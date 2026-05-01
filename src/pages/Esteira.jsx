// VerbaTech — Esteira de Crédito (Production Polish v2 — OCR/Biometrics + Kanban Bars)
import { useState, useEffect } from "react";
import {
  FileText, Search, CheckCircle, XCircle, AlertTriangle, Eye, Upload,
  Zap, Plus, ScanLine, TrendingUp, DollarSign, Camera, Brain,
  Clock, ArrowRight, ChevronRight, Filter, Download, RefreshCw,
  Shield, Lock, Fingerprint, Cpu, Users, BarChart2, ChevronDown
} from "lucide-react";
import { mockPropostas, statusColors, statusFlow, fmt, fmtDate } from "../data/verbatechData";

/* ── tokens ─────────────────────────────────── */
const S = {
  page: { padding: 24, minHeight: "100vh", background: "#080E1A" },
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};

/* ── Animated bar ─────────────────────────────── */
function AnimBar({ pct, color, height = 5, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 80 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: height }}>
      <div style={{
        height: "100%", width: `${w}%`, borderRadius: height,
        background: color, transition: "width 0.85s cubic-bezier(.4,0,.2,1)",
        boxShadow: `0 0 5px ${color}66`,
      }} />
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
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, display: "inline-block", boxShadow: `0 0 4px ${cfg.dot}` }} />
      {status}
    </span>
  );
}

/* ── IA Score badge ──────────────────────────── */
function IaScore({ score }) {
  if (score === null || score === undefined) return <span style={{ color: "#475569", fontSize: 12 }}>—</span>;
  const color = score >= 80 ? "#4ADE80" : score >= 60 ? "#FCD34D" : "#F87171";
  const bg = color + "18";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: bg, borderRadius: 8, padding: "3px 9px" }}>
      <Cpu size={10} color={color} />
      <span style={{ fontSize: 12, fontWeight: 900, color }}>{score}</span>
    </span>
  );
}

/* ── Doc Checklist ───────────────────────────── */
function DocChecklist({ docs }) {
  const labels = { rg: "RG / CNH", cpf: "CPF", compRenda: "Comp. Renda", selfie: "Selfie / Biometria" };
  const icons  = { rg: Shield, cpf: FileText, compRenda: DollarSign, selfie: Camera };
  const entries = Object.entries(docs);
  const done = entries.filter(([, v]) => v).length;
  const pct  = Math.round((done / entries.length) * 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 700 }}>Checklist Documentos</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: done === entries.length ? "#4ADE80" : "#FCD34D" }}>{done}/{entries.length}</span>
      </div>
      <div style={{ marginBottom: 12 }}>
        <AnimBar pct={pct} color={done === entries.length ? "#4ADE80" : "#FCD34D"} height={4} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {entries.map(([k, ok]) => {
          const Icon = icons[k] || FileText;
          return (
            <div key={k} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 12px",
              background: ok ? "rgba(74,222,128,0.05)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${ok ? "rgba(74,222,128,0.18)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 9, transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: ok ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {ok ? <CheckCircle size={14} color="#4ADE80" /> : <Icon size={14} color="#475569" />}
                </div>
                <span style={{ fontSize: 13, color: ok ? "#CBD5E1" : "#94A3B8", fontWeight: ok ? 600 : 400 }}>{labels[k]}</span>
              </div>
              {ok
                ? <span style={{ fontSize: 10, color: "#4ADE80", fontWeight: 700 }}>✓ OK</span>
                : <button style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 6, padding: "3px 9px", cursor: "pointer", color: "#818CF8", fontSize: 10,
                }}>
                  <Upload size={10} /> Enviar
                </button>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Step Timeline ───────────────────────────── */
function StepTimeline({ status }) {
  const idx = statusFlow.indexOf(status);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {statusFlow.map((s, i) => {
        const done    = i < idx;
        const active  = i === idx;
        const pending = i > idx;
        const cfg = statusColors[s] || statusColors["Digitação"];
        const color = done ? "#4ADE80" : active ? cfg.dot : "rgba(255,255,255,0.12)";
        return (
          <div key={s} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            {/* Dot + line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                background: color,
                boxShadow: active ? `0 0 8px ${color}` : "none",
                animation: active ? "anim-blink 2s ease-in-out infinite" : "none",
                border: pending ? "1.5px solid rgba(255,255,255,0.12)" : "none",
              }} />
              {i < statusFlow.length - 1 && (
                <div style={{
                  width: 1.5, height: 22,
                  background: done ? "#4ADE80" : "rgba(255,255,255,0.07)",
                  margin: "3px 0",
                }} />
              )}
            </div>
            {/* Label */}
            <div style={{ paddingBottom: i < statusFlow.length - 1 ? 0 : 0, paddingTop: 0 }}>
              <span style={{
                fontSize: 11, fontWeight: active ? 700 : done ? 600 : 400,
                color: active ? "#F1F5F9" : done ? "#4ADE80" : "#334155",
              }}>{s}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── OCR/Biometrics Visual ───────────────────── */
function BiometricsBadge({ docs }) {
  const selfieOk = docs?.selfie;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 12px",
      background: selfieOk ? "rgba(74,222,128,0.06)" : "rgba(99,102,241,0.06)",
      border: `1px solid ${selfieOk ? "rgba(74,222,128,0.2)" : "rgba(99,102,241,0.2)"}`,
      borderRadius: 10,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: selfieOk ? "rgba(74,222,128,0.12)" : "rgba(99,102,241,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selfieOk ? <Fingerprint size={15} color="#4ADE80" /> : <Camera size={15} color="#818CF8" />}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: selfieOk ? "#4ADE80" : "#818CF8" }}>
          {selfieOk ? "Biometria Confirmada" : "Biometria Pendente"}
        </div>
        <div style={{ fontSize: 9, color: "#475569" }}>
          {selfieOk ? "Selfie + liveness check ✓" : "Aguardando selfie do cliente"}
        </div>
      </div>
    </div>
  );
}

/* ── OCR Status ──────────────────────────────── */
function OcrStatus({ docs }) {
  const rgOk = docs?.rg;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 12px",
      background: rgOk ? "rgba(56,189,248,0.06)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${rgOk ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 10,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: rgOk ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ScanLine size={15} color={rgOk ? "#38BDF8" : "#475569"} />
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: rgOk ? "#38BDF8" : "#64748B" }}>
          {rgOk ? "OCR Concluído" : "OCR Pendente"}
        </div>
        <div style={{ fontSize: 9, color: "#475569" }}>
          {rgOk ? "Dados extraídos automaticamente" : "Aguardando documento"}
        </div>
      </div>
    </div>
  );
}

/* ── AI Analysis Panel ────────────────────────── */
function AIAnalysis({ proposta }) {
  const score = proposta.scoreIA;
  const color = score >= 80 ? "#4ADE80" : score >= 60 ? "#FCD34D" : "#F87171";
  const bg    = color + "08";
  const border = color + "28";
  const label  = score >= 80 ? "Alta probabilidade de aprovação" : score >= 60 ? "Análise moderada" : "Requer revisão manual";
  const risks = [
    { label: "Capacidade pagto.", pct: Math.min(100, score + 5), color: "#4ADE80" },
    { label: "Risco documental",  pct: Math.max(10, 100 - score + 10), color: "#F87171" },
    { label: "Score bureau",      pct: score - 2, color: "#818CF8" },
    { label: "Consistência dados",pct: score + 3, color: "#38BDF8" },
  ];
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Brain size={15} color={color} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#F1F5F9" }}>Análise IA — Score {score}</div>
          <div style={{ fontSize: 10, color: "#475569" }}>{label}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 24, fontWeight: 900, color }}>{score}</div>
      </div>
      {risks.map((r, i) => (
        <div key={i} style={{ marginBottom: 9 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>{r.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{Math.min(100, Math.max(0, r.pct))}%</span>
          </div>
          <AnimBar pct={Math.min(100, Math.max(0, r.pct))} color={r.color} height={4} delay={i * 80} />
        </div>
      ))}
    </div>
  );
}

/* ── Kanban Column ───────────────────────────── */
function KanbanCol({ status, propostas, onSelect }) {
  const cfg = statusColors[status] || statusColors["Digitação"];
  const total = propostas.reduce((a, p) => a + p.valor, 0);
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12, padding: 12, minWidth: 200, maxWidth: 240, flex: "0 0 220px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 5px ${cfg.dot}` }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#CBD5E1" }}>{status}</span>
        </div>
        <span style={{
          background: cfg.bg, color: cfg.text,
          borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700,
        }}>{propostas.length}</span>
      </div>
      {/* Column total bar */}
      {propostas.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: "#475569", marginBottom: 3 }}>
            Volume: <span style={{ color: cfg.dot, fontWeight: 700 }}>{fmt(total)}</span>
          </div>
          <AnimBar pct={(propostas.length / mockPropostas.length) * 100} color={cfg.dot} height={3} />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {propostas.slice(0, 4).map(p => (
          <div key={p.id} onClick={() => onSelect(p)} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 9, padding: "10px 12px", cursor: "pointer", transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.dot + "44"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "#CBD5E1", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.cliente}</div>
            <div style={{ fontSize: 11, color: "#A78BFA", fontWeight: 800, marginBottom: 4 }}>{fmt(p.valor)}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#475569" }}>{p.produto.split(" ")[0]}</span>
              <IaScore score={p.scoreIA} />
            </div>
          </div>
        ))}
        {propostas.length > 4 && (
          <div style={{ textAlign: "center", fontSize: 10, color: "#475569", padding: "4px 0" }}>+{propostas.length - 4} mais</div>
        )}
      </div>
    </div>
  );
}

/* ── Proposal Drawer ─────────────────────────── */
function PropostaDrawer({ proposta, onClose }) {
  const [tab, setTab] = useState("docs");
  if (!proposta) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
      zIndex: 1000, display: "flex", justifyContent: "flex-end",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: 460, height: "100%", background: "#0C1424",
        borderLeft: "1px solid rgba(99,102,241,0.25)",
        overflowY: "auto", padding: 24,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#F1F5F9" }}>{proposta.cliente}</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{proposta.id} · {fmtDate(proposta.data)}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>✕</button>
        </div>

        {/* Key metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Valor", value: fmt(proposta.valor), color: "#A78BFA" },
            { label: "Produto", value: proposta.produto, color: "#06B6D4" },
            { label: "Agente", value: proposta.agente.split(" ")[0], color: "#FCD34D" },
          ].map((m, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: m.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Status pill + timeline */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 10 }}><StatusPill status={proposta.status} /></div>
            <StepTimeline status={proposta.status} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 180 }}>
            <BiometricsBadge docs={proposta.docs} />
            <OcrStatus docs={proposta.docs} />
          </div>
        </div>

        {/* AI analysis */}
        {proposta.scoreIA && (
          <div style={{ marginBottom: 20 }}>
            <AIAnalysis proposta={proposta} />
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 16 }}>
          {[
            { key: "docs", label: "Documentos" },
            { key: "detalhes", label: "Detalhes" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "9px 16px", background: "none", border: "none",
              borderBottom: `2px solid ${tab === t.key ? "#6366F1" : "transparent"}`,
              color: tab === t.key ? "#F1F5F9" : "#64748B",
              cursor: "pointer", fontSize: 12, fontWeight: tab === t.key ? 700 : 500,
              marginBottom: -1,
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "docs" && <DocChecklist docs={proposta.docs} />}
        {tab === "detalhes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["CPF", proposta.cpf],
              ["Banco", proposta.banco],
              ["Prazo", proposta.prazo ? `${proposta.prazo}x` : "—"],
              ["Taxa", proposta.taxa ? `${proposta.taxa}% a.m.` : "—"],
              ["Parcela", proposta.parcela ? fmt(proposta.parcela) : "—"],
              ["Comissão", proposta.comissao ? fmt(proposta.comissao) : "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>{k}</span>
                <span style={{ fontSize: 13, color: "#CBD5E1", fontWeight: 600 }}>{v || "—"}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button style={{
            flex: 1, padding: "11px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13,
          }}>
            Avançar Etapa →
          </button>
          <button style={{
            padding: "11px 14px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
            borderRadius: 10, color: "#F87171", cursor: "pointer", fontWeight: 700, fontSize: 13,
          }}>
            Reprovar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Nova Proposta Modal ──────────────────────── */
function NovaModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [cpf, setCpf] = useState("");
  const [produto, setProduto] = useState("consignado_inss");
  const [valor, setValor] = useState(15000);

  const produtos = [
    { key: "consignado_inss",  label: "Consignado INSS",   color: "#6366F1" },
    { key: "antecipacao_fgts", label: "Antecipação FGTS",  color: "#10B981" },
    { key: "cartao_rmc",       label: "Cartão RMC",        color: "#F59E0B" },
    { key: "refinanciamento",  label: "Refinanciamento",   color: "#8B5CF6" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#0F1729", border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 18, padding: 28, width: 500, maxWidth: "95vw",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#F1F5F9" }}>Nova Proposta</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ fontSize: 12, color: "#475569", marginBottom: 20 }}>Passo {step} de 3</div>

        {/* Step bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {["Cliente", "Produto", "Dados"].map((s, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: i < step ? "#6366F1" : "rgba(255,255,255,0.08)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ ...S.label, display: "block", marginBottom: 6 }}>CPF do Cliente</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00"
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 9, padding: "10px 14px", color: "#F1F5F9", fontSize: 14, outline: "none",
                  }} />
                <button style={{
                  padding: "10px 16px", background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)", borderRadius: 9,
                  color: "#818CF8", cursor: "pointer", fontSize: 13, fontWeight: 700,
                }}>Consultar</button>
              </div>
            </div>
            {/* Simulated result */}
            {cpf.length >= 3 && (
              <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#4ADE80", marginBottom: 4 }}>✓ Cliente encontrado</div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>Maria Aparecida Silva · Benefício INSS</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Margem disponível: <strong style={{ color: "#A78BFA" }}>R$ 820,00</strong></div>
              </div>
            )}
          </div>
        )}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {produtos.map(p => (
              <button key={p.key} onClick={() => setProduto(p.key)} style={{
                padding: "12px 16px", borderRadius: 10,
                background: produto === p.key ? p.color + "18" : "rgba(255,255,255,0.03)",
                border: `1px solid ${produto === p.key ? p.color + "44" : "rgba(255,255,255,0.08)"}`,
                color: produto === p.key ? "#F1F5F9" : "#94A3B8",
                cursor: "pointer", textAlign: "left", fontWeight: produto === p.key ? 700 : 500,
                fontSize: 13, transition: "all 0.15s",
              }}>
                {produto === p.key && <span style={{ color: p.color, marginRight: 8 }}>●</span>}
                {p.label}
              </button>
            ))}
          </div>
        )}
        {step === 3 && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ ...S.label, display: "block", marginBottom: 6 }}>Valor solicitado</label>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>R$ 1.000</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#A78BFA" }}>{fmt(valor)}</span>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>R$ 80.000</span>
              </div>
              <input type="range" min={1000} max={80000} step={500} value={valor} onChange={e => setValor(+e.target.value)}
                style={{ width: "100%", accentColor: "#6366F1" }} />
            </div>
            <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>Parcela estimada</span>
                <span style={{ fontSize: 15, fontWeight: 900, color: "#4ADE80" }}>R$ {((valor / 60) * 1.018).toFixed(2).replace(".", ",")}/mês</span>
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>60x · Taxa 1.80% a.m. · Cabe na margem ✓</div>
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
            {step === 3 ? "✓ Criar Proposta" : "Próximo →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────── */
export default function Esteira() {
  const [viewMode, setViewMode] = useState("kanban"); // kanban | list
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProp, setSelectedProp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = mockPropostas.filter(p => {
    const matchS = p.cliente.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchF = statusFilter === "all" || p.status === statusFilter;
    return matchS && matchF;
  });

  const totalValor = filtered.reduce((a, p) => a + p.valor, 0);
  const avgScore   = Math.round(filtered.filter(p => p.scoreIA).reduce((a, p) => a + p.scoreIA, 0) / (filtered.filter(p => p.scoreIA).length || 1));

  const statusGroups = {};
  statusFlow.forEach(s => {
    statusGroups[s] = filtered.filter(p => p.status === s);
  });

  return (
    <div style={S.page}>
      {showModal   && <NovaModal onClose={() => setShowModal(false)} />}
      {selectedProp && <PropostaDrawer proposta={selectedProp} onClose={() => setSelectedProp(null)} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Esteira de Crédito</h1>
          <p style={{ color: "#64748B", fontSize: 13 }}>Pipeline Kanban · OCR automático · Biometria · Score IA</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13,
          boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
        }}>
          <Plus size={15} /> Nova Proposta
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total propostas",   value: filtered.length,                      color: "#6366F1" },
          { label: "Volume total",      value: fmt(totalValor),                      color: "#A78BFA" },
          { label: "Score IA médio",    value: avgScore,                             color: "#4ADE80" },
          { label: "Aprovadas mês",     value: filtered.filter(p => p.status === "Aprovado" || p.status === "Pago").length, color: "#FCD34D" },
        ].map((k, i) => (
          <div key={i} style={{ ...S.card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 5 }}>{k.label}</div>
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
            placeholder="Buscar por cliente ou ID…"
            style={{ background: "none", border: "none", color: "#F1F5F9", fontSize: 13, outline: "none", flex: 1 }} />
        </div>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
          background: "#0F1729", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 9, padding: "8px 12px", color: "#94A3B8", fontSize: 13, cursor: "pointer", outline: "none",
        }}>
          <option value="all">Todos status</option>
          {statusFlow.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* View toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, overflow: "hidden" }}>
          {[
            { key: "kanban", label: "Kanban" },
            { key: "list",   label: "Lista" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setViewMode(key)} style={{
              padding: "8px 14px", background: viewMode === key ? "rgba(99,102,241,0.2)" : "transparent",
              border: "none", color: viewMode === key ? "#818CF8" : "#475569",
              cursor: "pointer", fontSize: 12, fontWeight: viewMode === key ? 700 : 500,
            }}>
              {label}
            </button>
          ))}
        </div>

        <button style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 9, padding: "8px 12px", color: "#64748B", cursor: "pointer", fontSize: 12,
        }}>
          <Download size={13} /> Exportar
        </button>
      </div>

      {/* Kanban Board */}
      {viewMode === "kanban" && (
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12 }}>
          {statusFlow.map(s => (
            <KanbanCol key={s} status={s} propostas={statusGroups[s] || []} onSelect={setSelectedProp} />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div style={{ ...S.card, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["ID", "Cliente", "Produto", "Valor", "Prazo", "Score IA", "Agente", "Data", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", ...S.label }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}
                  onClick={() => setSelectedProp(p)}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "10px 16px", fontSize: 11, color: "#6366F1", fontWeight: 800 }}>{p.id.slice(-7)}</td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#CBD5E1", fontWeight: 600 }}>{p.cliente}</td>
                  <td style={{ padding: "10px 16px", fontSize: 11, color: "#94A3B8" }}>{p.produto}</td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#A78BFA", fontWeight: 800 }}>{fmt(p.valor)}</td>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: "#64748B" }}>{p.prazo ? `${p.prazo}x` : "—"}</td>
                  <td style={{ padding: "10px 16px" }}><IaScore score={p.scoreIA} /></td>
                  <td style={{ padding: "10px 16px", fontSize: 11, color: "#64748B" }}>{p.agente.split(" ")[0]}</td>
                  <td style={{ padding: "10px 16px", fontSize: 11, color: "#64748B" }}>{fmtDate(p.data)}</td>
                  <td style={{ padding: "10px 16px" }}><StatusPill status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
