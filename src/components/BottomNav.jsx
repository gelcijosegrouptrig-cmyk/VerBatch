import { useNavigate, useLocation } from "react-router-dom";
import { Home, CreditCard, RefreshCw, BookOpen, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/credito", icon: CreditCard, label: "Crédito" },
  { path: "/reequilibrio", icon: RefreshCw, label: "Reequilíbrio" },
  { path: "/educacao", icon: BookOpen, label: "Educação" },
  { path: "/perfil", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = pathname === path;
        return (
          <button
            key={path}
            className={`nav-item${active ? " active" : ""}`}
            onClick={() => navigate(path)}
          >
            <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
