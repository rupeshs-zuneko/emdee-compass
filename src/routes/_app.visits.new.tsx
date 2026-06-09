import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X, MapPin, Check, Camera, Image as ImageIcon } from "lucide-react";
import { TopHeader } from "@/components/mobile/nav";
import { ScreenScroll } from "@/components/mobile/frame";
import { MButton, SectionCard } from "@/components/mobile/primitives";
import {
  Field, TextInput, TextArea, SelectField, BottomSheet, OptionList, SearchablePicker,
} from "@/components/mobile/forms";
import {
  createVisit, getVisit, refData, updateVisit, useStore, listOpportunities,
} from "@/lib/mock/store";
import type { ContactRef, InfluenceLevel, Outcome, SolutionRef, Visit, VisitType } from "@/lib/mock/types";

export const Route = createFileRoute("/_app/visits/new")({
  validateSearch: (s: Record<string, unknown>) => ({
    opportunityId: typeof s.opportunityId === "string" ? s.opportunityId : undefined,
  }),
  component: NewVisit,
});

function NewVisit() {
  const { opportunityId } = Route.useSearch();
  return <VisitForm mode="new" initialOpportunityId={opportunityId} />;
}

export function VisitForm({
  mode,
  id,
  initialOpportunityId,
}: {
  mode: "new" | "edit";
  id?: string;
  initialOpportunityId?: string;
}) {
  useStore();
  const navigate = useNavigate();
  const existing = id ? getVisit(id) : null;

  const [form, setForm] = useState<Partial<Visit>>(
    existing || {
      department: "",
      subDepartment: "",
      district: "",
      visitDate: new Date().toISOString(),
      visitType: "Discovery",
      outcome: "Neutral",
      opportunityId: initialOpportunityId ?? null,
      nextAction: "",
      nextActionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      discussionNotes: "",
      contacts: [],
      solutions: [],
      gps: null,
      photos: [],
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sheet, setSheet] = useState<
    | null
    | "dept" | "district" | "type" | "outcome" | "opportunity" | "solution" | "contactExisting" | "contactNew"
  >(null);

  const opportunities = listOpportunities();

  function update<K extends keyof Visit>(key: K, val: Visit[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function captureGps() {
    // mock GPS — generates a coord near Mumbai
    const lat = 19.07 + (Math.random() - 0.5) * 0.4;
    const lng = 72.87 + (Math.random() - 0.5) * 0.4;
    update("gps", { lat, lng });
  }

  function addPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setForm((f) => ({ ...f, photos: [...(f.photos || []), ...urls] }));
  }

  function save() {
    const errs: Record<string, string> = {};
    if (!form.department) errs.department = "Department is required";
    if (!form.district) errs.district = "District is required";
    if (!form.visitType) errs.visitType = "Type is required";
    if (!form.outcome) errs.outcome = "Outcome is required";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (mode === "edit" && id) {
      updateVisit(id, form);
      navigate({ to: "/visits/$id", params: { id } });
    } else {
      const v = createVisit(form);
      navigate({ to: "/visits/$id", params: { id: v.id } });
    }
  }

  const selectedOpp = form.opportunityId ? opportunities.find((o) => o.id === form.opportunityId) : null;

  return (
    <>
      <TopHeader
        title={mode === "new" ? "New Visit" : "Edit Visit"}
        back
        right={
          <button onClick={save} className="text-sm font-semibold text-orange-700 px-2 py-1.5">Save</button>
        }
      />
      <ScreenScroll className="px-4 pb-10">
        <div className="space-y-3">
          <SectionCard title="Where">
            <div className="space-y-4">
              <Field label="Government Department" error={errors.department}>
                <SelectField value={form.department} onClick={() => setSheet("dept")} placeholder="Select department" error={errors.department} />
              </Field>
              <Field label="Sub Department">
                <TextInput value={form.subDepartment || ""} onChange={(e) => update("subDepartment", e.target.value)} />
              </Field>
              <Field label="District" error={errors.district}>
                <SelectField value={form.district} onClick={() => setSheet("district")} placeholder="Select district" error={errors.district} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="When & What">
            <div className="space-y-4">
              <Field label="Visit Date">
                <TextInput
                  type="date"
                  value={(form.visitDate || "").slice(0, 10)}
                  onChange={(e) => update("visitDate", new Date(e.target.value).toISOString())}
                />
              </Field>
              <Field label="Visit Type" error={errors.visitType}>
                <SelectField value={form.visitType} onClick={() => setSheet("type")} placeholder="Select type" />
              </Field>
              <Field label="Outcome" error={errors.outcome}>
                <SelectField value={form.outcome} onClick={() => setSheet("outcome")} placeholder="Select outcome" />
              </Field>
              <Field label="Linked Opportunity">
                <SelectField
                  value={selectedOpp?.title}
                  placeholder="Optional"
                  onClick={() => setSheet("opportunity")}
                />
              </Field>
              <Field label="Next Action">
                <TextInput
                  value={form.nextAction || ""}
                  onChange={(e) => update("nextAction", e.target.value)}
                  placeholder="What's the next step?"
                />
              </Field>
              <Field label="Next Action Date">
                <TextInput
                  type="date"
                  value={(form.nextActionDate || "").slice(0, 10)}
                  onChange={(e) => update("nextActionDate", new Date(e.target.value).toISOString())}
                />
              </Field>
              <Field label="Discussion Notes">
                <TextArea
                  value={form.discussionNotes || ""}
                  onChange={(e) => update("discussionNotes", e.target.value)}
                  placeholder="Key points from the meeting…"
                  rows={4}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="GPS Location">
            {form.gps ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
                  <Check className="size-4" /> Location captured
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wide">Lat</p>
                    <p className="text-sm font-mono text-ink mt-0.5">{form.gps.lat.toFixed(4)}</p>
                  </div>
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wide">Lng</p>
                    <p className="text-sm font-mono text-ink mt-0.5">{form.gps.lng.toFixed(4)}</p>
                  </div>
                </div>
                <MButton variant="secondary" fullWidth leftIcon={<MapPin className="size-4" />} onClick={captureGps}>
                  Recapture
                </MButton>
              </div>
            ) : (
              <MButton variant="secondary" fullWidth leftIcon={<MapPin className="size-4" />} onClick={captureGps}>
                Capture Location
              </MButton>
            )}
          </SectionCard>

          <SectionCard
            title="Contacts Met"
            action={
              <div className="flex gap-2">
                <button onClick={() => setSheet("contactExisting")} className="text-xs font-semibold text-orange-700 inline-flex items-center gap-1">
                  <Plus className="size-3" /> Existing
                </button>
                <button onClick={() => setSheet("contactNew")} className="text-xs font-semibold text-orange-700 inline-flex items-center gap-1">
                  <Plus className="size-3" /> New
                </button>
              </div>
            }
          >
            {(form.contacts || []).length === 0 ? (
              <p className="text-sm text-zinc-400 py-2">No contacts added.</p>
            ) : (
              <div className="space-y-2">
                {(form.contacts || []).map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-b-0">
                    <div>
                      <p className="text-sm text-ink font-medium">{c.name}</p>
                      <p className="text-xs text-zinc-500">{c.designation} · {c.influence}</p>
                    </div>
                    <button
                      onClick={() => update("contacts", (form.contacts || []).filter((x) => x.id !== c.id))}
                      className="size-8 rounded-full hover:bg-zinc-100 flex items-center justify-center"
                    >
                      <X className="size-4 text-zinc-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Solutions Discussed"
            action={
              <button onClick={() => setSheet("solution")} className="text-xs font-semibold text-orange-700 inline-flex items-center gap-1">
                <Plus className="size-3" /> Add Solution
              </button>
            }
          >
            {(form.solutions || []).length === 0 ? (
              <p className="text-sm text-zinc-400 py-2">No solutions added.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(form.solutions || []).map((s) => (
                  <span key={s.id} className="pl-3 pr-1 py-1 bg-zinc-100 rounded-full text-xs text-ink font-medium flex items-center gap-1">
                    {s.name}
                    <button
                      onClick={() => update("solutions", (form.solutions || []).filter((x) => x.id !== s.id))}
                      className="size-5 rounded-full hover:bg-zinc-200 flex items-center justify-center"
                    >
                      <X className="size-3 text-zinc-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Photos"
            action={
              <label className="text-xs font-semibold text-orange-700 inline-flex items-center gap-1 cursor-pointer">
                <Camera className="size-3" /> Add Photo
                <input type="file" accept="image/*" multiple capture="environment" onChange={addPhoto} className="hidden" />
              </label>
            }
          >
            {(form.photos || []).length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-zinc-400 py-2">
                <ImageIcon className="size-4" /> No photos attached
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {(form.photos || []).map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-zinc-100 ring-1 ring-black/5">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <div className="pt-2">
            <MButton fullWidth onClick={save}>
              {mode === "new" ? "Save Visit" : "Save Changes"}
            </MButton>
          </div>
        </div>
      </ScreenScroll>

      {/* Bottom sheets */}
      <BottomSheet open={sheet === "dept"} onClose={() => setSheet(null)} title="Government Department">
        <OptionList options={refData.departments} value={form.department} onChange={(v) => update("department", v)} onClose={() => setSheet(null)} />
      </BottomSheet>
      <BottomSheet open={sheet === "district"} onClose={() => setSheet(null)} title="District">
        <OptionList options={refData.districts} value={form.district} onChange={(v) => update("district", v)} onClose={() => setSheet(null)} />
      </BottomSheet>
      <BottomSheet open={sheet === "type"} onClose={() => setSheet(null)} title="Visit Type">
        <OptionList
          options={["Discovery", "Demo", "Negotiation", "Follow-up", "Closing"] as VisitType[]}
          value={form.visitType}
          onChange={(v) => update("visitType", v)}
          onClose={() => setSheet(null)}
        />
      </BottomSheet>
      <BottomSheet open={sheet === "outcome"} onClose={() => setSheet(null)} title="Outcome">
        <OptionList
          options={["Positive", "Neutral", "Negative", "Tender Indicated", "Follow-up Required"] as Outcome[]}
          value={form.outcome}
          onChange={(v) => update("outcome", v)}
          onClose={() => setSheet(null)}
        />
      </BottomSheet>

      <SearchablePicker
        open={sheet === "opportunity"}
        onClose={() => setSheet(null)}
        title="Linked Opportunity"
        items={opportunities.map((o) => ({ id: o.id, label: o.title, sublabel: o.department }))}
        onSelect={(item) => update("opportunityId", item.id)}
      />

      <SearchablePicker
        open={sheet === "solution"}
        onClose={() => setSheet(null)}
        title="Add Solution"
        items={refData.solutions.map((s) => ({ id: s.id, label: s.name, sublabel: s.offeringType }))}
        onSelect={(item) => {
          const s = refData.solutions.find((x) => x.id === item.id)!;
          setForm((f) => {
            if ((f.solutions || []).find((x) => x.id === s.id)) return f;
            return { ...f, solutions: [...(f.solutions || []), s as SolutionRef] };
          });
        }}
      />

      <SearchablePicker
        open={sheet === "contactExisting"}
        onClose={() => setSheet(null)}
        title="Add Existing Contact"
        items={refData.contacts.map((c) => ({ id: c.id, label: c.name, sublabel: `${c.designation} · ${c.influence}` }))}
        onSelect={(item) => {
          const c = refData.contacts.find((x) => x.id === item.id)!;
          setForm((f) => {
            if ((f.contacts || []).find((x) => x.id === c.id)) return f;
            return { ...f, contacts: [...(f.contacts || []), c as ContactRef] };
          });
        }}
      />

      <NewContactSheet
        open={sheet === "contactNew"}
        onClose={() => setSheet(null)}
        onAdd={(c) => setForm((f) => ({ ...f, contacts: [...(f.contacts || []), c] }))}
      />
    </>
  );
}

function NewContactSheet({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (c: ContactRef) => void;
}) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [mobile, setMobile] = useState("");
  const [influence, setInfluence] = useState<InfluenceLevel>("Influencer");
  const [influenceSheet, setInfluenceSheet] = useState(false);

  function reset() {
    setName(""); setDesignation(""); setMobile(""); setInfluence("Influencer");
  }

  return (
    <BottomSheet open={open} onClose={() => { reset(); onClose(); }} title="New Contact">
      <div className="space-y-3 pb-2">
        <Field label="Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Designation"><TextInput value={designation} onChange={(e) => setDesignation(e.target.value)} /></Field>
        <Field label="Mobile"><TextInput type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91 …" /></Field>
        <Field label="Influence Level">
          <SelectField value={influence} onClick={() => setInfluenceSheet(true)} />
        </Field>
        <MButton
          fullWidth
          disabled={!name.trim()}
          onClick={() => {
            onAdd({
              id: `c_${Math.random().toString(36).slice(2, 8)}`,
              name: name.trim(),
              designation,
              mobile: mobile || undefined,
              influence,
            });
            reset();
            onClose();
          }}
        >
          Add Contact
        </MButton>
      </div>

      <BottomSheet open={influenceSheet} onClose={() => setInfluenceSheet(false)} title="Influence Level">
        <OptionList
          options={["Decision Maker", "Influencer", "Gatekeeper", "User"] as InfluenceLevel[]}
          value={influence}
          onChange={setInfluence}
          onClose={() => setInfluenceSheet(false)}
        />
      </BottomSheet>
    </BottomSheet>
  );
}
