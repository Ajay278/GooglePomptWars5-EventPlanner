import React, { useState, useMemo } from 'react';
import { FullEventPlan, EventType } from '../types/event';
import { PlannerTab } from './Header';
import { 
  Calendar, 
  IndianRupee, 
  Users, 
  MapPin, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Clock, 
  Briefcase,
  Layers,
  TrendingUp
} from 'lucide-react';

interface EventsListViewProps {
  plans: FullEventPlan[];
  activePlanId: string;
  onSelectPlan: (id: string, tab?: PlannerTab) => void;
  onOpenCreateModal: () => void;
  onDeletePlan: (id: string) => void;
}

export const EventsListView: React.FC<EventsListViewProps> = ({
  plans,
  activePlanId,
  onSelectPlan,
  onOpenCreateModal,
  onDeletePlan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const typeLabels: Record<EventType, string> = {
    wedding: 'Wedding & Reception',
    birthday: 'Birthday Milestone',
    community: 'Community Gathering',
    anniversary: 'Anniversary Gala',
    corporate_gala: 'Corporate Event',
  };

  const getDaysUntil = (dateStr: string) => {
    try {
      const target = new Date(dateStr);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const diffMs = target.getTime() - now.getTime();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (days < 0) return `${Math.abs(days)}d ago`;
      if (days === 0) return 'Today!';
      return `${days}d away`;
    } catch {
      return 'Upcoming';
    }
  };

  // Filter & Search
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const matchesType = selectedType === 'all' || p.eventType === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.themeStyle.toLowerCase().includes(q) ||
        p.eventType.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [plans, selectedType, searchQuery]);

  // Aggregate metrics across all events
  const totalCombinedBudget = plans.reduce((acc, p) => acc + (p.targetBudget || 0), 0);
  const totalCombinedGuests = plans.reduce((acc, p) => acc + (p.guestCount || 0), 0);
  const totalVendorsCount = plans.reduce((acc, p) => acc + p.vendors.length, 0);

  return (
    <div className="space-y-6">
      {/* Hero / Studio Header Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
              <span>EVENT PORTFOLIO &amp; MASTER DIRECTORY</span>
              <span aria-hidden="true">·</span>
              <span>{plans.length} ACTIVE PLANS</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Event Planner Master Directory
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Manage multi-event timelines, budgets, verified vendor contracts, and AI-curated creative concepts from a centralized dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Generate New Event (AI)</span>
            </button>
          </div>
        </div>

        {/* 4-Stat Studio Portfolio KPI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <div className="text-2xs font-mono uppercase text-slate-500">Total Events</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{plans.length} Planned</div>
            <div className="text-2xs text-slate-500 mt-0.5">Weddings, Birthdays &amp; Fairs</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <div className="text-2xs font-mono uppercase text-slate-500">Portfolio Budget</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">₹{totalCombinedBudget.toLocaleString()}</div>
            <div className="text-2xs text-slate-500 mt-0.5">Ceiling across all events</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <div className="text-2xs font-mono uppercase text-slate-500">Total Guest Count</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{totalCombinedGuests} Guests</div>
            <div className="text-2xs text-slate-500 mt-0.5">Hospitality headcount</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <div className="text-2xs font-mono uppercase text-slate-500">Vendor Directory</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{totalVendorsCount} Partners</div>
            <div className="text-2xs text-slate-500 mt-0.5">Catering, venues &amp; audio</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by event title, venue location, or theme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'wedding', label: 'Weddings' },
            { id: 'birthday', label: 'Birthdays' },
            { id: 'community', label: 'Community' },
          ].map((cat) => {
            const isSelected = selectedType === cat.id;
            const count =
              cat.id === 'all'
                ? plans.length
                : plans.filter((p) => p.eventType === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedType(cat.id)}
                className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap text-xs font-medium cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPlans.map((plan) => {
          const daysAway = getDaysUntil(plan.date);
          const totalActual = plan.budgetItems.reduce((acc, b) => acc + (b.actualAmount || 0), 0);
          const confirmedVendors = plan.vendors.filter(
            (v) => v.status === 'confirmed' || v.status === 'contract_signed' || v.status === 'deposit_paid'
          ).length;
          const completedMilestones = plan.timelineMilestones.filter((m) => m.completed).length;
          const isCurrentActive = plan.id === activePlanId;

          return (
            <div
              key={plan.id}
              className={`bg-white border rounded-lg p-5 shadow-xs flex flex-col justify-between transition-all hover:border-slate-400 ${
                isCurrentActive ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                {/* Top Badge & Countdown */}
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="font-semibold text-slate-600 uppercase text-2xs tracking-wider">
                    {typeLabels[plan.eventType] || plan.eventType}
                  </span>
                  <span className="font-mono text-2xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                    {daysAway}
                  </span>
                </div>

                {/* Event Title */}
                <div>
                  <h3
                    onClick={() => onSelectPlan(plan.id, 'overview')}
                    className="text-base font-bold text-slate-900 tracking-tight hover:text-slate-600 cursor-pointer line-clamp-1 leading-snug"
                  >
                    {plan.title}
                  </h3>
                  {plan.themeStyle && (
                    <p className="text-2xs text-slate-500 italic mt-0.5 line-clamp-1">
                      {plan.themeStyle}
                    </p>
                  )}
                </div>

                {/* Key Metadata Row */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-mono text-2xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{plan.date}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{plan.guestCount} Guests</span>
                  </div>

                  {plan.location && (
                    <div className="flex items-center gap-1.5 text-2xs text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{plan.location}</span>
                    </div>
                  )}
                </div>

                {/* Mini Budget & Pipeline Progress */}
                <div className="p-3 bg-slate-50 rounded border border-slate-200/70 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-2xs">
                    <span className="text-slate-500">Budget Target</span>
                    <span className="font-bold text-slate-900">₹{plan.targetBudget.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((totalActual / (plan.targetBudget || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-2xs text-slate-500 pt-0.5">
                    <span>{confirmedVendors}/{plan.vendors.length} vendors secured</span>
                    <span>{completedMilestones}/{plan.timelineMilestones.length} milestones</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectPlan(plan.id, 'overview')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                >
                  <span>Open Master Plan</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectPlan(plan.id, 'budget')}
                    className="px-2 py-1 text-2xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                  >
                    Budget
                  </button>
                  <button
                    onClick={() => onSelectPlan(plan.id, 'timeline')}
                    className="px-2 py-1 text-2xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                  >
                    Timeline
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete plan "${plan.title}"?`)) {
                        onDeletePlan(plan.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer ml-1"
                    title="Delete event plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPlans.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center space-y-3">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No events found matching your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or category filter, or generate a new event plan with our GenAI assistant.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate Plan with AI</span>
          </button>
        </div>
      )}
    </div>
  );
};
