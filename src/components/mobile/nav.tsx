import { Link, useMatchRoute } from "@tanstack/react-router";
import { Briefcase, MapPin, User, ArrowLeft, Package } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TopHeader({
  title,
  subtitle,
  back,
  right,
  serif = true,
}: {
  title: string;
  subtitle?: string;
  back?: { to: string; params?: Record<string, string> } | true;
  right?: ReactNode;
  serif?: boolean;
}) {
  return (
    <header className="pt-12 px-5 pb-3 bg-surface z-10 shrink-0">
      <div className="flex items-center gap-3 min-h-9">
        {back && (
          <BackButton to={typeof back === "object" ? back.to : undefined} params={typeof back === "object" ? back.params : undefined} />
        )}
        <div className="flex-1 min-w-0">
          <h1
            className={cn(
              "text-[22px] leading-tight text-ink truncate",
              serif ? "font-serif font-medium" : "font-semibold tracking-tight",
            )}
          >
            {title}
          </h1>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

function BackButton({ to, params }: { to?: string; params?: Record<string, string> }) {
  if (to) {
    return (
      <Link
        to={to as never}
        params={params as never}
        className="size-9 -ml-1 rounded-full flex items-center justify-center hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
        aria-label="Back"
      >
        <ArrowLeft className="size-5" />
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="size-9 -ml-1 rounded-full flex items-center justify-center hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
      aria-label="Back"
    >
      <ArrowLeft className="size-5" />
    </button>
  );
}

const TABS = [
  { to: "/opportunities", label: "Opps", icon: Briefcase },
  { to: "/visits", label: "Visits", icon: MapPin },
  { to: "/solutions", label: "Solutions", icon: Package },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomTabBar() {
  const matchRoute = useMatchRoute();
  return (
    <nav className="shrink-0 h-[72px] bg-white/85 backdrop-blur-md border-t border-zinc-200/70 px-4 pb-2 pt-1.5 flex justify-around items-center">
      {TABS.map(({ to, label, icon: Icon }) => {
        const active = !!matchRoute({ to: to as never, fuzzy: true });
        return (
          <Link
            key={to}
            to={to as never}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl"
          >
            <div
              className={cn(
                "size-9 rounded-full flex items-center justify-center transition-colors",
                active ? "bg-ink text-white" : "text-zinc-500",
              )}
            >
              <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} />
            </div>
            <span
              className={cn(
                "text-[10px] font-medium tracking-tight",
                active ? "text-ink" : "text-zinc-500",
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
