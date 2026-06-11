import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Send, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { listPublishedSolutions, getOpportunity, getVisit } from "@/lib/mock/store";
import type { Solution } from "@/lib/mock/types";

type Context =
  | { kind: "none" }
  | { kind: "opportunity"; id: string }
  | { kind: "visit"; id: string };

interface Msg {
  id: string;
  role: "assistant" | "user";
  text: string;
  recs?: Solution[];
}

const QUICK = [
  "Best for surveillance",
  "Software solutions",
  "What to pitch for this department",
];

export function AssistantFAB({ context = { kind: "none" } as Context }: { context?: Context }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="EMDEE's Assistant"
        className="absolute bottom-[88px] right-5 size-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-xl flex items-center justify-center ring-4 ring-white active:scale-95 transition-transform z-30"
      >
        <Sparkles className="size-5" strokeWidth={2.2} />
      </button>
      {open && <AssistantSheet onClose={() => setOpen(false)} context={context} />}
    </>
  );
}

function AssistantSheet({ onClose, context }: { onClose: () => void; context: Context }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      id: "intro",
      role: "assistant",
      text: contextIntro(context),
    },
  ]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function ask(q: string) {
    const text = q.trim();
    if (!text) return;
    const userMsg: Msg = { id: `u_${Date.now()}`, role: "user", text };
    const reply = recommend(text, context);
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
  }

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
      />
      <div className="relative w-full bg-white rounded-t-[28px] shadow-2xl flex flex-col max-h-[80%] animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="pt-2 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-zinc-300" />
        </div>
        {/* Header */}
        <div className="px-5 pt-3 pb-4 flex items-center gap-3 border-b border-zinc-100">
          <div className="size-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif text-lg text-ink leading-tight">EMDEE's Assistant</h2>
            <p className="text-[11px] text-zinc-500">Ask me which solution fits this client.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-full flex items-center justify-center hover:bg-zinc-100"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Conversation */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex flex-col gap-2 max-w-[88%]", m.role === "user" ? "ml-auto items-end" : "items-start")}
            >
              <div
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-ink text-white rounded-br-md"
                    : "bg-zinc-100 text-ink rounded-bl-md",
                )}
              >
                {m.text}
              </div>
              {m.recs && m.recs.length > 0 && (
                <div className="w-full space-y-2 pt-1">
                  {m.recs.map((s) => (
                    <Link
                      key={s.id}
                      to="/solutions/$id"
                      params={{ id: s.id }}
                      onClick={onClose}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white ring-1 ring-zinc-200 hover:ring-zinc-300 active:scale-[0.99] transition"
                    >
                      <div className="size-9 rounded-lg bg-orange-50 ring-1 ring-orange-100 flex items-center justify-center shrink-0">
                        <FileText className="size-4 text-orange-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink truncate">{s.name}</p>
                        <p className="text-[11px] text-zinc-500">{s.category} · {s.offeringType}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick chips */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              className="shrink-0 h-8 px-3 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-700 ring-1 ring-black/5 hover:bg-zinc-200"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="p-3 pb-5 border-t border-zinc-100 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask which solution to pitch…"
            className="flex-1 h-11 px-4 bg-zinc-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ink placeholder:text-zinc-500"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!input.trim()}
            className="size-11 rounded-full bg-ink text-white flex items-center justify-center disabled:bg-zinc-300 active:scale-95 transition-transform"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// --- context + recommendation logic ---

function contextIntro(context: Context): string {
  if (context.kind === "opportunity") {
    const o = getOpportunity(context.id);
    if (o) return `Hi! Looking at "${o.title}" for ${o.department}. Ask me what to pitch, or tap a suggestion below.`;
  }
  if (context.kind === "visit") {
    const v = getVisit(context.id);
    if (v) return `Hi! Looking at your visit to ${v.department}. Ask me what to pitch, or tap a suggestion below.`;
  }
  return "Hi Rupesh! Ask me which solution fits a client, or tap a suggestion below.";
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Surveillance & Vision": ["surveillance", "cctv", "camera", "anpr", "vision", "security", "police", "traffic"],
  "ERP & Workflow": ["erp", "workflow", "file", "approval", "citizen", "education", "school", "office"],
  "Automation": ["automation", "rpa", "bot", "process", "back office", "back-office", "automate"],
};

const TYPE_KEYWORDS: Record<string, string[]> = {
  Hardware: ["hardware", "device", "camera", "edge"],
  Software: ["software", "app", "analytics", "platform"],
  Solution: ["solution", "end-to-end", "end to end", "full", "bundle", "system"],
};

function recommend(question: string, context: Context): Msg {
  const all = listPublishedSolutions();
  const q = question.toLowerCase();

  let contextSolIds = new Set<string>();
  let contextDept = "";
  if (context.kind === "opportunity") {
    const o = getOpportunity(context.id);
    if (o) {
      contextDept = o.department;
      o.solutions.forEach((s) => contextSolIds.add(s.id));
    }
  } else if (context.kind === "visit") {
    const v = getVisit(context.id);
    if (v) {
      contextDept = v.department;
      v.solutions.forEach((s) => contextSolIds.add(s.id));
    }
  }

  // Score every solution
  const scored = all.map((s) => {
    let score = 0;
    const hay = `${s.name} ${s.category} ${s.shortDescription} ${s.offeringType}`.toLowerCase();

    // category keyword match
    for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
      if (s.category === cat) {
        for (const kw of kws) if (q.includes(kw)) score += 3;
      }
    }
    // offering-type keyword match
    for (const [type, kws] of Object.entries(TYPE_KEYWORDS)) {
      if (s.offeringType === type) {
        for (const kw of kws) if (q.includes(kw)) score += 2;
      }
    }
    // direct name/desc tokens
    q.split(/\W+/).filter((t) => t.length > 3).forEach((t) => {
      if (hay.includes(t)) score += 1;
    });
    // context boost: already-linked solutions are highly relevant
    if (contextSolIds.has(s.id)) score += 4;
    // context dept hints
    if (contextDept) {
      const d = contextDept.toLowerCase();
      if ((d.includes("police") || d.includes("administration") || d.includes("health")) &&
          s.category === "Surveillance & Vision") score += 2;
      if ((d.includes("education") || d.includes("municipal")) &&
          (s.category === "ERP & Workflow" || s.category === "Automation")) score += 2;
    }
    return { s, score };
  });

  const top = scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.s);

  if (top.length === 0) {
    return {
      id: `a_${Date.now()}`,
      role: "assistant",
      text: "I couldn't find a published solution for that — try a different category (surveillance, ERP, automation) or offering type.",
    };
  }

  const lead = top[0];
  const support = top.slice(1);
  const deptPart = contextDept ? ` at ${contextDept}` : "";
  let text = `For that${deptPart}, I'd lead with ${lead.name} (${lead.offeringType.toLowerCase()})`;
  if (support.length === 1) {
    text += `, supported by ${support[0].name} (${support[0].offeringType.toLowerCase()}).`;
  } else if (support.length === 2) {
    text += `, supported by ${support[0].name} and ${support[1].name}.`;
  } else {
    text += ".";
  }

  return { id: `a_${Date.now()}`, role: "assistant", text, recs: top };
}
