import { useSyncExternalStore } from "react";
import type {
  ContactRef,
  Opportunity,
  Solution,
  SolutionRef,
  Stage,
  User,
  Visit,
} from "./types";

const STORAGE_KEY = "emdee_crm_state_v2";
const AUTH_KEY = "emdee_crm_auth_v1";

const SOLUTIONS: Solution[] = [
  {
    id: "sol_1",
    name: "CCTV Analytics",
    category: "Surveillance & Vision",
    offeringType: "Software",
    shortDescription:
      "AI-powered video analytics layered on existing CCTV networks for real-time alerts, intrusion detection, and behaviour analysis.",
    talkingPoints: [
      "Works with most ONVIF cameras — no rip-and-replace",
      "GPU-optimised edge processing keeps bandwidth costs low",
      "Pre-trained models for crowd, vehicle, and ANPR use cases",
      "Compliant with MeitY data residency guidelines",
    ],
    status: "Published",
  },
  {
    id: "sol_2",
    name: "Smart Surveillance System",
    category: "Surveillance & Vision",
    offeringType: "Solution",
    shortDescription:
      "End-to-end command-and-control surveillance platform combining cameras, analytics, VMS, and operator dashboards.",
    talkingPoints: [
      "Single pane of glass for all city/campus cameras",
      "Incident workflows with role-based escalation",
      "Integrates with PA systems and panic alarms",
      "Deployed across 4 smart-city ICCCs",
    ],
    status: "Published",
  },
  {
    id: "sol_3",
    name: "Edge Cameras",
    category: "Surveillance & Vision",
    offeringType: "Hardware",
    shortDescription:
      "Ruggedised AI-on-edge IP cameras with on-device inference for low-latency analytics and offline operation.",
    talkingPoints: [
      "IP67-rated, suitable for outdoor public deployments",
      "Built-in ANPR and face-blur modules",
      "PoE+ with optional solar/4G kit",
      "5-year warranty with on-site service",
    ],
    status: "Published",
  },
  {
    id: "sol_4",
    name: "ERP Workflow",
    category: "ERP & Workflow",
    offeringType: "Software",
    shortDescription:
      "Configurable workflow engine for government departments — file movement, approvals, and citizen-service tracking.",
    talkingPoints: [
      "No-code form and workflow designer",
      "DigiLocker and eSign integrations out of the box",
      "Bengali, Hindi, and English language support",
      "Audit trail compliant with RTI requirements",
    ],
    status: "Published",
  },
  {
    id: "sol_5",
    name: "Process Automation Suite",
    category: "Automation",
    offeringType: "Solution",
    shortDescription:
      "RPA + workflow bundle that automates repetitive back-office processes across legacy systems and modern apps.",
    talkingPoints: [
      "Pre-built bots for HRMS, treasury, and grievance redressal",
      "ROI typically within 6 months on volume processes",
      "Works alongside existing ERP without disruption",
      "Dedicated implementation support for first 90 days",
    ],
    status: "Published",
  },
  // Hidden draft — should never appear in pickers/catalog
  {
    id: "sol_draft",
    name: "Drone Surveillance (Beta)",
    category: "Surveillance & Vision",
    offeringType: "Solution",
    shortDescription: "Beta drone surveillance offering — internal only.",
    talkingPoints: [],
    status: "Draft",
  },
];

function ref(id: string): SolutionRef {
  const s = SOLUTIONS.find((x) => x.id === id)!;
  return { id: s.id, name: s.name, offeringType: s.offeringType };
}

const CONTACTS: ContactRef[] = [
  { id: "c_1", name: "Soumitra Banerjee", designation: "Joint Commissioner", mobile: "+91 98300 11122", influence: "Decision Maker" },
  { id: "c_2", name: "Anindita Ghosh", designation: "Deputy Director (IT)", mobile: "+91 98300 22233", influence: "Influencer" },
  { id: "c_3", name: "Rajat Mukherjee", designation: "Section Officer", mobile: "+91 98300 33344", influence: "Gatekeeper" },
  { id: "c_4", name: "Dr. Paromita Sen", designation: "Medical Superintendent", mobile: "+91 98300 44455", influence: "Decision Maker" },
];

const DEPARTMENTS = [
  "Kolkata Police",
  "Howrah Municipal Corporation",
  "WB Health Department",
  "WB Education Department",
  "Hooghly District Administration",
];

const DISTRICTS = [
  "Kolkata",
  "Howrah",
  "Hooghly",
  "North 24 Parganas",
  "South 24 Parganas",
  "Bardhaman",
];

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
      title: "Kolkata Police City-Wide CCTV Upgrade",
      department: "Kolkata Police",
      subDepartment: "Command & Control Centre",
      district: "Kolkata",
      stage: "Tender Expected",
      temperature: "Hot",
      source: "Reference",
      actionDate: daysFromNow(3),
      createdDate: daysFromNow(-21),
      assignedRep: REP.name,
      departmentBudget: 45000000,
      softwareCost: 22000000,
      hardwareCost: 18000000,
      solutions: [ref("sol_2"), ref("sol_3")],
      notes: "Strong push from Joint Commissioner. FY budget allocated. RFP draft under legal review.",
    },
    {
      id: "opp_2",
      title: "Howrah Citizen Services Automation",
      department: "Howrah Municipal Corporation",
      subDepartment: "e-Governance Cell",
      district: "Howrah",
      stage: "Pitched",
      temperature: "Warm",
      source: "Cold Outreach",
      actionDate: daysFromNow(5),
      createdDate: daysFromNow(-14),
      assignedRep: REP.name,
      departmentBudget: 12000000,
      softwareCost: 9000000,
      hardwareCost: 0,
      solutions: [ref("sol_4"), ref("sol_5")],
      notes: "Pitched ERP Workflow + RPA bundle to Deputy Director. Awaiting feedback.",
    },
    {
      id: "opp_3",
      title: "Hospital Surveillance — SSKM & NRS",
      department: "WB Health Department",
      subDepartment: "Tertiary Care",
      district: "Kolkata",
      stage: "Identified",
      temperature: "Cold",
      source: "Tender Portal",
      actionDate: daysFromNow(10),
      createdDate: daysFromNow(-7),
      assignedRep: REP.name,
      departmentBudget: 28000000,
      softwareCost: 8000000,
      hardwareCost: 17000000,
      solutions: [ref("sol_2")],
      notes: "Initial scoping after security incident in March.",
    },
    {
      id: "opp_4",
      title: "WB Education Department School ERP",
      department: "WB Education Department",
      subDepartment: "Secondary Board",
      district: "Kolkata",
      stage: "Interest Confirmed",
      temperature: "Hot",
      source: "Existing Account",
      actionDate: daysFromNow(-1),
      createdDate: daysFromNow(-30),
      assignedRep: REP.name,
      departmentBudget: 56000000,
      softwareCost: 30000000,
      hardwareCost: 14000000,
      solutions: [ref("sol_4")],
      notes: "Sign-off pending from Principal Secretary. Phase 1 covers 200 schools.",
    },
    {
      id: "opp_5",
      title: "Hooghly Smart Surveillance Programme",
      department: "Hooghly District Administration",
      subDepartment: "DM Office",
      district: "Hooghly",
      stage: "Tender Released",
      temperature: "Hot",
      source: "Industry Event",
      actionDate: daysFromNow(7),
      createdDate: daysFromNow(-45),
      assignedRep: REP.name,
      departmentBudget: 82000000,
      softwareCost: 24000000,
      hardwareCost: 48000000,
      solutions: [ref("sol_2"), ref("sol_3"), ref("sol_1")],
      notes: "RFP live on WBSEDCL portal. Submission due in 12 days.",
    },
    {
      id: "opp_6",
      title: "Kolkata Police Traffic ANPR Pilot",
      department: "Kolkata Police",
      subDepartment: "Traffic Wing",
      district: "Kolkata",
      stage: "Handed to CRM",
      temperature: "Warm",
      source: "Reference",
      actionDate: daysFromNow(0),
      createdDate: daysFromNow(-60),
      assignedRep: REP.name,
      departmentBudget: 18000000,
      softwareCost: 12000000,
      hardwareCost: 2000000,
      solutions: [ref("sol_1")],
      notes: "Won. Transitioning to delivery team.",
    },
    {
      id: "opp_7",
      title: "Howrah Hospital Asset Tracking",
      department: "WB Health Department",
      subDepartment: "Howrah General Hospital",
      district: "Howrah",
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
      department: "Kolkata Police",
      subDepartment: "Command & Control Centre",
      district: "Kolkata",
      visitDate: daysFromNow(-2),
      visitType: "Technical Discussion",
      outcome: "Positive",
      opportunityId: "opp_1",
      nextAction: "Share final BoQ and SLA matrix",
      nextActionDate: daysFromNow(3),
      discussionNotes:
        "Joint Commissioner confirmed budget. Walked through camera placement plan for Park Street and Esplanade zones. Asked for clarifications on SLAs and exit clauses.",
      contacts: [CONTACTS[0], CONTACTS[1]],
      solutions: [ref("sol_2"), ref("sol_3")],
      gps: { lat: 22.5726, lng: 88.3639 },
      photos: [],
      salesRep: REP.name,
    },
    {
      id: "v_2",
      department: "Howrah Municipal Corporation",
      subDepartment: "e-Governance Cell",
      district: "Howrah",
      visitDate: daysFromNow(-5),
      visitType: "Cold Pitch",
      outcome: "Neutral",
      opportunityId: "opp_2",
      nextAction: "Send sample workflow templates",
      nextActionDate: daysFromNow(2),
      discussionNotes:
        "First meeting. Walked through ERP Workflow capabilities. Director wants a comparison with TCS iON offering.",
      contacts: [CONTACTS[1]],
      solutions: [ref("sol_4")],
      gps: { lat: 22.5958, lng: 88.2636 },
      photos: [],
      salesRep: REP.name,
    },
    {
      id: "v_3",
      department: "Hooghly District Administration",
      subDepartment: "DM Office",
      district: "Hooghly",
      visitDate: daysFromNow(-7),
      visitType: "Demo",
      outcome: "Tender Indicated",
      opportunityId: "opp_5",
      nextAction: "Monitor portal for RFP release",
      nextActionDate: daysFromNow(1),
      discussionNotes:
        "Demo at DM Bungalow. District Magistrate indicated RFP within 2 weeks. Showed live feed from Kolkata deployment.",
      contacts: [CONTACTS[0], CONTACTS[2]],
      solutions: [ref("sol_2")],
      gps: { lat: 22.9089, lng: 88.3970 },
      photos: [],
      salesRep: REP.name,
    },
    {
      id: "v_4",
      department: "WB Health Department",
      subDepartment: "Howrah General Hospital",
      district: "Howrah",
      visitDate: daysFromNow(-12),
      visitType: "Tender Follow-up",
      outcome: "Negative",
      opportunityId: "opp_7",
      nextAction: "Revisit next FY",
      nextActionDate: daysFromNow(180),
      discussionNotes: "No budget this cycle. Closed out.",
      contacts: [CONTACTS[2]],
      solutions: [],
      gps: null,
      photos: [],
      salesRep: REP.name,
    },
    {
      id: "v_5",
      department: "WB Education Department",
      subDepartment: "Secondary Board",
      district: "Kolkata",
      visitDate: daysFromNow(-1),
      visitType: "Relationship Visit",
      outcome: "Follow-up Required",
      opportunityId: "opp_4",
      nextAction: "Get Principal Secretary sign-off",
      nextActionDate: daysFromNow(4),
      discussionNotes: "Pricing finalized. Need top-level approval before tender release.",
      contacts: [CONTACTS[0], CONTACTS[3]],
      solutions: [ref("sol_4")],
      gps: { lat: 22.5448, lng: 88.3426 },
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

export function listPublishedSolutions(): Solution[] {
  return SOLUTIONS.filter((s) => s.status === "Published");
}
export function getSolution(id: string): Solution | null {
  return SOLUTIONS.find((s) => s.id === id) || null;
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
    visitType: input.visitType || "Cold Pitch",
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
  solutions: SOLUTIONS.filter((s) => s.status === "Published"),
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
