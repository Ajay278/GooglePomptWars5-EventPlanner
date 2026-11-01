import React, { useState, useEffect } from 'react';
import { FullEventPlan } from './types/event';
import { INITIAL_PLANS } from './data/initialEvents';
import { Header, PlannerTab } from './components/Header';
import { EventSelector } from './components/EventSelector';
import { OverviewView } from './components/OverviewView';
import { BudgetView } from './components/BudgetView';
import { TimelineView } from './components/TimelineView';
import { VendorView } from './components/VendorView';
import { IdeasInspirationView } from './components/IdeasInspirationView';
import { AiPlannerModal } from './components/AiPlannerModal';
import { Check, Sparkles, Calendar } from 'lucide-react';

const STORAGE_KEY = 'event_planner_master_plans_v1';

export default function App() {
  const [plans, setPlans] = useState<FullEventPlan[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored plans, using default initial plans:', e);
    }
    return INITIAL_PLANS;
  });

  const [activePlanId, setActivePlanId] = useState<string>(() => {
    return plans[0]?.id || INITIAL_PLANS[0].id;
  });

  const [currentTab, setCurrentTab] = useState<PlannerTab>('overview');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync plans to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch (e) {
      console.error('Error saving plans to localStorage:', e);
    }
  }, [plans]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const activePlan = plans.find((p) => p.id === activePlanId) || plans[0] || INITIAL_PLANS[0];

  const handleUpdatePlan = (updatedPlan: FullEventPlan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
  };

  const handlePlanGenerated = (newPlan: FullEventPlan) => {
    setPlans((prev) => [newPlan, ...prev]);
    setActivePlanId(newPlan.id);
    setCurrentTab('overview');
    showToast(`Master Plan for "${newPlan.title}" created with AI!`);
  };

  const handleDeletePlan = (planId: string) => {
    const remaining = plans.filter((p) => p.id !== planId);
    if (remaining.length === 0) {
      setPlans(INITIAL_PLANS);
      setActivePlanId(INITIAL_PLANS[0].id);
      showToast('Reset to default template plans.');
    } else {
      setPlans(remaining);
      setActivePlanId(remaining[0].id);
      showToast('Plan deleted.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-200 text-slate-900">
      {/* Top Bar Contract compliant Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAiGenerator={() => setIsAiModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Event Context Header & Switcher */}
        <EventSelector
          plans={plans}
          activePlanId={activePlan.id}
          onSelectPlan={setActivePlanId}
          onOpenCreateModal={() => setIsAiModalOpen(true)}
        />

        {/* Tab View Routing */}
        {currentTab === 'overview' && (
          <OverviewView
            plan={activePlan}
            onNavigateTab={setCurrentTab}
            onDeletePlan={handleDeletePlan}
          />
        )}

        {currentTab === 'budget' && (
          <BudgetView
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
          />
        )}

        {currentTab === 'timeline' && (
          <TimelineView
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
          />
        )}

        {currentTab === 'vendors' && (
          <VendorView
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
          />
        )}

        {currentTab === 'ideas' && (
          <IdeasInspirationView
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
          />
        )}
      </main>

      {/* Quiet, anti-slop footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Event Planner Studio</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>AI-Powered Weddings, Birthdays &amp; Community Gatherings</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="text-slate-700 hover:text-slate-900 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>New AI Event</span>
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums">Budgets · Timelines · Vendors · Ideas</span>
          </div>
        </div>
      </footer>

      {/* GenAI Plan Generator Modal */}
      <AiPlannerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onPlanGenerated={handlePlanGenerated}
      />

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
