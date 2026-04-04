import { useEffect, useRef, useState } from "react";
import { Routes, Route, BrowserRouter, NavLink } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("isOpen");
    return saved !== null ? JSON.parse(saved) : "false";
  });
  const asideRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("isOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  console.log(isOpen);

  useGSAP(() => {
    gsap.to(asideRef.current, {
      width: isOpen ? "300px" : "0px",
      padding: isOpen ? "1rem" : "0px",
      duration: 0.4,
      ease: "power2.out",
    });
  }, [isOpen]);

  useGSAP(() => {
    gsap.fromTo(
      ".card",
      {
        y: "50px",
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        scrollTrigger: {
          trigger: ".card",
          start: "top center",
          markers: true,
        },
        stagger: 0.1,
        duration: 1.2,
        ease: "expo.out",
      },
    );
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path=""
          element={
            <div
              ref={mainRef}
              className="bg-slate-900 min-h-screen flex justify-start h-full"
            >
              <aside
                ref={asideRef}
                className={`good flex flex-col sticky top-0 left-0 bg-slate-950 ${isOpen ? "w-75 p-3" : "w-0"} `}
              ></aside>
              <main className="flex flex-col p-4 gap-6 flex-1">
                <div className="flex-1 flex flex-col p-4 gap-4 min-h-screen w-full">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex justify-center items-center p-3 px-5 cursor-pointer text-xs w-fit text-neutral-400 font-bold rounded-full bg-black/50"
                  >
                    {isOpen ? "fermer" : "ouvrir"}
                  </button>
                  <NavLink to="/home" className="w-fit">
                    <button className="p-2 px-6 text-white rounded-full bg-blue-600 border-t border-t-blue-300 border-b border-b-blue-900 font-semibold tracking-tight leading-tight cursor-pointer hover:bg-blue-500 hover:shadow-[0_0_12px_0_#4C8DF6] ease-out transition-all duration-200 flex justify-center items-center uppercase hover:text-white text-sm h-9.5">
                      Continuer
                    </button>
                  </NavLink>
                </div>
                <div className="grid w-full max-w-7xl mx-auto min-h-screen justify-center items-center content-center gap-5 grid-cols-3">
                  <div className="card w-full aspect-video rounded-xl bg-white/10"></div>
                  <div className="card w-full aspect-video rounded-xl bg-white/10"></div>
                  <div className="card w-full aspect-video rounded-xl bg-white/10"></div>
                  <div className="card w-full aspect-video rounded-xl bg-white/10"></div>
                  <div className="card w-full aspect-video rounded-xl bg-white/10"></div>
                  <div className="card w-full aspect-video rounded-xl bg-white/10"></div>
                </div>
                <div className="min-h-screen w-full"></div>
              </main>
            </div>
          }
        />
        <Route path="/home" element={<div>Home</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
