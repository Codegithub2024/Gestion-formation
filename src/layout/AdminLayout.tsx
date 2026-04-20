import { Outlet } from "react-router-dom";
import { useRef } from "react";
import { FireExtinguisher, Plus, Send } from "lucide-react";
import Button from "../components/Button";
import { useAuthStore } from "../store/auth.store";
import SideBar from "../components/SideBar";

export default function AdminLayout() {
  const user = useAuthStore((state) => state.user);

  const contentRef = useRef(null);

  return (
    <div ref={contentRef} className="flex bg-primary-amber-text/5">
      <SideBar contentRef={contentRef} />

      <main className="p-2 pl-0 flex flex-col flex-1">
        <div className="rounded-lg flex flex-col flex-1 bg-white border border-neutral-200 overflow-hidden">
          <nav className="border-b border-b-neutral-200">
            <div className="container mx-auto flex justify-between p-2 min-h-12">
              <div className="flex gap-2 items-center">
                <div className="leading-none px-2 py-1 rounded-md bg-primary-amber-text/10">
                  <p className="text-xs tracking-tight text-neutral-500 font-semibold">
                    CurrentUser: {user?.email}
                  </p>
                </div>
              </div>
              <Button text="dépanner" buttonStyle="blue">
                <FireExtinguisher size={18} />
              </Button>
            </div>
          </nav>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
