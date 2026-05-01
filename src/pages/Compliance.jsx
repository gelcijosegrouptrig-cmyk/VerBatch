// VerbaTech — Compliance & IA (Production Polish v2 — Gauge + Live Pulse + Risk Bars)
import { useState, useEffect } from "react";
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Zap, Clock,
  TrendingDown, TrendingUp, FileText, Lock, Activity, BarChart2,
  Brain, AlertCircle, ChevronRight, RefreshCw, Download, Cpu,
  Wifi, Database, Eye
} from "lucide-react";
import {
  mockIAEngine, mockAlertasIA, mockRegrasCompliance, mockAuditLog,
  mockIntegracoes, fmt, fmtDate
} from "../data/verbatechData";

const S = {
  page: { padding: 24 },
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};

const NIVEL_CFG = {
  critico:      { color: "#F87171", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)",   icon: XCircle,       label: "Crítico" },
  atencao:      { color: "#FCD34D", bg: "rgba(252,211,77,0.1)",  border: "rgba(252,211,77,0.3)",  icon: AlertTriangle, label: "Atenção" },
  oportunidade: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.3)",  icon: TrendingUp,    label: "Oportunidade" },
  info:         { color: "#38BDF8", bg: "rgba(56,189,248,0.1)",  border: "rgba(56,189,248,0.3)",  icon: AlertCircle,   label: "Info" },
};
const INTEG_CFG = {
  online:     { color: "#4ADE80", bg: "rgba(74,222,128,0.1)",  label: "Online",     pulse: true },
  parcial:    { color: "#FCD34D", bg: "rgba(252,211,77,0.1)",  label: "Parcial",    pulse: false },
  manutencao: { color: "#F87171", bg: "rgba(248,113,113,0.1)", label: "Manutenção", pulse: false },
};

/* ── Animated bar ─────────────────────────────── */
function AnimBar({ pct, color, height = 6, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: height }}>
      <div style={{
        height: "100%", width: `${w}%`, borderRadius: height,
        background: color, transition: "width 0.9s cubic-bezier(.4,0,.2,1)",
        boxShadow: `0 0 6px ${color}66`,
      }} />
    </div>
  );
}

/* ── SVG Half-circle Gauge ────────────────────── */
function AIGauge({ value, size = 140 }) {
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  const color = value >= 90 ? "#4ADE80" : value >= 75 ? "#FCD34D" : "#F87171";
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let frame;
    const dur = 1200;
    let start = null;
    const run = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setAnim(ease * value);
      if (p < 1) frame = requestAnimationFrame(run);
    };
    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const cx = size / 2, cy = size / 2;
  const animPct = anim / 100;

  return (
    <div style={{ position: "relative", width: size, height: size / 2 + 20 }}>
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, transform: "rotate(180deg)" }}>
        {/* track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth="9"
          strokeDasharray={`${circ * 0.5} ${circ * 0.5}`}
          strokeLinecap="round"
        />
        {/* fill */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="9"
          strokeDasharray={`${circ * 0.5} ${circ * 0.5}`}
          strokeDashoffset={circ * 0.5 * (1 - animPct)}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}99)`, transition: "stroke 0.3s" }}
        />
      </svg>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1, letterSpacing: -1 }}>
          {Math.round(anim)}%
        </div>
        <div style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>
          Acurácia IA
        </div>
      </div>
    </div>
  );
}

/* ── Live Pulse Dot ───────────────────────────── */
function PulseDot({ color = "#4ADE80", size = 8 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: color + "33",
        animation: "anim-blink 1.5s ease-in-out infinite",
        transform: "scale(2)",
      }} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: color, boxShadow: `0 0 6px ${color}`,
        animation: "anim-blink 1.5s ease-in-out infinite",
      }} />
    </div>
  );
}

/* ── IA Engine Card ───────────────────────────── */
function IAEngineCard() {
  const { totalAnalises, taxaAprovacao, taxaRejeicao, acuracia, riskModels } = mockIAEngine;
  const models = riskModels || [
    { nome: "Score INSS", acuracia: 94.2, tipo: "gradient_boost" },
    { nome: "Fraude Docs", acuracia: 97.8, tipo: "neural_net" },
    { nome: "Capacidade", acuracia: 91.5, tipo: "regression" },
    { nome: "Risco Corban", acuracia: 88.7, tipo: "ensemble" },
  ];

  return (
    <div style={{ ...S.card, padding: 22 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15))",
            border: "1px solid rgba(99,102,241,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(99,102,241,0.2)",
          }}>
            <Brain size={20} color="#818CF8" />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 16 }}>Engine de IA</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <PulseDot color="#4ADE80" size={7} />
              <span style={{ fontSize: 11, color: "#4ADE80", fontWeight: 700 }}>Ativo — Analisando em tempo real</span>
            </div>
          </div>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8, padding: "6px 12px", color: "#64748B", cursor: "pointer", fontSize: 11,
        }}>
          <RefreshCw size={11} /> Atualizar
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "center" }}>
        {/* Gauge */}
        <AIGauge value={acuracia} size={140} />

        {/* Metrics */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Total Análises", value: totalAnalises.toLocaleString("pt-BR"), color: "#818CF8" },
              { label: "Taxa Aprovação", value: `${taxaAprovacao}%`, color: "#4ADE80" },
              { label: "Taxa Rejeição", value: `${taxaRejeicao}%`, color: "#F87171" },
              { label: "Tempo médio", value: "1.2s", color: "#FCD34D" },
            ].map((m, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: "10px 13px",
              }}>
                <div style={{ ...S.label, marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Approval/rejection bars */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>Aprovação</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#4ADE80" }}>{taxaAprovacao}%</span>
            </div>
            <AnimBar pct={taxaAprovacao} color="#4ADE80" delay={0} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>Rejeição</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#F87171" }}>{taxaRejeicao}%</span>
            </div>
            <AnimBar pct={taxaRejeicao} color="#F87171" delay={150} />
          </div>
        </div>
      </div>

      {/* Risk models */}
      <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
        <div style={{ ...S.label, marginBottom: 12 }}>Modelos de Risco</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {models.map((m, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#CBD5E1" }}>{m.nome}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: m.acuracia >= 95 ? "#4ADE80" : m.acuracia >= 90 ? "#FCD34D" : "#F87171" }}>{m.acuracia}%</span>
              </div>
              <AnimBar pct={m.acuracia} color={m.acuracia >= 95 ? "#4ADE80" : m.acuracia >= 90 ? "#FCD34D" : "#F87171"} height={4} delay={i * 120} />
              <div style={{ fontSize: 9, color: "#334155", marginTop: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{m.tipo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Alert Card ───────────────────────────────── */
function AlertaCard({ alerta, idx }) {
  const cfg = NIVEL_CFG[alerta.nivel] || NIVEL_CFG.info;
  const Icon = cfg.icon;
  const isCritical = alerta.nivel === "critico";

  return (
    <div style={{
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: 12, padding: "14px 16px",
      transition: "all 0.15s",
      position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = cfg.color + "66"}
      onMouseLeave={e => e.currentTarget.style.borderColor = cfg.border}
    >
      {isCritical && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          width: 8, height: 8, borderRadius: "50%",
          background: "#F87171",
          animation: "anim-blink 1s ease-in-out infinite",
          boxShadow: "0 0 8px rgba(248,113,113,0.7)",
        }} />
      )}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
          background: cfg.color + "22",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 10px ${cfg.color}33`,
        }}>
          <Icon size={16} color={cfg.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>{alerta.cliente}</span>
            <span style={{ fontSize: 10, color: cfg.color, fontWeight: 700, background: cfg.color + "22", borderRadius: 6, padding: "1px 7px" }}>
              {cfg.label}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5, marginBottom: 6 }}>{alerta.mensagem}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={10} /> {alerta.tempo}
            </span>
            {alerta.scoreIA && (
              <span style={{ fontSize: 10, color: "#818CF8", display: "flex", alignItems: "center", gap: 4 }}>
                <Cpu size={10} /> Score: {alerta.scoreIA}
              </span>
            )}
            <button style={{
              marginLeft: "auto", background: "none", border: `1px solid ${cfg.color}44`,
              borderRadius: 6, padding: "2px 9px", cursor: "pointer", color: cfg.color, fontSize: 10, fontWeight: 700,
            }}>
              Revisar →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Rules Table ──────────────────────────────── */
function RegrasTable({ regras }) {
  return (
    <div style={{ ...S.card, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 9 }}>
        <Lock size={14} color="#6366F1" />
        <span style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 14 }}>Regras Ativas</span>
        <span style={{ background: "rgba(99,102,241,0.15)", color: "#818CF8", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{regras.length}</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {["Regra", "Parâmetro", "Base Legal", "Status"].map(h => (
              <th key={h} style={{ padding: "8px 16px", textAlign: "left", ...S.label }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {regras.map((r, i) => (
            <tr key={i}
              style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "default" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <td style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, color: "#CBD5E1" }}>{r.nome}</td>
              <td style={{ padding: "10px 16px", fontSize: 12, color: "#A78BFA", fontWeight: 700 }}>{r.limite}</td>
              <td style={{ padding: "10px 16px", fontSize: 11, color: "#64748B" }}>{r.baseLegal}</td>
              <td style={{ padding: "10px 16px" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: r.ativo ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                  color: r.ativo ? "#4ADE80" : "#F87171",
                  borderRadius: 20, padding: "3px 9px", fontSize: 10, fontWeight: 700,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                  {r.ativo ? "Ativo" : "Inativo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Audit Log ────────────────────────────────── */
function AuditLog({ logs }) {
  return (
    <div style={{ ...S.card, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <FileText size={14} color="#06B6D4" />
          <span style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 14 }}>Audit Log</span>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "none", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 7, padding: "5px 10px", color: "#64748B", cursor: "pointer", fontSize: 11,
        }}>
          <Download size={11} /> Exportar
        </button>
      </div>
      {logs.map((log, i) => {
        const statusColor = log.status === "success" ? "#4ADE80" : log.status === "warning" ? "#FCD34D" : "#F87171";
        return (
          <div key={i} style={{
            display: "flex", gap: 12, padding: "11px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            alignItems: "flex-start",
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: statusColor + "18",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {log.status === "success"
                ? <CheckCircle size={13} color={statusColor} />
                : log.status === "warning"
                  ? <AlertTriangle size={13} color={statusColor} />
                  : <XCircle size={13} color={statusColor} />
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1" }}>{log.acao}</div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>
                {log.usuario} · {fmtDate(log.data)} · {log.ip}
              </div>
            </div>
            <span style={{
              background: statusColor + "18", color: statusColor,
              borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700, flexShrink: 0,
            }}>
              {log.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Integrations Status ──────────────────────── */
function IntegracoesStatus({ integs }) {
  return (
    <div style={{ ...S.card, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
        <Wifi size={14} color="#4ADE80" />
        <span style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 14 }}>Status Integrações</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#4ADE80", fontWeight: 700 }}>
          {integs.filter(i => i.status === "online").length}/{integs.length} online
        </span>
      </div>
      {integs.map((integ, i) => {
        const cfg = INTEG_CFG[integ.status] || INTEG_CFG.online;
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.02)", borderRadius: 10, marginBottom: 8,
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {cfg.pulse
                ? <PulseDot color={cfg.color} size={8} />
                : <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color }} />
              }
            </div>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: cfg.color + "18", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Database size={13} color={cfg.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#CBD5E1" }}>{integ.nome}</div>
              <div style={{ fontSize: 10, color: "#475569" }}>{integ.tipo}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: cfg.color, fontWeight: 700 }}>{cfg.label}</div>
              <div style={{ fontSize: 10, color: "#475569" }}>{integ.latencia}ms</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main ─────────────────────────────────────── */
export default function Compliance() {
  const [tab, setTab] = useState("alertas"); // alertas | regras | audit

  const critCount = mockAlertasIA.filter(a => a.nivel === "critico").length;
  const atentCount = mockAlertasIA.filter(a => a.nivel === "atencao").length;
  const oppCount = mockAlertasIA.filter(a => a.nivel === "oportunidade").length;

  const kpis = [
    { label: "Alertas Críticos", value: critCount, color: "#F87171" },
    { label: "Em Atenção",       value: atentCount, color: "#FCD34D" },
    { label: "Oportunidades",    value: oppCount,   color: "#4ADE80" },
    { label: "Regras Ativas",    value: mockRegrasCompliance.filter(r => r.ativo).length, color: "#818CF8" },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Compliance & IA</h1>
          <p style={{ color: "#64748B", fontSize: 13 }}>Motor de análise · Alertas em tempo real · Audit log · LGPD/BACEN</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <PulseDot color="#4ADE80" size={8} />
          <span style={{ fontSize: 12, color: "#4ADE80", fontWeight: 700 }}>Sistema Ativo</span>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ ...S.card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 5 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

        {/* Left: IA Engine + Tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <IAEngineCard />

          {/* Tabs */}
          <div style={{ ...S.card, overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 18px" }}>
              {[
                { key: "alertas", label: `Alertas (${mockAlertasIA.length})` },
                { key: "regras",  label: "Regras" },
                { key: "audit",   label: "Audit Log" },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  padding: "12px 18px", background: "none", border: "none",
                  borderBottom: `2px solid ${tab === t.key ? "#6366F1" : "transparent"}`,
                  color: tab === t.key ? "#F1F5F9" : "#64748B",
                  cursor: "pointer", fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
                  marginBottom: -1, transition: "all 0.15s",
                }}>
                  {tab === t.key && t.key === "alertas" && critCount > 0 && (
                    <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#F87171", marginRight: 6, boxShadow: "0 0 6px rgba(248,113,113,0.7)", animation: "anim-blink 1.2s ease-in-out infinite" }} />
                  )}
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "alertas" && (
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {mockAlertasIA.map((a, i) => <AlertaCard key={i} alerta={a} idx={i} />)}
              </div>
            )}
            {tab === "regras" && (
              <div style={{ padding: 0 }}>
                <RegrasTable regras={mockRegrasCompliance} />
              </div>
            )}
            {tab === "audit" && (
              <div>
                <AuditLog logs={mockAuditLog} />
              </div>
            )}
          </div>
        </div>

        {/* Right: Integrations */}
        <div>
          <IntegracoesStatus integs={mockIntegracoes} />
        </div>
      </div>
    </div>
  );
}
