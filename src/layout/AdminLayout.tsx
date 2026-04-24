import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useRef, useState, type RefObject } from "react";
import { FireExtinguisher, Plus, Send, User2 } from "lucide-react";
import Button from "../components/Button";
import { useAuthStore } from "../store/auth.store";
import SideBar from "../components/SideBar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const profileRef = useRef(null);
  const navRef = useRef(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      gsap.set(profileRef.current, {
        y: open ? 0 : 5,
        autoAlpha: open ? 1 : 0,
      });
      tlRef.current = gsap.timeline({ paused: true }).fromTo(
        profileRef.current,
        { autoAlpha: 0, y: 5 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
      );
    },
    { scope: navRef },
  );

  // Séparé : on pilote la timeline existante
  useEffect(() => {
    if (!tlRef.current) return;
    if (open) tlRef.current.play();
    else tlRef.current.reverse();
  }, [open]);

  return (
    <div ref={contentRef} className="flex bg-neutral-100">
      <SideBar />

      <main className="p-2 pl-0 flex flex-col flex-1">
        <div className="rounded-lg flex flex-col flex-1 border border-neutral-200 overflow-hidden">
          <nav ref={navRef} className="border-b border-b-neutral-200 px-4">
            <div className="container mx-auto flex justify-between min-h-12 items-center">
              <div className="flex gap-2 items-center">
                <div className="flex items-center">
                  <p className="text-xs tracking-tight leading-none font-semibold flex items-center gap-1">
                    /
                    <span className="text-neutral-600 px-2 py-0.5 rounded-md bg-primary-amber-text/10">
                      Dashboard
                    </span>
                  </p>
                </div>
              </div>

              <div className="relative">
                <div
                  onClick={() => setOpen(!open)}
                  className="flex justify-center cursor-pointer items-center bg-primary-text rounded-full border border-neutral-200 size-9 bg-neutral-800 text-neutral-100"
                >
                  <p className="text-base font-bold ">
                    {user?.email?.charAt(0).toUpperCase()}
                  </p>
                </div>
                <div
                  ref={profileRef}
                  className="absolute top-full right-0 pt-2"
                >
                  <div className="min-w-62.5 bg-white p-2 shadow-2xl rounded-2xl">
                    <div className="flex items-center gap-1">
                      <div className="flex size-10 justify-center items-center">
                        <User2 size={32} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="font-bold text-sm tracking-tight text-neutral-700 leading-none">
                          {user?.role}
                        </p>
                        {/*<p className="font-medium text-neutral-700 text-xs leading-none">{user?.email}</p>*/}
                        <div className="leading-none px-2 py-0.5 rounded-md bg-primary-amber-text/10">
                          <p className="text-xs tracking-tight text-neutral-600 font-semibold">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2 flex-1">
                      <hr className="border-neutral-200 border" />
                    </div>
                    <div className="flex flex-col">
                      <Button
                        onClick={logout}
                        text="Se déconnecter"
                        buttonStyle="red"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
