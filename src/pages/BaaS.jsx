// VerbaTech — BaaS (Banking as a Service): Conta Master + Subcontas + Split Automático
import { useState, useEffect } from "react";
import {
  Building2, Wallet, ArrowUpRight, ArrowDownLeft, Zap, Users,
  CheckCircle, Clock, XCircle, AlertTriangle, Copy, QrCode,
  RefreshCw, Download, ChevronRight, Settings, Shield, TrendingUp,
  DollarSign, BarChart2, Layers, GitBranch, Send, Eye, EyeOff,
  CreditCard, Globe, Landmark,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  mockContaMaster, mockSubcontas, mockSplitRegras,
  mockTransacoesSplit, mockSaldoHistorico, fmt, fmtDate,
} from "../data/verbatechData";

/* ── tokens ─────────────────────────────────────── */
const S = {
  page:  { padding: 24 },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
  h2:    { fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 },
};

const STATUS_SUBCONTA = {
  ativa:     { color: "#4ADE80", label: "Ativa" },
  bloqueada: { color: "#F87171", label: "Bloqueada" },
  pendente:  { color: "#F59E0B", label: "Pendente" },
};

const TIPO_TRX = {
  liberacao: { label: "Liberação CCB", color: "#6366F1", icon: ArrowUpRight },
  parcela:   { label: "Parcela Recebida", color: "#4ADE80", icon: ArrowDownLeft },
  resgate:   { label: "Resgate FIDC", color: "#F59E0B", icon: ArrowUpRight },
};

/* ── Animated counter ─────────────────────────── */
function AnimNum({ target, prefix = "", suffix = "", duration = 900, decimals = 2 }) {
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
  }, [target]);
  return <span>{prefix}{display.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

/* ── Split Diagram ─────────────────────────────── */
function SplitDiagram({ exemplo }) {
  const total = exemplo.valor;
  const parts = [
    { label: "Retorno FIDC", value: exemplo.retornoFundo, color: "#6366F1", pct: (exemplo.retornoFundo / total * 100).toFixed(1) },
    { label: "Plataforma",   value: exemplo.taxaPlataforma, color: "#4ADE80", pct: (exemplo.taxaPlataforma / total * 100).toFixed(1) },
    { label: "Corban",       value: exemplo.comissaoCorban, color: "#F59E0B", pct: (exemplo.comissaoCorban / total * 100).toFixed(1) },
    { label: "Vendedor",     value: exemplo.comissaoVendedor, color: "#A78BFA", pct: (exemplo.comissaoVendedor / total * 100).toFixed(1) },
    { label: "Custo BaaS",   value: exemplo.custoBaaS, color: "#F87171", pct: (exemplo.custoBaaS / total * 100).toFixed(1) },
  ];
  return (
    <div>
      <div style={{ fontSize: 11, color: "#64748B", marginBottom: 10 }}>
        Exemplo: contrato de <span style={{ color: "#F1F5F9", fontWeight: 700 }}>{fmt(total)}</span> — split automático no ato da liberação
      </div>
      {/* barra proporcional */}
      <div style={{ display: "flex", height: 10, borderRadius: 8, overflow: "hidden", marginBottom: 16, gap: 1 }}>
        {parts.map((p, i) => (
          <div key={i} style={{ width: `${p.pct}%`, background: p.color, transition: "width 0.8s ease" }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {parts.map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.03)", borderRadius: 9, padding: "10px 12px",
            border: `1px solid ${p.color}22`,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700 }}>{p.label}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: p.color }}>{fmt(p.value)}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: p.color }}>{p.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Subconta Card ─────────────────────────────── */
function SubcontaCard({ sub, showBalance }) {
  const st = STATUS_SUBCONTA[sub.status] || STATUS_SUBCONTA.ativa;
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12, padding: "14px 16px",
      borderLeft: `3px solid ${st.color}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>{sub.nome}</div>
          <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>{sub.numero} · Split {sub.splitPct}%</div>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
          background: st.color + "18", color: st.color, border: `1px solid ${st.color}30`,
        }}>{st.label}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: "rgba(74,222,128,0.06)", borderRadius: 8, padding: "8px 10px" }}>
          <div style={S.label}>Saldo</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: showBalance ? "#4ADE80" : "#475569" }}>
            {showBalance ? fmt(sub.saldo) : "••••••"}
          </div>
        </div>
        <div style={{ background: "rgba(245,158,11,0.06)", borderRadius: 8, padding: "8px 10px" }}>
          <div style={S.label}>Pendente</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B" }}>{fmt(sub.saldoPendente)}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <span style={{ fontSize: 10, color: "#64748B" }}>
          Total recebido: <span style={{ color: "#94A3B8" }}>{fmt(sub.totalRecebido)}</span>
        </span>
        <span style={{ fontSize: 10, color: "#64748B" }}>
          Último: <span style={{ color: "#94A3B8" }}>{sub.ultimoCredito}</span>
        </span>
      </div>
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────── */
export default function BaaS() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const totalSubcontas = mockSubcontas.reduce((a, s) => a + s.saldo, 0);
  const totalPendente  = mockSubcontas.reduce((a, s) => a + s.saldoPendente, 0);
  const ativas = mockSubcontas.filter(s => s.status === "ativa").length;

  function copyPix() {
    navigator.clipboard?.writeText(mockContaMaster.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="page">

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg,rgba(99,102,241,0.14),rgba(6,182,212,0.07))",
        border: "1px solid rgba(99,102,241,0.22)", borderRadius: 16,
        padding: "20px 24px", marginBottom: 22,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(99,102,241,0.45)",
            }}>
              <Landmark size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#F1F5F9" }}>Banking as a Service</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Conta Master · Subcontas Corbans · Split Automático</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
            <div>
              <div style={S.label}>Parceiro BaaS</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#818CF8" }}>{mockContaMaster.banco}</div>
            </div>
            <div>
              <div style={S.label}>Licença</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#06B6D4" }}>{mockContaMaster.licenca}</div>
            </div>
            <div>
              <div style={S.label}>Conta Master</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#4ADE80" }}>{mockContaMaster.numero}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => setShowBalance(s => !s)} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 9, color: "#94A3B8", padding: "9px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600,
          }}>
            {showBalance ? <EyeOff size={13} /> : <Eye size={13} />}
            {showBalance ? "Ocultar saldos" : "Mostrar saldos"}
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            border: "none", borderRadius: 9, color: "#fff", padding: "9px 16px", cursor: "pointer", fontSize: 12, fontWeight: 700,
            boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
          }}>
            <RefreshCw size={13} /> Atualizar
          </button>
        </div>
      </div>

      {/* ── KPIs Master ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Saldo Disponível", value: mockContaMaster.saldoDisponivel, color: "#4ADE80", icon: Wallet, show: showBalance },
          { label: "Saldo Bloqueado (Custódia)", value: mockContaMaster.saldoBloqueado, color: "#F59E0B", icon: Shield, show: true },
          { label: "PL FIDC", value: mockContaMaster.saldoFIDC, color: "#6366F1", icon: BarChart2, show: showBalance },
          { label: "Limite Total Crédito", value: mockContaMaster.limiteCredito, color: "#06B6D4", icon: TrendingUp, show: true },
          { label: "Subcontas Ativas", value: ativas, color: "#A78BFA", icon: Users, show: true, isMoney: false },
        ].map(({ label, value, color, icon: Icon, show, isMoney = true }, i) => (
          <div key={i} style={{ ...S.card, position: "relative", overflow: "hidden", padding: 18 }}>
            <div style={{
              position: "absolute", top: 0, right: 0, width: 80, height: 80,
              background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} color={color} />
              </div>
              <span style={S.label}>{label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: show ? color : "#475569" }}>
              {show ? (isMoney ? fmt(value) : value) : "••••••"}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { id: "overview", label: "Visão Geral" },
          { id: "subcontas", label: "Subcontas" },
          { id: "split", label: "Split & Regras" },
          { id: "transacoes", label: "Transações" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer",
            background: activeTab === t.id ? "#6366F1" : "rgba(255,255,255,0.05)",
            color: activeTab === t.id ? "#fff" : "#64748B",
            border: activeTab === t.id ? "none" : "1px solid rgba(255,255,255,0.1)",
            transition: "all .2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB: Overview ── */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Conta Master Card */}
          <div style={{ ...S.card }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12,
                background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
                <Landmark size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#F1F5F9" }}>Conta Master VerbaTech</div>
                <div style={{ fontSize: 10, color: "#64748B" }}>{mockContaMaster.banco} · ISPB {mockContaMaster.ispb}</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
                background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: 6, padding: "3px 9px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80",
                  boxShadow: "0 0 6px #4ADE80", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 9, color: "#4ADE80", fontWeight: 700 }}>ONLINE</span>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.06))",
              border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
              <div style={S.label}>Saldo Total Disponível</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: showBalance ? "#818CF8" : "#475569", marginTop: 4, letterSpacing: -1 }}>
                {showBalance ? (
                  <AnimNum target={mockContaMaster.saldoDisponivel} prefix="R$ " decimals={2} />
                ) : "••••••••"}
              </div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 6 }}>
                + <span style={{ color: "#F59E0B", fontWeight: 700 }}>{fmt(mockContaMaster.saldoBloqueado)}</span> em custódia (CCBs ativas)
              </div>
            </div>

            {[
              { label: "N° Conta", value: mockContaMaster.numero, mono: true },
              { label: "Agência", value: mockContaMaster.agencia, mono: true },
              { label: "Parceiro SCD", value: mockContaMaster.parceiro },
              { label: "Status Licença", value: mockContaMaster.licenca },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={S.label}>{label}</span>
                <span style={{ fontSize: 11, color: "#CBD5E1", fontWeight: mono ? 700 : 500, fontFamily: mono ? "monospace" : "inherit" }}>
                  {value}
                </span>
              </div>
            ))}

            {/* PIX Key */}
            <div style={{ marginTop: 14, background: "rgba(99,102,241,0.08)", borderRadius: 10,
              padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={S.label}>Chave PIX</div>
                <div style={{ fontSize: 12, color: "#818CF8", fontWeight: 700, marginTop: 2 }}>{mockContaMaster.pixKey}</div>
              </div>
              <button onClick={copyPix} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: copied ? "rgba(74,222,128,0.15)" : "rgba(99,102,241,0.15)",
                border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(99,102,241,0.3)"}`,
                borderRadius: 7, color: copied ? "#4ADE80" : "#818CF8",
                fontSize: 11, fontWeight: 700, padding: "6px 12px", cursor: "pointer",
              }}>
                {copied ? <CheckCircle size={11} /> : <Copy size={11} />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          {/* Saldo Histórico Chart */}
          <div style={{ ...S.card }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={S.h2}>Fluxo de Caixa Master</span>
              <span style={{ fontSize: 10, color: "#64748B" }}>Últimos 6 meses</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockSaldoHistorico} barGap={4}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#0D1525", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, fontSize: 11 }}
                  formatter={v => [fmt(v), ""]} />
                <Bar dataKey="entrada" name="Entradas" fill="#4ADE80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saida" name="Saídas" fill="rgba(248,113,113,0.5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
              {[
                { label: "Entradas Abr", value: 618_000, color: "#4ADE80" },
                { label: "Saídas Abr", value: 543_000, color: "#F87171" },
                { label: "Resultado Líq", value: 75_000, color: "#6366F1" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 9, padding: "10px 12px" }}>
                  <div style={{ ...S.label, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color }}>{fmt(value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fluxo Split Visual */}
          <div style={{ ...S.card, gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <GitBranch size={16} color="#6366F1" />
              <span style={S.h2}>Fluxo do Split Automático</span>
              <span style={{ marginLeft: "auto", fontSize: 10, color: "#64748B" }}>
                Executado automaticamente no ato da liberação do crédito
              </span>
            </div>

            {/* Flow diagram */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, overflowX: "auto", padding: "4px 0" }}>
              {[
                { icon: "👤", label: "Cliente Assina CCB", color: "#06B6D4" },
                { arrow: true },
                { icon: "🏦", label: "SCD QI Tech Valida", color: "#8B5CF6" },
                { arrow: true },
                { icon: "💰", label: "Crédito Liberado (PIX/TED)", color: "#4ADE80" },
                { arrow: true },
                { icon: "⚡", label: "Split Automático", color: "#F59E0B", highlight: true },
                { arrow: true },
                { icon: "🏛️", label: "FIDC recebe capital + spread", color: "#6366F1" },
              ].map((item, i) => {
                if (item.arrow) return (
                  <ChevronRight key={i} size={16} color="#334155" style={{ flexShrink: 0 }} />
                );
                return (
                  <div key={i} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    background: item.highlight ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${item.highlight ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: 10, padding: "12px 16px", flexShrink: 0, minWidth: 110,
                  }}>
                    <span style={{ fontSize: 22 }}>{item.icon}</span>
                    <span style={{ fontSize: 10, color: item.color, fontWeight: 700, textAlign: "center" }}>{item.label}</span>
                  </div>
                );
              })}
            </div>

            <SplitDiagram exemplo={mockSplitRegras.exemploContrato} />
          </div>
        </div>
      )}

      {/* ── TAB: Subcontas ── */}
      {activeTab === "subcontas" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={S.h2}>Subcontas dos Corbans</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>
                Total em subcontas: <span style={{ color: "#4ADE80", fontWeight: 700 }}>{fmt(totalSubcontas)}</span>
                {" · "}Pendente: <span style={{ color: "#F59E0B", fontWeight: 700 }}>{fmt(totalPendente)}</span>
              </div>
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 9, color: "#818CF8", padding: "9px 16px", cursor: "pointer", fontSize: 12, fontWeight: 700,
            }}>
              <Users size={13} /> Nova Subconta
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
            {mockSubcontas.map(sub => (
              <SubcontaCard key={sub.id} sub={sub} showBalance={showBalance} />
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: Split & Regras ── */}
      {activeTab === "split" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>

          {/* Regras globais */}
          <div style={S.card}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
              <Settings size={15} color="#6366F1" />
              <span style={S.h2}>Parâmetros Globais do Split</span>
            </div>
            {[
              { label: "Taxa Plataforma (Admin)", value: `${mockSplitRegras.plataforma}%`, color: "#4ADE80", desc: "Retido pela VerbaTech em todo contrato" },
              { label: "Parceiro BaaS (QI Tech)", value: `${mockSplitRegras.parceiroBaaS}%`, color: "#F87171", desc: "Custo de infra e licença SCD" },
              { label: "Corban — Mínimo", value: `${mockSplitRegras.corbanMin}%`, color: "#F59E0B", desc: "Comissão mínima garantida ao Corban" },
              { label: "Corban — Máximo", value: `${mockSplitRegras.corbanMax}%`, color: "#F59E0B", desc: "Comissão máxima liberada ao Corban" },
              { label: "Vendedor — Mínimo", value: `${mockSplitRegras.vendedorMin}%`, color: "#A78BFA", desc: "Do split do Corban para o vendedor" },
              { label: "Vendedor — Máximo", value: `${mockSplitRegras.vendedorMax}%`, color: "#A78BFA", desc: "Máximo que o Corban pode repassar" },
              { label: "Retorno ao FIDC", value: `${mockSplitRegras.fundo}%`, color: "#6366F1", desc: "Capital + spread retornam ao fundo" },
            ].map(({ label, value, color, desc }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1" }}>{label}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{desc}</div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color }}>{value}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${parseFloat(value) * 20}%`,
                    background: color, borderRadius: 4,
                    boxShadow: `0 0 6px ${color}66`,
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Regras por Corban */}
          <div style={S.card}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
              <Layers size={15} color="#06B6D4" />
              <span style={S.h2}>Regras por Corban</span>
              <span style={{ marginLeft: "auto", fontSize: 10, color: "#64748B" }}>Admin define · Corban não altera</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Corban", "Nível", "Split Corban", "Split Vendedor", "Limite Op.", "Produtos", "Status"].map(h => (
                      <th key={h} style={{ padding: "7px 10px", textAlign: "left", ...S.label }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockSubcontas.map((sub, i) => {
                    const NIVEL_COLOR = { Diamante: "#00BFFF", Ouro: "#FFD700", Prata: "#C0C0C0", Bronze: "#CD7F32" };
                    const nivelMap = { "sub001": "Diamante", "sub002": "Ouro", "sub003": "Prata", "sub004": "Prata", "sub005": "Bronze", "sub006": "Bronze" };
                    const nivel = nivelMap[sub.id] || "Bronze";
                    const color = NIVEL_COLOR[nivel] || "#CD7F32";
                    const ativo = sub.status === "ativa";
                    return (
                      <tr key={sub.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "9px 10px", fontSize: 11, color: "#CBD5E1", fontWeight: 600 }}>
                          {sub.nome.split(" — ")[0]}
                        </td>
                        <td style={{ padding: "9px 10px" }}>
                          <span style={{ fontSize: 9, fontWeight: 800, color, background: color + "18",
                            borderRadius: 4, padding: "2px 6px", border: `1px solid ${color}30` }}>{nivel}</span>
                        </td>
                        <td style={{ padding: "9px 10px", fontSize: 12, fontWeight: 800, color: "#F59E0B" }}>{sub.splitPct}%</td>
                        <td style={{ padding: "9px 10px", fontSize: 11, color: "#A78BFA" }}>
                          {(sub.splitPct * 0.25).toFixed(2)}%
                        </td>
                        <td style={{ padding: "9px 10px", fontSize: 11, color: "#94A3B8" }}>
                          {fmt(sub.splitPct === 3.0 ? 50_000 : sub.splitPct === 2.5 ? 30_000 : sub.splitPct === 2.0 ? 20_000 : 15_000)}
                        </td>
                        <td style={{ padding: "9px 10px", fontSize: 10, color: "#64748B" }}>
                          {sub.splitPct === 3.0 ? "Todos" : sub.splitPct === 2.5 ? "INSS+FGTS+RMC" : "INSS+FGTS"}
                        </td>
                        <td style={{ padding: "9px 10px" }}>
                          <span style={{ fontSize: 9, fontWeight: 700,
                            color: ativo ? "#4ADE80" : "#F87171",
                            background: ativo ? "#4ADE8018" : "#F8717118",
                            borderRadius: 4, padding: "2px 7px",
                            border: `1px solid ${ativo ? "#4ADE8030" : "#F8717130"}` }}>
                            {ativo ? "Ativo" : "Bloqueado"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Transações ── */}
      {activeTab === "transacoes" && (
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Zap size={15} color="#F59E0B" />
              <span style={S.h2}>Transações de Split — Tempo Real</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)",
                borderRadius: 8, color: "#4ADE80", fontSize: 11, fontWeight: 700,
                padding: "6px 12px", cursor: "pointer",
              }}>
                <Download size={11} /> Exportar CSV
              </button>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Data/Hora", "CCB", "Cliente", "Tipo", "Valor Total", "FIDC", "Plataforma", "Corban", "Vendedor", "Status"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", ...S.label }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTransacoesSplit.map(trx => {
                const tipo = TIPO_TRX[trx.tipo] || TIPO_TRX.liberacao;
                const TIcon = tipo.icon;
                return (
                  <tr key={trx.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "10px 12px", fontSize: 10, color: "#64748B", fontFamily: "monospace" }}>{trx.data}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11, fontWeight: 800, color: "#818CF8" }}>{trx.ccbId}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#CBD5E1" }}>{trx.cliente}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5,
                        background: tipo.color + "18", borderRadius: 6, padding: "3px 8px",
                        fontSize: 10, fontWeight: 700, color: tipo.color, width: "fit-content" }}>
                        <TIcon size={9} /> {tipo.label}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 800, color: "#F1F5F9" }}>{fmt(trx.valor)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: "#6366F1", fontWeight: 700 }}>{fmt(trx.split.fundo)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: "#4ADE80", fontWeight: 700 }}>{fmt(trx.split.plataforma)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: "#F59E0B", fontWeight: 700 }}>{fmt(trx.split.corban)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: "#A78BFA", fontWeight: 700 }}>{fmt(trx.split.vendedor)}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#4ADE80",
                        background: "#4ADE8018", borderRadius: 4, padding: "2px 7px",
                        border: "1px solid #4ADE8030" }}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
