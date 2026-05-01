// VerbaTech — Sidebar (Production Polish)
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, GitPullRequest, Users, Package, DollarSign,
  Shield, Settings, LogOut, Zap, ChevronRight, TrendingUp,
  BarChart2, HeartHandshake, Send, Lock, Landmark, FileText, PieChart,
} from "lucide-react";
import { mockSession, mockKPIs, mockComissoes } from "../data/verbatechData";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  // ─── Core ───
  { path: "/",               label: "Dashboard",      icon: LayoutDashboard, color: "#6366F1",  group: "core" },
  { path: "/esteira",        label: "Esteira",         icon: GitPullRequest,  color: "#8B5CF6",  group: "core", badge: 3 },
  { path: "/corban",         label: "Corban CRM",      icon: Users,           color: "#06B6D4",  group: "core" },
  { path: "/produtos",       label: "Produtos",        icon: Package,         color: "#10B981",  group: "core" },
  { path: "/financeiro",     label: "Financeiro",      icon: DollarSign,      color: "#F59E0B",  group: "core" },
  { path: "/compliance",     label: "Compliance & IA", icon: Shield,          color: "#EF4444",  group: "core", badge: 1 },
  // ─── BaaS ───
  { path: "/baas",           label: "BaaS / Contas",   icon: Landmark,        color: "#818CF8",  group: "baas" },
  { path: "/ccb",            label: "CCB / Contratos", icon: FileText,        color: "#10B981",  group: "baas" },
  { path: "/fidc",           label: "FIDC / Fundo",    icon: PieChart,        color: "#F59E0B",  group: "baas" },
  // ─── Gestão ───
  { path: "/produtividade",  label: "Produtividade",   icon: BarChart2,       color: "#A855F7",  group: "gestao" },
  { path: "/seguros",        label: "Seguros",          icon: HeartHandshake,  color: "#EF4444",  group: "gestao" },
  { path: "/campanhas",      label: "Campanhas",        icon: Send,            color: "#25D366",  group: "gestao", badge: 2 },
  { path: "/seguranca",      label: "Segurança",        icon: Lock,            color: "#F59E0B",  group: "gestao", badge: 2 },
];

const NIVEL_COLORS = {
  Bronze:   { color: "#CD7F32", glow: "rgba(205,127,50,0.35)"  },
  Prata:    { color: "#C0C0C0", glow: "rgba(192,192,192,0.3)"  },
  Ouro:     { color: "#FFD700", glow: "rgba(255,215,0,0.35)"   },
  Diamante: { color: "#00BFFF", glow: "rgba(0,191,255,0.4)"    },
};

const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

// Mini sparkline for commission trend
function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 72, h = 22, pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* last dot */}
      {(() => {
        const last = data[data.length - 1];
        const x = w - pad;
        const y = h - pad - ((last - min) / range) * (h - pad * 2);
        return <circle cx={x} cy={y} r="2.5" fill={color} />;
      })()}
    </svg>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // usa dados do usuário logado ou fallback para mockSession
  const nivel    = user?.nivel || mockSession.nivel;
  const nivelCfg = NIVEL_COLORS[nivel] || NIVEL_COLORS.Ouro;
  const userName = user?.nome || mockSession.name;
  const userRole = user?.role || mockSession.role;
  const userComissao = user?.comissaoMes || mockSession.comissaoMes;

  // build sparkline data from comissoes
  const sparkData = mockComissoes?.mes?.map(m => m.comissao) || [8000, 9200, 10500, 11800, 13200, 14600];

  function handleLogout() { logout(); navigate("/login"); }

  return (
    <div style={{
      width: 240, minHeight: "100vh", background: "#060C18",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0, flexShrink: 0,
      // subtle right-edge gradient
    }}>
      {/* ── Logo ── */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 18px rgba(99,102,241,0.5), 0 0 0 1px rgba(99,102,241,0.25)",
            animation: "logo-breathe 4s ease-in-out infinite",
          }}>
            <Zap size={17} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#F1F5F9", letterSpacing: -0.5 }}>
              Verba<span style={{ color: "#6366F1" }}>Tech</span>
            </div>
            <div style={{ fontSize: 9, color: "#4ADE80", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>Corban Platform</div>
          </div>
        </div>
      </div>

      {/* ── User Card ── */}
      <div style={{ padding: "14px 14px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg,${nivelCfg.color}44,${nivelCfg.color}88)`,
            border: `2px solid ${nivelCfg.color}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 900, color: nivelCfg.color,
            boxShadow: `0 0 12px ${nivelCfg.glow}`,
          }}>
            {userName.charAt(0)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {userName}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <span style={{
                background: nivelCfg.color + "22", color: nivelCfg.color,
                border: `1px solid ${nivelCfg.color}44`,
                borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 800,
                letterSpacing: 0.5, boxShadow: `0 0 6px ${nivelCfg.glow}`,
              }}>
                {nivel.toUpperCase()}
              </span>
              <span style={{ fontSize: 10, color: "#64748B", textTransform: "capitalize" }}>{userRole}</span>
            </div>
          </div>
        </div>

        {/* Comissão strip with sparkline */}
        <div style={{
          padding: "9px 11px", borderRadius: 9,
          background: "rgba(74,222,128,0.06)",
          border: "1px solid rgba(74,222,128,0.14)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Comissão / mês</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#4ADE80", marginTop: 1 }}>
              {fmt(userComissao)}
            </div>
          </div>
          <Sparkline data={sparkData} color="#4ADE80" />
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: "10px 10px 4px", overflowY: "auto" }}>

        {/* Group labels + items */}
        {[
          { id: "core",   label: "Plataforma" },
          { id: "baas",   label: "BaaS & Crédito" },
          { id: "gestao", label: "Gestão" },
        ].map(({ id, label }, gi) => {
          const items = NAV_ITEMS.filter(n => n.group === id);
          return (
            <div key={id}>
              <div style={{
                fontSize: 9, color: "#334155", fontWeight: 800, letterSpacing: 1.5,
                textTransform: "uppercase", padding: gi === 0 ? "6px 8px 8px" : "14px 8px 8px",
                marginTop: gi > 0 ? 4 : 0,
                borderTop: gi > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}>
                {label}
              </div>
              {items.map(({ path, label: itemLabel, icon: Icon, color, badge }) => {
                const active = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 10px 9px 13px", borderRadius: 9, marginBottom: 2,
                      background: active ? `${color}18` : "transparent",
                      border: `1px solid ${active ? color + "33" : "transparent"}`,
                      cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                      position: "relative",
                      boxShadow: active ? `inset 0 0 20px ${color}08` : "none",
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                  >
                    {active && (
                      <div style={{
                        position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                        width: 3, height: 18, borderRadius: "0 3px 3px 0",
                        background: color, boxShadow: `0 0 8px ${color}`,
                      }} />
                    )}
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: active ? color + "22" : "rgba(255,255,255,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                      boxShadow: active ? `0 0 10px ${color}44` : "none",
                    }}>
                      <Icon size={14} color={active ? color : "#475569"} />
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: active ? 700 : 500,
                      color: active ? "#F1F5F9" : "#64748B", flex: 1,
                    }}>
                      {itemLabel}
                    </span>
                    {badge && !active && (
                      <span style={{
                        background: "rgba(239,68,68,0.8)", color: "#fff",
                        borderRadius: 10, padding: "1px 6px",
                        fontSize: 10, fontWeight: 700, minWidth: 18, textAlign: "center",
                        boxShadow: "0 0 6px rgba(239,68,68,0.5)",
                      }}>{badge}</span>
                    )}
                    {active && <ChevronRight size={12} color={color} />}
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* System */}
        <div style={{ fontSize: 9, color: "#334155", fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", padding: "12px 8px 8px", marginTop: 4, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          Sistema
        </div>
        {[
          { label: "Configurações", icon: Settings, onClick: null },
          { label: "Sair",          icon: LogOut,   onClick: handleLogout },
        ].map(({ label, icon: Icon, onClick }) => (
          <button key={label} onClick={onClick} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "9px 10px", borderRadius: 9, marginBottom: 2,
            background: "transparent", border: "1px solid transparent",
            cursor: "pointer", transition: "all 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = label === "Sair" ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={14} color="#475569" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#64748B" }}>{label}</span>
          </button>
        ))}
      </nav>

      {/* ── Roadmap Phase Progress ── */}
      <div style={{ padding: "12px 14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 9, color: "#475569", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>Roadmap</div>
          <span style={{ fontSize: 9, color: "#6366F1", fontWeight: 700 }}>FASE 1 ATIVA</span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: "35%", borderRadius: 10,
            background: "linear-gradient(90deg,#6366F1,#10B981)",
            boxShadow: "0 0 8px rgba(99,102,241,0.5)",
          }} />
        </div>

        {[
          { label: "MVP — INSS + FGTS",       state: "active" },
          { label: "Fintech — Conta + RMC",   state: "pending" },
          { label: "Expansão — SCD própria",  state: "pending" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < 2 ? 7 : 0 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
              background: r.state === "done" ? "#4ADE80" : r.state === "active" ? "#6366F1" : "rgba(255,255,255,0.12)",
              boxShadow: r.state === "done"   ? "0 0 8px rgba(74,222,128,0.5)"
                        : r.state === "active" ? "0 0 8px rgba(99,102,241,0.6)"
                        : "none",
              animation: r.state === "active" ? "anim-brand 2s ease-in-out infinite" : "none",
            }} />
            <span style={{
              fontSize: 10,
              color: r.state === "done" ? "#4ADE80" : r.state === "active" ? "#818CF8" : "#334155",
              fontWeight: r.state === "active" ? 700 : 500,
            }}>
              {r.label}
            </span>
          </div>
        ))}

        {/* Mini KPI strip */}
        <div style={{
          display: "flex", gap: 0, marginTop: 12,
          background: "rgba(255,255,255,0.02)", borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden",
        }}>
          {[
            { label: "Ativos", value: "7", color: "#6366F1" },
            { label: "Contratos", value: "282", color: "#10B981" },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: "7px 10px", textAlign: "center",
              borderRight: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "#475569", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
