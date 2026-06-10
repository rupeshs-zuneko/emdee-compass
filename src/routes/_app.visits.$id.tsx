import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, ExternalLink, X } from "lucide-react";
import { TopHeader } from "@/components/mobile/nav";
import { ScreenScroll } from "@/components/mobile/frame";
import { MButton, SectionCard, DetailRow } from "@/components/mobile/primitives";
import { OutcomeBadge } from "@/components/mobile/badges";
import { formatDate } from "@/components/mobile/util";
import { getOpportunity, getVisit, useStore } from "@/lib/mock/store";

export const Route = createFileRoute("/_app/visits/$id")({
  component: VisitDetail,
});

function VisitDetail() {
  useStore();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const visit = getVisit(id);
  if (!visit) throw notFound();
  const opp = visit.opportunityId ? getOpportunity(visit.opportunityId) : null;

  return (
    <>
      <TopHeader title={visit.department} subtitle={visit.subDepartment} back={{ to: "/visits" }} />
      <ScreenScroll className="px-4 pb-32">
        <div className="space-y-3">
          <div className="bg-card rounded-[20px] ring-1 ring-black/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Visit date</p>
                <p className="font-serif text-xl text-ink mt-0.5">{formatDate(visit.visitDate)}</p>
              </div>
              <OutcomeBadge outcome={visit.outcome} />
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-100">
              <span className="inline-flex items-center px-2.5 py-1 bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/60 text-[10px] font-semibold rounded-full uppercase tracking-tight">
                {visit.visitType}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/60 text-[10px] font-semibold rounded-full uppercase tracking-tight">
                {visit.district}
              </span>
            </div>
          </div>

          <SectionCard title="Details">
            <DetailRow label="Sub Department" value={visit.subDepartment || "—"} />
            <DetailRow label="Next Action" value={visit.nextAction || "—"} />
            <DetailRow label="Next Action Date" value={formatDate(visit.nextActionDate)} />
          </SectionCard>

          <SectionCard title="Linked Opportunity">
            {opp ? (
              <Link
                to="/opportunities/$id"
                params={{ id: opp.id }}
                className="flex items-start justify-between gap-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm text-ink font-medium truncate">{opp.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{opp.department}</p>
                </div>
                <ExternalLink className="size-4 text-zinc-400 shrink-0 mt-1" />
              </Link>
            ) : (
              <p className="text-sm text-zinc-400 py-2">No opportunity linked.</p>
            )}
          </SectionCard>

          <SectionCard title="Contacts Met">
            {visit.contacts.length === 0 ? (
              <p className="text-sm text-zinc-400 py-2">No contacts recorded.</p>
            ) : (
              <div className="space-y-3">
                {visit.contacts.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 py-2 border-b border-zinc-100 last:border-b-0">
                    <div className="size-9 rounded-full bg-orange-100 ring-1 ring-black/5 flex items-center justify-center text-xs font-semibold text-orange-700 shrink-0">
                      {c.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink font-medium">{c.name}</p>
                      <p className="text-xs text-zinc-500">{c.designation}</p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-tight bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-700 mt-1">
                      {c.influence}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Solutions Discussed">
            {visit.solutions.length === 0 ? (
              <p className="text-sm text-zinc-400 py-2">None recorded.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {visit.solutions.map((s) => (
                  <span key={s.id} className="px-3 py-1.5 bg-zinc-100 rounded-full text-xs text-ink font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="GPS Location">
            {visit.gps ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-semibold">Lat</p>
                    <p className="text-sm font-mono text-ink mt-0.5">{visit.gps.lat.toFixed(4)}</p>
                  </div>
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-semibold">Lng</p>
                    <p className="text-sm font-mono text-ink mt-0.5">{visit.gps.lng.toFixed(4)}</p>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${visit.gps.lat},${visit.gps.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-orange-700"
                >
                  <MapPin className="size-3.5" /> Open in Maps
                </a>
              </div>
            ) : (
              <p className="text-sm text-zinc-400 py-2">No location captured.</p>
            )}
          </SectionCard>

          {visit.photos.length > 0 && (
            <SectionCard title="Photos">
              <div className="grid grid-cols-3 gap-2">
                {visit.photos.map((src, i) => (
                  <a key={i} href={src} target="_blank" rel="noreferrer" className="aspect-square rounded-xl overflow-hidden bg-zinc-100 ring-1 ring-black/5">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </SectionCard>
          )}

          {visit.discussionNotes && (
            <SectionCard title="Discussion Notes">
              <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">{visit.discussionNotes}</p>
            </SectionCard>
          )}
        </div>
      </ScreenScroll>

      <div className="shrink-0 border-t border-zinc-100 bg-white/95 backdrop-blur px-4 py-3 flex gap-2">
        {!opp && (
          <MButton
            variant="secondary"
            fullWidth
            onClick={() => navigate({ to: "/opportunities/new" })}
          >
            Create Opportunity
          </MButton>
        )}
        <MButton fullWidth onClick={() => navigate({ to: "/visits/$id/edit", params: { id: visit.id } })}>
          Edit
        </MButton>
      </div>
    </>
  );
}
