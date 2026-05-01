// VerbaTech — Corban CRM (Production Polish v2 — Gamification + Animated Bars)
import { useState, useEffect } from "react";
import {
  Users, UserPlus, ChevronRight, ChevronDown, Search,
  Star, TrendingUp, Award, CheckCircle, Clock, XCircle,
  Phone, Mail, MapPin, DollarSign, BarChart2, Eye,
  Shield, Download, FileText, AlertCircle, Zap,
  Building2, Crown, Medal, Trophy, Sparkles
} from "lucide-react";
import {
  mockCorbans, mockSession, nivelConfig, mockKPIs, mockComissoes, fmt, fmtPct
} from "../data/verbatechData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/* ── tokens ─────────────────────────────────── */
const S = {
  page: { padding: 24, minHeight: "100vh", background: "#080E1A" },
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};

const ROLE_CFG = {
  master:    { label: "Master",    color: "#00BFFF", icon: Crown },
  agente:    { label: "Agente",    color: "#FFD700", icon: Star },
  sub_agente:{ label: "Sub-agente",color: "#C0C0C0", icon: Users },
  admin:     { label: "Admin",     color: "#F87171", icon: Shield },
};
const DOC_CFG = {
  aprovado:  { label: "Aprovado",   color: "#4ADE80", icon: CheckCircle },
  pendente:  { label: "Pendente",   color: "#FCD34D", icon: Clock },
  em_analise:{ label: "Em análise", color: "#38BDF8", icon: AlertCircle },
  reprovado: { label: "Reprovado",  color: "#F87171", icon: XCircle },
};
const MEDAL = ["🥇","🥈","🥉","4","5","6","7"];
const NIVEL_COLORS = { Diamante:"#00BFFF", Ouro:"#FFD700", Prata:"#C0C0C0", Bronze:"#CD7F32" };

/* ── helpers ─────────────────────────────────── */
function NivelBadge({ nivel }) {
  const cfg = nivelConfig[nivel] || {};
  return (
    <span style={{
      background: cfg.cor + "22", color: cfg.cor,
      border: `1px solid ${cfg.cor}44`, borderRadius: 6,
      padding: "2px 9px", fontSize: 10, fontWeight: 800, letterSpacing: 0.5,
      boxShadow: `0 0 8px ${cfg.cor}33`,
    }}>{nivel}</span>
  );
}
function RoleBadge({ role }) {
  const cfg = ROLE_CFG[role] || ROLE_CFG.sub_agente;
  return (
    <span style={{
      background: cfg.color + "18", color: cfg.color,
      border: `1px solid ${cfg.color}33`,
      borderRadius: 6, padding: "2px 9px", fontSize: 10, fontWeight: 700,
    }}>{cfg.label}</span>
  );
}
function DocBadge({ status }) {
  const cfg = DOC_CFG[status] || DOC_CFG.pendente;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: cfg.color + "18", color: cfg.color,
      border: `1px solid ${cfg.color}33`,
      borderRadius: 6, padding: "2px 9px", fontSize: 10, fontWeight: 700,
    }}>
      <Icon size={10} /> {cfg.label}
    </span>
  );
}

/* ── Animated progress bar ────────────────────── */
function AnimBar({ pct, color, height = 6 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: height }}>
      <div style={{
        height: "100%", width: `${width}%`, borderRadius: height,
        background: color, transition: "width 0.8s cubic-bezier(.4,0,.2,1)",
        boxShadow: `0 0 6px ${color}66`,
      }} />
    </div>
  );
}

/* ── Tree Node ────────────────────────────────── */
function TreeNode({ corban, allCorbans, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth === 0);
  const children = allCorbans.filter(c => c.parent === corban.id);
  const cfg = nivelConfig[corban.nivel] || {};
  const roleCfg = ROLE_CFG[corban.role] || ROLE_CFG.sub_agente;
  const maxProd = Math.max(...allCorbans.map(c => c.producaoMes));
  const barPct = Math.round((corban.producaoMes / maxProd) * 100);

  return (
    <div style={{ marginLeft: depth * 18 }}>
      <div style={{
        ...S.card,
        padding: "14px 16px",
        marginBottom: 8,
        borderLeft: `3px solid ${cfg.cor || roleCfg.color}55`,
        transition: "all 0.15s",
        cursor: "pointer",
      }}
        onMouseEnter={e => e.currentTarget.style.borderLeftColor = cfg.cor || roleCfg.color}
        onMouseLeave={e => e.currentTarget.style.borderLeftColor = (cfg.cor || roleCfg.color) + "55"}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: `${cfg.cor || roleCfg.color}22`,
            border: `2px solid ${cfg.cor || roleCfg.color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: cfg.cor || roleCfg.color,
            boxShadow: `0 0 10px ${cfg.cor || roleCfg.color}33`,
          }}>
            {corban.nome.charAt(0)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>{corban.nome}</span>
              <RoleBadge role={corban.role} />
              <NivelBadge nivel={corban.nivel} />
              {!corban.ativo && (
                <span style={{ background: "rgba(248,113,113,0.12)", color: "#F87171", borderRadius: 6, padding: "1px 7px", fontSize: 9, fontWeight: 700 }}>INATIVO</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={10} />{corban.cidade}
              </span>
              <span style={{ fontSize: 11, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                <Phone size={10} />{corban.telefone}
              </span>
              <span style={{ fontSize: 11, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                <Mail size={10} />{corban.email}
              </span>
            </div>
            {/* production bar */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: "#475569" }}>Produção mês</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: cfg.cor || "#818CF8" }}>{fmt(corban.producaoMes)}</span>
              </div>
              <AnimBar pct={barPct} color={cfg.cor || roleCfg.color} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>Comissão</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#4ADE80" }}>{fmt(corban.comissaoMes)}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <DocBadge status={corban.docStatus} />
              {children.length > 0 && (
                <button onClick={() => setExpanded(x => !x)} style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#818CF8", fontSize: 11,
                }}>
                  {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  {children.length}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {expanded && children.map(child => (
        <TreeNode key={child.id} corban={child} allCorbans={allCorbans} depth={depth + 1} />
      ))}
    </div>
  );
}

/* ── Ranking Card ─────────────────────────────── */
function RankingCard({ corbans }) {
  const sorted = [...corbans].sort((a, b) => b.comissaoMes - a.comissaoMes);
  const maxComm = sorted[0]?.comissaoMes || 1;

  return (
    <div style={{ ...S.card, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: "rgba(255,215,0,0.12)",
          border: "1px solid rgba(255,215,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Trophy size={17} color="#FFD700" />
        </div>
        <div>
          <div style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 15 }}>Ranking de Comissões</div>
          <div style={{ fontSize: 11, color: "#64748B" }}>Mês atual · Abr/2025</div>
        </div>
      </div>

      {sorted.map((c, i) => {
        const nc = NIVEL_COLORS[c.nivel] || "#818CF8";
        const barPct = (c.comissaoMes / maxComm) * 100;
        const medal = i < 3 ? MEDAL[i] : `#${i + 1}`;
        const isTop = i === 0;

        return (
          <div key={c.id} style={{
            padding: "14px 16px",
            background: isTop ? "rgba(255,215,0,0.05)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${isTop ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 12, marginBottom: 8,
            transition: "all 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = isTop ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = isTop ? "rgba(255,215,0,0.05)" : "rgba(255,255,255,0.02)"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: i < 3 ? 20 : 13, width: 24, textAlign: "center", flexShrink: 0, color: i >= 3 ? "#475569" : undefined }}>
                {medal}
              </span>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: nc + "22", border: `2px solid ${nc}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 900, color: nc,
                boxShadow: isTop ? `0 0 14px ${nc}44` : "none",
                flexShrink: 0,
              }}>
                {c.nome.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", display: "flex", alignItems: "center", gap: 6 }}>
                  {c.nome.split(" ")[0]} {c.nome.split(" ").slice(-1)[0]}
                  <NivelBadge nivel={c.nivel} />
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>{c.contratos} contratos · {c.cidade}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#4ADE80" }}>{fmt(c.comissaoMes)}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{fmt(c.producaoMes)} prod.</div>
              </div>
            </div>
            <AnimBar pct={barPct} color={isTop ? "#FFD700" : nc} height={5} />
          </div>
        );
      })}
    </div>
  );
}

/* ── Commission Calculator ────────────────────── */
function CommissionCalc() {
  const [valor, setValor] = useState(100000);
  const splits = [
    { role: "Master",    pct: 3.5, color: "#00BFFF" },
    { role: "Agente",    pct: 2.5, color: "#FFD700" },
    { role: "Sub-agente",pct: 1.5, color: "#C0C0C0" },
  ];
  return (
    <div style={{ ...S.card, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <Zap size={15} color="#818CF8" />
        <span style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 15 }}>Calculadora de Comissão</span>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <label style={{ ...S.label }}>Produção</label>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#818CF8" }}>{fmt(valor)}</span>
        </div>
        <input type="range" min={10000} max={500000} step={5000} value={valor}
          onChange={e => setValor(+e.target.value)}
          style={{ width: "100%", accentColor: "#6366F1" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          <span style={{ fontSize: 10, color: "#334155" }}>R$ 10k</span>
          <span style={{ fontSize: 10, color: "#334155" }}>R$ 500k</span>
        </div>
      </div>

      {splits.map((s, i) => {
        const comm = valor * (s.pct / 100);
        const barPct = (s.pct / 3.5) * 100;
        return (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>{s.role}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#475569" }}>{s.pct}%</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: s.color }}>{fmt(comm)}</span>
              </div>
            </div>
            <AnimBar pct={barPct} color={s.color} height={5} />
          </div>
        );
      })}

      <div style={{
        marginTop: 4, padding: "12px 16px",
        background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)",
        borderRadius: 10,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 700 }}>Total rede</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#4ADE80" }}>{fmt(valor * 0.075)}</span>
        </div>
        <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>7.5% combinado sobre {fmt(valor)}</div>
      </div>
    </div>
  );
}

/* ── Onboarding Modal ─────────────────────────── */
function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", cpf: "", cnpj: "", cidade: "", role: "sub_agente" });
  const steps = ["Dados Pessoais", "Empresa", "Confirmação"];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#0F1729", border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 18, padding: 28, width: 480, maxWidth: "95vw",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#F1F5F9" }}>Novo Corban</div>
            <div style={{ fontSize: 12, color: "#475569" }}>Passo {step} de {steps.length} · {steps[step - 1]}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        {/* Step progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: i < step ? "#6366F1" : "rgba(255,255,255,0.08)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["Nome completo", "nome"], ["E-mail", "email"], ["Telefone", "telefone"], ["CPF", "cpf"]].map(([label, key]) => (
              <div key={key}>
                <label style={{ ...S.label, display: "block", marginBottom: 5 }}>{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "9px 12px", color: "#F1F5F9", fontSize: 13, outline: "none",
                    boxSizing: "border-box",
                  }} />
              </div>
            ))}
          </div>
        )}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["CNPJ", "cnpj"], ["Cidade/UF", "cidade"]].map(([label, key]) => (
              <div key={key}>
                <label style={{ ...S.label, display: "block", marginBottom: 5 }}>{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "9px 12px", color: "#F1F5F9", fontSize: 13, outline: "none",
                    boxSizing: "border-box",
                  }} />
              </div>
            ))}
            <div>
              <label style={{ ...S.label, display: "block", marginBottom: 5 }}>Nível</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                style={{
                  width: "100%", background: "#0F1729", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "9px 12px", color: "#F1F5F9", fontSize: 13, outline: "none",
                }}>
                <option value="sub_agente">Sub-agente</option>
                <option value="agente">Agente</option>
                <option value="master">Master</option>
              </select>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              {Object.entries(form).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</span>
                  <span style={{ fontSize: 13, color: "#CBD5E1", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 8, padding: "10px 14px" }}>
              <Shield size={13} color="#38BDF8" />
              <span style={{ fontSize: 12, color: "#94A3B8" }}>Convite por e-mail será enviado automaticamente</span>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              flex: 1, padding: "11px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94A3B8", cursor: "pointer", fontSize: 13,
            }}>← Voltar</button>
          )}
          <button onClick={() => step < 3 ? setStep(s => s + 1) : onClose()} style={{
            flex: 2, padding: "11px",
            background: step === 3 ? "linear-gradient(135deg,#4ADE80,#10B981)" : "linear-gradient(135deg,#6366F1,#8B5CF6)",
            border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13,
          }}>
            {step === 3 ? "✓ Cadastrar Corban" : "Continuar →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────── */
export default function Corban() {
  const [view, setView] = useState("tree"); // tree | ranking | calc
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const roots = mockCorbans.filter(c => c.parent === null);
  const filtered = mockCorbans.filter(c => {
    const matchSearch = c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.cidade.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || c.role === roleFilter;
    return matchSearch && matchRole;
  });

  const kpiData = [
    { label: "Total Corbans", value: mockCorbans.length, color: "#6366F1" },
    { label: "Ativos", value: mockCorbans.filter(c => c.ativo).length, color: "#4ADE80" },
    { label: "Prod. Rede/mês", value: fmt(mockCorbans.reduce((a, c) => a + c.producaoMes, 0)), color: "#A78BFA" },
    { label: "Comissão Rede", value: fmt(mockCorbans.reduce((a, c) => a + c.comissaoMes, 0)), color: "#FCD34D" },
  ];

  const chartData = mockComissoes?.mes || [];

  return (
    <div style={S.page}>
      {showModal && <OnboardingModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Corban CRM</h1>
          <p style={{ color: "#64748B", fontSize: 13 }}>Hierarquia multinível · Comissões automáticas · Onboarding digital</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13,
          boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
        }}>
          <UserPlus size={15} /> Adicionar Corban
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {kpiData.map((k, i) => (
          <div key={i} style={{ ...S.card, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 200,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 9, padding: "8px 12px",
        }}>
          <Search size={14} color="#475569" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou cidade…"
            style={{ background: "none", border: "none", color: "#F1F5F9", fontSize: 13, outline: "none", flex: 1 }} />
        </div>

        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{
          background: "#0F1729", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 9, padding: "8px 12px", color: "#94A3B8", fontSize: 13, cursor: "pointer", outline: "none",
        }}>
          <option value="all">Todos níveis</option>
          <option value="master">Master</option>
          <option value="agente">Agente</option>
          <option value="sub_agente">Sub-agente</option>
        </select>

        {/* View switcher */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, overflow: "hidden" }}>
          {[
            { key: "tree", icon: Users, label: "Hierarquia" },
            { key: "ranking", icon: Trophy, label: "Ranking" },
            { key: "calc", icon: BarChart2, label: "Comissão" },
          ].map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setView(key)} style={{
              padding: "8px 14px", background: view === key ? "rgba(99,102,241,0.2)" : "transparent",
              border: "none", color: view === key ? "#818CF8" : "#475569",
              cursor: "pointer", fontSize: 12, fontWeight: view === key ? 700 : 500,
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
            }}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ display: "grid", gridTemplateColumns: view === "tree" ? "1fr 360px" : "1fr", gap: 20, alignItems: "start" }}>

        {/* Main panel */}
        <div>
          {view === "tree" && (
            <div>
              {(search || roleFilter !== "all" ? filtered : roots).map(c => (
                <TreeNode key={c.id} corban={c}
                  allCorbans={search || roleFilter !== "all" ? filtered : mockCorbans}
                  depth={0} />
              ))}
            </div>
          )}
          {view === "ranking" && <RankingCard corbans={mockCorbans} />}
          {view === "calc" && <CommissionCalc />}
        </div>

        {/* Side panel — only in tree view */}
        {view === "tree" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Commission chart */}
            {chartData.length > 0 && (
              <div style={{ ...S.card, padding: 18 }}>
                <div style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 14, marginBottom: 4 }}>Comissão — 6 meses</div>
                <div style={{ fontSize: 11, color: "#64748B", marginBottom: 14 }}>Crescimento acumulado da rede</div>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={chartData} barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={v => fmt(v)}
                      contentStyle={{ background: "#0F1729", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="comissao" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Network summary */}
            <div style={{ ...S.card, padding: 18 }}>
              <div style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 14, marginBottom: 14 }}>Distribuição Rede</div>
              {Object.entries(ROLE_CFG).filter(([k]) => k !== "admin").map(([role, cfg]) => {
                const count = mockCorbans.filter(c => c.role === role).length;
                const pct = Math.round((count / mockCorbans.length) * 100);
                return (
                  <div key={role} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>{cfg.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: cfg.color }}>{count}</span>
                    </div>
                    <AnimBar pct={pct} color={cfg.color} />
                  </div>
                );
              })}
            </div>

            {/* Top performers mini */}
            <div style={{ ...S.card, padding: 18 }}>
              <div style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 14, marginBottom: 14 }}>Top 3 Performers</div>
              {[...mockCorbans].sort((a, b) => b.producaoMes - a.producaoMes).slice(0, 3).map((c, i) => {
                const nc = NIVEL_COLORS[c.nivel] || "#818CF8";
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 18, width: 22 }}>{MEDAL[i]}</span>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: nc + "22", border: `2px solid ${nc}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 900, color: nc, flexShrink: 0,
                    }}>
                      {c.nome.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.nome}</div>
                      <div style={{ fontSize: 10, color: "#475569" }}>{fmt(c.producaoMes)}</div>
                    </div>
                    <NivelBadge nivel={c.nivel} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
