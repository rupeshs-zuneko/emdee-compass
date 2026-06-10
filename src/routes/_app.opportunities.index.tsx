import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TopHeader } from "@/components/mobile/nav";
import { ScreenScroll } from "@/components/mobile/frame";
import { Card, Chip, FAB, Skeleton } from "@/components/mobile/primitives";
import { StageBadge, TemperatureBadge } from "@/components/mobile/badges";
import { EmptyState, formatRelative, isOverdue } from "@/components/mobile/util";
import { cn } from "@/lib/utils";
import { MButton } from "@/components/mobile/primitives";
import { useStore } from "@/lib/mock/store";
import type { Stage } from "@/lib/mock/types";

const STAGES: ("All" | Stage)[] = [
  "All", "Identified", "Pitched", "Interest Confirmed",
  "Tender Expected", "Tender Released", "Handed to CRM", "Dropped",
];

export const Route = createFileRoute("/_app/opportunities/")({
  head: () => ({ meta: [{ title: "Opportunities — EMDEE CRM" }] }),
  component: OpportunitiesList,
});

function OpportunitiesList() {
  const { opportunities } = useStore();
  const navigate = useNavigate();
  const [stage, setStage] = useState<"All" | Stage>("All");
  const [q, setQ] = useState("");
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      const matchStage = stage === "All" || o.stage === stage;
      const matchQ = !q || (o.title + o.department).toLowerCase().includes(q.toLowerCase());
      return matchStage && matchQ;
    });
  }, [opportunities, stage, q]);

  return (
    <>
      <TopHeader title="Opportunities" subtitle={`${opportunities.length} active accounts`} />
      <div className="px-5 pb-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sales pipeline…"
            className="w-full h-11 pl-10 pr-4 bg-zinc-100/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink placeholder:text-zinc-500"
          />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-3 shrink-0">
        {STAGES.map((s) => (
          <Chip key={s} active={stage === s} onClick={() => setStage(s)}>{s}</Chip>
        ))}
      </div>
      <ScreenScroll className="px-4 pb-32">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={q ? "No matching results" : "No opportunities yet"}
            description={q ? "Try a different search or filter." : "Create your first opportunity to get started."}
            action={
              <MButton onClick={() => navigate({ to: "/opportunities/new" })}>+ Create Opportunity</MButton>
            }
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => (
              <Card key={o.id} onClick={() => navigate({ to: "/opportunities/$id", params: { id: o.id } })}>
                <h3 className="font-serif text-lg font-medium leading-tight text-ink text-pretty">
                  {o.title}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">{o.department}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <StageBadge stage={o.stage} />
                  <TemperatureBadge temp={o.temperature} />
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-orange-100 ring-1 ring-black/5 flex items-center justify-center text-[10px] font-semibold text-orange-700">
                      {initials(o.assignedRep)}
                    </div>
                    <span className="text-xs text-zinc-600 font-medium">{o.assignedRep}</span>
                  </div>
                  <span className={cn("text-xs font-medium", isOverdue(o.actionDate) && o.stage !== "Handed to CRM" && o.stage !== "Dropped" ? "text-red-600" : "text-zinc-400")}>
                    {formatRelative(o.actionDate)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScreenScroll>
      <FAB label="New" onClick={() => navigate({ to: "/opportunities/new" })} />
    </>
  );
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}
