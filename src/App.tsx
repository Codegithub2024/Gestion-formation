import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";

function App() {

    const data = login();

    async function login() {
      const req = await fetch("http://localhost:8085/api/auth/login");
      const response = await req.json();
      return response;
    }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<div>Admin</div>} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<div>Admin</div>} />
        </Route>
        <Route
          path="/home"
          element={
            <div className="flex w-full min-h-screen bg-slate-800 text-white justify-center items-center">
              <p>Home</p>
              <div>{data}</div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
