import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import UserList from "./pages/admin/user/UserList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/utilisateurs" element={<UserList />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
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
    </QueryClientProvider>
  );
}

export default App;
