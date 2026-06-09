import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Mail, Shield } from "lucide-react";
import { TopHeader } from "@/components/mobile/nav";
import { ScreenScroll } from "@/components/mobile/frame";
import { MButton, SectionCard } from "@/components/mobile/primitives";
import { logout, refData } from "@/lib/mock/store";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — EMDEE CRM" }] }),
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const user = refData.currentUser;
  const initials = user.name.split(" ").map((p) => p[0]).join("").slice(0, 2);

  return (
    <>
      <TopHeader title="Profile" />
      <ScreenScroll className="px-4 pb-32">
        <div className="flex flex-col items-center pt-6 pb-8">
          <div className="size-24 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 ring-4 ring-white shadow-sm flex items-center justify-center">
            <span className="font-serif text-3xl font-medium text-orange-800">{initials}</span>
          </div>
          <h2 className="font-serif text-2xl text-ink mt-4">{user.name}</h2>
          <p className="text-sm text-zinc-500 mt-1">{user.email}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 rounded-full text-[11px] font-semibold text-zinc-700 uppercase tracking-tight">
            <Shield className="size-3" /> {user.role}
          </span>
        </div>

        <div className="space-y-3">
          <SectionCard title="Account">
            <div className="space-y-3">
              <Row icon={<Mail className="size-4" />} label="Email" value={user.email} />
              <Row icon={<Shield className="size-4" />} label="Role" value={user.role} />
            </div>
          </SectionCard>

          <SectionCard title="About">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">App Version</span>
              <span className="text-sm font-mono text-ink">1.0.0</span>
            </div>
          </SectionCard>

          <div className="pt-2">
            <MButton
              fullWidth
              leftIcon={<LogOut className="size-4" />}
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
            >
              Log Out
            </MButton>
          </div>
        </div>
      </ScreenScroll>
    </>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="size-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">{icon}</div>
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500 font-semibold">{label}</p>
        <p className="text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}
