import { cn } from "@/lib/utils";
import type { Outcome, Stage, Temperature } from "@/lib/mock/types";

const stageStyles: Record<Stage, string> = {
  "Identified": "bg-zinc-100 text-zinc-700 ring-zinc-200/60",
  "Pitched": "bg-blue-50 text-blue-700 ring-blue-200/60",
  "Interest Confirmed": "bg-teal-50 text-teal-700 ring-teal-200/60",
  "Tender Expected": "bg-purple-50 text-purple-700 ring-purple-200/60",
  "Tender Released": "bg-violet-50 text-violet-700 ring-violet-200/60",
  "Handed to CRM": "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
  "Dropped": "bg-red-50 text-red-700 ring-red-200/60",
};

const tempStyles: Record<Temperature, string> = {
  Hot: "bg-orange-50 text-orange-700 ring-orange-200/60",
  Warm: "bg-amber-50 text-amber-700 ring-amber-200/60",
  Cold: "bg-sky-50 text-sky-700 ring-sky-200/60",
};

const outcomeStyles: Record<Outcome, string> = {
  Positive: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
  Neutral: "bg-amber-50 text-amber-700 ring-amber-200/60",
  Negative: "bg-red-50 text-red-700 ring-red-200/60",
  "Tender Indicated": "bg-purple-50 text-purple-700 ring-purple-200/60",
  "Follow-up Required": "bg-zinc-100 text-zinc-700 ring-zinc-200/60",
};

const base = "inline-flex items-center px-2.5 py-1 text-[10px] font-semibold rounded-full ring-1 uppercase tracking-tight whitespace-nowrap";

export function StageBadge({ stage, className }: { stage: Stage; className?: string }) {
  return <span className={cn(base, stageStyles[stage], className)}>{stage}</span>;
}
export function TemperatureBadge({ temp, className }: { temp: Temperature; className?: string }) {
  return <span className={cn(base, tempStyles[temp], className)}>{temp}</span>;
}
export function OutcomeBadge({ outcome, className }: { outcome: Outcome; className?: string }) {
  return <span className={cn(base, outcomeStyles[outcome], className)}>{outcome}</span>;
}
