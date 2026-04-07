import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import { useEffect, useState } from "react";

function App() {
  // const [data, setData] = useState(null)

  useEffect(() => {
    login();
  }, []);

  async function login() {
    const res = await fetch("http://localhost:8086/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@formation.com",
        motDePasse: "admin123",
      }),
    });

    if (!res.ok) {
      throw new Error("Erreur de connexion");
    }

    console.log(await res.json());
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<div>Admin</div>} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/login" element={<div>Login</div>} />
        </Route>
        <Route
          path="/home"
          element={
            <div className="flex w-full min-h-screen bg-neutral-200 text-neutral-800 font-bold justify-center items-center">
              <p>Home</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
