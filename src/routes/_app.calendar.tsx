import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Briefcase, MapPin } from "lucide-react";
import { TopHeader } from "@/components/mobile/nav";
import { ScreenScroll } from "@/components/mobile/frame";
import { Card } from "@/components/mobile/primitives";
import { useStore } from "@/lib/mock/store";
import { cn } from "@/lib/utils";
import { formatDate, isOverdue } from "@/components/mobile/util";

export const Route = createFileRoute("/_app/calendar")({
  head: () => ({ meta: [{ title: "Calendar — EMDEE CRM" }] }),
  component: CalendarScreen,
});

type Item = {
  id: string;
  kind: "opp" | "visit";
  title: string;
  sub: string;
  date: string;
  go: () => void;
};

function CalendarScreen() {
  const { opportunities, visits } = useStore();
  const navigate = useNavigate();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selected, setSelected] = useState<string>(new Date().toDateString());

  const items = useMemo<Item[]>(() => {
    const ops: Item[] = opportunities
      .filter((o) => o.stage !== "Handed to CRM" && o.stage !== "Dropped")
      .map((o) => ({
        id: `o_${o.id}`,
        kind: "opp",
        title: o.title,
        sub: o.department,
        date: o.actionDate,
        go: () => navigate({ to: "/opportunities/$id", params: { id: o.id } }),
      }));
    const vis: Item[] = visits
      .filter((v) => v.nextActionDate)
      .map((v) => ({
        id: `v_${v.id}`,
        kind: "visit",
        title: v.nextAction || "Follow-up visit",
        sub: v.department,
        date: v.nextActionDate,
        go: () => navigate({ to: "/visits/$id", params: { id: v.id } }),
      }));
    return [...ops, ...vis];
  }, [opportunities, visits, navigate]);

  const byDay = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of items) {
      const k = new Date(it.date).toDateString();
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(it);
    }
    return map;
  }, [items]);

  const month = cursor.getMonth();
  const year = cursor.getFullYear();
  const monthName = cursor.toLocaleString("en-IN", { month: "long", year: "numeric" });
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7) cells.push(null);

  const selectedList = byDay.get(selected) || [];
  const todayKey = new Date().toDateString();

  return (
    <>
      <TopHeader title="Calendar" subtitle="Visits & opportunity follow-ups" back />
      <ScreenScroll className="px-4 pb-32">
        <Card className="!p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              className="size-9 rounded-full hover:bg-zinc-100 flex items-center justify-center"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-5" />
            </button>
            <p className="font-serif text-lg text-ink">{monthName}</p>
            <button
              type="button"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              className="size-9 rounded-full hover:bg-zinc-100 flex items-center justify-center"
              aria-label="Next month"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i} className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 py-1">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((c, i) => {
              if (!c) return <div key={i} className="aspect-square" />;
              const k = c.toDateString();
              const list = byDay.get(k) || [];
              const isSel = k === selected;
              const isTd = k === todayKey;
              const hasOverdue = list.some((it) => isOverdue(it.date));
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(k)}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center relative text-sm transition-colors",
                    isSel
                      ? "bg-ink text-white"
                      : isTd
                      ? "bg-orange-50 text-orange-800 ring-1 ring-orange-200"
                      : "text-ink hover:bg-zinc-100",
                  )}
                >
                  <span className={cn("font-medium", list.length > 0 && !isSel && "font-semibold")}>{c.getDate()}</span>
                  {list.length > 0 && (
                    <span
                      className={cn(
                        "absolute bottom-1.5 size-1.5 rounded-full",
                        isSel ? "bg-white" : hasOverdue ? "bg-red-500" : "bg-orange-500",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="mt-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-700 px-1 mb-2">
            {new Date(selected).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            <span className="text-zinc-400 ml-2 font-medium">· {selectedList.length} item{selectedList.length === 1 ? "" : "s"}</span>
          </h2>
          {selectedList.length === 0 ? (
            <Card className="text-center">
              <p className="text-sm text-zinc-500">Nothing scheduled for this day.</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {selectedList
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((it) => (
                  <Card key={it.id} onClick={it.go}>
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "size-9 rounded-xl flex items-center justify-center shrink-0",
                          it.kind === "opp" ? "bg-orange-50 text-orange-700 ring-1 ring-orange-100" : "bg-zinc-100 text-zinc-700",
                        )}
                      >
                        {it.kind === "opp" ? <Briefcase className="size-4" /> : <MapPin className="size-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink leading-tight">{it.title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{it.sub}</p>
                        <p
                          className={cn(
                            "text-[11px] font-semibold mt-1",
                            isOverdue(it.date) ? "text-red-600" : "text-zinc-500",
                          )}
                        >
                          {it.kind === "opp" ? "Action due" : "Follow-up"} · {formatDate(it.date)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </ScreenScroll>
    </>
  );
}
