import { useLocation } from "react-router-dom";
import { Bell, Eye, EyeOff, Zap, Search, HelpCircle } from "lucide-react";
import { mockUser } from "../data/mockData";

const pageTitles = {
  "/":             { title: "Dashboard",               sub: "Visão geral financeira em tempo real" },
  "/credito":      { title: "Crédito Inteligente",      sub: "Ofertas personalizadas para seu perfil consignado" },
  "/reequilibrio": { title: "Reequilíbrio Financeiro",  sub: "Substitua dívidas caras por crédito com menor custo" },
  "/educacao":     { title: "Educação Financeira",      sub: "Aprenda e ganhe benefícios nas taxas" },
  "/perfil":       { title: "Meu Perfil",               sub: "Dados pessoais, segurança e configurações da conta" },
};

export default function Topbar({ showBalance, setShowBalance }) {
  const { pathname } = useLocation();
  const pg = pageTitles[pathname] || pageTitles["/"];
  const initials = mockUser.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <header className="topbar">
      {/* Left: page title */}
      <div>
        <div className="topbar-title">{pg.title}</div>
        <div style={{ fontSize: 11.5, color: "var(--text-4)", marginTop: 2 }}>{pg.sub}</div>
      </div>

      {/* Right: actions */}
      <div className="topbar-right">
        {/* IA Alert chip */}
        <button style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "rgba(0,200,150,0.08)", border: "1px solid rgba(0,200,150,0.22)",
          borderRadius: 20, padding: "7px 14px",
          fontSize: 12, fontWeight: 700, color: "var(--green)",
          cursor: "pointer", transition: "all .15s",
          whiteSpace: "nowrap",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(0,200,150,0.14)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(0,200,150,0.08)"}
        >
          <Zap size={12} fill="currentColor" />
          IA: R$ 210/mês de economia disponível
        </button>

        {/* Toggle balance */}
        <button className="topbar-btn" onClick={() => setShowBalance(s => !s)} title={showBalance ? "Ocultar valores" : "Mostrar valores"}>
          {showBalance ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>

        {/* Notifications */}
        <button className="topbar-btn" style={{ position: "relative" }} title="Notificações">
          <Bell size={15} />
          <span style={{
            position: "absolute", top: 7, right: 7,
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--red)", border: "1.5px solid var(--bg2)",
          }} />
        </button>

        {/* Help */}
        <button className="topbar-btn" title="Ajuda">
          <HelpCircle size={15} />
        </button>

        {/* Separator */}
        <div style={{ width: 1, height: 28, background: "var(--card-border)" }} />

        {/* Avatar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 9, cursor: "pointer",
          padding: "4px 10px 4px 4px",
          background: "rgba(255,255,255,0.04)", border: "1px solid var(--card-border)",
          borderRadius: 22, transition: "background .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
        >
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg,#7C3AED,#00C896)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 11, color: "white",
          }}>{initials}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", lineHeight: 1.2 }}>
              {mockUser.name.split(" ")[0]}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-4)" }}>{mockUser.tipo}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
