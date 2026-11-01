export type EventType = 'wedding' | 'birthday' | 'community' | 'anniversary' | 'corporate_gala';

export interface BudgetItem {
  id: string;
  category: string;
  itemName: string;
  allocatedAmount: number;
  actualAmount: number;
  paidAmount: number;
  status: 'estimated' | 'booked' | 'paid';
  notes?: string;
}

export type TimelinePhase = 
  | '6_months_before'
  | '3_months_before'
  | '1_month_before'
  | '1_week_before'
  | 'day_of'
  | 'post_event';

export interface TimelineMilestone {
  id: string;
  phase: TimelinePhase;
  phaseLabel: string;
  title: string;
  targetDate: string;
  time?: string;
  completed: boolean;
  responsible: string;
  notes?: string;
}

export type VendorStatus = 
  | 'researching'
  | 'contacted'
  | 'proposal_received'
  | 'contract_signed'
  | 'deposit_paid'
  | 'confirmed';

export interface VendorItem {
  id: string;
  category: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  status: VendorStatus;
  priceQuote?: number;
  depositAmount?: number;
  depositDue?: string;
  notes?: string;
}

export interface PersonalizedIdea {
  id: string;
  category: 'theme' | 'experience' | 'decor' | 'food_drink' | 'favors' | 'budget_saver';
  title: string;
  description: string;
  estimatedCostImpact: 'low' | 'medium' | 'high' | 'free';
  isSaved: boolean;
}

export interface FullEventPlan {
  id: string;
  title: string;
  eventType: EventType;
  date: string;
  location: string;
  guestCount: number;
  targetBudget: number;
  themeStyle: string;
  specialRequests: string;
  summaryOverview: string;
  budgetItems: BudgetItem[];
  timelineMilestones: TimelineMilestone[];
  vendors: VendorItem[];
  personalizedIdeas: PersonalizedIdea[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanGenerationRequest {
  eventType: EventType;
  title: string;
  date: string;
  location: string;
  guestCount: number;
  targetBudget: number;
  themeStyle: string;
  specialRequests?: string;
}
