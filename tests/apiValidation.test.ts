import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createFallbackPlan } from '../src/server/eventApi.ts';
import { PlanGenerationRequest } from '../src/types/event.ts';

describe('Server-side Plan Generation & Fallback Architecture', () => {
  it('createFallbackPlan generates valid full master plan for wedding', () => {
    const req: PlanGenerationRequest = {
      eventType: 'wedding',
      title: 'Aarav & Maya Royal Palace Wedding',
      date: '2026-12-20',
      location: 'Udaipur Heritage Palace',
      guestCount: 200,
      targetBudget: 500000,
      themeStyle: 'Royal Marigold & Candlelight Elegance',
      specialRequests: 'Sangeet night setup, live sitar, vegetarian banquet',
    };

    const plan = createFallbackPlan(req);

    assert.equal(plan.title, req.title);
    assert.equal(plan.eventType, 'wedding');
    assert.equal(plan.targetBudget, 500000);
    assert.equal(plan.guestCount, 200);
    assert.ok(plan.budgetItems.length >= 6, 'Must generate at least 6 budget line items');
    assert.ok(plan.timelineMilestones.length >= 6, 'Must generate timeline milestones');
    assert.ok(plan.vendors.length >= 4, 'Must generate vendor checklist');
    assert.ok(plan.personalizedIdeas.length >= 4, 'Must generate creative personalized ideas');

    // Verify budget items sum up approximately to the target budget (within 5% margin)
    const sumAllocated = plan.budgetItems.reduce((acc, b) => acc + b.allocatedAmount, 0);
    assert.ok(
      Math.abs(sumAllocated - req.targetBudget) <= req.targetBudget * 0.05,
      `Allocated sum ${sumAllocated} should be within 5% of target ${req.targetBudget}`
    );
  });

  it('createFallbackPlan generates valid birthday plan with day-of timestamps', () => {
    const req: PlanGenerationRequest = {
      eventType: 'birthday',
      title: 'Kavya’s Sweet 16 Neon Roller Disco',
      date: '2026-11-25',
      location: 'Downtown Roller Dome',
      guestCount: 60,
      targetBudget: 40000,
      themeStyle: 'Retro Neon Glow & Synthwave',
    };

    const plan = createFallbackPlan(req);
    assert.equal(plan.eventType, 'birthday');
    assert.ok(plan.budgetItems.some((b) => b.category.includes('Venue') || b.category.includes('Food')));

    const dayOfMilestones = plan.timelineMilestones.filter((m) => m.phase === 'day_of');
    assert.ok(dayOfMilestones.length >= 3, 'Must contain day-of schedule events');
    assert.ok(dayOfMilestones.some((m) => m.time), 'Day-of events must have time defined');
  });

  it('createFallbackPlan generates valid community festival plan', () => {
    const req: PlanGenerationRequest = {
      eventType: 'community',
      title: 'Spring Blossom Town Carnival',
      date: '2027-04-10',
      location: 'Central Memorial Park',
      guestCount: 800,
      targetBudget: 150000,
      themeStyle: 'Eco-Friendly Bloom Festival',
    };

    const plan = createFallbackPlan(req);
    assert.equal(plan.eventType, 'community');
    assert.ok(plan.vendors.some((v) => v.category.includes('Permits') || v.category.includes('Municipal') || v.category.includes('Infrastructure')));
  });
});
