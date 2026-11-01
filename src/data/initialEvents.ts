import { FullEventPlan } from '../types/event';

export const INITIAL_PLANS: FullEventPlan[] = [
  {
    id: 'plan-wedding-1',
    title: "Elena & Marcus's Coastal Botanical Wedding",
    eventType: 'wedding',
    date: '2026-11-14',
    location: 'Cliffside Botanical Pavilion, Monterey, CA',
    guestCount: 120,
    targetBudget: 38000,
    themeStyle: 'Coastal Botanical & Warm Terracotta with Organic Florals',
    specialRequests: 'Sunset ceremony at 16:30, pescatarian & gluten-free catering options, acoustic guitar during vows, vintage polaroid station.',
    summaryOverview: 'An intimate coastal celebration blending native coastal flora with warm terracotta textures. Features a seaside outdoor ceremony followed by an open-air pavilion dinner, artisanal local farm-to-table dining, and a live 5-piece brass-and-soul ensemble.',
    budgetItems: [
      { id: 'b-1', category: 'Venue', itemName: 'Botanical Pavilion Rental & Seaside Terrace', allocatedAmount: 8500, actualAmount: 8500, paidAmount: 4250, status: 'booked', notes: 'Includes tables, chairs, and evening lighting setup' },
      { id: 'b-2', category: 'Catering & Bar', itemName: 'Farm-to-Table Dinner (120 guests + signature bar)', allocatedAmount: 14500, actualAmount: 14200, paidAmount: 5000, status: 'booked', notes: 'Pescatarian stations + local coastal wines' },
      { id: 'b-3', category: 'Photography & Film', itemName: '8-Hour Dual Photographer + Drone Footage', allocatedAmount: 4200, actualAmount: 4000, paidAmount: 2000, status: 'booked', notes: 'Golden hour coastal session included' },
      { id: 'b-4', category: 'Floral & Decor', itemName: 'Terracotta Urns, Archway & Table Runners', allocatedAmount: 3800, actualAmount: 3600, paidAmount: 1800, status: 'booked', notes: 'Eucalyptus, pampas, proteas and terracotta ceramics' },
      { id: 'b-5', category: 'Music & Audio', itemName: 'Ceremony Acoustic Duo + Reception Soul Band', allocatedAmount: 3200, actualAmount: 3400, paidAmount: 1000, status: 'booked', notes: 'Ceremony acoustic guitar + 5-piece live dance band' },
      { id: 'b-6', category: 'Stationery & Signage', itemName: 'Letterpress Invitations, Menus & Welcome Board', allocatedAmount: 900, actualAmount: 850, paidAmount: 850, status: 'paid', notes: 'Handmade cotton paper with deckled edges' },
      { id: 'b-7', category: 'Attire & Beauty', itemName: 'Hair & Makeup for Bridal Party (6 people)', allocatedAmount: 1400, actualAmount: 1400, paidAmount: 700, status: 'booked' },
      { id: 'b-8', category: 'Contingency & Tips', itemName: 'Weather Canopy Reserve & Vendor Tips', allocatedAmount: 1500, actualAmount: 0, paidAmount: 0, status: 'estimated', notes: 'Emergency buffer' }
    ],
    timelineMilestones: [
      { id: 't-1', phase: '6_months_before', phaseLabel: '6 Months Out', title: 'Lock Venue & Caterer Tasting', targetDate: '2026-05-14', completed: true, responsible: 'Planner & Couple' },
      { id: 't-2', phase: '3_months_before', phaseLabel: '3 Months Out', title: 'Send Formal Invitations & Track RSVPs', targetDate: '2026-08-14', completed: true, responsible: 'Couple' },
      { id: 't-3', phase: '1_month_before', phaseLabel: '1 Month Out', title: 'Finalize Floor Plan & Seating Chart', targetDate: '2026-10-14', completed: true, responsible: 'Planner' },
      { id: 't-4', phase: '1_week_before', phaseLabel: 'Final Week', title: 'Final Headcount & Dietary List to Caterer', targetDate: '2026-11-07', completed: false, responsible: 'Planner' },
      { id: 't-5', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '10:00 AM - Vendor Load-in & Floral Arch Installation', targetDate: '2026-11-14', time: '10:00', completed: false, responsible: 'Florist & Decor Crew' },
      { id: 't-6', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '13:00 PM - Bridal Party Hair, Makeup & First Look Photos', targetDate: '2026-11-14', time: '13:00', completed: false, responsible: 'Photographer & Stylist' },
      { id: 't-7', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '16:00 PM - Guest Arrival & Pre-Ceremony Infused Citrus Water', targetDate: '2026-11-14', time: '16:00', completed: false, responsible: 'Venue Staff' },
      { id: 't-8', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '16:30 PM - Sunset Ceremony & Vows Over the Ocean', targetDate: '2026-11-14', time: '16:30', completed: false, responsible: 'Officiant & Musicians' },
      { id: 't-9', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '17:30 PM - Cocktail Hour with Fresh Oyster Shucking Station', targetDate: '2026-11-14', time: '17:30', completed: false, responsible: 'Catering Team' },
      { id: 't-10', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '19:00 PM - Plated Dinner, Toasts & First Dance', targetDate: '2026-11-14', time: '19:00', completed: false, responsible: 'Band & Emcee' },
      { id: 't-11', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '22:30 PM - Sparkler Send-off & Late Night Churros', targetDate: '2026-11-14', time: '22:30', completed: false, responsible: 'Coordination Team' }
    ],
    vendors: [
      { id: 'v-1', category: 'Venue Coordinator', name: 'Monterey Coast Botanical Estate', contactPerson: 'Sarah Jenkins', phone: '(831) 555-0192', email: 'events@montereybotanicals.com', status: 'contract_signed', priceQuote: 8500, depositAmount: 4250, depositDue: 'Paid' },
      { id: 'v-2', category: 'Catering & Beverages', name: 'Pacific Coast Harvest Culinary Co.', contactPerson: 'Chef Mateo Vance', phone: '(831) 555-0144', email: 'catering@pacificcoastharvest.com', status: 'contract_signed', priceQuote: 14200, depositAmount: 5000, depositDue: 'Paid' },
      { id: 'v-3', category: 'Lead Photographer', name: 'Lighthouse & Dune Photography', contactPerson: 'Clara Reed', phone: '(415) 555-0187', email: 'clara@lighthousedune.com', status: 'contract_signed', priceQuote: 4000, depositAmount: 2000, depositDue: 'Paid' },
      { id: 'v-4', category: 'Floral & Botanical Design', name: 'Wild Coastal Blooms Studio', contactPerson: 'Liam Gomez', phone: '(831) 555-0131', email: 'liam@wildcoastalblooms.com', status: 'contract_signed', priceQuote: 3600, depositAmount: 1800, depositDue: 'Paid' },
      { id: 'v-5', category: 'Music Ensemble', name: 'The Golden Gate Brass & Soul Band', contactPerson: 'Marcus Cole', phone: '(415) 555-0219', email: 'booking@goldengatesoul.com', status: 'contract_signed', priceQuote: 3400, depositAmount: 1000, depositDue: 'Balance due Nov 1' }
    ],
    personalizedIdeas: [
      { id: 'pi-1', category: 'food_drink', title: 'His & Hers Coastal Signature Cocktails', description: 'His: Smoked rosemary mezcal paloma; Hers: Elderflower blackberry spritz garnished with edible coastal blossoms.', estimatedCostImpact: 'low', isSaved: true },
      { id: 'pi-2', category: 'experience', title: 'Audio Guestbook in a Vintage Rotary Phone', description: 'Guests pick up a retro terracotta-painted rotary phone to record genuine voice messages, well-wishes, and funny advice.', estimatedCostImpact: 'low', isSaved: true },
      { id: 'pi-3', category: 'favors', title: 'Artisanal Sea Salt in Mini Corked Vials', description: 'Locally harvested Big Sur sea salt infused with citrus herbs, tagged with custom calligraphy: "Thanks for seasoning our lives".', estimatedCostImpact: 'low', isSaved: true },
      { id: 'pi-4', category: 'decor', title: 'Suspended Driftwood & Fairy Light Canopy', description: 'Natural driftwood hung above long wooden banquet tables with delicate micro-filament fairy lights to simulate ocean starlight.', estimatedCostImpact: 'medium', isSaved: true }
    ],
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-10-25T10:00:00Z'
  },
  {
    id: 'plan-birthday-2',
    title: "Miles's 10th Super-Science & Robotics Birthday Lab",
    eventType: 'birthday',
    date: '2026-11-21',
    location: 'Discovery Hall MakerSpace & Courtyard',
    guestCount: 35,
    targetBudget: 2400,
    themeStyle: 'Retro Science Lab & Glowing Robotics with Interactive Experiments',
    specialRequests: 'Nut-free treats, dry-ice volcanic eruption cake, interactive take-home robotics kits for 25 kids, slime-making station.',
    summaryOverview: 'An action-packed 10th birthday party styled as a top-secret science laboratory. Kids receive lab coats, safety goggles, and ID badges upon arrival, then rotate through 3 experiment stations culminating in an explosive liquid nitrogen ice cream finale.',
    budgetItems: [
      { id: 'bb-1', category: 'Venue', itemName: 'MakerSpace 3-Hour Room Rental', allocatedAmount: 450, actualAmount: 450, paidAmount: 450, status: 'paid', notes: 'Includes 6 lab tables and sink cleanup' },
      { id: 'bb-2', category: 'Entertainment & Educator', itemName: 'Mad Science Instructor (2 Hours Live Demos)', allocatedAmount: 550, actualAmount: 500, paidAmount: 250, status: 'booked', notes: 'Liquid nitrogen + rocket launch included' },
      { id: 'bb-3', category: 'Food & Refreshments', itemName: 'Gourmet Sliders, Fruit Skewers & Lab Drinks', allocatedAmount: 600, actualAmount: 580, paidAmount: 200, status: 'booked', notes: 'Served in beaker-style safe plastic glassware' },
      { id: 'bb-4', category: 'Custom Cake', itemName: 'Beaker Volcano Dry-Ice Cake (Nut-Free Chocolate)', allocatedAmount: 250, actualAmount: 260, paidAmount: 130, status: 'booked', notes: 'Food-safe tube inside for fog effect' },
      { id: 'bb-5', category: 'Kits & Favors', itemName: 'Mini Solar Robot Kits & Lab Coats (25 sets)', allocatedAmount: 350, actualAmount: 320, paidAmount: 320, status: 'paid' },
      { id: 'bb-6', category: 'Decor & Balloons', itemName: 'Periodic Table Banner, Glow Sticks & Atom Garland', allocatedAmount: 200, actualAmount: 180, paidAmount: 180, status: 'paid' }
    ],
    timelineMilestones: [
      { id: 'bt-1', phase: '1_month_before', phaseLabel: '1 Month Out', title: 'Book Science Educator & Reserve MakerSpace', targetDate: '2026-10-21', completed: true, responsible: 'Host' },
      { id: 'bt-2', phase: '1_week_before', phaseLabel: '1 Week Out', title: 'Assemble Lab Badges & Order Dry-Ice', targetDate: '2026-11-14', completed: false, responsible: 'Host' },
      { id: 'bt-3', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '13:00 PM - Setup Experiment Tables & Decor', targetDate: '2026-11-21', time: '13:00', completed: false, responsible: 'Host & Helpers' },
      { id: 'bt-4', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '14:00 PM - Junior Scientists Check-in & Lab Coat Gearing', targetDate: '2026-11-21', time: '14:00', completed: false, responsible: 'Host' },
      { id: 'bt-5', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '14:30 PM - Magnetic Slime & Circuit Workshop', targetDate: '2026-11-21', time: '14:30', completed: false, responsible: 'Instructor' },
      { id: 'bt-6', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '15:30 PM - Volcano Cake Singing & Nitro Ice Cream', targetDate: '2026-11-21', time: '15:30', completed: false, responsible: 'Instructor & Host' }
    ],
    vendors: [
      { id: 'bv-1', category: 'Venue', name: 'Discovery Maker Lab Co.', contactPerson: 'Danielle Brooks', phone: '(555) 019-3382', status: 'confirmed', priceQuote: 450, depositAmount: 450 },
      { id: 'bv-2', category: 'Science Host', name: 'Quantum Kids Science Show', contactPerson: 'Prof. Eric Stern', phone: '(555) 019-4491', status: 'contract_signed', priceQuote: 500, depositAmount: 250 },
      { id: 'bv-3', category: 'Bakery', name: 'Sweet Molecule Bakery', contactPerson: 'Chef Nadia', phone: '(555) 019-8821', status: 'contract_signed', priceQuote: 260, depositAmount: 130 }
    ],
    personalizedIdeas: [
      { id: 'bpi-1', category: 'experience', title: 'Glowing Atomic Punch Station', description: 'Tonic water punch with lime that fluoresces under ultraviolet blacklights, served in graduated measuring cylinder cups.', estimatedCostImpact: 'low', isSaved: true },
      { id: 'bpi-2', category: 'favors', title: 'Customized Scientist ID Badges with Lanyards', description: 'Kids get a laminated pass with their photo or avatar: "Level 10 Master Roboticist".', estimatedCostImpact: 'low', isSaved: true },
      { id: 'bpi-3', category: 'decor', title: 'Giant Cardboard Robot Photo Booth', description: 'Retro 8-foot cardboard robot cutout with cutouts for kids faces and neon robotic sound effect buttons.', estimatedCostImpact: 'low', isSaved: true }
    ],
    createdAt: '2026-09-10T14:00:00Z',
    updatedAt: '2026-10-25T10:15:00Z'
  },
  {
    id: 'plan-community-3',
    title: 'Oakridge Annual Harvest & Charity Community Fair',
    eventType: 'community',
    date: '2026-12-05',
    location: 'Oakridge Town Square & Historic Green',
    guestCount: 350,
    targetBudget: 7500,
    themeStyle: 'Cozy Winter Harvest with Artisan Makers, Warm Cider & Local Music',
    specialRequests: 'City sound and street closure permits, local non-profit booth allocation, zero-waste composting stations, ADA accessible ramps.',
    summaryOverview: 'A neighborhood-wide community gathering uniting local businesses, artisan craftsmen, schools, and non-profits. Features 20 artisan pop-up stalls, 4 local food trucks, a community baking competition, acoustic live musicians, and a charitable toy collection drive.',
    budgetItems: [
      { id: 'cb-1', category: 'Permits & Municipal', itemName: 'City Park Permit, Police Traffic & Sound Waiver', allocatedAmount: 950, actualAmount: 900, paidAmount: 900, status: 'paid', notes: 'Approved by City Council' },
      { id: 'cb-2', category: 'Infrastructure & Rentals', itemName: '20 Pop-up Canopies, 60 Tables & Portable Generators', allocatedAmount: 2400, actualAmount: 2300, paidAmount: 1150, status: 'booked', notes: 'Delivery 07:00 AM on fair day' },
      { id: 'cb-3', category: 'Sound & Stage', itemName: 'Acoustic Sound Rig & Sound Engineer (6 Hours)', allocatedAmount: 1200, actualAmount: 1100, paidAmount: 550, status: 'booked' },
      { id: 'cb-4', category: 'Waste & Sanitation', itemName: '4 Portable Restrooms + 6 Eco-Compost Stations', allocatedAmount: 1100, actualAmount: 1150, paidAmount: 500, status: 'booked', notes: 'Zero-waste volunteer monitors assigned' },
      { id: 'cb-5', category: 'Signage & Marketing', itemName: 'Town Posters, Street Banner & Printed Map Flyers', allocatedAmount: 650, actualAmount: 550, paidAmount: 550, status: 'paid' },
      { id: 'cb-6', category: 'Community Prizes', itemName: 'Baking Contest Ribbons, Gift Baskets & Children Badges', allocatedAmount: 500, actualAmount: 480, paidAmount: 200, status: 'booked' },
      { id: 'cb-7', category: 'Contingency Reserve', itemName: 'Emergency First Aid Station & Weather Tarps', allocatedAmount: 700, actualAmount: 0, paidAmount: 0, status: 'estimated' }
    ],
    timelineMilestones: [
      { id: 'ct-1', phase: '3_months_before', phaseLabel: '3 Months Out', title: 'Submit Municipal Park & Street Closure Permits', targetDate: '2026-09-05', completed: true, responsible: 'Steering Committee' },
      { id: 'ct-2', phase: '1_month_before', phaseLabel: '1 Month Out', title: 'Confirm 20 Artisan Vendors & Food Trucks', targetDate: '2026-11-05', completed: true, responsible: 'Vendor Coordinator' },
      { id: 'ct-3', phase: '1_week_before', phaseLabel: '1 Week Out', title: 'Publish Fair Map & Stage Performance Schedule', targetDate: '2026-11-28', completed: false, responsible: 'Comms Lead' },
      { id: 'ct-4', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '07:00 AM - Street Barriers & Food Truck Electrical Staging', targetDate: '2026-12-05', time: '07:00', completed: false, responsible: 'Logistics Team' },
      { id: 'ct-5', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '10:00 AM - Gates Open & High School Brass Band Opening Ceremony', targetDate: '2026-12-05', time: '10:00', completed: false, responsible: 'Emcee' },
      { id: 'ct-6', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '13:00 PM - Annual Apple Pie & Baked Goods Contest Judging', targetDate: '2026-12-05', time: '13:00', completed: false, responsible: 'Judging Panel' },
      { id: 'ct-7', phase: 'day_of', phaseLabel: 'Day-Of Schedule', title: '16:00 PM - Charity Toy Drive Announcement & Tree Lighting', targetDate: '2026-12-05', time: '16:00', completed: false, responsible: 'Mayor & Committee' }
    ],
    vendors: [
      { id: 'cv-1', category: 'Municipal Permits', name: 'Oakridge Dept of Parks & Recreation', contactPerson: 'Officer Hayes', phone: '(555) 019-9911', status: 'confirmed', priceQuote: 900, depositAmount: 900 },
      { id: 'cv-2', category: 'Event Rentals', name: 'Valley Event Canopy & Power Rentals', contactPerson: 'Jack Miller', phone: '(555) 019-2234', status: 'contract_signed', priceQuote: 2300, depositAmount: 1150 },
      { id: 'cv-3', category: 'Sound Engineer', name: 'Acoustic Sound Lab Live', contactPerson: 'Tanya Morales', phone: '(555) 019-7711', status: 'contract_signed', priceQuote: 1100, depositAmount: 550 }
    ],
    personalizedIdeas: [
      { id: 'cpi-1', category: 'experience', title: 'Community Wishing Garland & Storyboard', description: 'A giant woven pine-and-rope garland where neighbors pin hand-written notes celebrating local elders and favorite town memories.', estimatedCostImpact: 'low', isSaved: true },
      { id: 'cpi-2', category: 'food_drink', title: 'Warm Spiced Cider Passport', description: 'Attendees buy a reusable town commemorative mug and receive stamps tasting 4 different heritage cider recipes from local farms.', estimatedCostImpact: 'low', isSaved: true },
      { id: 'cpi-3', category: 'experience', title: 'Youth Maker & Upcycling Workshop Booth', description: 'Children build birdhouses and holiday wreaths using reclaimed barn wood and pine cones under supervision.', estimatedCostImpact: 'free', isSaved: true }
    ],
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-10-25T10:20:00Z'
  }
];
