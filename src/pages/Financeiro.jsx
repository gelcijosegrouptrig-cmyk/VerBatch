// VerbaTech — Financeiro (Production Polish v2 — VBT Card + Sparklines + Full UX)
import { useState, useEffect } from "react";
import {
  DollarSign, ArrowUpRight, ArrowDownLeft, TrendingUp, CreditCard,
  Send, QrCode, Receipt, RefreshCw, Download, Eye, EyeOff,
  Zap, BarChart2, ChevronRight, Clock, CheckCircle, Wifi, Copy,
  Sparkles, ArrowRight, TrendingDown
} from "lucide-react";
import {
  mockSession, mockContaDigital, mockExtrato, mockComissoes, mockKPIs,
  mockGraficoProducao, fmt, fmtDate
} from "../data/verbatechData";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const S = {
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};
const CAT_COLORS = {
  comissao: "#4ADE80", repasse: "#38BDF8", antecipacao: "#A78BFA",
  rendimento: "#FCD34D", transferencia: "#F87171", operacional: "#94A3B8", cartao: "#FB923C",
};

/* ── Micro Sparkline ─────────────────────────── */
function Spark({ data, color, h = 32, w = 64 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const lx = (w - pad).toFixed(1);
  const ly = (h - pad - ((data[data.length - 1] - min) / range) * (h - pad * 2)).toFixed(1);
  const gid = `sf${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${pad},${h} ${pts} ${lx},${h}`} fill={`url(#${gid})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
      <circle cx={lx} cy={ly} r="2.5" fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
    </svg>
  );
}

/* ── VBT Physical Card ────────────────────────── */
function VBTCard({ show, onToggle }) {
  const [copied, setCopied] = useState(false);
  const num = mockContaDigital.numero || "0000 1234 5678 9999";
  const maskedNum = show ? num : "•••• •••• •••• " + num.slice(-4);

  const handleCopy = () => {
    navigator.clipboard?.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #0D1836 0%, #1a1060 45%, #0A1E3D 100%)",
      border: "1px solid rgba(99,102,241,0.35)",
      borderRadius: 20, padding: "26px 28px",
      position: "relative", overflow: "hidden",
      boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)",
      minHeight: 200,
    }}>
      {/* Decorative orbs */}
      <div style={{ position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -50, left: 10, width: 170, height: 170, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      {/* Grid pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

      <div style={{ position: "relative" }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div style={{
            width: 40, height: 31, borderRadius: 5,
            background: "linear-gradient(135deg, #d4af37, #f5e68a, #c9a227)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 800, letterSpacing: 1 }}>
              VERBA<span style={{ color: "#818CF8" }}>TECH</span>
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: 1.5, marginTop: 1 }}>CONTA DIGITAL</div>
          </div>
        </div>

        {/* Balance */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: 0.8, marginBottom: 4, textTransform: "uppercase" }}>Saldo Disponível</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#F1F5F9", letterSpacing: -1 }}>
            {show ? fmt(mockContaDigital.saldo) : "R$ ••••••"}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
            <span style={{ fontSize: 11, color: "#4ADE80" }}>+{fmt(mockSession.comissaoPendente)} pendente</span>
            <span style={{ fontSize: 11, color: "#FCD34D" }}>+{fmt(mockContaDigital.rendimentoDia)} hoje</span>
          </div>
        </div>

        {/* Card number + controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: 3, fontFamily: "monospace" }}>
              {maskedNum}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
              {mockSession.name.toUpperCase()}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onToggle} style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "rgba(255,255,255,0.6)",
              display: "flex", alignItems: "center", gap: 5, fontSize: 11,
            }}>
              {show ? <EyeOff size={12} /> : <Eye size={12} />}
              {show ? "Ocultar" : "Revelar"}
            </button>
            <button onClick={handleCopy} style={{
              background: copied ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.08)",
              border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 8, padding: "6px 10px", cursor: "pointer",
              color: copied ? "#4ADE80" : "rgba(255,255,255,0.6)",
              display: "flex", alignItems: "center", gap: 5, fontSize: 11, transition: "all 0.2s",
            }}>
              <Copy size={12} /> {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Quick Action Button ──────────────────────── */
function ActionBtn({ icon: Icon, label, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12, padding: "14px 10px", cursor: "pointer", flex: 1, minWidth: 70,
      transition: "all 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = color + "14"; e.currentTarget.style.borderColor = color + "33"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: color + "18", border: `1px solid ${color}28`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={17} color={color} />
      </div>
      <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textAlign: "center" }}>{label}</span>
    </button>
  );
}

/* ── Statement row ────────────────────────────── */
function StatementRow({ tx }) {
  const credit = tx.tipo === "credito";
  const color = CAT_COLORS[tx.categoria] || "#94A3B8";
  const Icon = credit ? ArrowDownLeft : ArrowUpRight;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 18px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      transition: "background 0.1s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: color + "18", border: `1px solid ${color}28`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={15} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.descricao}</div>
        <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>{fmtDate(tx.data)} · {tx.categoria}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: credit ? "#4ADE80" : "#F87171" }}>
          {credit ? "+" : "−"}{fmt(Math.abs(tx.valor))}
        </div>
        {tx.sparkline && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Spark data={tx.sparkline} color={credit ? "#4ADE80" : "#F87171"} h={16} w={40} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Commission Row ───────────────────────────── */
function CommRow({ item }) {
  const pct = (item.valor / (mockKPIs?.comissaoMes?.valor || 25000)) * 100;
  return (
    <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>{item.origem}</div>
          <div style={{ fontSize: 10, color: "#475569" }}>{fmtDate(item.data)} · {item.contratos} contratos</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#4ADE80" }}>{fmt(item.valor)}</div>
          <div style={{ fontSize: 10, color: item.status === "pago" ? "#4ADE80" : "#FCD34D" }}>
            {item.status === "pago" ? "✓ Pago" : "⏳ Pendente"}
          </div>
        </div>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
        <div style={{
          height: "100%", width: `${Math.min(pct, 100)}%`, borderRadius: 4,
          background: item.status === "pago" ? "#4ADE80" : "#FCD34D",
          boxShadow: `0 0 5px ${item.status === "pago" ? "#4ADE80" : "#FCD34D"}66`,
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

/* ── Custom Tooltip ───────────────────────────── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0F1729", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#64748B", marginBottom: 6, fontWeight: 700 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 800 }}>{p.name}: {fmt(p.value)}</div>
      ))}
    </div>
  );
}

/* ── Main ─────────────────────────────────────── */
export default function Financeiro({ showBalance: propShow }) {
  const [show, setShow] = useState(true);
  const [tab, setTab] = useState("extrato");

  const commMes = mockComissoes?.mes || [];
  const commData = commMes.map(m => ({ mes: m.mes, comissao: m.comissao, producao: m.producao }));
  const spark6 = commMes.map(m => m.comissao);

  const statsSummary = [
    { label: "Comissão/mês", value: fmt(mockSession.comissaoMes), sub: "+9.6% vs mar", color: "#4ADE80", spark: spark6 },
    { label: "Comissão/ano", value: fmt(mockSession.comissaoAno), sub: "+18.4% vs 2024", color: "#818CF8", spark: spark6.map(v => v * 8.5) },
    { label: "Saldo conta", value: show ? fmt(mockContaDigital.saldo) : "R$ ••••", sub: `Rend. hoje: +${fmt(mockContaDigital.rendimentoDia)}`, color: "#38BDF8", spark: null },
    { label: "Pend. liquidar", value: fmt(mockSession.comissaoPendente), sub: "Próx. liquidação: 05/05", color: "#FCD34D", spark: null },
  ];

  return (
    <div className="page">

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Financeiro</h1>
        <p style={{ color: "#64748B", fontSize: 13 }}>Conta digital · Comissões · Split automático · PIX/TED · Extrato</p>
      </div>

      {/* Top grid: Card + Actions + Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Left: VBT Card + Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <VBTCard show={show} onToggle={() => setShow(s => !s)} />

          {/* Quick Actions */}
          <div style={{ ...S.card, padding: 16 }}>
            <div style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Ações Rápidas</div>
            <div style={{ display: "flex", gap: 8 }}>
              <ActionBtn icon={QrCode} label="PIX" color="#6366F1" />
              <ActionBtn icon={Send} label="TED" color="#06B6D4" />
              <ActionBtn icon={Receipt} label="Boleto" color="#F59E0B" />
              <ActionBtn icon={Zap} label="Antecipar" color="#4ADE80" />
              <ActionBtn icon={RefreshCw} label="Recarregar" color="#A78BFA" />
            </div>
          </div>

          {/* Limits */}
          <div style={{ ...S.card, padding: 16 }}>
            <div style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>Limites Diários</div>
            {[
              { label: "PIX", usado: 12500, total: 50000, color: "#6366F1" },
              { label: "TED", usado: 5000, total: 20000, color: "#06B6D4" },
              { label: "Cartão VBT", usado: 2300, total: 10000, color: "#F59E0B" },
            ].map((l, i) => {
              const pct = (l.usado / l.total) * 100;
              return (
                <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>{l.label}</span>
                    <span style={{ fontSize: 11, color: "#475569" }}>
                      <span style={{ color: l.color, fontWeight: 700 }}>{fmt(l.usado)}</span> / {fmt(l.total)}
                    </span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 5 }}>
                    <div style={{
                      height: "100%", width: `${pct}%`, borderRadius: 5,
                      background: pct > 80 ? "#F87171" : l.color,
                      transition: "width 0.6s ease",
                      boxShadow: `0 0 6px ${pct > 80 ? "#F87171" : l.color}66`,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Stats cards + chart */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {statsSummary.map((s, i) => (
              <div key={i} style={{ ...S.card, padding: "14px 16px" }}>
                <div style={{ fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>{s.label}</div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: s.color }}>{s.value}</div>
                  {s.spark && <Spark data={s.spark} color={s.color} h={28} w={54} />}
                </div>
                <div style={{ fontSize: 10, color: "#475569" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{ ...S.card, padding: 18, flex: 1 }}>
            <div style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 14, marginBottom: 3 }}>Produção vs Comissão</div>
            <div style={{ fontSize: 11, color: "#64748B", marginBottom: 14 }}>Últimos 6 meses</div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={commData}>
                <defs>
                  <linearGradient id="gFP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gFC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="producao" name="Produção" stroke="#6366F1" strokeWidth={2} fill="url(#gFP)" />
                <Area type="monotone" dataKey="comissao" name="Comissão" stroke="#4ADE80" strokeWidth={2} fill="url(#gFC)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom: Tabs — Extrato / Comissões */}
      <div style={{ ...S.card, overflow: "hidden" }}>
        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 18px" }}>
          {[
            { key: "extrato", label: "Extrato" },
            { key: "comissoes", label: "Comissões" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "13px 18px", background: "none", border: "none",
              borderBottom: `2px solid ${tab === t.key ? "#6366F1" : "transparent"}`,
              color: tab === t.key ? "#F1F5F9" : "#64748B",
              cursor: "pointer", fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
              marginBottom: -1, transition: "all 0.15s",
            }}>
              {t.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button style={{
            display: "flex", alignItems: "center", gap: 5, margin: "8px 0",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "5px 12px", color: "#64748B", cursor: "pointer", fontSize: 11,
          }}>
            <Download size={12} /> Exportar CSV
          </button>
        </div>

        {tab === "extrato" && (
          <div>
            {mockExtrato.map((tx, i) => (
              <StatementRow key={i} tx={tx} />
            ))}
          </div>
        )}
        {tab === "comissoes" && (
          <div>
            {mockComissoes?.detalhes?.map((item, i) => (
              <CommRow key={i} item={item} />
            )) || (
              <div style={{ padding: 24, textAlign: "center", color: "#475569" }}>
                Nenhuma comissão registrada
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
