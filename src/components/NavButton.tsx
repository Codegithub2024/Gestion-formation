import { NavLink } from "react-router-dom";

type NavLinkProps = {
  to: string;
  text: string;
  children?: React.ReactNode;
};

export default function NavButton({ to, text, children }: NavLinkProps) {
  return (
    <NavLink
      to={`${to}`}
      className={({ isActive }) =>
        `nav-button ring-1 ${isActive ? "bg-white text-neutral-800 ring-neutral-200" : " hover:bg-black/5 text-neutral-500 ring-transparent"}`
      }
    >
      <p className="nav-button-text">
        {children}
        {text}
      </p>
    </NavLink>
  );
}
