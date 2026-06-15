import { Check } from "lucide-react";
import type { Stage } from "@/lib/mock/types";

const FLOW: Stage[] = [
  "Identified",
  "Pitched",
  "Interest Confirmed",
  "Tender Expected",
  "Tender Released",
  "Handed to CRM",
];

const SHORT: Record<Stage, string> = {
  "Identified": "Identified",
  "Pitched": "Pitched",
  "Interest Confirmed": "Interest",
  "Tender Expected": "Expected",
  "Tender Released": "Released",
  "Handed to CRM": "Handed",
  "Dropped": "Dropped",
};

export function StageFlow({ stage }: { stage: Stage }) {
  const dropped = stage === "Dropped";
  const currentIdx = dropped ? -1 : FLOW.indexOf(stage);
  const pct = dropped ? 0 : ((currentIdx) / (FLOW.length - 1)) * 100;

  return (
    <div className="bg-card rounded-[20px] ring-1 ring-black/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">Pipeline Flow</p>
        <p className="text-xs text-zinc-500">
          {dropped ? "Dropped" : `Step ${currentIdx + 1} of ${FLOW.length}`}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${dropped ? "bg-red-400" : "bg-orange-500"}`}
          style={{ width: dropped ? "100%" : `${pct}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex items-start justify-between gap-1">
        {FLOW.map((s, i) => {
          const done = !dropped && i < currentIdx;
          const active = !dropped && i === currentIdx;
          return (
            <div key={s} className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={[
                  "size-7 rounded-full flex items-center justify-center text-[11px] font-semibold ring-1 transition-colors",
                  done
                    ? "bg-orange-500 text-white ring-orange-500"
                    : active
                    ? "bg-white text-orange-700 ring-orange-500 ring-2"
                    : "bg-zinc-50 text-zinc-400 ring-zinc-200",
                ].join(" ")}
              >
                {done ? <Check className="size-3.5" /> : i + 1}
              </div>
              <p
                className={[
                  "mt-2 text-[10px] leading-tight text-center truncate w-full",
                  active ? "text-ink font-semibold" : done ? "text-zinc-600" : "text-zinc-400",
                ].join(" ")}
              >
                {SHORT[s]}
              </p>
            </div>
          );
        })}
      </div>

      {dropped && (
        <p className="text-xs text-red-600 mt-4 text-center font-medium">This opportunity was dropped.</p>
      )}
    </div>
  );
}
