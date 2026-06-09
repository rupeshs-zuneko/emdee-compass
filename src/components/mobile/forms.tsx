import { useEffect, useId, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  error,
  helper,
  children,
}: {
  label: string;
  error?: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-zinc-600 mb-1.5">{label}</span>
      {children}
      {error ? (
        <span className="block text-xs text-red-600 mt-1.5">{error}</span>
      ) : helper ? (
        <span className="block text-xs text-zinc-400 mt-1.5">{helper}</span>
      ) : null}
    </label>
  );
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}
export function TextInput({ error, className, ...rest }: TextInputProps) {
  return (
    <input
      {...rest}
      className={cn(
        "w-full h-12 px-4 bg-white rounded-xl text-sm text-ink placeholder:text-zinc-400 ring-1 transition-colors focus:outline-none focus:ring-2",
        error ? "ring-red-300 focus:ring-red-500" : "ring-zinc-200 focus:ring-ink",
        "disabled:bg-zinc-100 disabled:text-zinc-400",
        className,
      )}
    />
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}
export function TextArea({ error, className, rows = 4, ...rest }: TextAreaProps) {
  return (
    <textarea
      rows={rows}
      {...rest}
      className={cn(
        "w-full p-4 bg-white rounded-xl text-sm text-ink placeholder:text-zinc-400 ring-1 transition-colors focus:outline-none focus:ring-2 resize-none",
        error ? "ring-red-300 focus:ring-red-500" : "ring-zinc-200 focus:ring-ink",
        className,
      )}
    />
  );
}

export function SelectField({
  value,
  placeholder = "Select…",
  onClick,
  error,
}: {
  value?: string;
  placeholder?: string;
  onClick: () => void;
  error?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full h-12 px-4 bg-white rounded-xl text-sm ring-1 flex items-center justify-between transition-colors",
        error ? "ring-red-300" : "ring-zinc-200 hover:ring-zinc-300",
        value ? "text-ink" : "text-zinc-400",
      )}
    >
      <span className="truncate">{value || placeholder}</span>
      <ChevronDown className="size-4 text-zinc-400 shrink-0 ml-2" />
    </button>
  );
}

// ---------- Bottom sheet ----------

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40 animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full bg-white rounded-t-[28px] pb-6 max-h-[80%] flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="pt-3 flex justify-center"><div className="w-10 h-1 bg-zinc-300 rounded-full" /></div>
        <div className="px-5 pt-3 pb-2 flex items-center justify-between">
          <h3 className="font-serif text-lg font-medium text-ink">{title}</h3>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-zinc-100 flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-2">{children}</div>
      </div>
    </div>
  );
}

export function OptionList<T extends string>({
  options,
  value,
  onChange,
  onClose,
}: {
  options: readonly T[] | T[];
  value?: T;
  onChange: (v: T) => void;
  onClose: () => void;
}) {
  return (
    <div className="divide-y divide-zinc-100">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => {
            onChange(opt);
            onClose();
          }}
          className="w-full py-3.5 flex items-center justify-between text-left"
        >
          <span className="text-sm text-ink">{opt}</span>
          {value === opt && <Check className="size-4 text-ink" />}
        </button>
      ))}
    </div>
  );
}

// ---------- Searchable picker ----------

export function SearchablePicker<T extends { id: string; label: string; sublabel?: string }>({
  open,
  onClose,
  title,
  items,
  onSelect,
  emptyText = "No results",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  items: T[];
  onSelect: (item: T) => void;
  emptyText?: string;
}) {
  const [q, setQ] = useState("");
  const id = useId();
  const filtered = q
    ? items.filter((i) => (i.label + (i.sublabel || "")).toLowerCase().includes(q.toLowerCase()))
    : items;
  useEffect(() => { if (!open) setQ(""); }, [open]);
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
        <input
          id={id}
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="w-full h-11 pl-10 pr-3 bg-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="text-center text-sm text-zinc-500 py-10">{emptyText}</div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { onSelect(item); onClose(); }}
              className="w-full py-3 text-left"
            >
              <div className="text-sm text-ink font-medium">{item.label}</div>
              {item.sublabel && <div className="text-xs text-zinc-500 mt-0.5">{item.sublabel}</div>}
            </button>
          ))}
        </div>
      )}
    </BottomSheet>
  );
}
