import { Routes, Route, BrowserRouter, NavLink } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path=""
          element={
            <div className="bg-slate-900 h-screen flex justify-start">
              <aside className="flex flex-col p-3 bg-slate-950 min-w-xs"></aside>
              <main className="flex flex-col p-4">
                <NavLink to="/home" className="w-fit">
                  <button className="p-2 px-6 text-white rounded-full bg-blue-600 border-t border-t-blue-300 border-b border-b-blue-900 font-semibold tracking-tight leading-tight cursor-pointer hover:bg-blue-500 hover:shadow-[0_0_12px_0_#4C8DF6] ease-out transition-all duration-200 flex justify-center items-center uppercase hover:text-white text-sm h-9.5">
                    Continuer
                  </button>
                </NavLink>
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
