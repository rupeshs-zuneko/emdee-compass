import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const auth = (() => { try { return localStorage.getItem("emdee_crm_auth_v1"); } catch { return null; } })();
    throw redirect({ to: auth ? "/home" : "/login" });
  },
  component: () => null,
});
