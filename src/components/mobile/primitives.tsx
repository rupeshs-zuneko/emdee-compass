import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-zinc-800 active:scale-[0.98] disabled:bg-zinc-300 disabled:text-zinc-500",
  secondary: "bg-white text-ink ring-1 ring-zinc-200 hover:bg-zinc-50 active:scale-[0.98] disabled:opacity-50",
  danger: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] disabled:opacity-50",
  ghost: "bg-transparent text-ink hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-40",
};

export const MButton = forwardRef<HTMLButtonElement, ButtonProps>(function MButton(
  { variant = "primary", loading, fullWidth, leftIcon, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "h-12 px-5 rounded-2xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed",
        fullWidth && "w-full",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : leftIcon}
      {children}
    </button>
  );
});

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Comp: "div" | "button" = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "block w-full text-left bg-card p-5 rounded-[20px] ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform",
        onClick && "active:scale-[0.99] hover:ring-black/10",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 px-4 rounded-full text-xs font-medium whitespace-nowrap transition-colors ring-1",
        active
          ? "bg-zinc-950 text-white ring-zinc-950"
          : "bg-zinc-100 text-zinc-700 ring-black/5 hover:bg-zinc-200",
      )}
    >
      {children}
    </button>
  );
}

export function FAB({ onClick, label = "Create" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute bottom-[88px] left-5 h-14 px-5 bg-zinc-950 text-white rounded-full shadow-xl flex items-center justify-center gap-2 ring-4 ring-white active:scale-95 transition-transform"
    >
      <Plus className="size-5" strokeWidth={2.4} />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-zinc-200/70", className)} />;
}

export function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="bg-card rounded-[20px] ring-1 ring-black/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-zinc-100 last:border-b-0">
      <span className="text-xs text-zinc-500 font-medium">{label}</span>
      <span className="text-sm text-ink font-medium text-right">{value}</span>
    </div>
  );
}
