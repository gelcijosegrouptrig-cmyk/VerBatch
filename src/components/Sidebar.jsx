import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, CreditCard, RefreshCw, BookOpen, User,
  Settings, LogOut, Shield, TrendingUp, Zap
} from "lucide-react";
import { mockUser } from "../data/mockData";

const navItems = [
  { path: "/",             icon: LayoutDashboard, label: "Dashboard",        chip: null },
  { path: "/credito",      icon: CreditCard,      label: "Crédito",          chip: "Nova oferta" },
  { path: "/reequilibrio", icon: RefreshCw,        label: "Reequilíbrio",     chip: null },
  { path: "/educacao",     icon: BookOpen,         label: "Educação",         chip: "+50 pts" },
  { path: "/perfil",       icon: User,             label: "Perfil",           chip: null },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">VB</div>
        <div>
          <div className="logo-text">Ver<span>Batch</span></div>
          <div className="logo-ver">Fintech · v1.0</div>
        </div>
      </div>

      {/* Nav principal */}
      <nav className="nav-section" style={{ flex: 1 }}>
        <div className="nav-label">Menu Principal</div>
        {navItems.map(({ path, icon: Icon, label, chip }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              className={`nav-item${active ? " active" : ""}`}
              onClick={() => navigate(path)}
            >
              <span className="nav-icon">
                <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
              </span>
              {label}
              {chip && !active && (
                <span className="nav-chip">{chip}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Nav sistema */}
      <nav className="nav-section" style={{ marginTop: 4, paddingBottom: 0 }}>
        <div className="nav-label">Sistema</div>
        <button className="nav-item">
          <span className="nav-icon"><Shield size={16} strokeWidth={1.8} /></span>
          Segurança LGPD
        </button>
        <button className="nav-item">
          <span className="nav-icon"><Settings size={16} strokeWidth={1.8} /></span>
          Configurações
        </button>
      </nav>

      {/* IA Insight */}
      <div style={{ margin: "12px 12px 0", padding: "12px", background: "rgba(0,200,150,0.07)", border: "1px solid rgba(0,200,150,0.18)", borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
          <Zap size={12} color="var(--green)" fill="var(--green)" />
          <span style={{ fontSize: 10, fontWeight: 800, color: "var(--green)", textTransform: "uppercase", letterSpacing: 0.8 }}>IA Detectou</span>
        </div>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>
          Economize <strong style={{ color: "var(--green)" }}>R$ 210/mês</strong> trocando dívida cara por consignado
        </div>
      </div>

      {/* User bottom */}
      <div className="sidebar-bottom">
        <div style={{ fontSize: 9.5, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: 1 }}>
          Conta ativa · INSS
        </div>
        <div className="user-mini">
          <div className="user-avatar">
            {mockUser.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-mini-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {mockUser.name}
            </div>
            <div className="user-mini-type">Score {mockUser.score} · {mockUser.scoreLabel}</div>
          </div>
          <button style={{ background: "none", border: "none", color: "var(--text-4)", cursor: "pointer", padding: 4, borderRadius: 6 }}
            title="Sair">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
