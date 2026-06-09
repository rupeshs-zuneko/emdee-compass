import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { TopHeader } from "@/components/mobile/nav";
import { ScreenScroll } from "@/components/mobile/frame";
import { MButton, SectionCard } from "@/components/mobile/primitives";
import {
  Field, TextInput, TextArea, SelectField, BottomSheet, OptionList, SearchablePicker,
} from "@/components/mobile/forms";
import {
  createOpportunity, getOpportunity, refData, updateOpportunity, useStore,
} from "@/lib/mock/store";
import type { Opportunity, SolutionRef, Temperature } from "@/lib/mock/types";

export const Route = createFileRoute("/_app/opportunities/new")({
  component: () => <OpportunityForm mode="new" />,
});

export function OpportunityForm({ mode, id }: { mode: "new" | "edit"; id?: string }) {
  useStore();
  const navigate = useNavigate();
  const existing = id ? getOpportunity(id) : null;

  const [form, setForm] = useState<Partial<Opportunity>>(
    existing || {
      title: "",
      department: "",
      subDepartment: "",
      district: "",
      temperature: "Warm",
      source: "",
      actionDate: new Date().toISOString().slice(0, 10),
      departmentBudget: 0,
      notes: "",
      solutions: [],
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sheet, setSheet] = useState<null | "dept" | "subdept" | "district" | "temperature" | "source" | "solution">(null);

  function update<K extends keyof Opportunity>(key: K, val: Opportunity[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function save() {
    const errs: Record<string, string> = {};
    if (!form.title?.trim()) errs.title = "Title is required";
    if (!form.department) errs.department = "Department is required";
    if (!form.district) errs.district = "District is required";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (mode === "edit" && id) {
      updateOpportunity(id, form);
      navigate({ to: "/opportunities/$id", params: { id } });
    } else {
      const o = createOpportunity(form);
      navigate({ to: "/opportunities/$id", params: { id: o.id } });
    }
  }

  function removeSolution(sid: string) {
    setForm((f) => ({ ...f, solutions: (f.solutions || []).filter((s) => s.id !== sid) }));
  }

  return (
    <>
      <TopHeader
        title={mode === "new" ? "New Opportunity" : "Edit Opportunity"}
        back
        right={
          <button onClick={save} className="text-sm font-semibold text-orange-700 px-2 py-1.5">
            Save
          </button>
        }
      />
      <ScreenScroll className="px-4 pb-10">
        <div className="space-y-3">
          <SectionCard title="Basics">
            <div className="space-y-4">
              <Field label="Title" error={errors.title}>
                <TextInput
                  value={form.title || ""}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Cloud Infrastructure Renewal"
                  error={errors.title}
                />
              </Field>
              <Field label="Government Department" error={errors.department}>
                <SelectField
                  value={form.department}
                  placeholder="Select department"
                  onClick={() => setSheet("dept")}
                  error={errors.department}
                />
              </Field>
              <Field label="Sub Department">
                <TextInput
                  value={form.subDepartment || ""}
                  onChange={(e) => update("subDepartment", e.target.value)}
                  placeholder="e.g. IT Wing"
                />
              </Field>
              <Field label="District" error={errors.district}>
                <SelectField
                  value={form.district}
                  placeholder="Select district"
                  onClick={() => setSheet("district")}
                  error={errors.district}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Pipeline">
            <div className="space-y-4">
              <Field label="Temperature">
                <SelectField
                  value={form.temperature}
                  placeholder="Select temperature"
                  onClick={() => setSheet("temperature")}
                />
              </Field>
              <Field label="Use Case Source">
                <SelectField
                  value={form.source}
                  placeholder="Select source"
                  onClick={() => setSheet("source")}
                />
              </Field>
              <Field label="Action Date">
                <TextInput
                  type="date"
                  value={(form.actionDate || "").slice(0, 10)}
                  onChange={(e) => update("actionDate", new Date(e.target.value).toISOString())}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Budget">
            <Field label="Department Budget (₹)">
              <TextInput
                type="number"
                value={form.departmentBudget || ""}
                onChange={(e) => update("departmentBudget", Number(e.target.value))}
                placeholder="0"
              />
            </Field>
          </SectionCard>

          <SectionCard
            title="Solutions"
            action={
              <button
                onClick={() => setSheet("solution")}
                className="text-xs font-semibold text-orange-700 inline-flex items-center gap-1"
              >
                <Plus className="size-3" /> Add Solution
              </button>
            }
          >
            {(form.solutions || []).length === 0 ? (
              <p className="text-sm text-zinc-400 py-2">No solutions added.</p>
            ) : (
              <div className="space-y-2">
                {(form.solutions || []).map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-b-0">
                    <div>
                      <p className="text-sm text-ink font-medium">{s.name}</p>
                      <p className="text-xs text-zinc-500">{s.offeringType}</p>
                    </div>
                    <button onClick={() => removeSolution(s.id)} className="size-8 rounded-full hover:bg-zinc-100 flex items-center justify-center">
                      <X className="size-4 text-zinc-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Notes">
            <Field label="Internal notes">
              <TextArea
                value={form.notes || ""}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Add context, next steps, key contacts…"
                rows={5}
              />
            </Field>
          </SectionCard>

          <div className="pt-2">
            <MButton fullWidth onClick={save}>
              {mode === "new" ? "Create Opportunity" : "Save Changes"}
            </MButton>
          </div>
        </div>
      </ScreenScroll>

      <BottomSheet open={sheet === "dept"} onClose={() => setSheet(null)} title="Government Department">
        <OptionList
          options={refData.departments}
          value={form.department}
          onChange={(v) => update("department", v)}
          onClose={() => setSheet(null)}
        />
      </BottomSheet>
      <BottomSheet open={sheet === "district"} onClose={() => setSheet(null)} title="District">
        <OptionList options={refData.districts} value={form.district} onChange={(v) => update("district", v)} onClose={() => setSheet(null)} />
      </BottomSheet>
      <BottomSheet open={sheet === "temperature"} onClose={() => setSheet(null)} title="Temperature">
        <OptionList options={["Hot", "Warm", "Cold"] as Temperature[]} value={form.temperature} onChange={(v) => update("temperature", v)} onClose={() => setSheet(null)} />
      </BottomSheet>
      <BottomSheet open={sheet === "source"} onClose={() => setSheet(null)} title="Use Case Source">
        <OptionList options={refData.sources} value={form.source} onChange={(v) => update("source", v)} onClose={() => setSheet(null)} />
      </BottomSheet>

      <SearchablePicker
        open={sheet === "solution"}
        onClose={() => setSheet(null)}
        title="Add Solution"
        items={refData.solutions.map((s) => ({ id: s.id, label: s.name, sublabel: s.offeringType }))}
        onSelect={(item) => {
          const s = refData.solutions.find((x) => x.id === item.id)!;
          setForm((f) => {
            const existing = (f.solutions || []).find((x) => x.id === s.id);
            if (existing) return f;
            return { ...f, solutions: [...(f.solutions || []), s as SolutionRef] };
          });
        }}
      />
    </>
  );
}
