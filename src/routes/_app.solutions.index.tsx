import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, FileText } from "lucide-react";
import { TopHeader } from "@/components/mobile/nav";
import { ScreenScroll } from "@/components/mobile/frame";
import { Card, Chip } from "@/components/mobile/primitives";
import { EmptyState } from "@/components/mobile/util";
import { listPublishedSolutions } from "@/lib/mock/store";
import type { OfferingType } from "@/lib/mock/types";

const TYPES: ("All" | OfferingType)[] = ["All", "Hardware", "Software", "Solution", "Others"];

export const Route = createFileRoute("/_app/solutions/")({
  head: () => ({ meta: [{ title: "Solutions — EMDEE CRM" }] }),
  component: SolutionsList,
});

function SolutionsList() {
  const navigate = useNavigate();
  const solutions = listPublishedSolutions();
  const [type, setType] = useState<"All" | OfferingType>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return solutions.filter((s) => {
      const okType = type === "All" || s.offeringType === type;
      const okQ = !q || (s.name + s.category + s.shortDescription).toLowerCase().includes(q.toLowerCase());
      return okType && okQ;
    });
  }, [solutions, type, q]);

  return (
    <>
      <TopHeader title="Solutions" subtitle={`${solutions.length} published offerings`} />
      <div className="px-5 pb-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search catalog…"
            className="w-full h-11 pl-10 pr-4 bg-zinc-100/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink placeholder:text-zinc-500"
          />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-3 shrink-0">
        {TYPES.map((t) => (
          <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>
        ))}
      </div>
      <ScreenScroll className="px-4 pb-32">
        {filtered.length === 0 ? (
          <EmptyState title="No solutions" description="Try a different filter or search." />
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => (
              <Card key={s.id} onClick={() => navigate({ to: "/solutions/$id", params: { id: s.id } })}>
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-orange-50 ring-1 ring-orange-100 flex items-center justify-center shrink-0">
                    <FileText className="size-4 text-orange-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg font-medium leading-tight text-ink text-pretty">{s.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{s.category}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center px-2.5 py-1 bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/60 text-[10px] font-semibold rounded-full uppercase tracking-tight">
                        {s.offeringType}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScreenScroll>
    </>
  );
}
