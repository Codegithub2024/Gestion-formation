import { Routes, Route, BrowserRouter, NavLink } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./pages/auth/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Button from "./components/ui/Button";
import AdminRoutes from "./routes/AdminRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route
            path="/"
            element={
              <div className="flex w-full min-h-screen bg-white text-neutral-800 font-bold justify-center items-center">
                <NavLink to="/login">
                  <Button text="go to login" buttonStyle="amber" />
                </NavLink>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
