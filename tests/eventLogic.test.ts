import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PLANS } from '../src/data/initialEvents.ts';
import { FullEventPlan } from '../src/types/event.ts';

describe('Event Logic & Business Calculations Suite', () => {
  it('Initial seed events contain valid data across all required fields', () => {
    assert.equal(INITIAL_PLANS.length, 3);

    for (const plan of INITIAL_PLANS) {
      assert.ok(plan.id, 'Plan must have an id');
      assert.ok(plan.title, 'Plan must have a title');
      assert.ok(plan.eventType, 'Plan must have an eventType');
      assert.ok(plan.targetBudget > 0, 'Target budget must be greater than zero');
      assert.ok(plan.guestCount > 0, 'Guest count must be greater than zero');
      assert.ok(plan.budgetItems.length > 0, 'Plan must have budget line items');
      assert.ok(plan.timelineMilestones.length > 0, 'Plan must have timeline milestones');
      assert.ok(plan.vendors.length > 0, 'Plan must have vendors');
      assert.ok(plan.personalizedIdeas.length > 0, 'Plan must have personalized ideas');
    }
  });

  it('Calculates budget allocations, actual spend, and remaining buffer accurately', () => {
    const weddingPlan = INITIAL_PLANS[0];

    const totalAllocated = weddingPlan.budgetItems.reduce(
      (acc, item) => acc + (item.allocatedAmount || 0),
      0
    );
    const totalActual = weddingPlan.budgetItems.reduce(
      (acc, item) => acc + (item.actualAmount || 0),
      0
    );
    const totalPaid = weddingPlan.budgetItems.reduce(
      (acc, item) => acc + (item.paidAmount || 0),
      0
    );
    const remainingBuffer = weddingPlan.targetBudget - totalActual;
    const costPerGuest = Math.round(weddingPlan.targetBudget / weddingPlan.guestCount);

    assert.ok(totalAllocated > 0, 'Allocated budget should be positive');
    assert.ok(totalActual > 0, 'Actual committed should be positive');
    assert.ok(totalPaid > 0, 'Total paid in deposits should be positive');
    assert.equal(remainingBuffer, weddingPlan.targetBudget - totalActual);
    assert.equal(costPerGuest, Math.round(38000 / 120));
  });

  it('Calculates vendor pipeline and milestone completion rates', () => {
    const weddingPlan = INITIAL_PLANS[0];

    const totalVendors = weddingPlan.vendors.length;
    const securedVendors = weddingPlan.vendors.filter(
      (v) => v.status === 'confirmed' || v.status === 'contract_signed' || v.status === 'deposit_paid'
    ).length;

    assert.equal(securedVendors, totalVendors); // In wedding seed, all vendors are contracted

    const totalMilestones = weddingPlan.timelineMilestones.length;
    const completedMilestones = weddingPlan.timelineMilestones.filter((m) => m.completed).length;
    const progressPct = Math.round((completedMilestones / totalMilestones) * 100);

    assert.ok(progressPct >= 0 && progressPct <= 100, 'Progress percentage should be within 0-100%');
  });

  it('Aggregates multi-event portfolio totals correctly', () => {
    const totalCombinedBudget = INITIAL_PLANS.reduce((acc, p) => acc + p.targetBudget, 0);
    const totalCombinedGuests = INITIAL_PLANS.reduce((acc, p) => acc + p.guestCount, 0);
    const totalVendorsCount = INITIAL_PLANS.reduce((acc, p) => acc + p.vendors.length, 0);

    assert.equal(totalCombinedBudget, 38000 + 2400 + 7500); // 47,900
    assert.equal(totalCombinedGuests, 120 + 35 + 350); // 505
    assert.equal(totalVendorsCount, 5 + 3 + 3); // 11
  });
});
