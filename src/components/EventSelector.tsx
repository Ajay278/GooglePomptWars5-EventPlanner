import React from 'react';
import { FullEventPlan, EventType } from '../types/event';
import { Calendar, Users, MapPin, IndianRupee, Plus, Sparkles, ChevronDown, LayoutGrid, ArrowLeft } from 'lucide-react';

interface EventSelectorProps {
  plans: FullEventPlan[];
  activePlanId: string;
  onSelectPlan: (id: string) => void;
  onOpenCreateModal: () => void;
  onNavigateToAllEvents?: () => void;
}

export const EventSelector: React.FC<EventSelectorProps> = ({
  plans,
  activePlanId,
  onSelectPlan,
  onOpenCreateModal,
  onNavigateToAllEvents,
}) => {
  const activePlan = plans.find((p) => p.id === activePlanId) || plans[0];

  const typeLabels: Record<EventType, string> = {
    wedding: 'Wedding & Reception',
    birthday: 'Birthday Celebration',
    community: 'Community Gathering',
    anniversary: 'Anniversary Gala',
    corporate_gala: 'Corporate Event',
  };

  if (!activePlan) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Column: Event Context & Selector */}
        <div className="space-y-1.5">
          {/* Top metadata line: Unboxed text with dot separators */}
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span className="font-semibold text-slate-900 uppercase tracking-wider text-2xs">
              {typeLabels[activePlan.eventType]}
            </span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 font-mono tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{activePlan.date}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 font-mono tabular-nums">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{activePlan.guestCount} Guests</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 font-mono tabular-nums text-slate-700 font-semibold">
              <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
              <span>Budget: ₹{activePlan.targetBudget.toLocaleString()}</span>
            </div>
          </div>

          {/* Event Title with Switcher Dropdown */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {activePlan.title}
            </h1>
            <div className="relative inline-block">
              <select
                value={activePlan.id}
                onChange={(e) => onSelectPlan(e.target.value)}
                className="pl-2.5 pr-7 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer appearance-none transition-colors"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    Switch: {p.title} ({typeLabels[p.eventType].split(' ')[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Location and Theme Snippet */}
          <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap pt-0.5">
            {activePlan.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{activePlan.location}</span>
              </div>
            )}
            {activePlan.themeStyle && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="italic text-slate-600">{activePlan.themeStyle}</span>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Fast Actions */}
        <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
          {onNavigateToAllEvents && (
            <button
              onClick={onNavigateToAllEvents}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors cursor-pointer shadow-2xs"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
              <span>All Events ({plans.length})</span>
            </button>
          )}

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>New Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};
