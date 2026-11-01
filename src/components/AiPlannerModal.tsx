import React, { useState } from 'react';
import { EventType, FullEventPlan, PlanGenerationRequest } from '../types/event';
import { X, Sparkles, Loader2, Wand2, Calendar, IndianRupee, Users, MapPin, Heart } from 'lucide-react';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (newPlan: FullEventPlan) => void;
}

export const AiPlannerModal: React.FC<AiPlannerModalProps> = ({
  isOpen,
  onClose,
  onPlanGenerated,
}) => {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-11-20');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [targetBudget, setTargetBudget] = useState<number>(25000);
  const [themeStyle, setThemeStyle] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Preset quick fill
  const applyPreset = (preset: {
    type: EventType;
    title: string;
    budget: number;
    guests: number;
    location: string;
    theme: string;
    requests: string;
  }) => {
    setEventType(preset.type);
    setTitle(preset.title);
    setTargetBudget(preset.budget);
    setGuestCount(preset.guests);
    setLocation(preset.location);
    setThemeStyle(preset.theme);
    setSpecialRequests(preset.requests);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide an event title.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setLoadingStep('Synthesizing event parameters and budget distribution...');

    const timer1 = setTimeout(() => {
      setLoadingStep('Crafting vendor checklist and day-of run-of-show...');
    }, 1200);

    const timer2 = setTimeout(() => {
      setLoadingStep('Generating creative experiences and custom touches...');
    }, 2400);

    try {
      const payload: PlanGenerationRequest = {
        eventType,
        title: title.trim(),
        date,
        location: location.trim(),
        guestCount: Number(guestCount) || 50,
        targetBudget: Number(targetBudget) || 5000,
        themeStyle: themeStyle.trim(),
        specialRequests: specialRequests.trim(),
      };

      const res = await fetch('/api/events/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Generation failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.plan) {
        onPlanGenerated(data.plan);
        onClose();
      } else {
        throw new Error('Invalid plan structure returned from assistant.');
      }
    } catch (err: any) {
      console.error('Error during AI plan generation:', err);
      setErrorMessage(err.message || 'Failed to generate plan. Please try again.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-2xs font-mono text-slate-500 uppercase">GenAI Event Architect</div>
              <h3 className="text-base font-bold text-slate-900">
                Generate Full Event Master Plan
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleGenerate} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick Presets Strip */}
          <div className="space-y-1.5 pb-2 border-b border-slate-100">
            <div className="text-2xs font-semibold uppercase text-slate-500 flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-slate-400" />
              <span>Or click an instant template:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  applyPreset({
                    type: 'wedding',
                    title: 'Sophia & Julian Vineyard Wedding',
                    budget: 45000,
                    guests: 130,
                    location: 'Sonoma Valley Vineyard Estate',
                    theme: 'Rustic Italian Vineyard with Olive Branches and Candlelight',
                    requests: 'Outdoor ceremony at 17:00, woodfired pizza late night, live cello duet.',
                  })
                }
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-2xs transition-colors"
              >
                💍 Vineyard Wedding (₹45k)
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPreset({
                    type: 'birthday',
                    title: 'Leo’s 30th Rooftop Sunset Birthday',
                    budget: 3500,
                    guests: 45,
                    location: 'Skyline Terrace Loft, Downtown',
                    theme: 'Modern Retro 80s Disco & Neon Tropical',
                    requests: 'Specialty cocktail bar, DJ booth, taco truck station, disposable cameras.',
                  })
                }
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-2xs transition-colors"
              >
                🎂 30th Rooftop Birthday (₹3.5k)
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPreset({
                    type: 'community',
                    title: 'Riverside Spring Arts & Eco Festival',
                    budget: 8000,
                    guests: 500,
                    location: 'Riverside Promenade & Park',
                    theme: 'Eco-conscious Art & Local Farmers Market',
                    requests: 'City sound permits, 30 artist booths, food truck row, zero-waste team.',
                  })
                }
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-2xs transition-colors"
              >
                🎪 Community Arts Fair (₹8k)
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Event Type Selector */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Event Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEventType('wedding')}
                className={`py-2 px-3 rounded border text-center transition-all ${
                  eventType === 'wedding'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                💍 Wedding
              </button>
              <button
                type="button"
                onClick={() => setEventType('birthday')}
                className={`py-2 px-3 rounded border text-center transition-all ${
                  eventType === 'birthday'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                🎂 Birthday
              </button>
              <button
                type="button"
                onClick={() => setEventType('community')}
                className={`py-2 px-3 rounded border text-center transition-all ${
                  eventType === 'community'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                🎪 Community Event
              </button>
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maya & Leo's Coastal Wedding, Liam's 7th Safari Party..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
            />
          </div>

          {/* Date, Location, Budget, Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Venue / City Location
              </label>
              <input
                type="text"
                placeholder="e.g. Botanical Garden, City Loft, Community Park"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Target Budget (₹ INR)
              </label>
              <input
                type="number"
                min="500"
                step="250"
                value={targetBudget}
                onChange={(e) => setTargetBudget(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Expected Guest Count
              </label>
              <input
                type="number"
                min="5"
                max="5000"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900 font-mono text-xs"
              />
            </div>
          </div>

          {/* Theme & Style */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Theme, Aesthetic &amp; Vibe
            </label>
            <input
              type="text"
              placeholder="e.g. Modern Terracotta Minimalist, 90s Neon Retro, Warm Autumn Harvest"
              value={themeStyle}
              onChange={(e) => setThemeStyle(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
            />
          </div>

          {/* Special Requests */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Special Requests, Cultural Elements or Priorities
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Dietary preferences (vegan/nut-free), sunset ceremony timing, interactive kids zone, acoustic band, charity collection..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
            />
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-slate-800 animate-spin shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">
                  AI Planning Assistant is Generating Your Plan...
                </div>
                <div className="text-2xs text-slate-500 font-mono">{loadingStep}</div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded text-slate-700 hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Master Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Master Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
