import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { MobileFrame, Logo } from "@/components/mobile/frame";
import { MButton } from "@/components/mobile/primitives";
import { Field, TextInput } from "@/components/mobile/forms";
import { login } from "@/lib/mock/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — EMDEE Pre-Sales CRM" }] }),
  component: LoginScreen,
});

function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("rupesh.s@zuneko.in");
  const [password, setPassword] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Login failed.");
      return;
    }
    navigate({ to: "/home" });
  }

  return (
    <MobileFrame>
      <div className="flex flex-col h-full px-7 pt-16 pb-10">
        <div className="flex flex-col items-start gap-4 mb-12">
          <Logo size={44} />
          <div>
            <h1 className="font-serif text-3xl text-ink leading-tight">EMDEE Pre-Sales CRM</h1>
            <p className="text-sm text-zinc-500 mt-1.5">Government Sales Companion</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email">
            <TextInput
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.gov.in"
              error={error || undefined}
            />
          </Field>
          <Field label="Password">
            <div className="relative">
              <TextInput
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-12"
                error={error || undefined}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-9 rounded-full flex items-center justify-center hover:bg-zinc-100"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="size-4 text-zinc-500" /> : <Eye className="size-4 text-zinc-500" />}
              </button>
            </div>
          </Field>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 ring-1 ring-red-200/60 rounded-xl text-xs text-red-700">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <MButton type="submit" fullWidth loading={loading}>
              Sign in
            </MButton>
          </div>
        </form>

        <div className="mt-auto text-center">
          <p className="text-[11px] text-zinc-400">
            Use <span className="font-mono">wrong@test.com</span> to see the error state.
          </p>
        </div>
      </div>
    </MobileFrame>
  );
}
