import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TopHeader } from "@/components/mobile/nav";
import { ScreenScroll } from "@/components/mobile/frame";
import { Card, Chip, FAB } from "@/components/mobile/primitives";
import { OutcomeBadge } from "@/components/mobile/badges";
import { EmptyState, formatDate, formatRelative } from "@/components/mobile/util";
import { MButton } from "@/components/mobile/primitives";
import { useStore } from "@/lib/mock/store";
import type { Outcome } from "@/lib/mock/types";

const DATE_CHIPS = ["All", "This Week", "This Month"] as const;
const OUTCOMES: ("All" | Outcome)[] = [
  "All", "Positive", "Neutral", "Negative", "Tender Indicated", "Follow-up Required",
];

export const Route = createFileRoute("/_app/visits/")({
  head: () => ({ meta: [{ title: "Visits — EMDEE CRM" }] }),
  component: VisitsList,
});

function VisitsList() {
  const { visits } = useStore();
  const navigate = useNavigate();
  const [dateChip, setDateChip] = useState<(typeof DATE_CHIPS)[number]>("All");
  const [outcome, setOutcome] = useState<"All" | Outcome>("All");

  const filtered = useMemo(() => {
    const now = Date.now();
    return visits.filter((v) => {
      const t = new Date(v.visitDate).getTime();
      const days = (now - t) / (1000 * 60 * 60 * 24);
      const dateOk =
        dateChip === "All" ? true :
        dateChip === "This Week" ? days < 7 :
        days < 31;
      const outcomeOk = outcome === "All" || v.outcome === outcome;
      return dateOk && outcomeOk;
    });
  }, [visits, dateChip, outcome]);

  return (
    <>
      <TopHeader title="Visits" subtitle={`${visits.length} field visits logged`} />
      <div className="px-5 pb-2 shrink-0 space-y-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {DATE_CHIPS.map((c) => <Chip key={c} active={dateChip === c} onClick={() => setDateChip(c)}>{c}</Chip>)}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {OUTCOMES.map((o) => <Chip key={o} active={outcome === o} onClick={() => setOutcome(o)}>{o}</Chip>)}
        </div>
      </div>
      <ScreenScroll className="px-4 pt-3 pb-32">
        {filtered.length === 0 ? (
          <EmptyState
            title="No visits found"
            description="Adjust filters or log your first visit."
            action={<MButton onClick={() => navigate({ to: "/visits/new" })}>+ New Visit</MButton>}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((v) => (
              <Card key={v.id} onClick={() => navigate({ to: "/visits/$id", params: { id: v.id } })}>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-serif text-lg font-medium leading-tight text-ink text-pretty">{v.department}</h3>
                </div>
                <p className="text-xs text-zinc-500">{v.subDepartment} · {v.district}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <OutcomeBadge outcome={v.outcome} />
                  <span className="inline-flex items-center px-2.5 py-1 bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/60 text-[10px] font-semibold rounded-full uppercase tracking-tight">
                    {v.visitType}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-zinc-100">
                  <span className="text-xs text-zinc-600 font-medium">{v.salesRep}</span>
                  <span className="text-xs text-zinc-400">{formatRelative(v.visitDate)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScreenScroll>
      <FAB label="New" onClick={() => navigate({ to: "/visits/new" })} />
    </>
  );
}
