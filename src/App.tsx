import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<div>Admin</div>} />
        </Route>
        <Route
          path="/home"
          element={
            <div className="flex w-full min-h-screen bg-slate-800 text-white justify-center items-center">
              Home
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
