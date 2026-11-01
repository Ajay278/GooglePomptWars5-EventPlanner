import React, { useState } from 'react';
import { FullEventPlan, PersonalizedIdea } from '../types/event';
import { Sparkles, Plus, Trash2, Heart, Lightbulb, Loader2, IndianRupee } from 'lucide-react';

interface IdeasInspirationViewProps {
  plan: FullEventPlan;
  onUpdatePlan: (updatedPlan: FullEventPlan) => void;
}

export const IdeasInspirationView: React.FC<IdeasInspirationViewProps> = ({
  plan,
  onUpdatePlan,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customCat, setCustomCat] = useState<PersonalizedIdea['category']>('experience');

  const ideas = plan.personalizedIdeas;

  const handleFetchAiIdeas = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/events/suggest-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: plan.eventType,
          themeStyle: plan.themeStyle,
          guestCount: plan.guestCount,
          targetBudget: plan.targetBudget,
          currentIdeasCount: ideas.length,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.ideas)) {
        onUpdatePlan({
          ...plan,
          personalizedIdeas: [...data.ideas, ...plan.personalizedIdeas],
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Error fetching AI ideas:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSaved = (id: string) => {
    onUpdatePlan({
      ...plan,
      personalizedIdeas: ideas.map((i) =>
        i.id === id ? { ...i, isSaved: !i.isSaved } : i
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteIdea = (id: string) => {
    onUpdatePlan({
      ...plan,
      personalizedIdeas: ideas.filter((i) => i.id !== id),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddCustomIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newIdea: PersonalizedIdea = {
      id: `pi-${Date.now()}`,
      category: customCat,
      title: customTitle.trim(),
      description: customDesc.trim(),
      estimatedCostImpact: 'low',
      isSaved: true,
    };

    onUpdatePlan({
      ...plan,
      personalizedIdeas: [newIdea, ...ideas],
      updatedAt: new Date().toISOString(),
    });

    setCustomTitle('');
    setCustomDesc('');
    setIsAddingCustom(false);
  };

  const filteredIdeas = ideas.filter((i) => {
    if (selectedCategory === 'all') return true;
    return i.category === selectedCategory;
  });

  const categoryLabels: Record<PersonalizedIdea['category'], string> = {
    theme: 'Theme & Motif',
    experience: 'Guest Experience',
    decor: 'Atmosphere & Decor',
    food_drink: 'Signature Food & Drink',
    favors: 'Favors & Keepsakes',
    budget_saver: 'Smart Budget Saver',
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
              <span>CREATIVE INSPIRATION STUDIO</span>
              <span aria-hidden="true">·</span>
              <span>SIGNATURE DETAILS &amp; MEMORABLE TOUCHES</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Personalized Ideas &amp; Bespoke Concepts
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingCustom(!isAddingCustom)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Idea</span>
            </button>
            <button
              onClick={handleFetchAiIdeas}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Curating Ideas with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate More Ideas with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter categories */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-2xs font-bold text-slate-500 mr-2 uppercase">Filter:</span>
          {['all', 'experience', 'food_drink', 'decor', 'budget_saver', 'favors'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-medium ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Ideas' : categoryLabels[cat as PersonalizedIdea['category']]}
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Idea Form */}
      {isAddingCustom && (
        <form onSubmit={handleAddCustomIdea} className="p-5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-3 text-xs">
          <div className="font-bold text-slate-900">Add Bespoke Concept</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Concept Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Vintage Champagne Coupe Tower with Sparkler Toast"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={customCat}
                onChange={(e) => setCustomCat(e.target.value as PersonalizedIdea['category'])}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-slate-900 bg-white"
              >
                <option value="experience">Guest Experience</option>
                <option value="food_drink">Signature Food &amp; Drink</option>
                <option value="decor">Atmosphere &amp; Decor</option>
                <option value="budget_saver">Smart Budget Saver</option>
                <option value="favors">Favors &amp; Keepsakes</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description &amp; Implementation Details</label>
            <textarea
              rows={2}
              placeholder="Explain how this touch will delight guests or keep budget under control..."
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 text-white rounded font-semibold cursor-pointer"
            >
              Save Idea
            </button>
          </div>
        </form>
      )}

      {/* Ideas Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-2.5 hover:border-slate-400 transition-colors flex flex-col justify-between"
          >
            <div>
              {/* Category & Cost Badge */}
              <div className="flex items-center justify-between text-2xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-800 uppercase tracking-wider">
                  {categoryLabels[idea.category]}
                </span>
                <span className="font-mono capitalize text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {idea.estimatedCostImpact === 'free' ? 'Zero Cost' : `${idea.estimatedCostImpact} cost impact`}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                {idea.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                {idea.description}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleSaved(idea.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  idea.isSaved
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${idea.isSaved ? 'fill-rose-700' : ''}`} />
                <span>{idea.isSaved ? 'Saved to Plan' : 'Save to Plan'}</span>
              </button>

              <button
                onClick={() => handleDeleteIdea(idea.id)}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Remove idea"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
