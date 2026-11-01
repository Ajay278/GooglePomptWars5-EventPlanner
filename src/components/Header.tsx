import React from 'react';
import { Calendar, Sparkles, Plus } from 'lucide-react';

export type PlannerTab = 'events' | 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas';

interface HeaderProps {
  currentTab: PlannerTab;
  onSelectTab: (tab: PlannerTab) => void;
  onOpenAiGenerator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenAiGenerator,
}) => {
  const tabs: Array<{ id: PlannerTab; label: string }> = [
    { id: 'events', label: 'All Events' },
    { id: 'overview', label: 'Master Plan' },
    { id: 'budget', label: 'Budget Tracker' },
    { id: 'timeline', label: 'Timelines & Run of Show' },
    { id: 'vendors', label: 'Vendor Checklist' },
    { id: 'ideas', label: 'Personalized Ideas' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            <Calendar className="w-4 h-4 text-slate-100" />
          </div>
          <button
            onClick={() => onSelectTab('events')}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-slate-700 transition-colors whitespace-nowrap text-left cursor-pointer"
          >
            Event Planner Studio
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line with subtle active indicator) */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4 text-sm font-medium">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 transition-colors whitespace-nowrap text-sm ${
                  isActive
                    ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAiGenerator}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate Plan with AI</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-slate-200 bg-slate-50/90 px-4 py-2 overflow-x-auto gap-2 text-xs font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`px-2.5 py-1 whitespace-nowrap rounded ${
              currentTab === tab.id ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
