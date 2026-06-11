import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-zinc-200/60 flex items-start md:items-center justify-center md:py-8">
      <div
        className={cn(
          "relative w-full max-w-[420px] h-dvh md:h-[860px] bg-surface text-foreground",
          "md:rounded-[44px] md:overflow-hidden md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]",
          "md:border-[10px] md:border-zinc-900",
          "flex flex-col overflow-hidden",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ScreenScroll({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <main className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)} style={style}>
      {children}
    </main>
  );
}

export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#18181b" />
      <path
        d="M10 9 H22 V12 H13 V14.5 H20 V17.5 H13 V20 H22 V23 H10 Z"
        fill="#fafaf9"
      />
    </svg>
  );
}
