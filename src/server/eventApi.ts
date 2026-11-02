import express, { type Request, type Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import type { FullEventPlan, PlanGenerationRequest } from '../types/event.ts';

export const eventApiRouter = express.Router();

// Helper for timeout
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('AI generation timed out')), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Lazy initialization of Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasValidKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10);
  if (hasValidKey && apiKey) {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return null;
}

// Generate comprehensive master event plan
eventApiRouter.post('/generate-plan', async (req: Request, res: Response) => {
  const reqData: PlanGenerationRequest = req.body;
  const { eventType, title, date, location, guestCount, targetBudget, themeStyle, specialRequests } = reqData;

  if (!title || !eventType) {
    return res.status(400).json({ error: 'Title and Event Type are required.' });
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `You are an elite, world-class event planner specializing in weddings, birthdays, and community gatherings.
Create a comprehensive, production-ready master event plan based on these parameters:
- Event Type: ${eventType} (wedding, birthday, or community)
- Event Title: ${title}
- Target Date: ${date || 'Upcoming'}
- Location / Venue: ${location || 'To be decided'}
- Expected Guests: ${guestCount || 50}
- Total Target Budget: ₹${targetBudget || 5000} (INR)
- Preferred Theme/Style: ${themeStyle || 'Elegant and memorable'}
- Special Requests & Notes: ${specialRequests || 'None provided'}

Generate:
1. A vivid 2-3 sentence executive summary overview.
2. A detailed budget breakdown (6 to 9 realistic line items whose allocatedAmounts sum up close to the target budget of ₹${targetBudget || 5000}). Categories like Venue, Catering & Bar, Photography, Florals/Decor, Music/DJ, Favors/Print, Contingency.
3. A timeline with both milestone countdown phases (e.g. 6 Months Out, 1 Month Out, Final Week) AND 4-6 specific Day-Of schedule milestones with precise times (e.g. 10:00, 14:00, 17:30).
4. A vendor checklist (4-6 key vendors needed for this event type with category, sample vendor name, status 'researching' or 'contacted', and estimated price quote in INR).
5. 4 distinct, personalized creative ideas (signature food/drink, unique guest experience, decor accent, and a smart budget-saver tip).`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summaryOverview: { type: Type.STRING },
                budgetItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      itemName: { type: Type.STRING },
                      allocatedAmount: { type: Type.NUMBER },
                      notes: { type: Type.STRING },
                    },
                    required: ['category', 'itemName', 'allocatedAmount'],
                  },
                },
                timelineMilestones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phase: { type: Type.STRING, description: 'One of: 6_months_before, 3_months_before, 1_month_before, 1_week_before, day_of' },
                      phaseLabel: { type: Type.STRING },
                      title: { type: Type.STRING },
                      time: { type: Type.STRING, description: 'e.g. 14:30 or empty if non-day-of' },
                      responsible: { type: Type.STRING },
                    },
                    required: ['phase', 'phaseLabel', 'title', 'responsible'],
                  },
                },
                vendors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      name: { type: Type.STRING },
                      status: { type: Type.STRING, description: 'researching, contacted, or confirmed' },
                      priceQuote: { type: Type.NUMBER },
                      notes: { type: Type.STRING },
                    },
                    required: ['category', 'name', 'status', 'priceQuote'],
                  },
                },
                personalizedIdeas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING, description: 'theme, experience, decor, food_drink, favors, or budget_saver' },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      estimatedCostImpact: { type: Type.STRING, description: 'low, medium, high, or free' },
                    },
                    required: ['category', 'title', 'description', 'estimatedCostImpact'],
                  },
                },
              },
              required: ['summaryOverview', 'budgetItems', 'timelineMilestones', 'vendors', 'personalizedIdeas'],
            },
          },
        }),
        7500
      );

      const rawJson = response.text;
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        const fullPlan: FullEventPlan = {
          id: `plan-${Date.now()}`,
          title,
          eventType,
          date: date || new Date().toISOString().split('T')[0],
          location: location || 'TBD',
          guestCount: Number(guestCount) || 50,
          targetBudget: Number(targetBudget) || 5000,
          themeStyle: themeStyle || 'Classic & Celebratory',
          specialRequests: specialRequests || '',
          summaryOverview: parsed.summaryOverview || '',
          budgetItems: (parsed.budgetItems || []).map((b: any, idx: number) => ({
            id: `b-${Date.now()}-${idx}`,
            category: b.category,
            itemName: b.itemName,
            allocatedAmount: Number(b.allocatedAmount) || 0,
            actualAmount: 0,
            paidAmount: 0,
            status: 'estimated',
            notes: b.notes || '',
          })),
          timelineMilestones: (parsed.timelineMilestones || []).map((t: any, idx: number) => ({
            id: `t-${Date.now()}-${idx}`,
            phase: t.phase || '1_month_before',
            phaseLabel: t.phaseLabel || 'Milestone',
            title: t.title,
            targetDate: date || new Date().toISOString().split('T')[0],
            time: t.time || '',
            completed: false,
            responsible: t.responsible || 'Planner',
          })),
          vendors: (parsed.vendors || []).map((v: any, idx: number) => ({
            id: `v-${Date.now()}-${idx}`,
            category: v.category,
            name: v.name,
            status: (v.status === 'confirmed' ? 'confirmed' : 'researching') as any,
            priceQuote: Number(v.priceQuote) || 0,
            depositAmount: 0,
            notes: v.notes || '',
          })),
          personalizedIdeas: (parsed.personalizedIdeas || []).map((i: any, idx: number) => ({
            id: `pi-${Date.now()}-${idx}`,
            category: i.category || 'experience',
            title: i.title,
            description: i.description,
            estimatedCostImpact: i.estimatedCostImpact || 'low',
            isSaved: true,
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return res.json({ success: true, plan: fullPlan, source: 'gemini' });
      }
    } catch (geminiError) {
      console.warn('Gemini plan generation failed, falling back:', geminiError);
    }
  }

  // Fallback generation
  const fallbackPlan = createFallbackPlan(reqData);
  return res.json({ success: true, plan: fallbackPlan, source: 'fallback' });
});

// Suggest personalized ideas
eventApiRouter.post('/suggest-ideas', async (req: Request, res: Response) => {
  const { eventType, themeStyle, guestCount, targetBudget } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Suggest 4 innovative, heartwarming, and personalized event ideas for a ${eventType || 'celebration'} with theme "${themeStyle || 'Modern Festive'}", ${guestCount || 50} guests, and ₹${targetBudget || 5000} (INR) budget. Include signature drinks/food, guest experience, unique decor, and a budget saver.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: 'theme, experience, decor, food_drink, favors, or budget_saver' },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedCostImpact: { type: Type.STRING, description: 'low, medium, high, or free' },
                },
                required: ['category', 'title', 'description', 'estimatedCostImpact'],
              },
            },
          },
        }),
        7000
      );

      const ideas = JSON.parse(response.text || '[]');
      return res.json({
        success: true,
        ideas: ideas.map((item: any, idx: number) => ({
          id: `idea-${Date.now()}-${idx}`,
          ...item,
          isSaved: false,
        })),
      });
    } catch (err) {
      console.warn('Gemini ideas suggestion failed, using default ideas:', err);
    }
  }

  const defaultIdeas = [
    {
      id: `idea-${Date.now()}-1`,
      category: 'experience',
      title: 'Storytelling Memory Wall & Polaroid Corner',
      description: 'Provide two instant cameras and mini wooden clips on twine for guests to snap candid moments and pin handwritten memories.',
      estimatedCostImpact: 'low',
      isSaved: false,
    },
    {
      id: `idea-${Date.now()}-2`,
      category: 'food_drink',
      title: 'Personalized Signature Mocktail / Cocktail Bar',
      description: 'Two curated themed drinks featuring local botanical infusions and custom illustrated recipe cards for guests to keep.',
      estimatedCostImpact: 'low',
      isSaved: false,
    },
    {
      id: `idea-${Date.now()}-3`,
      category: 'budget_saver',
      title: 'Digital RSVP & Dynamic Seating Map',
      description: 'Save hundreds on postage and reprints by utilizing an interactive QR-code registry and online seating dashboard.',
      estimatedCostImpact: 'free',
      isSaved: false,
    },
    {
      id: `idea-${Date.now()}-4`,
      category: 'decor',
      title: 'Warm Ambient Lantern & Flora Centerpieces',
      description: 'Upcycled amber glass bottles with micro fairy lights and locally sourced seasonal foliage instead of expensive imported blooms.',
      estimatedCostImpact: 'low',
      isSaved: false,
    },
  ];

  return res.json({ success: true, ideas: defaultIdeas });
});

export function createFallbackPlan(req: PlanGenerationRequest): FullEventPlan {
  const budget = Number(req.targetBudget) || 5000;
  const isWedding = req.eventType === 'wedding';
  const isBirthday = req.eventType === 'birthday';

  let budgetItems: any[] = [];
  if (isWedding) {
    budgetItems = [
      { category: 'Venue', itemName: 'Ceremony & Reception Space Rental', allocatedAmount: Math.round(budget * 0.30), notes: 'Deposit due upon contract' },
      { category: 'Catering & Bar', itemName: 'Plated Dinner & Cocktail Service', allocatedAmount: Math.round(budget * 0.35), notes: 'Includes tastings' },
      { category: 'Photography & Film', itemName: '8-Hour Professional Photography', allocatedAmount: Math.round(budget * 0.12), notes: 'Full digital album' },
      { category: 'Floral & Decor', itemName: 'Ceremony Arch, Bouquets & Centerpieces', allocatedAmount: Math.round(budget * 0.10) },
      { category: 'Music & Audio', itemName: 'Live Duo & Evening DJ', allocatedAmount: Math.round(budget * 0.08) },
      { category: 'Contingency', itemName: 'Buffer & Gratuities', allocatedAmount: Math.round(budget * 0.05) },
    ];
  } else if (isBirthday) {
    budgetItems = [
      { category: 'Venue', itemName: 'Private Party Lounge / Event Room', allocatedAmount: Math.round(budget * 0.25) },
      { category: 'Food & Refreshments', itemName: 'Buffet Catering, Sliders & Beverages', allocatedAmount: Math.round(budget * 0.35) },
      { category: 'Custom Cake', itemName: 'Tiered Specialty Theme Cake & Cupcakes', allocatedAmount: Math.round(budget * 0.10) },
      { category: 'Entertainment', itemName: 'DJ / Performer / Activity Facilitator', allocatedAmount: Math.round(budget * 0.15) },
      { category: 'Decor & Balloons', itemName: 'Photo Backdrop, Balloon Arches & Tableware', allocatedAmount: Math.round(budget * 0.10) },
      { category: 'Party Favors', itemName: 'Custom Keepsake Favors for Guests', allocatedAmount: Math.round(budget * 0.05) },
    ];
  } else {
    budgetItems = [
      { category: 'Permits & Municipal', itemName: 'City Park Permits & Safety Inspection', allocatedAmount: Math.round(budget * 0.15) },
      { category: 'Rentals & Infrastructure', itemName: 'Tents, Canopies, Tables & Restroom Units', allocatedAmount: Math.round(budget * 0.35) },
      { category: 'Sound & Audio Rig', itemName: 'Stage PA System & Microphone Setup', allocatedAmount: Math.round(budget * 0.18) },
      { category: 'Signage & Marketing', itemName: 'Town Banners, Directional Signs & Flyers', allocatedAmount: Math.round(budget * 0.12) },
      { category: 'Hospitality & Supplies', itemName: 'Volunteer Refreshments & Water Stations', allocatedAmount: Math.round(budget * 0.12) },
      { category: 'Emergency Reserve', itemName: 'Weather Tarps & First-Aid Contingency', allocatedAmount: Math.round(budget * 0.08) },
    ];
  }

  const milestones: any[] = [
    { phase: '3_months_before', phaseLabel: '3 Months Out', title: 'Confirm Date, Location & Core Vendors', targetDate: req.date || 'Upcoming', completed: true, responsible: 'Lead Planner' },
    { phase: '1_month_before', phaseLabel: '1 Month Out', title: 'Send Invitations & Confirm RSVPs', targetDate: req.date || 'Upcoming', completed: false, responsible: 'Host Team' },
    { phase: '1_week_before', phaseLabel: 'Final Week', title: 'Finalize Equipment Check & Vendor Arrival Schedule', targetDate: req.date || 'Upcoming', completed: false, responsible: 'Planner' },
    { phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '09:00 AM - Vendor Load-in & Venue Setup', targetDate: req.date || 'Upcoming', time: '09:00', completed: false, responsible: 'Setup Crew' },
    { phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '13:00 PM - Soundcheck & Catering Prep', targetDate: req.date || 'Upcoming', time: '13:00', completed: false, responsible: 'AV Lead & Chef' },
    { phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '15:00 PM - Guest Arrival & Opening Welcome', targetDate: req.date || 'Upcoming', time: '15:00', completed: false, responsible: 'Emcee' },
    { phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '18:00 PM - Main Program / Feast / Speeches', targetDate: req.date || 'Upcoming', time: '18:00', completed: false, responsible: 'All Teams' },
    { phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '21:30 PM - Event Wrap & Tear Down', targetDate: req.date || 'Upcoming', time: '21:30', completed: false, responsible: 'Logistics' },
  ];

  const vendors: any[] = isWedding
    ? [
        { category: 'Venue', name: 'Grand Estate & Gardens', status: 'contacted', priceQuote: Math.round(budget * 0.3) },
        { category: 'Caterer', name: 'Artisan Feast Culinary', status: 'researching', priceQuote: Math.round(budget * 0.35) },
        { category: 'Photography', name: 'Silver Light Photo Studio', status: 'contacted', priceQuote: Math.round(budget * 0.12) },
        { category: 'Music', name: 'Harbor Sounds DJ & Band', status: 'researching', priceQuote: Math.round(budget * 0.08) },
      ]
    : isBirthday
    ? [
        { category: 'Venue', name: 'City Skyline Event Studio', status: 'contacted', priceQuote: Math.round(budget * 0.25) },
        { category: 'Bakery', name: 'Sweet Creations Cake Bar', status: 'researching', priceQuote: Math.round(budget * 0.1) },
        { category: 'Entertainment', name: 'Groove Beats DJ & Lighting', status: 'researching', priceQuote: Math.round(budget * 0.15) },
      ]
    : [
        { category: 'Municipal Permits', name: 'City Parks & Public Works Office', status: 'contacted', priceQuote: Math.round(budget * 0.15) },
        { category: 'Equipment Rental', name: 'Pinnacle Event Tent & Power Supply', status: 'contacted', priceQuote: Math.round(budget * 0.35) },
        { category: 'Sound System', name: 'Live Stage Audio Engineers', status: 'researching', priceQuote: Math.round(budget * 0.18) },
      ];

  const ideas: any[] = [
    {
      category: 'experience',
      title: 'Interactive Guest Welcome Installation',
      description: 'A customized display allowing guests to write well-wishes, place pins on a world map, or snap polaroid keepsakes.',
      estimatedCostImpact: 'low',
      isSaved: true,
    },
    {
      category: 'food_drink',
      title: 'Craft Signature Drink Station',
      description: 'Two personalized beverages reflecting the honorees’ favorite tastes with themed signage and custom garnishes.',
      estimatedCostImpact: 'low',
      isSaved: true,
    },
    {
      category: 'budget_saver',
      title: 'Digital Multi-Platform Schedule & RSVPs',
      description: 'Leverage QR codes on welcome signage so guests can view live timelines and announcements directly on mobile without printed booklets.',
      estimatedCostImpact: 'free',
      isSaved: true,
    },
    {
      category: 'decor',
      title: 'Warm Micro-Fairy Light & Botanical Accents',
      description: 'High-impact atmospheric lighting combined with locally sourced seasonal greenery for maximum aesthetic at minimum cost.',
      estimatedCostImpact: 'low',
      isSaved: true,
    },
  ];

  return {
    id: `plan-${Date.now()}`,
    title: req.title,
    eventType: req.eventType,
    date: req.date || new Date().toISOString().split('T')[0],
    location: req.location || 'Selected Venue',
    guestCount: Number(req.guestCount) || 50,
    targetBudget: budget,
    themeStyle: req.themeStyle || 'Classic & Celebratory',
    specialRequests: req.specialRequests || '',
    summaryOverview: `A meticulously planned ${req.eventType} tailored for ${req.guestCount || 50} guests, balancing elegant aesthetics, cohesive schedule pacing, and budget discipline.`,
    budgetItems: budgetItems.map((b, i) => ({
      id: `b-${i}`,
      category: b.category,
      itemName: b.itemName,
      allocatedAmount: b.allocatedAmount,
      actualAmount: 0,
      paidAmount: 0,
      status: 'estimated',
      notes: b.notes || '',
    })),
    timelineMilestones: milestones.map((m, i) => ({
      id: `m-${i}`,
      ...m,
    })),
    vendors: vendors.map((v, i) => ({
      id: `v-${i}`,
      ...v,
      depositAmount: 0,
      notes: '',
    })),
    personalizedIdeas: ideas.map((idItem, i) => ({
      id: `idea-${i}`,
      ...idItem,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
