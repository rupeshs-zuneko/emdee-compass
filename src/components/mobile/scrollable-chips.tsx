import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollableChips({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(false);

  function update() {
    const el = ref.current;
    if (!el) return;
    setCanL(el.scrollLeft > 4);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  function nudge(dir: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(120, el.clientWidth * 0.6), behavior: "smooth" });
  }

  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        ref={ref}
        className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-3 scroll-smooth"
      >
        {children}
      </div>
      {canL && (
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Scroll left"
          className="absolute left-1 top-1/2 -translate-y-1/2 -mt-1 size-6 rounded-full bg-white/95 ring-1 ring-black/10 shadow flex items-center justify-center text-zinc-700 active:scale-95"
        >
          <ChevronLeft className="size-3.5" />
        </button>
      )}
      {canR && (
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Scroll right"
          className="absolute right-1 top-1/2 -translate-y-1/2 -mt-1 size-6 rounded-full bg-white/95 ring-1 ring-black/10 shadow flex items-center justify-center text-zinc-700 active:scale-95"
        >
          <ChevronRight className="size-3.5" />
        </button>
      )}
    </div>
  );
}
