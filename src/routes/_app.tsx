import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileFrame } from "@/components/mobile/frame";
import { BottomTabBar } from "@/components/mobile/nav";
import { getAuth } from "@/lib/mock/store";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!getAuth()) {
      navigate({ to: "/login", replace: true });
    } else {
      setReady(true);
    }
  }, [navigate]);

  return (
    <MobileFrame>
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {ready ? <Outlet /> : <div className="flex-1" />}
      </div>
      <BottomTabBar />
    </MobileFrame>
  );
}
