// VerbaTech — CCB (Cédula de Crédito Bancário) + Formalização Digital
import { useState, useEffect } from "react";
import {
  FileText, CheckCircle, Clock, XCircle, AlertTriangle, Shield,
  Camera, Fingerprint, Send, Download, Eye, Search, Filter,
  ChevronRight, Zap, RefreshCw, QrCode, Smartphone, User,
  Building2, DollarSign, Calendar, Lock, Wifi, WifiOff,
  ArrowRight, BarChart2, Globe, Activity,
} from "lucide-react";
import {
  mockCCBs, mockConvenios, fmt, fmtDate,
} from "../data/verbatechData";

/* ── tokens ─────────────────────────────────────── */
const S = {
  page:  { padding: 24 },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
  h2:    { fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 },
};

const STATUS_CCB = {
  rascunho:             { label: "Rascunho",           color: "#64748B", bg: "#64748B18", icon: FileText },
  pendente_assinatura:  { label: "Aguard. Assinatura", color: "#F59E0B", bg: "#F59E0B18", icon: Clock },
  assinado:             { label: "Assinado",           color: "#38BDF8", bg: "#38BDF818", icon: CheckCircle },
  averbado:             { label: "Averbado ✓",         color: "#4ADE80", bg: "#4ADE8018", icon: CheckCircle },
  cancelado:            { label: "Cancelado",          color: "#F87171", bg: "#F8717118", icon: XCircle },
};

const ASSN_STATUS = {
  nao_iniciado:      { label: "Não iniciado",       color: "#64748B" },
  aguardando_biometria: { label: "Aguard. biometria", color: "#F59E0B" },
  biometria_ok:      { label: "Biometria OK ✓",     color: "#4ADE80" },
  recusado:          { label: "Recusado",            color: "#F87171" },
};

const CONVENIO_STATUS = {
  online:     { color: "#4ADE80", label: "Online" },
  parcial:    { color: "#F59E0B", label: "Parcial" },
  manutencao: { color: "#F87171", label: "Manutenção" },
};

/* ── Status pill ──────────────────────────────── */
function StatusPill({ status }) {
  const cfg = STATUS_CCB[status] || STATUS_CCB.rascunho;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.color, borderRadius: 20,
      padding: "3px 10px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
      border: `1px solid ${cfg.color}30`,
    }}>
      <Icon size={9} />
      {cfg.label}
    </span>
  );
}

/* ── Fluxo de formalização ─────────────────── */
function FormalizacaoFlow({ ccb }) {
  const steps = [
    { id: "proposta",   label: "Proposta Criada",    done: true,                                      icon: FileText },
    { id: "consulta",   label: "Margem Consultada",  done: true,                                      icon: Wifi },
    { id: "ccb",        label: "CCB Gerada",         done: ccb.status !== "rascunho",                icon: FileText },
    { id: "envio",      label: "Envio WhatsApp/SMS", done: ccb.status !== "rascunho",                icon: Smartphone },
    { id: "biometria",  label: "Biometria Facial",   done: ccb.biometria,                            icon: Camera },
    { id: "assinatura", label: "Assinatura Digital", done: ccb.assinaturaEletronica,                 icon: Fingerprint },
    { id: "averbacao",  label: "Averbação Eletr.",   done: !!ccb.averbacaoData,                      icon: Building2 },
    { id: "liberacao",  label: "Crédito Liberado",   done: !!ccb.liberacaoData,                      icon: DollarSign },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", padding: "8px 0" }}>
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === steps.length - 1;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 80 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: step.done ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)",
                border: `2px solid ${step.done ? "#4ADE80" : "rgba(255,255,255,0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: step.done ? "0 0 12px rgba(74,222,128,0.3)" : "none",
                transition: "all 0.3s",
              }}>
                <Icon size={14} color={step.done ? "#4ADE80" : "#475569"} />
              </div>
              <span style={{ fontSize: 9, fontWeight: step.done ? 700 : 500,
                color: step.done ? "#4ADE80" : "#475569",
                textAlign: "center", lineHeight: 1.3 }}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div style={{
                width: 28, height: 2, borderRadius: 2, flexShrink: 0, margin: "0 2px", marginTop: -20,
                background: step.done ? "#4ADE80" : "rgba(255,255,255,0.1)",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── CCB Detail Modal ──────────────────────── */
function CCBModal({ ccb, onClose }) {
  if (!ccb) return null;
  const st = STATUS_CCB[ccb.status] || STATUS_CCB.rascunho;
  const assn = ASSN_STATUS[ccb.assinaturaStatus] || ASSN_STATUS.nao_iniciado;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#0D1525", borderRadius: 20, width: "100%", maxWidth: 680,
        border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
        maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px",
          background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(6,182,212,0.06))",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <FileText size={18} color="#6366F1" />
              <div style={{ fontSize: 17, fontWeight: 800, color: "#F1F5F9" }}>{ccb.id}</div>
              <StatusPill status={ccb.status} />
            </div>
            <div style={{ fontSize: 12, color: "#64748B" }}>
              {ccb.cliente} · {ccb.cpf} · {ccb.convenio}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none",
            color: "#64748B", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "20px 24px" }}>

          {/* Fluxo */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...S.label, marginBottom: 12 }}>Status de Formalização</div>
            <FormalizacaoFlow ccb={ccb} />
          </div>

          {/* Dados financeiros */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { l: "Valor Liberado", v: fmt(ccb.valor), c: "#6366F1" },
              { l: "Parcela", v: fmt(ccb.parcela), c: "#4ADE80" },
              { l: "Prazo", v: `${ccb.parcelas}x`, c: "#F59E0B" },
              { l: "Taxa", v: `${ccb.taxa}% a.m.`, c: "#38BDF8" },
              { l: "Total a Pagar", v: fmt(ccb.totalPagar), c: "#F87171" },
              { l: "Margem Usada", v: ccb.margemUsada ? fmt(ccb.margemUsada) : "—", c: "#A78BFA" },
            ].map(({ l, v, c }) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "11px 13px" }}>
                <div style={{ ...S.label, marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: c }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Datas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { l: "Emissão CCB", v: ccb.emissao },
              { l: "1ª Parcela", v: ccb.vencimento1 },
              { l: "Assinatura Digital", v: ccb.dataAssinatura || "—" },
              { l: "Averbação", v: ccb.averbacaoData || "—" },
              { l: "Liberação Crédito", v: ccb.liberacaoData || "—" },
              { l: "PIX Destino", v: ccb.pixDestino || "—" },
            ].map(({ l, v }) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={S.label}>{l}</span>
                <span style={{ fontSize: 11, color: "#CBD5E1", fontFamily: "monospace" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Biometria / Assinatura */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            <div style={{ background: ccb.biometria ? "rgba(74,222,128,0.08)" : "rgba(245,158,11,0.08)",
              border: `1px solid ${ccb.biometria ? "rgba(74,222,128,0.2)" : "rgba(245,158,11,0.2)"}`,
              borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <Camera size={18} color={ccb.biometria ? "#4ADE80" : "#F59E0B"} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: ccb.biometria ? "#4ADE80" : "#F59E0B" }}>
                  Biometria Facial
                </div>
                <div style={{ fontSize: 10, color: "#64748B" }}>
                  {ccb.biometria ? "Validada com sucesso" : "Pendente"}
                </div>
              </div>
            </div>
            <div style={{ background: ccb.assinaturaEletronica ? "rgba(74,222,128,0.08)" : "rgba(245,158,11,0.08)",
              border: `1px solid ${ccb.assinaturaEletronica ? "rgba(74,222,128,0.2)" : "rgba(245,158,11,0.2)"}`,
              borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <Fingerprint size={18} color={ccb.assinaturaEletronica ? "#4ADE80" : "#F59E0B"} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: ccb.assinaturaEletronica ? "#4ADE80" : "#F59E0B" }}>
                  Assinatura Digital
                </div>
                <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600 }}>{assn.label}</div>
              </div>
            </div>
          </div>

          {/* Documentos */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...S.label, marginBottom: 10 }}>Documentos Anexados ({ccb.documentos.length})</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ccb.documentos.length > 0 ? ccb.documentos.map((doc, i) => (
                <span key={i} style={{
                  background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: 7, padding: "4px 10px", fontSize: 11, color: "#818CF8", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <CheckCircle size={10} color="#4ADE80" /> {doc}
                </span>
              )) : (
                <span style={{ fontSize: 11, color: "#475569" }}>Nenhum documento anexado</span>
              )}
            </div>
          </div>

          {/* Ações */}
          <div style={{ display: "flex", gap: 10 }}>
            {ccb.status === "pendente_assinatura" && (
              <button style={{
                flex: 1, padding: "11px", borderRadius: 11,
                background: "linear-gradient(135deg,#F59E0B,#D97706)",
                border: "none", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
              }}>
                <Send size={14} /> Reenviar Link Assinatura
              </button>
            )}
            <button style={{
              flex: 1, padding: "11px", borderRadius: 11,
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
              color: "#818CF8", fontWeight: 700, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <Download size={13} /> Baixar CCB PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────── */
export default function CCB() {
  const [activeTab, setActiveTab]   = useState("ccbs");
  const [selectedCCB, setSelectedCCB] = useState(null);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [search, setSearch] = useState("");

  const totalEmitido = mockCCBs.reduce((a, c) => a + c.valor, 0);
  const averbados = mockCCBs.filter(c => c.status === "averbado").length;
  const pendAssin = mockCCBs.filter(c => c.status === "pendente_assinatura").length;

  const filtered = mockCCBs.filter(ccb => {
    const matchStatus = filterStatus === "todos" || ccb.status === filterStatus;
    const matchSearch = !search || ccb.cliente.toLowerCase().includes(search.toLowerCase()) ||
      ccb.id.toLowerCase().includes(search.toLowerCase()) || ccb.cpf.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="page">

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg,rgba(74,222,128,0.1),rgba(6,182,212,0.06))",
        border: "1px solid rgba(74,222,128,0.2)", borderRadius: 16,
        padding: "20px 24px", marginBottom: 22,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg,#10B981,#059669)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(16,185,129,0.45)",
            }}>
              <FileText size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#F1F5F9" }}>CCB — Cédula de Crédito Bancário</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Emissão · Formalização Digital · Biometria · Averbação Eletrônica</div>
            </div>
          </div>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg,#10B981,#059669)",
          border: "none", borderRadius: 10, color: "#fff", fontWeight: 800,
          fontSize: 13, padding: "10px 20px", cursor: "pointer",
          boxShadow: "0 4px 18px rgba(16,185,129,0.4)",
        }}>
          <FileText size={14} /> Nova CCB
        </button>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14, marginBottom: 22 }}>
        {[
          { label: "CCBs Emitidas (mês)", value: mockCCBs.length, isMoney: false, color: "#6366F1", icon: FileText },
          { label: "Volume Total", value: totalEmitido, isMoney: true, color: "#4ADE80", icon: DollarSign },
          { label: "Averbadas", value: averbados, isMoney: false, color: "#10B981", icon: CheckCircle },
          { label: "Aguard. Assinatura", value: pendAssin, isMoney: false, color: "#F59E0B", icon: Clock },
          { label: "Convênios Online", value: mockConvenios.filter(c => c.status === "online").length, isMoney: false, color: "#06B6D4", icon: Wifi },
        ].map(({ label, value, isMoney, color, icon: Icon }, i) => (
          <div key={i} style={{ ...S.card, position: "relative", overflow: "hidden", padding: 18 }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 70, height: 70,
              background: `radial-gradient(circle at top right, ${color}18, transparent 70%)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={13} color={color} />
              </div>
              <span style={S.label}>{label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color }}>
              {isMoney ? fmt(value) : value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { id: "ccbs",      label: "CCBs" },
          { id: "convenios", label: "Convênios & APIs" },
          { id: "fluxo",     label: "Fluxo de Formalização" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer",
            background: activeTab === t.id ? "#10B981" : "rgba(255,255,255,0.05)",
            color: activeTab === t.id ? "#fff" : "#64748B",
            border: activeTab === t.id ? "none" : "1px solid rgba(255,255,255,0.1)",
            transition: "all .2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB: CCBs ── */}
      {activeTab === "ccbs" && (
        <div style={S.card}>
          {/* Filtros */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search size={13} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar cliente, CCB, CPF..."
                style={{
                  width: "100%", padding: "9px 12px 9px 34px", borderRadius: 9,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#F1F5F9", fontSize: 12, outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            {["todos", "rascunho", "pendente_assinatura", "assinado", "averbado", "cancelado"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: "8px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                background: filterStatus === s ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                color: filterStatus === s ? "#818CF8" : "#64748B",
                border: `1px solid ${filterStatus === s ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
              }}>
                {s === "todos" ? "Todos" : STATUS_CCB[s]?.label || s}
              </button>
            ))}
          </div>

          {/* Tabela */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["CCB ID", "Cliente / CPF", "Produto", "Valor", "Parcela", "Status", "Assinatura", "Averbação", ""].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", ...S.label }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ccb => {
                const assn = ASSN_STATUS[ccb.assinaturaStatus] || ASSN_STATUS.nao_iniciado;
                return (
                  <tr key={ccb.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#818CF8" }}>{ccb.id}</div>
                      <div style={{ fontSize: 9, color: "#475569", marginTop: 1 }}>{ccb.emissao}</div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>{ccb.cliente}</div>
                      <div style={{ fontSize: 9, color: "#64748B", fontFamily: "monospace" }}>{ccb.cpf}</div>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{ccb.produto}</div>
                      <div style={{ fontSize: 9, color: "#64748B" }}>{ccb.convenio} · SCD: {ccb.scd}</div>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 800, color: "#6366F1" }}>{fmt(ccb.valor)}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#4ADE80" }}>{fmt(ccb.parcela)}</div>
                      <div style={{ fontSize: 9, color: "#64748B" }}>{ccb.parcelas}x · {ccb.taxa}% a.m.</div>
                    </td>
                    <td style={{ padding: "10px 12px" }}><StatusPill status={ccb.status} /></td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: assn.color }}>{assn.label}</span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 10, color: "#64748B", fontFamily: "monospace" }}>
                      {ccb.averbacaoData || "—"}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <button onClick={() => setSelectedCCB(ccb)} style={{
                        background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
                        borderRadius: 7, color: "#818CF8", fontSize: 11, fontWeight: 700,
                        padding: "5px 10px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <Eye size={10} /> Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB: Convênios ── */}
      {activeTab === "convenios" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {mockConvenios.map(conv => {
            const st = CONVENIO_STATUS[conv.status] || CONVENIO_STATUS.manutencao;
            const online = conv.status === "online";
            return (
              <div key={conv.id} style={{ ...S.card, borderLeft: `3px solid ${st.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#F1F5F9", marginBottom: 3 }}>{conv.nome}</div>
                    <div style={{ fontSize: 10, color: "#64748B" }}>{conv.api}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6,
                    background: st.color + "18", borderRadius: 8, padding: "4px 10px",
                    border: `1px solid ${st.color}30` }}>
                    {online ? <Wifi size={11} color={st.color} /> : <WifiOff size={11} color={st.color} />}
                    <span style={{ fontSize: 10, fontWeight: 700, color: st.color }}>{st.label}</span>
                    {online && conv.latencia && (
                      <span style={{ fontSize: 9, color: st.color }}>{conv.latencia}ms</span>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {[
                    { l: "Taxa Base", v: `${conv.taxaBase}% a.m.`, c: "#6366F1" },
                    { l: "Prazo Máx.", v: `${conv.prazoMax}x`, c: "#F59E0B" },
                    { l: "Limite Idade", v: `${conv.limiteIdade} anos`, c: "#06B6D4" },
                  ].map(({ l, v, c }) => (
                    <div key={l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ ...S.label, marginBottom: 3 }}>{l}</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: c }}>{v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0",
                  borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 11, color: "#64748B" }}>
                    Margens consultadas (mês): <span style={{ color: "#94A3B8", fontWeight: 700 }}>{conv.margensConsultadas.toLocaleString("pt-BR")}</span>
                  </span>
                  <span style={{ fontSize: 11, color: "#64748B" }}>
                    Averbações: <span style={{ color: "#4ADE80", fontWeight: 700 }}>{conv.averbacoes}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB: Fluxo ── */}
      {activeTab === "fluxo" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Fluxo completo */}
          <div style={{ ...S.card, gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 20 }}>
              <Activity size={15} color="#10B981" />
              <span style={S.h2}>Fluxo Completo — Proposta → Crédito Liberado</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              {[
                {
                  step: "01", label: "Consulta de Margem", color: "#6366F1",
                  desc: "Sistema consulta Dataprev/SIAPE/CAIXA em tempo real via API. Retorna margem disponível, benefício e dados do titular.",
                  items: ["Consulta Dataprev (INSS)", "Consulta SIAPE", "Extrato FGTS (CAIXA)", "Score Serasa OpenFinance"],
                },
                {
                  step: "02", label: "Emissão da CCB", color: "#10B981",
                  desc: "Sistema gera automaticamente a CCB com todos os dados do contrato. CCB é registrada via SCD parceira (QI Tech).",
                  items: ["Geração automática", "Registro SCD QI Tech", "Número de protocolo", "Hash blockchain"],
                },
                {
                  step: "03", label: "Formalização Digital", color: "#F59E0B",
                  desc: "Cliente recebe link por WhatsApp/SMS. Realiza biometria facial, leitura do documento e assina eletronicamente.",
                  items: ["Link WhatsApp/SMS", "Biometria facial (liveness)", "OCR de documentos", "Assinatura eletrônica ICP-B"],
                },
                {
                  step: "04", label: "Averbação & Crédito", color: "#4ADE80",
                  desc: "Contrato é averbado eletronicamente no convênio. Crédito liberado via PIX em até 2 horas. Split automático executado.",
                  items: ["Averbação eletrônica", "PIX/TED para o cliente", "Split automático", "CCB cedida ao FIDC"],
                },
              ].map(({ step, label, color, desc, items }) => (
                <div key={step} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 12,
                  border: `1px solid ${color}22`, padding: "16px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%",
                    background: `radial-gradient(circle, ${color}18, transparent 70%)` }} />
                  <div style={{ fontSize: 28, fontWeight: 900, color: color + "40", marginBottom: 8, lineHeight: 1 }}>{step}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#F1F5F9", marginBottom: 8 }}>{label}</div>
                  <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.6, marginBottom: 12 }}>{desc}</div>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                      <CheckCircle size={10} color={color} />
                      <span style={{ fontSize: 10, color: "#94A3B8" }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Tempo médio por etapa */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: 14 }}>Tempo Médio por Etapa</div>
            {[
              { etapa: "Consulta de Margem", tempo: "8s", color: "#6366F1", pct: 5 },
              { etapa: "Emissão da CCB", tempo: "15s", color: "#10B981", pct: 10 },
              { etapa: "Envio do link (WhatsApp)", tempo: "2s", color: "#25D366", pct: 2 },
              { etapa: "Assinatura pelo cliente", tempo: "~4 min", color: "#F59E0B", pct: 60 },
              { etapa: "Averbação eletrônica", tempo: "45s", color: "#06B6D4", pct: 25 },
              { etapa: "Liberação PIX", tempo: "3s", color: "#4ADE80", pct: 3 },
            ].map(({ etapa, tempo, color, pct }) => (
              <div key={etapa} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{etapa}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color }}>{tempo}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 4 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Taxa de sucesso por convênio */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: 14 }}>Taxa de Averbação por Convênio</div>
            {mockConvenios.filter(c => c.averbacoes > 0).map(conv => {
              const pct = Math.round((conv.averbacoes / conv.margensConsultadas) * 100);
              const color = pct >= 20 ? "#4ADE80" : pct >= 10 ? "#F59E0B" : "#F87171";
              return (
                <div key={conv.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>{conv.sigla} — {conv.nome.split(" ")[0]}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color }}>
                      {pct}% <span style={{ fontSize: 9, color: "#64748B" }}>({conv.averbacoes}/{conv.margensConsultadas})</span>
                    </span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${Math.min(pct * 3, 100)}%`, background: color, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de detalhe */}
      {selectedCCB && <CCBModal ccb={selectedCCB} onClose={() => setSelectedCCB(null)} />}
    </div>
  );
}
