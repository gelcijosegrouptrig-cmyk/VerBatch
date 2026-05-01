// VerbaTech — FIDC (Fundo de Investimento em Direitos Creditórios)
import { useState, useEffect } from "react";
import {
  TrendingUp, DollarSign, Shield, BarChart2, Users, CheckCircle,
  AlertTriangle, Clock, ArrowUpRight, ArrowDownLeft, Download,
  RefreshCw, Eye, ChevronRight, Activity, Building2, Landmark,
  PieChart as PieIcon, FileText, Zap, Globe,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import {
  mockFIDC, mockFIDCEvolucao, mockFIDCCedentes, mockFIDCEventos, fmt,
} from "../data/verbatechData";

/* ── tokens ─────────────────────────────────────── */
const S = {
  page:  { padding: 24, minHeight: "100vh", background: "#080E1A" },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
  h2:    { fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 },
};

const EVENTO_CFG = {
  cessao:      { label: "Cessão de CCBs",   color: "#6366F1", icon: ArrowUpRight },
  liquidacao:  { label: "Liquidação",        color: "#4ADE80", icon: ArrowDownLeft },
  aporte:      { label: "Aporte de Cotas",  color: "#10B981", icon: ArrowUpRight },
  resgate:     { label: "Resgate de Cotas", color: "#F87171", icon: ArrowDownLeft },
};

const STATUS_CFG = {
  processado: { color: "#4ADE80", label: "Processado" },
  pendente:   { color: "#F59E0B", label: "Pendente" },
  cancelado:  { color: "#F87171", label: "Cancelado" },
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

/* ── Gauge de inadimplência ─────────────────── */
function InadGauge({ value, limit = 5 }) {
  const [pct, setPct] = useState(0);
  const displayPct = (value / limit) * 100;
  const color = value < 2 ? "#4ADE80" : value < 3.5 ? "#F59E0B" : "#F87171";

  useEffect(() => {
    const t = setTimeout(() => setPct(displayPct), 200);
    return () => clearTimeout(t);
  }, [displayPct]);

  const radius = 54, stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 130, height: 130 }}>
        <svg width={130} height={130} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={65} cy={65} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
          <circle cx={65} cy={65} r={radius} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease", filter: `drop-shadow(0 0 8px ${color}80)` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}%</div>
          <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase" }}>Inadimp.</div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: "#64748B", marginTop: 4 }}>
        Limite covenante: <span style={{ color: "#F87171", fontWeight: 700 }}>{limit}%</span>
      </div>
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────── */
export default function FIDC() {
  const [activeTab, setActiveTab] = useState("overview");

  const seniorPct = ((mockFIDC.cotasSenior / mockFIDC.patrimonio) * 100).toFixed(1);
  const subPct    = ((mockFIDC.cotasSubordinadas / mockFIDC.patrimonio) * 100).toFixed(1);
  const utilizacao = ((mockFIDC.carteira / mockFIDC.patrimonio) * 100).toFixed(1);

  const pieData = [
    { name: "Cota Sênior", value: mockFIDC.cotasSenior, cor: "#6366F1" },
    { name: "Cota Subord.", value: mockFIDC.cotasSubordinadas, cor: "#10B981" },
  ];

  const utilizacaoData = [
    { name: "Carteira Ativa", value: mockFIDC.carteira, cor: "#4ADE80" },
    { name: "Disponível", value: mockFIDC.disponivel, cor: "rgba(255,255,255,0.1)" },
  ];

  return (
    <div style={S.page}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg,rgba(16,185,129,0.12),rgba(99,102,241,0.07))",
        border: "1px solid rgba(16,185,129,0.22)", borderRadius: 16,
        padding: "20px 24px", marginBottom: 22,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg,#10B981,#059669)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(16,185,129,0.45)",
            }}>
              <TrendingUp size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#F1F5F9" }}>{mockFIDC.nome}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>CNPJ {mockFIDC.cnpj} · {mockFIDC.statusCVM}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { l: "Administrador", v: mockFIDC.administrador, c: "#818CF8" },
              { l: "Custodiante", v: mockFIDC.custodiante, c: "#06B6D4" },
              { l: "Rating", v: mockFIDC.rating, c: "#4ADE80" },
              { l: "Tipo", v: mockFIDC.tipo, c: "#F59E0B" },
            ].map(({ l, v, c }) => (
              <div key={l}>
                <div style={S.label}>{l}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 9, color: "#10B981", padding: "9px 16px", cursor: "pointer", fontSize: 12, fontWeight: 700,
          }}>
            <Download size={13} /> Relatório CVM
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 9, color: "#94A3B8", padding: "9px 16px", cursor: "pointer", fontSize: 12, fontWeight: 600,
          }}>
            <RefreshCw size={13} /> Atualizar
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 14, marginBottom: 22 }}>
        {[
          { label: "PL do Fundo", value: mockFIDC.patrimonio, color: "#10B981", icon: BarChart2 },
          { label: "Carteira Ativa", value: mockFIDC.carteira, color: "#6366F1", icon: FileText },
          { label: "Disponível para Novas CCBs", value: mockFIDC.disponivel, color: "#4ADE80", icon: DollarSign },
          { label: "Cotas Sênior (Total)", value: mockFIDC.cotasSenior, color: "#818CF8", icon: Landmark },
          { label: "TIR do Fundo (a.a.)", value: `${mockFIDC.tir}%`, color: "#F59E0B", icon: TrendingUp, raw: true },
          { label: "Spread Médio (a.a.)", value: `${mockFIDC.spreadMedio}%`, color: "#06B6D4", icon: Activity, raw: true },
        ].map(({ label, value, color, icon: Icon, raw }, i) => (
          <div key={i} style={{ ...S.card, position: "relative", overflow: "hidden", padding: 18 }}>
            <div style={{
              position: "absolute", top: 0, right: 0, width: 80, height: 80,
              background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} color={color} />
              </div>
              <span style={S.label}>{label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color }}>
              {raw ? value : fmt(value)}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { id: "overview",  label: "Visão Geral" },
          { id: "cedentes",  label: "Cedentes" },
          { id: "eventos",   label: "Eventos" },
          { id: "relatorio", label: "Relatório" },
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

      {/* ── TAB: Overview ── */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

          {/* PL Evolução */}
          <div style={{ ...S.card, gridColumn: "1 / 3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={S.h2}>Evolução do PL — Últimos 6 meses</span>
              <div style={{ display: "flex", gap: 14 }}>
                {[
                  { label: "PL", color: "#10B981" },
                  { label: "Carteira", color: "#6366F1" },
                  { label: "Inadimp. %", color: "#F87171" },
                ].map(({ label, color }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 8, height: 3, borderRadius: 2, background: color }} />
                    <span style={{ fontSize: 10, color: "#64748B" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={mockFIDCEvolucao}>
                <defs>
                  <linearGradient id="gPL" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1_000_000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ background: "#0D1525", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, fontSize: 11 }}
                  formatter={v => [fmt(v), ""]}
                />
                <Area type="monotone" dataKey="pl" name="PL" stroke="#10B981" strokeWidth={2.5} fill="url(#gPL)" />
                <Area type="monotone" dataKey="carteira" name="Carteira" stroke="#6366F1" strokeWidth={2} fill="url(#gCart)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Inadimplência gauge */}
          <div style={{ ...S.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ textAlign: "center" }}>
              <div style={S.h2}>Inadimplência</div>
              <div style={{ fontSize: 10, color: "#64748B", marginTop: 3 }}>Covenante máx: 5%</div>
            </div>
            <InadGauge value={mockFIDC.inadimplencia} limit={5} />
            <div style={{ width: "100%" }}>
              {mockFIDCEvolucao.slice(-3).map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between",
                  padding: "6px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <span style={{ fontSize: 11, color: "#64748B" }}>{m.mes}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: m.inadimplencia < 2 ? "#4ADE80" : m.inadimplencia < 3.5 ? "#F59E0B" : "#F87171",
                  }}>{m.inadimplencia}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mix de cotas */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: 14 }}>Composição das Cotas</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <PieChart width={130} height={130}>
                <Pie data={pieData} cx={60} cy={60} innerRadius={36} outerRadius={58}
                  dataKey="value" stroke="none" paddingAngle={3}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.cor} />)}
                </Pie>
              </PieChart>
              <div style={{ flex: 1 }}>
                {pieData.map(p => (
                  <div key={p.name} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: p.cor }} />
                        <span style={{ fontSize: 11, color: "#94A3B8" }}>{p.name}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: p.cor }}>{fmt(p.value)}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 4 }}>
                      <div style={{ height: "100%", width: `${(p.value / mockFIDC.patrimonio) * 100}%`, background: p.cor, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "9px 10px" }}>
                  <div style={{ fontSize: 10, color: "#64748B" }}>Utilização da Carteira</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#10B981", marginTop: 2 }}>
                    {utilizacao}% do PL
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info do fundo */}
          <div style={{ ...S.card }}>
            <div style={{ ...S.label, marginBottom: 14 }}>Dados do Fundo</div>
            {[
              { l: "Gestor", v: mockFIDC.gestor },
              { l: "Auditor", v: mockFIDC.auditor },
              { l: "Tipo", v: mockFIDC.tipo },
              { l: "Início", v: mockFIDC.inicioFundo },
              { l: "Data Ref.", v: mockFIDC.dataReferencia },
              { l: "Investidores", v: `${mockFIDC.investidores} cotistas` },
              { l: "Cota Sênior", v: `R$ ${mockFIDC.cotaSeniorValor.toFixed(2)} / cota` },
              { l: "Cota Subord.", v: `R$ ${mockFIDC.cotaSubValor.toFixed(2)} / cota` },
            ].map(({ l, v }) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={S.label}>{l}</span>
                <span style={{ fontSize: 11, color: "#CBD5E1", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Retorno vs Benchmark */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: 14 }}>Retorno vs Benchmark</div>
            {[
              { label: "TIR do Fundo", value: `${mockFIDC.tir}%`, color: "#10B981", desc: "ao ano" },
              { label: "CDI (ref.)", value: "10.5%", color: "#6366F1", desc: "ao ano" },
              { label: "IPCA + 8%", value: "12.4%", color: "#F59E0B", desc: "ao ano (meta sênior)" },
              { label: "Spread Médio", value: `${mockFIDC.spreadMedio}%`, color: "#06B6D4", desc: "sobre custo de capital" },
            ].map(({ label, value, color, desc }, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", background: "rgba(255,255,255,0.03)",
                borderRadius: 9, marginBottom: i < 3 ? 8 : 0,
                border: `1px solid ${color}22` }}>
                <div style={{ width: 4, height: 36, borderRadius: 2, background: color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{label}</div>
                  <div style={{ fontSize: 9, color: "#475569" }}>{desc}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: Cedentes ── */}
      {activeTab === "cedentes" && (
        <div>
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={S.h2}>Cedentes de Direitos Creditórios</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>
                Corbans que cedem CCBs ao fundo · Total carteira: <span style={{ color: "#10B981", fontWeight: 700 }}>{fmt(mockFIDC.carteira)}</span>
              </div>
            </div>
          </div>

          <div style={{ ...S.card, marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Cedente", "Contratos", "Saldo Carteira", "% do Fundo", "Inadimplência", "Status"].map(h => (
                    <th key={h} style={{ padding: "8px 14px", textAlign: "left", ...S.label }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockFIDCCedentes.map((ced, i) => {
                  const pctFundo = ((ced.saldo / mockFIDC.carteira) * 100).toFixed(1);
                  const inadColor = ced.inadimplencia < 2 ? "#4ADE80" : ced.inadimplencia < 3 ? "#F59E0B" : "#F87171";
                  const ativo = ced.status === "ativo";
                  return (
                    <tr key={ced.id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 9,
                            background: ativo ? "rgba(16,185,129,0.15)" : "rgba(248,113,113,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 800, color: ativo ? "#10B981" : "#F87171" }}>
                            {ced.nome.charAt(0)}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>{ced.nome}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 700, color: "#6366F1" }}>
                        {ced.contratos}
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 800, color: "#10B981" }}>
                        {fmt(ced.saldo)}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 4 }}>
                            <div style={{ height: "100%", width: `${pctFundo}%`, background: "#10B981", borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80", minWidth: 36 }}>{pctFundo}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: inadColor }}>
                          {ced.inadimplencia}%
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: 9, fontWeight: 700,
                          color: ativo ? "#4ADE80" : "#F87171",
                          background: ativo ? "#4ADE8018" : "#F8717118",
                          borderRadius: 4, padding: "2px 8px",
                          border: `1px solid ${ativo ? "#4ADE8030" : "#F8717130"}` }}>
                          {ativo ? "Ativo" : "Suspenso"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Concentração por cedente */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: 14 }}>Concentração da Carteira por Cedente</div>
            {mockFIDCCedentes.map(ced => {
              const pct = parseFloat(((ced.saldo / mockFIDC.carteira) * 100).toFixed(1));
              const color = ced.status === "ativo" ? "#10B981" : "#F87171";
              return (
                <div key={ced.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>{ced.nome}</span>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "#64748B" }}>{fmt(ced.saldo)}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4,
                      boxShadow: `0 0 6px ${color}55` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: Eventos ── */}
      {activeTab === "eventos" && (
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Activity size={15} color="#10B981" />
              <span style={S.h2}>Eventos do Fundo</span>
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: 8, color: "#10B981", fontSize: 11, fontWeight: 700,
              padding: "6px 12px", cursor: "pointer",
            }}>
              <Download size={11} /> Exportar
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mockFIDCEventos.map(ev => {
              const cfg = EVENTO_CFG[ev.tipo] || EVENTO_CFG.cessao;
              const Icon = cfg.icon;
              const st = STATUS_CFG[ev.status] || STATUS_CFG.pendente;
              const isEntry = ev.tipo === "liquidacao" || ev.tipo === "aporte";
              return (
                <div key={ev.id} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "rgba(255,255,255,0.02)", borderRadius: 11, padding: "14px 16px",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: cfg.color + "18", border: `1px solid ${cfg.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={16} color={cfg.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>{ev.descricao}</div>
                    <div style={{ fontSize: 10, color: "#64748B", marginTop: 2 }}>
                      {ev.data} · {cfg.label}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: isEntry ? "#4ADE80" : "#F87171" }}>
                      {isEntry ? "+" : "-"}{fmt(ev.valor)}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700,
                      color: st.color, background: st.color + "18",
                      borderRadius: 4, padding: "2px 7px",
                      border: `1px solid ${st.color}30` }}>
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: Relatório ── */}
      {activeTab === "relatorio" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Resumo executivo */}
          <div style={{ ...S.card, gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 20 }}>
              <FileText size={15} color="#10B981" />
              <span style={S.h2}>Resumo Executivo — {mockFIDC.dataReferencia}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              {[
                { label: "Patrimônio Líquido", value: fmt(mockFIDC.patrimonio), color: "#10B981", delta: "+{fmt(500000)} mês", up: true },
                { label: "Carteira Ativa", value: fmt(mockFIDC.carteira), color: "#6366F1", delta: `${utilizacao}% utilizado`, up: true },
                { label: "Disponível p/ Crédito", value: fmt(mockFIDC.disponivel), color: "#4ADE80", delta: "Pronto para ceder", up: true },
                { label: "Inadimplência", value: `${mockFIDC.inadimplencia}%`, color: "#F59E0B", delta: "-0.03pp vs mês ant.", up: false },
              ].map(({ label, value, color, delta, up }) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 11, padding: "14px 16px" }}>
                  <div style={{ ...S.label, marginBottom: 8 }}>{label}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color, marginBottom: 6 }}>{value}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5,
                    fontSize: 10, fontWeight: 700,
                    color: up ? "#4ADE80" : "#F87171" }}>
                    <ArrowUpRight size={10} style={{ transform: up ? "none" : "rotate(90deg)" }} />
                    {delta}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estrutura regulatória */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: 14 }}>Estrutura Regulatória</div>
            {[
              { label: "CVM — ICVM 356", status: "Registrado", color: "#4ADE80" },
              { label: "Rating Fitch", status: `${mockFIDC.rating}`, color: "#4ADE80" },
              { label: "Auditoria Externa", status: mockFIDC.auditor, color: "#4ADE80" },
              { label: "Custodiante CVM", status: mockFIDC.custodiante, color: "#4ADE80" },
              { label: "SCD Parceira", status: "QI Tech (autorizada BCB)", color: "#4ADE80" },
              { label: "Averbação Eletrônica", status: "Integrada Dataprev/SIAPE", color: "#4ADE80" },
            ].map(({ label, status, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>{label}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color }}>
                  <CheckCircle size={10} /> {status}
                </span>
              </div>
            ))}
          </div>

          {/* Fluxo de capital */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: 14 }}>Fluxo de Capital — Como funciona</div>
            {[
              { step: "1", text: "Investidores aportam capital comprando cotas sênior/subordinada", color: "#6366F1" },
              { step: "2", text: "Fundo disponibiliza capital para VerbaTech emitir CCBs", color: "#10B981" },
              { step: "3", text: "CCBs são cedidas ao FIDC como direitos creditórios", color: "#F59E0B" },
              { step: "4", text: "Parcelas pagas pelos clientes retornam ao fundo (capital + spread)", color: "#06B6D4" },
              { step: "5", text: "Fundo distribui rendimentos proporcionais às cotas", color: "#4ADE80" },
              { step: "6", text: "VerbaTech retém taxa de administração e serviço (1.5%/contrato)", color: "#A78BFA" },
            ].map(({ step, text, color }) => (
              <div key={step} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: color + "22", border: `1px solid ${color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 900, color }}>
                  {step}
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6, paddingTop: 4 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
