import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  Briefcase, Flame, MapPin, Plus, AlertCircle, ChevronRight,
  CalendarClock, Target, CalendarDays,
} from "lucide-react";
import { ScreenScroll } from "@/components/mobile/frame";
import { Card, MButton } from "@/components/mobile/primitives";
import { formatDate, formatRelative, isOverdue } from "@/components/mobile/util";
import { AssistantFAB } from "@/components/mobile/assistant";
import { refData, useStore } from "@/lib/mock/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/home")({
  head: () => ({ meta: [{ title: "Home — EMDEE CRM" }] }),
  component: HomeScreen,
});

function HomeScreen() {
  const { opportunities, visits } = useStore();
  const navigate = useNavigate();

  // Load Poppins on this screen only (trial)
  useEffect(() => {
    const id = "poppins-font-link";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const now = new Date();
  const greet = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  const targetSummary = useMemo(() => {
    const visited = refData.targets.filter((t) => visits.some((v) => v.department === t.name)).length;
    const opps = refData.targets.filter((t) =>
      opportunities.some((o) => o.department === t.name && o.stage !== "Dropped"),
    ).length;
    return { total: refData.targets.length, visited, opps };
  }, [opportunities, visits]);

  const openOpps = useMemo(
    () => opportunities.filter((o) => o.stage !== "Handed to CRM" && o.stage !== "Dropped"),
    [opportunities],
  );
  const hotOpps = useMemo(() => opportunities.filter((o) => o.temperature === "Hot"), [opportunities]);
  const visitsThisWeek = useMemo(() => {
    const sevenAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return visits.filter((v) => new Date(v.visitDate).getTime() >= sevenAgo);
  }, [visits]);

  const needsAttention = useMemo(
    () =>
      openOpps
        .filter((o) => isOverdue(o.actionDate) || isToday(o.actionDate))
        .sort((a, b) => new Date(a.actionDate).getTime() - new Date(b.actionDate).getTime()),
    [openOpps],
  );

  const upcoming = useMemo(() => {
    type Item = { id: string; kind: "opp" | "visit"; title: string; sub: string; date: string; href: () => void };
    const oppItems: Item[] = openOpps
      .filter((o) => !isOverdue(o.actionDate))
      .map((o) => ({
        id: `o_${o.id}`,
        kind: "opp",
        title: o.title,
        sub: `${o.department} · Opportunity`,
        date: o.actionDate,
        href: () => navigate({ to: "/opportunities/$id", params: { id: o.id } }),
      }));
    const visitItems: Item[] = visits
      .filter((v) => v.nextActionDate && !isOverdue(v.nextActionDate))
      .map((v) => ({
        id: `v_${v.id}`,
        kind: "visit",
        title: v.nextAction || "Follow-up visit",
        sub: `${v.department} · Visit`,
        date: v.nextActionDate,
        href: () => navigate({ to: "/visits/$id", params: { id: v.id } }),
      }));
    return [...oppItems, ...visitItems]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [openOpps, visits, navigate]);

  return (
    <>
      <header className="pt-12 px-5 pb-3 bg-surface shrink-0">
        <p className="text-xs text-zinc-500 font-medium">
          {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="font-serif text-[26px] leading-tight text-ink mt-1">
          {greet}, {refData.currentUser.name.split(" ")[0]} {refData.currentUser.name.split(" ").slice(1).join(" ")}
        </h1>
      </header>

      <ScreenScroll className="px-4 pb-32">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatCard
            label="Open Opps"
            value={openOpps.length}
            tone="zinc"
            icon={<Briefcase className="size-4" />}
            onClick={() => navigate({ to: "/opportunities" })}
          />
          <StatCard
            label="Hot Deals"
            value={hotOpps.length}
            tone="red"
            icon={<Flame className="size-4" />}
            onClick={() => navigate({ to: "/opportunities" })}
          />
          <StatCard
            label="Visits / 7d"
            value={visitsThisWeek.length}
            tone="orange"
            icon={<MapPin className="size-4" />}
            onClick={() => navigate({ to: "/visits" })}
          />
        </div>

        {/* Needs Attention */}
        <section className="mb-5">
          <div className="flex items-center gap-2 px-1 mb-2">
            <AlertCircle className="size-4 text-red-600" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-700">Needs Attention</h2>
          </div>
          {needsAttention.length === 0 ? (
            <Card className="text-center">
              <p className="text-sm text-ink font-medium">You're all caught up</p>
              <p className="text-xs text-zinc-500 mt-1">No overdue action items today.</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {needsAttention.map((o) => (
                <Card key={o.id} onClick={() => navigate({ to: "/opportunities/$id", params: { id: o.id } })}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink leading-tight">{o.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{o.department}</p>
                    </div>
                    <ChevronRight className="size-4 text-zinc-400 mt-1" />
                  </div>
                  <p className="text-xs font-semibold text-red-600 mt-2">
                    {formatRelative(o.actionDate)} · {formatDate(o.actionDate)}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Follow-ups */}
        <section className="mb-5">
          <div className="flex items-center gap-2 px-1 mb-2">
            <CalendarClock className="size-4 text-zinc-700" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-700">Upcoming Follow-ups</h2>
          </div>
          {upcoming.length === 0 ? (
            <Card className="text-center">
              <p className="text-sm text-zinc-500">No follow-ups scheduled.</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {upcoming.map((u) => (
                <Card key={u.id} onClick={u.href}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink leading-tight">{u.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{u.sub}</p>
                    </div>
                    <span className="text-xs font-medium text-zinc-500 shrink-0 mt-0.5">
                      {formatRelative(u.date)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-700 px-1 mb-2">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <MButton
              fullWidth
              variant="secondary"
              leftIcon={<Plus className="size-4" />}
              onClick={() => navigate({ to: "/visits/new" })}
            >
              Log Visit
            </MButton>
            <MButton
              fullWidth
              leftIcon={<Plus className="size-4" />}
              onClick={() => navigate({ to: "/opportunities/new" })}
            >
              New Opp
            </MButton>
          </div>
        </section>
      </ScreenScroll>

      <AssistantFAB />
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  onClick,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  onClick: () => void;
  tone: "zinc" | "red" | "orange";
}) {
  const tones = {
    zinc: "bg-zinc-100 text-zinc-700",
    red: "bg-red-50 text-red-700",
    orange: "bg-orange-50 text-orange-700",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-card rounded-2xl ring-1 ring-black/5 p-3 text-left active:scale-[0.98] transition-transform"
    >
      <div className={cn("size-7 rounded-lg flex items-center justify-center mb-2", tones[tone])}>{icon}</div>
      <p className="font-serif text-2xl text-ink leading-none">{value}</p>
      <p className="text-[10px] text-zinc-500 mt-1 font-medium uppercase tracking-tight">{label}</p>
    </button>
  );
}

function isToday(iso: string) {
  const d = new Date(iso);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}
