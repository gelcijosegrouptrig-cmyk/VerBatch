// VerbaTech — Topbar
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Eye, EyeOff, AlertTriangle, Zap, ChevronDown } from "lucide-react";
import { mockSession, mockKPIs, mockAlertasIA } from "../data/verbatechData";

const PAGE_TITLES = {
  "/":              { emoji: "📊", title: "Dashboard",           subtitle: "Visão geral da plataforma" },
  "/esteira":       { emoji: "📋", title: "Esteira de Crédito",  subtitle: "Pipeline · Digitação · Averbação" },
  "/corban":        { emoji: "👥", title: "Corban CRM",           subtitle: "Hierarquia · Onboarding · Comissões" },
  "/produtos":      { emoji: "📦", title: "Portfólio de Produtos",subtitle: "Consignado · FGTS · RMC/RCC · Pessoal" },
  "/financeiro":    { emoji: "💰", title: "Financeiro",           subtitle: "Conta Digital · Split · Extrato" },
  "/compliance":    { emoji: "🛡️", title: "Compliance & IA",     subtitle: "Engine Anti-Superendividamento · LGPD" },
  "/credito":       { emoji: "💳", title: "Crédito",              subtitle: "Ofertas e simulações" },
  "/reequilibrio":  { emoji: "⚖️", title: "Reequilíbrio",        subtitle: "Desendividamento" },
  "/educacao":      { emoji: "🎓", title: "Educação",             subtitle: "Conteúdos financeiros" },
  "/perfil":        { emoji: "👤", title: "Perfil",               subtitle: "Dados e configurações" },
  "/produtividade": { emoji: "📈", title: "Produtividade",        subtitle: "Ranking digitadores · Conversão · PDF" },
  "/seguros":       { emoji: "🛡️", title: "Seguros",              subtitle: "Vida · Prestamista · Residencial · Saúde" },
  "/campanhas":     { emoji: "📲", title: "Campanhas & CRM",      subtitle: "WhatsApp · SMS · E-mail · Prospects" },
  "/seguranca":     { emoji: "🔒", title: "Segurança & Acesso",   subtitle: "2FA · Logs · IP/Horário · CPF vinculado" },
};

const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function Topbar({ showBalance, setShowBalance }) {
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const page = PAGE_TITLES[location.pathname] || PAGE_TITLES["/"];
  const criticalAlerts = mockAlertasIA.filter(a => a.nivel === "critico").length;

  return (
    <header style={{
      height: 60, background: "rgba(6,12,24,0.95)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
      backdropFilter: "blur(12px)",
    }}>
      {/* Page title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>{page.emoji}</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", lineHeight: 1.2 }}>{page.title}</div>
          <div style={{ fontSize: 11, color: "#475569" }}>{page.subtitle}</div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* IA alert chip */}
        {criticalAlerts > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 20, padding: "4px 12px", cursor: "pointer",
          }}>
            <AlertTriangle size={12} color="#F87171" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#F87171" }}>
              {criticalAlerts} alerta{criticalAlerts > 1 ? "s" : ""} crítico{criticalAlerts > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Balance toggle */}
        <button
          onClick={() => setShowBalance(s => !s)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
            color: "#94A3B8", cursor: "pointer", fontSize: 12, fontWeight: 600,
          }}
        >
          {showBalance ? <EyeOff size={13} /> : <Eye size={13} />}
          {showBalance ? fmt(mockSession.saldoConta) : "••••••"}
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotif(s => !s)}
            style={{
              width: 36, height: 36, borderRadius: 9,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", position: "relative",
            }}
          >
            <Bell size={15} color="#94A3B8" />
            <span style={{
              position: "absolute", top: 5, right: 5,
              width: 8, height: 8, borderRadius: "50%",
              background: "#EF4444", border: "1.5px solid #060C18",
            }} />
          </button>
          {showNotif && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: 300, background: "#0A1120", border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 12, padding: 0, zIndex: 200, overflow: "hidden",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontWeight: 700, color: "#F1F5F9", fontSize: 13 }}>
                Notificações
              </div>
              {[
                { text: "Proposta VBT-2024-004 em Averbação", time: "há 2h", color: "#38BDF8" },
                { text: "Alerta IA: superendividamento detectado", time: "há 4h", color: "#F87171" },
                { text: "Comissão R$ 1.260 creditada na conta", time: "ontem", color: "#4ADE80" },
                { text: "Nova oportunidade FGTS — José Pereira", time: "ontem", color: "#A78BFA" },
              ].map((n, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px",
                  borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  cursor: "pointer",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.color, flexShrink: 0, marginTop: 4 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#CBD5E1" }}>{n.text}</div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg,#6366F188,#8B5CF688)",
          border: "1.5px solid rgba(99,102,241,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 800, color: "#A78BFA", cursor: "pointer",
        }}>
          {mockSession.name.charAt(0)}
        </div>
      </div>
    </header>
  );
}
