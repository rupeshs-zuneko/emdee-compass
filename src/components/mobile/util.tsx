import { Inbox } from "lucide-react";
import { type ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-16">
      <div className="size-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
        {icon || <Inbox className="size-7 text-zinc-400" />}
      </div>
      <h3 className="font-serif text-xl font-medium text-ink">{title}</h3>
      {description && <p className="text-sm text-zinc-500 mt-1.5 max-w-[26ch]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch { return iso; }
}

export function formatRelative(iso: string) {
  try {
    const d = new Date(iso).getTime();
    const now = Date.now();
    const diff = Math.round((d - now) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
    if (diff > 1 && diff < 14) return `In ${diff} days`;
    if (diff < -1 && diff > -14) return `${Math.abs(diff)} days ago`;
    return formatDate(iso);
  } catch { return iso; }
}

export function formatINR(n: number) {
  if (!n) return "—";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}
