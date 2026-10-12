import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "\u25C6" },
  { to: "/portfolio", label: "Portfolio", icon: "\u25A0" },
  { to: "/screener", label: "Screener", icon: "\u25B2" },
  { to: "/indices", label: "Indices", icon: "\u25CF" },
  { to: "/dividends", label: "Dividends", icon: "\u25B6" },
  { to: "/settings", label: "Settings", icon: "\u2699" },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          PSX Insight
          <ThemeToggle />
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">{user?.name || user?.email}</div>
          <button onClick={logout} className="btn btn-sm" style={{ width: "100%" }}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
