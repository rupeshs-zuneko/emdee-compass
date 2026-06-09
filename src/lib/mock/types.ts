export type Stage =
  | "Identified"
  | "Pitched"
  | "Interest Confirmed"
  | "Tender Expected"
  | "Tender Released"
  | "Handed to CRM"
  | "Dropped";

export type Temperature = "Hot" | "Warm" | "Cold";

export type Outcome =
  | "Positive"
  | "Neutral"
  | "Negative"
  | "Tender Indicated"
  | "Follow-up Required";

export type VisitType = "Discovery" | "Demo" | "Negotiation" | "Follow-up" | "Closing";

export type InfluenceLevel = "Decision Maker" | "Influencer" | "Gatekeeper" | "User";

export interface SolutionRef {
  id: string;
  name: string;
  offeringType: string;
}

export interface ContactRef {
  id: string;
  name: string;
  designation: string;
  mobile?: string;
  influence: InfluenceLevel;
}

export interface Opportunity {
  id: string;
  title: string;
  department: string;
  subDepartment: string;
  district: string;
  stage: Stage;
  temperature: Temperature;
  source: string;
  actionDate: string;
  createdDate: string;
  assignedRep: string;
  departmentBudget: number;
  softwareCost: number;
  hardwareCost: number;
  solutions: SolutionRef[];
  notes: string;
}

export interface Visit {
  id: string;
  department: string;
  subDepartment: string;
  district: string;
  visitDate: string;
  visitType: VisitType;
  outcome: Outcome;
  opportunityId: string | null;
  nextAction: string;
  nextActionDate: string;
  discussionNotes: string;
  contacts: ContactRef[];
  solutions: SolutionRef[];
  gps: { lat: number; lng: number } | null;
  photos: string[];
  salesRep: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
}
