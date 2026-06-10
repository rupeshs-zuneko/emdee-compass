import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { MapPin, FileText, ChevronRight } from "lucide-react";
import { TopHeader } from "@/components/mobile/nav";
import { ScreenScroll } from "@/components/mobile/frame";
import { MButton, SectionCard, DetailRow } from "@/components/mobile/primitives";
import { StageBadge, TemperatureBadge } from "@/components/mobile/badges";
import { formatDate, formatINR, isOverdue } from "@/components/mobile/util";
import { getOpportunity, transitionStage, useStore, visitsForOpportunity } from "@/lib/mock/store";
import type { Stage } from "@/lib/mock/types";

export const Route = createFileRoute("/_app/opportunities/$id")({
  component: OpportunityDetail,
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <h2 className="font-serif text-xl">Opportunity not found</h2>
      <Link to="/opportunities" className="text-sm text-orange-700 mt-3 inline-block">Back to list</Link>
    </div>
  ),
});

function OpportunityDetail() {
  useStore();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const opp = getOpportunity(id);
  if (!opp) throw notFound();

  const visits = visitsForOpportunity(id);
  const total = opp.softwareCost + opp.hardwareCost;

  const action = nextWorkflowAction(opp.stage);

  return (
    <>
      <TopHeader title={opp.title} back={{ to: "/opportunities" }} />

      <ScreenScroll className="px-4 pb-40">
        <div className="space-y-3">
          {/* Header card */}
          <div className="bg-card rounded-[20px] ring-1 ring-black/5 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">{opp.department}</p>
            <h2 className="font-serif text-2xl font-medium text-ink leading-tight mt-2 text-pretty">{opp.title}</h2>
            <div className="flex flex-wrap gap-2 mt-4">
              <StageBadge stage={opp.stage} />
              <TemperatureBadge temp={opp.temperature} />
            </div>
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-zinc-100">
              <div className="size-7 rounded-full bg-orange-100 ring-1 ring-black/5 flex items-center justify-center text-[11px] font-semibold text-orange-700">
                {opp.assignedRep.split(" ").map(p => p[0]).join("").slice(0,2)}
              </div>
              <div className="text-xs">
                <p className="text-zinc-500">Assigned to</p>
                <p className="text-ink font-medium">{opp.assignedRep}</p>
              </div>
            </div>
          </div>

          {/* Workflow actions */}
          {opp.stage !== "Dropped" && opp.stage !== "Handed to CRM" && (
            <SectionCard title="Workflow">
              <div className="flex flex-col gap-2">
                {action && (
                  <MButton fullWidth onClick={() => transitionStage(opp.id, action.next)}>
                    {action.label}
                  </MButton>
                )}
                <MButton
                  fullWidth
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => transitionStage(opp.id, "Dropped")}
                >
                  Drop Deal
                </MButton>
              </div>
            </SectionCard>
          )}

          <SectionCard title="Details">
            <div>
              <DetailRow label="District" value={opp.district || "—"} />
              <DetailRow label="Sub Department" value={opp.subDepartment || "—"} />
              <DetailRow label="Source" value={opp.source || "—"} />
              <DetailRow label="Action Date" value={<span className={isOverdue(opp.actionDate) && opp.stage !== "Handed to CRM" && opp.stage !== "Dropped" ? "text-red-600" : undefined}>{formatDate(opp.actionDate)}</span>} />
              <DetailRow label="Created" value={formatDate(opp.createdDate)} />
            </div>
          </SectionCard>

          <SectionCard title="Solutions">
            {opp.solutions.length === 0 ? (
              <p className="text-sm text-zinc-400 py-2">No solutions added.</p>
            ) : (
              <div className="space-y-2">
                {opp.solutions.map((s) => (
                  <div key={s.id} className="flex items-start gap-3 py-2">
                    <FileText className="size-4 text-zinc-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-ink font-medium">{s.name}</p>
                      <p className="text-xs text-zinc-500">{s.offeringType}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Budget">
            <DetailRow label="Department Budget" value={formatINR(opp.departmentBudget)} />
            <DetailRow label="Software Cost" value={formatINR(opp.softwareCost)} />
            <DetailRow label="Hardware Cost" value={formatINR(opp.hardwareCost)} />
            <div className="pt-3 mt-2 border-t border-zinc-100 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">Total</span>
              <span className="font-serif text-xl text-ink">{formatINR(total)}</span>
            </div>
          </SectionCard>

          <SectionCard
            title="Visits"
            action={
              <Link to="/visits" className="text-xs font-semibold text-orange-700 inline-flex items-center gap-1">
                View All <ChevronRight className="size-3" />
              </Link>
            }
          >
            {visits.length === 0 ? (
              <p className="text-sm text-zinc-400 py-2">No visits logged yet.</p>
            ) : (
              <p className="text-sm text-ink">
                <span className="font-serif text-2xl">{visits.length}</span>
                <span className="text-zinc-500 ml-2">visit{visits.length === 1 ? "" : "s"} logged</span>
              </p>
            )}
          </SectionCard>

          {opp.notes && (
            <SectionCard title="Notes">
              <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">{opp.notes}</p>
            </SectionCard>
          )}
        </div>
      </ScreenScroll>

      {/* Bottom action bar */}
      <div className="shrink-0 border-t border-zinc-100 bg-white/95 backdrop-blur px-4 py-3 flex gap-2">
        <MButton
          variant="secondary"
          fullWidth
          leftIcon={<MapPin className="size-4" />}
          onClick={() => navigate({ to: "/visits/new", search: { opportunityId: opp.id } as never })}
        >
          Log Visit
        </MButton>
        <MButton
          fullWidth
          onClick={() => navigate({ to: "/opportunities/$id/edit", params: { id: opp.id } })}
        >
          Edit
        </MButton>
      </div>
    </>
  );
}

function nextWorkflowAction(stage: Stage): { label: string; next: Stage } | null {
  switch (stage) {
    case "Identified": return { label: "Pitch", next: "Pitched" };
    case "Pitched": return { label: "Confirm Interest", next: "Interest Confirmed" };
    case "Interest Confirmed": return { label: "Mark Tender Expected", next: "Tender Expected" };
    case "Tender Expected": return { label: "Release Tender", next: "Tender Released" };
    case "Tender Released": return { label: "Hand Over to CRM", next: "Handed to CRM" };
    default: return null;
  }
}
