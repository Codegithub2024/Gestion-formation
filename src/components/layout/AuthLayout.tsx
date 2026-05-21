import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex justify-center-safe items-center-safe w-full h-screen border">
      <div className="flex-1 flex justify-center bg-neutral-100 py-10 px-4 lg:py-24 h-full bg-grid grid-size-3 grid-color-neutral-200">
        <Outlet />
      </div>
    </div>
  );
}
