import React from 'react';
import { FullEventPlan } from '../types/event';
import { PlannerTab } from './Header';
import { 
  Calendar, 
  IndianRupee, 
  Clock, 
  Users, 
  Briefcase, 
  Sparkles, 
  Download, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Trash2
} from 'lucide-react';

interface OverviewViewProps {
  plan: FullEventPlan;
  onNavigateTab: (tab: PlannerTab) => void;
  onDeletePlan: (planId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  plan,
  onNavigateTab,
  onDeletePlan,
}) => {
  // Days until event calculation
  const getDaysUntil = (dateStr: string) => {
    try {
      const target = new Date(dateStr);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const diffMs = target.getTime() - now.getTime();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (days < 0) return `${Math.abs(days)} days ago`;
      if (days === 0) return 'Today!';
      return `${days} days away`;
    } catch {
      return 'Upcoming';
    }
  };

  const daysUntil = getDaysUntil(plan.date);

  // Budget calculations
  const totalAllocated = plan.budgetItems.reduce((acc, b) => acc + (b.allocatedAmount || 0), 0);
  const totalActual = plan.budgetItems.reduce((acc, b) => acc + (b.actualAmount || 0), 0);
  const remainingBudget = plan.targetBudget - totalActual;

  // Timeline completion
  const totalTasks = plan.timelineMilestones.length;
  const completedTasks = plan.timelineMilestones.filter((m) => m.completed).length;
  const timelineProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Vendors confirmed
  const totalVendors = plan.vendors.length;
  const confirmedVendors = plan.vendors.filter(
    (v) => v.status === 'confirmed' || v.status === 'contract_signed' || v.status === 'deposit_paid'
  ).length;

  // Export full plan to Markdown/Text
  const handleExportMarkdown = () => {
    const mdContent = [
      `# ${plan.title}`,
      `**Event Type:** ${plan.eventType.toUpperCase()}`,
      `**Target Date:** ${plan.date} (${daysUntil})`,
      `**Location:** ${plan.location}`,
      `**Guests:** ${plan.guestCount}`,
      `**Target Budget:** ₹${plan.targetBudget.toLocaleString()}`,
      `**Theme/Style:** ${plan.themeStyle}`,
      '',
      `## Executive Summary`,
      plan.summaryOverview,
      '',
      `## Budget Breakdown`,
      `Total Target: ₹${plan.targetBudget.toLocaleString()} | Actual Spent: ₹${totalActual.toLocaleString()} | Buffer: ₹${remainingBudget.toLocaleString()}`,
      ...plan.budgetItems.map(
        (b) => `- [${b.status.toUpperCase()}] **${b.category} - ${b.itemName}**: Allocated ₹${b.allocatedAmount.toLocaleString()} | Actual ₹${b.actualAmount.toLocaleString()}`
      ),
      '',
      `## Timeline & Run of Show`,
      ...plan.timelineMilestones.map(
        (m) => `- [${m.completed ? 'x' : ' '}] **${m.phaseLabel}${m.time ? ` (${m.time})` : ''}**: ${m.title} (Responsible: ${m.responsible})`
      ),
      '',
      `## Vendor Directory`,
      ...plan.vendors.map(
        (v) => `- **${v.name}** (${v.category}): Status: ${v.status} | Quote: ₹${v.priceQuote || 0} | Contact: ${v.phone || v.email || 'N/A'}`
      ),
      '',
      `## Personalized Ideas & Bespoke Touches`,
      ...plan.personalizedIdeas.map(
        (i) => `### ${i.title} (${i.category})\n${i.description}\n`
      ),
    ].join('\n');

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${plan.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_master_plan.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
              <span>MASTER EVENT BRIEF</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-900 font-mono">{daysUntil}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-snug">
              {plan.title}
            </h2>
          </div>

          <button
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-colors shadow-2xs whitespace-nowrap self-start cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Master Brief (.md)</span>
          </button>
        </div>

        {/* Narrative Summary */}
        <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
          {plan.summaryOverview}
        </p>

        {/* Special Requests pill-free notes */}
        {plan.specialRequests && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <span className="font-bold text-slate-900 uppercase text-2xs tracking-wider">
              Special Priorities &amp; Requests:
            </span>
            <p className="text-slate-600 leading-relaxed">{plan.specialRequests}</p>
          </div>
        )}
      </div>

      {/* 4 Interactive Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Budget Card */}
        <div
          onClick={() => onNavigateTab('budget')}
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <IndianRupee className="w-5 h-5 text-slate-700" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Budget Health
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              ₹{totalActual.toLocaleString()}
            </div>
            <div className="text-2xs text-slate-500 mt-0.5">
              of ₹{plan.targetBudget.toLocaleString()} target limit
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-800 mt-3 flex items-center justify-between">
            <span>Manage Budget</span>
            <span className="font-mono text-2xs text-slate-500">{plan.budgetItems.length} items</span>
          </div>
        </div>

        {/* Timeline Card */}
        <div
          onClick={() => onNavigateTab('timeline')}
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <Clock className="w-5 h-5 text-slate-700" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Timeline Progress
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              {timelineProgress}% Complete
            </div>
            <div className="text-2xs text-slate-500 mt-0.5">
              {completedTasks} of {totalTasks} milestones confirmed
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-800 mt-3 flex items-center justify-between">
            <span>View Run of Show</span>
            <span className="font-mono text-2xs text-slate-500">{totalTasks} phases</span>
          </div>
        </div>

        {/* Vendor Checklist Card */}
        <div
          onClick={() => onNavigateTab('vendors')}
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <Briefcase className="w-5 h-5 text-slate-700" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Vendor Pipeline
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              {confirmedVendors} / {totalVendors}
            </div>
            <div className="text-2xs text-slate-500 mt-0.5">
              Key partners under contract
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-800 mt-3 flex items-center justify-between">
            <span>Vendor Directory</span>
            <span className="font-mono text-2xs text-slate-500">{totalVendors} partners</span>
          </div>
        </div>

        {/* Ideas & Inspo Card */}
        <div
          onClick={() => onNavigateTab('ideas')}
          className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Creative Ideas
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              {plan.personalizedIdeas.length} Curated
            </div>
            <div className="text-2xs text-slate-500 mt-0.5">
              Signature touches &amp; experiences
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-800 mt-3 flex items-center justify-between">
            <span>Explore Concepts</span>
            <span className="text-2xs text-amber-700 font-semibold">+ AI Generator</span>
          </div>
        </div>
      </div>

      {/* Delete / Danger Zone Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
        <div>Plan ID: <span className="font-mono">{plan.id}</span></div>
        <button
          onClick={() => {
            if (window.confirm(`Delete plan "${plan.title}"?`)) {
              onDeletePlan(plan.id);
            }
          }}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Plan</span>
        </button>
      </div>
    </div>
  );
};
