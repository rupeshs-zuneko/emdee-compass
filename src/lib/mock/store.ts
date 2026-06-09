import { useSyncExternalStore } from "react";
import type {
  ContactRef,
  Opportunity,
  SolutionRef,
  Stage,
  User,
  Visit,
} from "./types";

const STORAGE_KEY = "emdee_crm_state_v1";
const AUTH_KEY = "emdee_crm_auth_v1";

const SOLUTIONS: SolutionRef[] = [
  { id: "sol_1", name: "Citizen Portal Suite", offeringType: "Software" },
  { id: "sol_2", name: "Land Records Digitization", offeringType: "Software + Services" },
  { id: "sol_3", name: "Fleet Telematics", offeringType: "Hardware + SaaS" },
  { id: "sol_4", name: "Cyber Security Audit", offeringType: "Services" },
  { id: "sol_5", name: "Digital Identity Platform", offeringType: "Platform" },
  { id: "sol_6", name: "Smart City Sensors", offeringType: "Hardware" },
];

const CONTACTS: ContactRef[] = [
  { id: "c_1", name: "Anita Deshmukh", designation: "Joint Secretary", mobile: "+91 98200 11122", influence: "Decision Maker" },
  { id: "c_2", name: "Rohit Iyer", designation: "Director (IT)", mobile: "+91 98200 22233", influence: "Influencer" },
  { id: "c_3", name: "Sunita Rao", designation: "Section Officer", mobile: "+91 98200 33344", influence: "Gatekeeper" },
];

const DEPARTMENTS = [
  "Department of Transport",
  "Ministry of Justice",
  "Public Works Department",
  "Department of Energy",
  "Cabinet Office",
  "Health & Family Welfare",
  "Urban Development",
  "Revenue Department",
];

const DISTRICTS = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"];

const SOURCES = ["Cold Outreach", "Reference", "Tender Portal", "Industry Event", "Existing Account"];

const REP: User = {
  name: "Rupesh Shinde",
  email: "rupesh.s@zuneko.in",
  role: "Sales Representative",
};

interface State {
  opportunities: Opportunity[];
  visits: Visit[];
}

const today = new Date();
const iso = (d: Date) => d.toISOString();
const daysFromNow = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return iso(d);
};

const SEED: State = {
  opportunities: [
    {
      id: "opp_1",
      title: "Statewide Cloud Infrastructure Renewal",
      department: "Department of Transport",
      subDepartment: "IT Wing",
      district: "Mumbai",
      stage: "Tender Expected",
      temperature: "Hot",
      source: "Reference",
      actionDate: daysFromNow(3),
      createdDate: daysFromNow(-21),
      assignedRep: REP.name,
      departmentBudget: 45000000,
      softwareCost: 22000000,
      hardwareCost: 18000000,
      solutions: [SOLUTIONS[0], SOLUTIONS[4]],
      notes: "Strong push from Joint Secretary's office. Budget allocated for FY.",
    },
    {
      id: "opp_2",
      title: "Cyber Security Audit Programme",
      department: "Ministry of Justice",
      subDepartment: "Digital Courts Cell",
      district: "Pune",
      stage: "Pitched",
      temperature: "Warm",
      source: "Cold Outreach",
      actionDate: daysFromNow(5),
      createdDate: daysFromNow(-14),
      assignedRep: REP.name,
      departmentBudget: 12000000,
      softwareCost: 0,
      hardwareCost: 0,
      solutions: [SOLUTIONS[3]],
      notes: "Pitched scope to Director (IT). Awaiting feedback.",
    },
    {
      id: "opp_3",
      title: "Public Transit Fleet Telematics",
      department: "Public Works Department",
      subDepartment: "Bus Division",
      district: "Nagpur",
      stage: "Identified",
      temperature: "Cold",
      source: "Tender Portal",
      actionDate: daysFromNow(10),
      createdDate: daysFromNow(-7),
      assignedRep: REP.name,
      departmentBudget: 28000000,
      softwareCost: 8000000,
      hardwareCost: 17000000,
      solutions: [SOLUTIONS[2]],
      notes: "",
    },
    {
      id: "opp_4",
      title: "Land Records Digitization Phase II",
      department: "Revenue Department",
      subDepartment: "Survey Wing",
      district: "Nashik",
      stage: "Interest Confirmed",
      temperature: "Hot",
      source: "Existing Account",
      actionDate: daysFromNow(2),
      createdDate: daysFromNow(-30),
      assignedRep: REP.name,
      departmentBudget: 56000000,
      softwareCost: 30000000,
      hardwareCost: 14000000,
      solutions: [SOLUTIONS[1]],
      notes: "Sign-off pending from Principal Secretary.",
    },
    {
      id: "opp_5",
      title: "Smart City Sensor Network",
      department: "Urban Development",
      subDepartment: "Smart Cities Mission",
      district: "Thane",
      stage: "Tender Released",
      temperature: "Hot",
      source: "Industry Event",
      actionDate: daysFromNow(7),
      createdDate: daysFromNow(-45),
      assignedRep: REP.name,
      departmentBudget: 82000000,
      softwareCost: 24000000,
      hardwareCost: 48000000,
      solutions: [SOLUTIONS[5]],
      notes: "RFP live on portal. Submission due in 12 days.",
    },
    {
      id: "opp_6",
      title: "Digital Identity Framework Pilot",
      department: "Cabinet Office",
      subDepartment: "GovTech Lab",
      district: "Mumbai",
      stage: "Handed to CRM",
      temperature: "Warm",
      source: "Reference",
      actionDate: daysFromNow(0),
      createdDate: daysFromNow(-60),
      assignedRep: REP.name,
      departmentBudget: 18000000,
      softwareCost: 12000000,
      hardwareCost: 2000000,
      solutions: [SOLUTIONS[4]],
      notes: "Won. Transitioning to delivery team.",
    },
    {
      id: "opp_7",
      title: "Hospital Asset Tracking",
      department: "Health & Family Welfare",
      subDepartment: "Tertiary Hospitals",
      district: "Aurangabad",
      stage: "Dropped",
      temperature: "Cold",
      source: "Cold Outreach",
      actionDate: daysFromNow(-5),
      createdDate: daysFromNow(-50),
      assignedRep: REP.name,
      departmentBudget: 9000000,
      softwareCost: 0,
      hardwareCost: 0,
      solutions: [],
      notes: "No budget allocation this cycle.",
    },
  ],
  visits: [
    {
      id: "v_1",
      department: "Department of Transport",
      subDepartment: "IT Wing",
      district: "Mumbai",
      visitDate: daysFromNow(-2),
      visitType: "Negotiation",
      outcome: "Positive",
      opportunityId: "opp_1",
      nextAction: "Share final BoQ",
      nextActionDate: daysFromNow(3),
      discussionNotes: "JS confirmed budget. Walked through solution architecture. Asked for clarifications on SLAs and exit clauses.",
      contacts: [CONTACTS[0], CONTACTS[1]],
      solutions: [SOLUTIONS[0]],
      gps: { lat: 19.076, lng: 72.8777 },
      photos: [],
      salesRep: REP.name,
    },
    {
      id: "v_2",
      department: "Ministry of Justice",
      subDepartment: "Digital Courts Cell",
      district: "Pune",
      visitDate: daysFromNow(-5),
      visitType: "Discovery",
      outcome: "Neutral",
      opportunityId: "opp_2",
      nextAction: "Send sample audit report",
      nextActionDate: daysFromNow(2),
      discussionNotes: "Initial discovery. Scope appears modest. Director wants vendor comparison.",
      contacts: [CONTACTS[1]],
      solutions: [SOLUTIONS[3]],
      gps: { lat: 18.5204, lng: 73.8567 },
      photos: [],
      salesRep: REP.name,
    },
    {
      id: "v_3",
      department: "Urban Development",
      subDepartment: "Smart Cities Mission",
      district: "Thane",
      visitDate: daysFromNow(-7),
      visitType: "Demo",
      outcome: "Tender Indicated",
      opportunityId: "opp_5",
      nextAction: "Monitor portal for RFP",
      nextActionDate: daysFromNow(1),
      discussionNotes: "Demo went well. Mission Director indicated RFP within 2 weeks.",
      contacts: [CONTACTS[0], CONTACTS[2]],
      solutions: [SOLUTIONS[5]],
      gps: { lat: 19.2183, lng: 72.9781 },
      photos: [],
      salesRep: REP.name,
    },
    {
      id: "v_4",
      department: "Health & Family Welfare",
      subDepartment: "Tertiary Hospitals",
      district: "Aurangabad",
      visitDate: daysFromNow(-12),
      visitType: "Follow-up",
      outcome: "Negative",
      opportunityId: "opp_7",
      nextAction: "Revisit next FY",
      nextActionDate: daysFromNow(180),
      discussionNotes: "No budget. Closed out.",
      contacts: [CONTACTS[2]],
      solutions: [],
      gps: null,
      photos: [],
      salesRep: REP.name,
    },
    {
      id: "v_5",
      department: "Revenue Department",
      subDepartment: "Survey Wing",
      district: "Nashik",
      visitDate: daysFromNow(-1),
      visitType: "Closing",
      outcome: "Follow-up Required",
      opportunityId: "opp_4",
      nextAction: "Get Principal Secretary sign-off",
      nextActionDate: daysFromNow(4),
      discussionNotes: "Pricing finalized. Need top-level approval.",
      contacts: [CONTACTS[0]],
      solutions: [SOLUTIONS[1]],
      gps: { lat: 19.9975, lng: 73.7898 },
      photos: [],
      salesRep: REP.name,
    },
  ],
};

let state: State = load();
const listeners = new Set<() => void>();

function load(): State {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED;
}

function persist() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  return state;
}
function getServerSnapshot() {
  return SEED;
}

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// --- accessors ---

export function listOpportunities() {
  return state.opportunities;
}
export function getOpportunity(id: string) {
  return state.opportunities.find((o) => o.id === id) || null;
}
export function listVisits() {
  return state.visits;
}
export function getVisit(id: string) {
  return state.visits.find((v) => v.id === id) || null;
}
export function visitsForOpportunity(id: string) {
  return state.visits.filter((v) => v.opportunityId === id);
}

// --- mutators ---

const nextId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

export function createOpportunity(input: Partial<Opportunity>): Opportunity {
  const opp: Opportunity = {
    id: nextId("opp"),
    title: input.title || "Untitled Opportunity",
    department: input.department || "",
    subDepartment: input.subDepartment || "",
    district: input.district || "",
    stage: "Identified",
    temperature: input.temperature || "Warm",
    source: input.source || "",
    actionDate: input.actionDate || daysFromNow(7),
    createdDate: iso(new Date()),
    assignedRep: REP.name,
    departmentBudget: input.departmentBudget || 0,
    softwareCost: input.softwareCost || 0,
    hardwareCost: input.hardwareCost || 0,
    solutions: input.solutions || [],
    notes: input.notes || "",
  };
  state = { ...state, opportunities: [opp, ...state.opportunities] };
  emit();
  return opp;
}

export function updateOpportunity(id: string, patch: Partial<Opportunity>) {
  state = {
    ...state,
    opportunities: state.opportunities.map((o) => (o.id === id ? { ...o, ...patch } : o)),
  };
  emit();
}

export function transitionStage(id: string, stage: Stage) {
  updateOpportunity(id, { stage });
}

export function createVisit(input: Partial<Visit>): Visit {
  const v: Visit = {
    id: nextId("v"),
    department: input.department || "",
    subDepartment: input.subDepartment || "",
    district: input.district || "",
    visitDate: input.visitDate || iso(new Date()),
    visitType: input.visitType || "Discovery",
    outcome: input.outcome || "Neutral",
    opportunityId: input.opportunityId ?? null,
    nextAction: input.nextAction || "",
    nextActionDate: input.nextActionDate || daysFromNow(7),
    discussionNotes: input.discussionNotes || "",
    contacts: input.contacts || [],
    solutions: input.solutions || [],
    gps: input.gps || null,
    photos: input.photos || [],
    salesRep: REP.name,
  };
  state = { ...state, visits: [v, ...state.visits] };
  emit();
  return v;
}

export function updateVisit(id: string, patch: Partial<Visit>) {
  state = {
    ...state,
    visits: state.visits.map((v) => (v.id === id ? { ...v, ...patch } : v)),
  };
  emit();
}

// --- reference data ---

export const refData = {
  solutions: SOLUTIONS,
  contacts: CONTACTS,
  departments: DEPARTMENTS,
  districts: DISTRICTS,
  sources: SOURCES,
  currentUser: REP,
};

// --- auth ---

export function getAuth(): { email: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  await new Promise((r) => setTimeout(r, 700));
  if (!email || !password) return { ok: false, error: "Email and password are required." };
  if (email.trim().toLowerCase() === "wrong@test.com") {
    return { ok: false, error: "Invalid email or password." };
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify({ email }));
  return { ok: true };
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
}
