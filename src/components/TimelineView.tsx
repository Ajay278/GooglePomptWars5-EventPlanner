import React, { useState } from 'react';
import { FullEventPlan, TimelineMilestone, TimelinePhase } from '../types/event';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Download, 
  Check, 
  ChevronRight, 
  Layers 
} from 'lucide-react';

interface TimelineViewProps {
  plan: FullEventPlan;
  onUpdatePlan: (updatedPlan: FullEventPlan) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ plan, onUpdatePlan }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'milestones' | 'day_of'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState<TimelinePhase>('1_month_before');
  const [targetDate, setTargetDate] = useState(plan.date);
  const [time, setTime] = useState('14:00');
  const [responsible, setResponsible] = useState('Lead Planner');

  const milestones = plan.timelineMilestones;
  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPct = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const handleToggleComplete = (id: string) => {
    onUpdatePlan({
      ...plan,
      timelineMilestones: milestones.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDelete = (id: string) => {
    onUpdatePlan({
      ...plan,
      timelineMilestones: milestones.filter((m) => m.id !== id),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const phaseLabels: Record<TimelinePhase, string> = {
      '6_months_before': '6 Months Out',
      '3_months_before': '3 Months Out',
      '1_month_before': '1 Month Out',
      '1_week_before': 'Final Week',
      'day_of': 'Day-Of Schedule',
      'post_event': 'Post-Event Wrap',
    };

    const newMilestone: TimelineMilestone = {
      id: `m-${Date.now()}`,
      phase,
      phaseLabel: phaseLabels[phase],
      title: title.trim(),
      targetDate,
      time: phase === 'day_of' ? time : undefined,
      completed: false,
      responsible: responsible.trim() || 'Planner',
    };

    onUpdatePlan({
      ...plan,
      timelineMilestones: [...milestones, newMilestone],
      updatedAt: new Date().toISOString(),
    });

    setTitle('');
    setIsAdding(false);
  };

  // Export run-of-show to iCal (.ics)
  const handleExportRunOfShow = () => {
    const dayOfEvents = milestones.filter((m) => m.phase === 'day_of' && m.time);
    const cleanDate = plan.date.replace(/-/g, '');

    const icsEvents = dayOfEvents.map((ev) => {
      const timeClean = (ev.time || '12:00').replace(':', '') + '00';
      return [
        'BEGIN:VEVENT',
        `UID:${ev.id}@eventplanner.local`,
        `DTSTAMP:${cleanDate}T${timeClean}Z`,
        `DTSTART:${cleanDate}T${timeClean}`,
        `SUMMARY:[${plan.title}] ${ev.title}`,
        `DESCRIPTION:Responsible: ${ev.responsible}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      ].join('\r\n');
    });

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Event Planner Studio//EN',
      ...icsEvents,
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${plan.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_run_of_show.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMilestones = milestones.filter((m) => {
    if (activeFilter === 'milestones') return m.phase !== 'day_of';
    if (activeFilter === 'day_of') return m.phase === 'day_of';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
              <span>TIMELINE &amp; RUN OF SHOW</span>
              <span aria-hidden="true">·</span>
              <span>COUNTDOWN PHASES &amp; MINUTE-BY-MINUTE</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Event Timeline &amp; Day-of Execution Schedule
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportRunOfShow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Day-of (.ics)</span>
            </button>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Schedule Item</span>
            </button>
          </div>
        </div>

        {/* Progress Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-600">Completion Velocity:</span>
            <span className="font-mono tabular-nums font-bold text-slate-900">
              {completedCount} of {milestones.length} tasks confirmed
            </span>
          </div>

          {/* Filter tabs */}
          <div className="inline-flex rounded bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 font-medium rounded transition-colors ${
                activeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              All Items ({milestones.length})
            </button>
            <button
              onClick={() => setActiveFilter('milestones')}
              className={`px-3 py-1 font-medium rounded transition-colors ${
                activeFilter === 'milestones' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Planning Phases
            </button>
            <button
              onClick={() => setActiveFilter('day_of')}
              className={`px-3 py-1 font-medium rounded transition-colors ${
                activeFilter === 'day_of' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Day-Of Run of Show
            </button>
          </div>
        </div>
      </div>

      {/* Add Milestone Inline Drawer */}
      {isAdding && (
        <form onSubmit={handleAddMilestone} className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs space-y-3 text-xs">
          <div className="font-bold text-slate-900">Add Timeline Milestone or Schedule Event</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Title / Milestone</label>
              <input
                type="text"
                required
                placeholder="e.g. 17:30 - Cocktail Hour & String Quartet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phase</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value as TimelinePhase)}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900 bg-white"
              >
                <option value="6_months_before">6 Months Out</option>
                <option value="3_months_before">3 Months Out</option>
                <option value="1_month_before">1 Month Out</option>
                <option value="1_week_before">Final Week</option>
                <option value="day_of">Day-Of Schedule</option>
                <option value="post_event">Post-Event Wrap</option>
              </select>
            </div>

            {phase === 'day_of' ? (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Exact Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-900 font-mono"
                />
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-900 font-mono"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-slate-700">Responsible Party:</label>
              <input
                type="text"
                placeholder="Planner / Host / Caterer"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="px-2 py-1 border border-slate-200 rounded text-slate-900"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Timeline Stream */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        {filteredMilestones.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <div className="text-xs font-semibold text-slate-600">No timeline items in this view.</div>
          </div>
        ) : (
          filteredMilestones.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleComplete(item.id)}
              className={`p-3.5 rounded-lg border flex items-start justify-between gap-4 cursor-pointer transition-all ${
                item.completed
                  ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                  : 'bg-white hover:bg-slate-50/60 border-slate-200 text-slate-900'
              }`}
            >
              {/* Checkbox & Details */}
              <div className="flex items-start gap-3">
                <span
                  className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    item.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white hover:border-slate-500'
                  }`}
                >
                  {item.completed && <Check className="w-3.5 h-3.5" />}
                </span>

                <div>
                  <div className="flex items-center gap-2 text-2xs font-mono text-slate-500 mb-0.5">
                    <span className="font-semibold text-slate-800 uppercase">{item.phaseLabel}</span>
                    {item.time && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                          {item.time}
                        </span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>Responsible: {item.responsible}</span>
                  </div>

                  <div
                    className={`text-sm font-semibold tracking-tight ${
                      item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Delete milestone"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
