// VerbaTech — Dashboard (Full Production Polish v2)
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, TrendingDown, Users, FileText, DollarSign, Zap,
  Shield, Activity, AlertTriangle, ChevronRight, BarChart2,
  ArrowUpRight, Wifi, Clock, CheckCircle, Cpu, Star, Crown
} from "lucide-react";
import {
  mockKPIs, mockSession, mockPropostas, mockCorbans, mockAlertasIA,
  mockGraficoProducao, mockGraficoProdutos, mockIntegracoes,
  mockComissoes, statusColors, fmt
} from "../data/verbatechData";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

/* ── shared style tokens ─────────────────────── */
const S = {
  page: { padding: 24, minHeight: "100vh", background: "#080E1A" },
  card: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
  },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};

/* ── Micro Sparkline SVG ─────────────────────── */
function Spark({ data, color, height = 32, width = 68 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const lastX = (width - pad).toFixed(1);
  const lastY = (height - pad - ((data[data.length - 1] - min) / range) * (height - pad * 2)).toFixed(1);
  const gradId = `sg${color.replace("#", "")}`;
  return (
    <svg width={width} height={height} style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`${pad},${height} ${pts} ${lastX},${height}`}
        fill={`url(#${gradId})`}
      />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
      <circle cx={lastX} cy={lastY} r="2.8" fill={color}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}

/* ── Animated counter ────────────────────────── */
function AnimNum({ target, prefix = "", suffix = "", duration = 900, decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(ease * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString("pt-BR");
  return <span>{prefix}{formatted}{suffix}</span>;
}

/* ── Live Clock ──────────────────────────────── */
function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <Clock size={11} color="#475569" />
      <span style={{ fontSize: 12, color: "#475569", fontFamily: "monospace" }}>
        {t.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
    </div>
  );
}

/* ── Status Pill ─────────────────────────────── */
function StatusPill({ status }) {
  const cfg = statusColors[status] || statusColors["Digitação"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.text, borderRadius: 20,
      padding: "3px 10px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

/* ── Integration row ─────────────────────────── */
function IntegRow({ integ }) {
  const online = integ.status === "online";
  const partial = integ.status === "parcial";
  const color = online ? "#4ADE80" : partial ? "#FCD34D" : "#F87171";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "6px 0",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
        background: color,
        boxShadow: `0 0 6px ${color}99`,
        animation: online ? "anim-blink 2.5s ease-in-out infinite" : "none",
      }} />
      <span style={{ flex: 1, fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{integ.nome}</span>
      <span style={{ fontSize: 10, color, fontWeight: 700 }}>{integ.latencia}ms</span>
    </div>
  );
}

/* ── Custom Tooltip ──────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0F1729", border: "1px solid rgba(99,102,241,0.35)",
      borderRadius: 10, padding: "10px 14px", fontSize: 12,
    }}>
      <div style={{ color: "#64748B", marginBottom: 6, fontWeight: 700 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <div style={{ width: 8, height: 3, borderRadius: 2, background: p.color }} />
          <span style={{ color: "#94A3B8" }}>{p.name}:</span>
          <span style={{ color: p.color, fontWeight: 800 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ── KPI Card ────────────────────────────────── */
function KpiCard({ kpi, color, icon: Icon, onClick, sparkData }) {
  const up = kpi.tendencia === "up";
  const down = kpi.tendencia === "down";
  const TrendIcon = up ? TrendingUp : down ? TrendingDown : Activity;
  const trendColor = up ? "#4ADE80" : down ? "#F87171" : "#FCD34D";

  return (
    <div onClick={onClick} style={{
      ...S.card,
      padding: "16px 18px",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.18s",
      position: "relative",
      overflow: "hidden",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color + "44";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}18`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* subtle color wash */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        background: `radial-gradient(circle at top right, ${color}, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: color + "18",
            border: `1px solid ${color}2a`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 12px ${color}22`,
          }}>
            <Icon size={15} color={color} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: trendColor + "18", borderRadius: 6, padding: "2px 7px" }}>
            <TrendIcon size={10} color={trendColor} />
            <span style={{ fontSize: 10, fontWeight: 800, color: trendColor }}>{kpi.variacao}</span>
          </div>
        </div>

        {/* Value + sparkline */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 4 }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#F1F5F9", lineHeight: 1, letterSpacing: -0.5 }}>
              {kpi.formato === "brl" ? fmt(kpi.valor)
                : kpi.formato === "pct" ? `${kpi.valor}%`
                  : kpi.valor.toLocaleString("pt-BR")}
            </div>
          </div>
          {sparkData && <Spark data={sparkData} color={color} />}
        </div>

        {/* Sub-label */}
        {kpi.sub && (
          <div style={{ fontSize: 10, color: "#475569" }}>{kpi.sub}</div>
        )}
      </div>
    </div>
  );
}

/* ── Welcome Banner ──────────────────────────── */
function WelcomeBanner({ navigate }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const integOnline = mockIntegracoes.filter(i => i.status === "online").length;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(6,182,212,0.06) 100%)",
      border: "1px solid rgba(99,102,241,0.2)",
      borderRadius: 16, padding: "20px 24px",
      marginBottom: 20, position: "relative", overflow: "hidden",
    }}>
      {/* decorative orb */}
      <div style={{
        position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -50, left: 60, width: 160, height: 160, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              fontSize: 22, fontWeight: 900, color: "#F1F5F9", letterSpacing: -0.5,
            }}>
              {greeting}, {mockSession.name.split(" ")[0]}! 👋
            </div>
            <span style={{
              fontSize: 10, fontWeight: 800, color: "#00BFFF",
              background: "rgba(0,191,255,0.12)", border: "1px solid rgba(0,191,255,0.28)",
              borderRadius: 6, padding: "2px 9px", letterSpacing: 0.6,
            }}>
              {mockSession.nivel.toUpperCase()}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%", background: "#4ADE80",
                boxShadow: "0 0 7px rgba(74,222,128,0.7)",
                animation: "anim-blink 2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: 12, color: "#64748B" }}>
                <span style={{ color: "#4ADE80", fontWeight: 700 }}>{integOnline}</span>/{mockIntegracoes.length} integrações ativas
              </span>
            </div>
            <span style={{ fontSize: 12, color: "#64748B" }}>
              Rede: <span style={{ color: "#06B6D4", fontWeight: 700 }}>{mockKPIs.rede.valor} Corbans</span>
            </span>
            <LiveClock />
          </div>

          {/* Quick stats */}
          <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
            {[
              { label: "Comissão/mês", value: fmt(mockSession.comissaoMes), color: "#4ADE80" },
              { label: "Saldo conta", value: fmt(mockSession.saldoConta), color: "#818CF8" },
              { label: "Pend. comissão", value: fmt(mockSession.comissaoPendente), color: "#FCD34D" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: s.color, marginTop: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignSelf: "flex-end" }}>
          <button onClick={() => navigate("/esteira")} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "10px 20px",
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            border: "none", borderRadius: 10, color: "#fff",
            cursor: "pointer", fontWeight: 700, fontSize: 13,
            boxShadow: "0 4px 18px rgba(99,102,241,0.45)",
            transition: "all 0.15s",
          }}>
            <FileText size={14} /> Nova Proposta
          </button>
          <button onClick={() => navigate("/compliance")} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10, color: "#F87171", cursor: "pointer", fontWeight: 700, fontSize: 13,
          }}>
            <AlertTriangle size={14} /> {mockKPIs.alertasIA.valor} Alertas
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────── */
export default function Dashboard({ showBalance }) {
  const navigate = useNavigate();
  const integOnline = mockIntegracoes.filter(i => i.status === "online").length;

  // build sparkline arrays from production data
  const prodSpark = mockGraficoProducao.map(m => m.producao);
  const commSpark = mockGraficoProducao.map(m => m.comissao);
  const corbSpark = [4, 5, 5, 6, 6, 7];
  const contSpark = mockGraficoProducao.map(m => Math.round(m.producao / 3200));
  const tickSpark = [94, 96, 95, 97, 96, 98];
  const alertSpark = [8, 6, 9, 5, 7, 4];

  const kpiCards = [
    { kpi: mockKPIs.producaoTotal, color: "#6366F1", icon: TrendingUp,  path: "/financeiro", spark: prodSpark },
    { kpi: mockKPIs.comissaoMes,   color: "#4ADE80", icon: DollarSign,  path: "/financeiro", spark: commSpark },
    { kpi: mockKPIs.rede,          color: "#06B6D4", icon: Users,       path: "/corban",     spark: corbSpark },
    { kpi: mockKPIs.contratos,     color: "#A78BFA", icon: FileText,    path: "/esteira",    spark: contSpark },
    { kpi: mockKPIs.ticketMedio,   color: "#FCD34D", icon: BarChart2,   path: "/produtos",   spark: tickSpark },
    { kpi: mockKPIs.alertasIA,     color: "#F87171", icon: Shield,      path: "/compliance", spark: alertSpark },
  ];

  return (
    <div style={S.page}>

      {/* ── Welcome Banner ── */}
      <WelcomeBanner navigate={navigate} />

      {/* ── KPI Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(188px,1fr))", gap: 12, marginBottom: 20 }}>
        {kpiCards.map(({ kpi, color, icon, path, spark }, i) => (
          <KpiCard key={i} kpi={kpi} color={color} icon={icon}
            onClick={() => navigate(path)} sparkData={spark} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Area chart */}
        <div style={{ ...S.card, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 15 }}>Produção vs Comissão</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                Últimos 6 meses · <span style={{ color: "#6366F1", fontWeight: 700 }}>{fmt(mockKPIs.producaoTotal.valor)}</span> total
              </div>
            </div>
            <button onClick={() => navigate("/financeiro")} style={{
              display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
              color: "#6366F1", cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>
              Detalhes <ChevronRight size={13} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockGraficoProducao}>
              <defs>
                <linearGradient id="gProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gComm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="producao" name="Produção" stroke="#6366F1" strokeWidth={2.5} fill="url(#gProd)" />
              <Area type="monotone" dataKey="comissao" name="Comissão" stroke="#4ADE80" strokeWidth={2} fill="url(#gComm)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{ ...S.card, padding: 20 }}>
          <div style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 15, marginBottom: 3 }}>Mix de Produtos</div>
          <div style={{ fontSize: 11, color: "#64748B", marginBottom: 14 }}>% volume · Abr/2025</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ResponsiveContainer width="52%" height={160}>
              <PieChart>
                <Pie data={mockGraficoProdutos} cx="50%" cy="50%"
                  innerRadius={36} outerRadius={68}
                  dataKey="valor" paddingAngle={3} startAngle={90} endAngle={-270}>
                  {mockGraficoProdutos.map((entry, i) => (
                    <Cell key={i} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip formatter={v => `${v}%`}
                  contentStyle={{ background: "#0F1729", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {mockGraficoProdutos.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 2, background: p.cor, flexShrink: 0,
                    boxShadow: `0 0 6px ${p.cor}99`,
                  }} />
                  <span style={{ fontSize: 11, color: "#94A3B8", flex: 1 }}>{p.nome}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: p.cor }}>{p.valor}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 16 }}>

        {/* Proposals Table */}
        <div style={{ ...S.card, overflow: "hidden" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 15 }}>Propostas Recentes</span>
              <span style={{
                background: "rgba(99,102,241,0.15)", color: "#818CF8",
                borderRadius: 20, padding: "1px 9px", fontSize: 11, fontWeight: 700,
              }}>{mockPropostas.length}</span>
            </div>
            <button onClick={() => navigate("/esteira")} style={{
              display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
              color: "#6366F1", cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>
              Ver esteira <ChevronRight size={13} />
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["ID", "Cliente", "Produto", "Valor", "Score IA", "Status"].map(h => (
                  <th key={h} style={{ padding: "8px 16px", textAlign: "left", ...S.label }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockPropostas.slice(0, 7).map(p => {
                const score = p.scoreIA;
                const sc = score >= 80 ? "#4ADE80" : score >= 60 ? "#FCD34D" : "#F87171";
                return (
                  <tr key={p.id}
                    onClick={() => navigate("/esteira")}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "10px 16px", fontSize: 11, color: "#6366F1", fontWeight: 800 }}>{p.id.slice(-7)}</td>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#CBD5E1", fontWeight: 600 }}>{p.cliente}</td>
                    <td style={{ padding: "10px 16px", fontSize: 11, color: "#94A3B8" }}>{p.produto}</td>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#A78BFA", fontWeight: 800 }}>{fmt(p.valor)}</td>
                    <td style={{ padding: "10px 16px" }}>
                      {score != null
                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: sc + "18", borderRadius: 6, padding: "2px 7px" }}>
                          <Cpu size={9} color={sc} />
                          <span style={{ fontSize: 11, fontWeight: 900, color: sc }}>{score}</span>
                        </span>
                        : <span style={{ color: "#475569", fontSize: 11 }}>—</span>
                      }
                    </td>
                    <td style={{ padding: "10px 16px" }}><StatusPill status={p.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* IA Alerts */}
          <div style={{ ...S.card, padding: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", background: "#F87171",
                  boxShadow: "0 0 8px rgba(248,113,113,0.8)",
                  animation: "anim-blink 1.2s ease-in-out infinite",
                }} />
                <span style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 14 }}>Alertas IA</span>
                <span style={{ background: "rgba(239,68,68,0.15)", color: "#F87171", borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>
                  {mockAlertasIA.length}
                </span>
              </div>
              <button onClick={() => navigate("/compliance")} style={{ background: "none", border: "none", color: "#6366F1", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                Ver todos →
              </button>
            </div>
            {mockAlertasIA.slice(0, 4).map((a, i) => {
              const clrs = { critico: "#F87171", atencao: "#FCD34D", oportunidade: "#4ADE80" };
              const c = clrs[a.nivel] || "#94A3B8";
              return (
                <div key={i} style={{
                  display: "flex", gap: 9, alignItems: "flex-start",
                  marginBottom: i < 3 ? 9 : 0,
                  paddingBottom: i < 3 ? 9 : 0,
                  borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: c, flexShrink: 0, marginTop: 4, boxShadow: `0 0 5px ${c}` }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#CBD5E1" }}>{a.cliente}</div>
                    <div style={{ fontSize: 10, color: "#64748B", lineHeight: 1.4, marginTop: 1 }}>{a.mensagem.slice(0, 58)}…</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Integrations */}
          <div style={{ ...S.card, padding: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Wifi size={13} color="#4ADE80" />
                <span style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 14 }}>Integrações</span>
              </div>
              <span style={{ fontSize: 11, color: "#4ADE80", fontWeight: 700 }}>{integOnline}/{mockIntegracoes.length} online</span>
            </div>
            {mockIntegracoes.slice(0, 5).map((integ, i) => (
              <IntegRow key={i} integ={integ} />
            ))}
            <button onClick={() => navigate("/compliance")} style={{
              marginTop: 10, width: "100%", padding: "6px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 7, color: "#64748B", cursor: "pointer", fontSize: 11,
            }}>
              Ver todas →
            </button>
          </div>

          {/* Top Corban — with ranking medals */}
          <div style={{ ...S.card, padding: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Crown size={13} color="#FFD700" />
                <span style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 14 }}>Top Corban</span>
              </div>
              <button onClick={() => navigate("/corban")} style={{ background: "none", border: "none", color: "#6366F1", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                Ranking →
              </button>
            </div>
            {[...mockCorbans].sort((a, b) => b.comissaoMes - a.comissaoMes).slice(0, 4).map((c, i) => {
              const medals = ["🥇", "🥈", "🥉", "4️⃣"];
              const nivelColors = { Diamante: "#00BFFF", Ouro: "#FFD700", Prata: "#C0C0C0", Bronze: "#CD7F32" };
              const nc = nivelColors[c.nivel] || "#818CF8";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
                  <span style={{ fontSize: 14, width: 20, textAlign: "center", flexShrink: 0 }}>{medals[i]}</span>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: nc + "22", border: `1.5px solid ${nc}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 900, color: nc,
                    boxShadow: `0 0 8px ${nc}33`, flexShrink: 0,
                  }}>
                    {c.nome.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#CBD5E1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.nome}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{c.contratos} contratos · {c.nivel}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 900, color: "#4ADE80", flexShrink: 0 }}>{fmt(c.comissaoMes)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
