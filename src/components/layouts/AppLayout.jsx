import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/authStore";
import { Link } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/movements", label: "Stock movements" },
  { to: "/recipes", label: "Recipes" },
];

const navLinkClass = ({ isActive }) =>
  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
    isActive
      ? "bg-accent text-foreground font-medium"
      : "text-muted-foreground hover:text-foreground hover:bg-accent"
  }`;

export function AppLayout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden text-left">
      <aside className="w-56 shrink-0 border-r border-border flex flex-col h-full">
        <div className="h-14 shrink-0 flex items-center px-4 border-b border-border">
          <span className="text-sm font-semibold tracking-tight">
            <Link to="/dashboard">Kitchen OS</Link>
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="shrink-0 p-2 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
