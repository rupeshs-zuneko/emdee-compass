import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { TopHeader } from "@/components/mobile/nav";
import { ScreenScroll } from "@/components/mobile/frame";
import { SectionCard, DetailRow } from "@/components/mobile/primitives";
import { getSolution } from "@/lib/mock/store";

export const Route = createFileRoute("/_app/solutions/$id")({
  component: SolutionDetail,
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <h2 className="font-serif text-xl">Solution not found</h2>
      <Link to="/solutions" className="text-sm text-orange-700 mt-3 inline-block">Back to catalog</Link>
    </div>
  ),
});

function SolutionDetail() {
  const { id } = Route.useParams();
  const s = getSolution(id);
  if (!s || s.status !== "Published") throw notFound();

  return (
    <>
      <TopHeader title={s.name} back={{ to: "/solutions" }} />
      <ScreenScroll className="px-4 pb-10">
        <div className="space-y-3">
          <div className="bg-card rounded-[20px] ring-1 ring-black/5 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">{s.category}</p>
            <h2 className="font-serif text-2xl font-medium text-ink leading-tight mt-2">{s.name}</h2>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center px-2.5 py-1 bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/60 text-[10px] font-semibold rounded-full uppercase tracking-tight">
                {s.offeringType}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60 text-[10px] font-semibold rounded-full uppercase tracking-tight">
                Published
              </span>
            </div>
          </div>

          <SectionCard title="Overview">
            <p className="text-sm text-ink leading-relaxed">{s.shortDescription}</p>
          </SectionCard>

          <SectionCard title="Talking Points">
            {s.talkingPoints.length === 0 ? (
              <p className="text-sm text-zinc-400 py-2">No talking points yet.</p>
            ) : (
              <ul className="space-y-3">
                {s.talkingPoints.map((tp, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-ink leading-relaxed">{tp}</span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Details">
            <DetailRow label="Category" value={s.category} />
            <DetailRow label="Offering Type" value={s.offeringType} />
            <DetailRow label="Status" value={s.status} />
          </SectionCard>

          <p className="text-[11px] text-center text-zinc-400 pt-2">
            Solutions are managed by Product team. Read-only view.
          </p>
        </div>
      </ScreenScroll>
    </>
  );
}
