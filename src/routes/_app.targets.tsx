import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Target, CheckCircle2, Briefcase, MapPin, ChevronRight } from "lucide-react";
import { TopHeader } from "@/components/mobile/nav";
import { ScreenScroll } from "@/components/mobile/frame";
import { Card } from "@/components/mobile/primitives";
import { refData, useStore } from "@/lib/mock/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/targets")({
  head: () => ({ meta: [{ title: "My Targets — EMDEE CRM" }] }),
  component: TargetsScreen,
});

type Status = "Not Visited" | "Visited" | "Opportunity Opened" | "Won";

function TargetsScreen() {
  const { opportunities, visits } = useStore();
  const navigate = useNavigate();

  const rows = useMemo(() => {
    return refData.targets.map((t) => {
      const tvis = visits.filter((v) => v.department === t.name);
      const tops = opportunities.filter((o) => o.department === t.name);
      const won = tops.some((o) => o.stage === "Handed to CRM");
      const hasOpp = tops.some((o) => o.stage !== "Dropped" && o.stage !== "Handed to CRM");
      const status: Status = won
        ? "Won"
        : hasOpp
        ? "Opportunity Opened"
        : tvis.length > 0
        ? "Visited"
        : "Not Visited";
      const progress =
        status === "Not Visited" ? 10 : status === "Visited" ? 40 : status === "Opportunity Opened" ? 75 : 100;
      const lastVisit = tvis.sort(
        (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
      )[0];
      return { t, status, progress, visitCount: tvis.length, oppCount: tops.length, lastVisit };
    });
  }, [opportunities, visits]);

  const summary = useMemo(() => {
    const visited = rows.filter((r) => r.status !== "Not Visited").length;
    const open = rows.filter((r) => r.status === "Opportunity Opened" || r.status === "Won").length;
    return { total: rows.length, visited, open };
  }, [rows]);

  return (
    <>
      <TopHeader title="My Targets" subtitle="Assigned departments to engage" back />
      <ScreenScroll className="px-4 pb-32">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <SummaryCard label="Assigned" value={summary.total} tone="zinc" />
          <SummaryCard label="Visited" value={summary.visited} tone="orange" />
          <SummaryCard label="Opps Open" value={summary.open} tone="green" />
        </div>

        <div className="space-y-2">
          {rows.map(({ t, status, progress, visitCount, oppCount, lastVisit }) => (
            <Card
              key={t.name}
              onClick={() =>
                lastVisit
                  ? navigate({ to: "/visits/$id", params: { id: lastVisit.id } })
                  : navigate({ to: "/visits/new" })
              }
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "size-10 rounded-xl flex items-center justify-center shrink-0 ring-1",
                    priorityTone(t.priority),
                  )}
                >
                  <Target className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-ink leading-tight">{t.name}</p>
                    <ChevronRight className="size-4 text-zinc-400 mt-0.5 shrink-0" />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{t.district} · {t.priority} priority</p>

                  <div className="mt-3 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", progressTone(status))}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] font-medium">
                    <span className={cn("inline-flex items-center gap-1", statusText(status))}>
                      {status === "Won" && <CheckCircle2 className="size-3.5" />}
                      {status}
                    </span>
                    <span className="text-zinc-400 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{visitCount}</span>
                      <span className="inline-flex items-center gap-1"><Briefcase className="size-3" />{oppCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScreenScroll>
    </>
  );
}

function priorityTone(p: "High" | "Medium" | "Low") {
  return p === "High"
    ? "bg-red-50 text-red-700 ring-red-100"
    : p === "Medium"
    ? "bg-orange-50 text-orange-700 ring-orange-100"
    : "bg-zinc-100 text-zinc-600 ring-zinc-200";
}
function progressTone(s: Status) {
  return s === "Won"
    ? "bg-emerald-500"
    : s === "Opportunity Opened"
    ? "bg-orange-500"
    : s === "Visited"
    ? "bg-amber-400"
    : "bg-zinc-300";
}
function statusText(s: Status) {
  return s === "Won"
    ? "text-emerald-700"
    : s === "Opportunity Opened"
    ? "text-orange-700"
    : s === "Visited"
    ? "text-amber-700"
    : "text-zinc-500";
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: "zinc" | "orange" | "green" }) {
  const tones = {
    zinc: "text-zinc-700",
    orange: "text-orange-700",
    green: "text-emerald-700",
  };
  return (
    <div className="bg-card rounded-2xl ring-1 ring-black/5 p-3">
      <p className={cn("font-serif text-2xl leading-none", tones[tone])}>{value}</p>
      <p className="text-[10px] text-zinc-500 mt-1 font-medium uppercase tracking-tight">{label}</p>
    </div>
  );
}
