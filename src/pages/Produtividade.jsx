// VerbaTech — Produtividade (Corban Master Report)
import { useState, useEffect, useRef } from "react";
import {
  BarChart2, TrendingUp, Users, FileText, Download, Award,
  ChevronUp, ChevronDown, Target, Clock, CheckCircle,
  XCircle, AlertCircle, Star, Zap, Filter, Calendar,
  Printer, RefreshCw, Eye, ArrowUpRight, ArrowDownRight,
  Medal, Crown, PieChart as PieIcon,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend,
  AreaChart, Area,
} from "recharts";
import {
  mockDigitadores, mockRelatorioMes, mockSession, fmt, fmtPct,
} from "../data/verbatechData";

/* ── design tokens ─────────────────────────────────────── */
const S = {
  page:  { padding: 24, minHeight: "100vh", background: "#080E1A" },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
  h2:    { fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 },
  h3:    { fontSize: 13, fontWeight: 600, color: "#CBD5E1", margin: 0 },
};

const MEDAL_ICON  = ["🥇","🥈","🥉","4º","5º","6º"];
const MEDAL_COLOR = ["#FFD700","#C0C0C0","#CD7F32","#94A3B8","#94A3B8","#94A3B8"];
const STATUS_CFG  = {
  ativo:    { label: "Ativo",    color: "#4ADE80" },
  afastado: { label: "Afastado", color: "#F59E0B" },
  inativo:  { label: "Inativo",  color: "#64748B" },
};
const PIE_COLORS = ["#6366F1","#06B6D4","#F59E0B","#EF4444"];

/* ── helpers ───────────────────────────────────────────── */
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
        background: color, transition: `width 0.9s cubic-bezier(.4,0,.2,1) ${delay}ms`,
        boxShadow: `0 0 8px ${color}55`,
      }} />
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, color, delta, deltaUp }) {
  return (
    <div style={{ ...S.card, display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${color}18, transparent 70%)` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "22",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color={color} />
        </div>
        <span style={S.label}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#F1F5F9", letterSpacing: -0.5 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {delta && (
          <span style={{ display: "flex", alignItems: "center", gap: 2,
            color: deltaUp ? "#4ADE80" : "#F87171", fontSize: 11, fontWeight: 700 }}>
            {deltaUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {delta}
          </span>
        )}
        <span style={{ fontSize: 11, color: "#64748B" }}>{sub}</span>
      </div>
    </div>
  );
}

function MiniSparkline({ data, color }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const w = 64, h = 24, p = 2;
  const pts = data.map((v, i) => {
    const x = p + (i / (data.length - 1)) * (w - p * 2);
    const y = h - p - ((v - min) / range) * (h - p * 2);
    return `${x},${y}`;
  }).join(" ");
  const last = data[data.length - 1];
  const lx = w - p;
  const ly = h - p - ((last - min) / range) * (h - p * 2);
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" opacity="0.8" />
      <circle cx={lx} cy={ly} r="2.5" fill={color} />
    </svg>
  );
}

/* ── Ranking Row ─────────────────────────────────────── */
function RankingRow({ dig, rank, selected, onSelect }) {
  const maxProd = Math.max(...mockDigitadores.map(d => d.producaoMes));
  const pct = Math.round((dig.producaoMes / maxProd) * 100);
  const sc = STATUS_CFG[dig.status] || STATUS_CFG.inativo;
  const isTop = rank < 3;
  return (
    <div
      onClick={() => onSelect(dig)}
      style={{
        display: "grid", gridTemplateColumns: "36px 1fr 90px 90px 80px 80px 64px 56px",
        alignItems: "center", gap: 12, padding: "12px 16px",
        background: selected ? "rgba(99,102,241,0.12)" : "transparent",
        borderRadius: 10, cursor: "pointer",
        border: selected ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
        transition: "all .2s",
      }}
    >
      {/* medal */}
      <div style={{ fontSize: rank < 3 ? 18 : 12, textAlign: "center",
        color: MEDAL_COLOR[rank], fontWeight: 800 }}>
        {MEDAL_ICON[rank]}
      </div>

      {/* name + bar */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: isTop ? `linear-gradient(135deg, #6366F1, #8B5CF6)` : "rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 800, color: "#fff",
          }}>{dig.avatar}</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{dig.nome}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
            background: sc.color + "20", color: sc.color, border: `1px solid ${sc.color}30`,
          }}>{sc.label}</span>
        </div>
        <AnimBar pct={pct} color={isTop ? "#6366F1" : "#334155"} height={4} delay={rank * 80} />
      </div>

      {/* contratos / meta */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>{dig.contratos}</div>
        <div style={{ fontSize: 10, color: "#64748B" }}>meta {dig.meta}</div>
      </div>

      {/* produção */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#4ADE80" }}>{fmt(dig.producaoMes)}</div>
      </div>

      {/* conversão */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>{dig.taxaConversao}%</div>
        <div style={{ fontSize: 9, color: "#64748B" }}>conversão</div>
      </div>

      {/* aprovação */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700,
          color: dig.taxaAprovacao >= 88 ? "#4ADE80" : dig.taxaAprovacao >= 80 ? "#FCD34D" : "#F87171" }}>
          {dig.taxaAprovacao}%
        </div>
        <div style={{ fontSize: 9, color: "#64748B" }}>aprovação</div>
      </div>

      {/* sparkline */}
      <MiniSparkline data={dig.historico} color={rank === 0 ? "#6366F1" : "#475569"} />

      {/* tempo */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>{dig.tempoMedio}h</div>
        <div style={{ fontSize: 9, color: "#64748B" }}>t.médio</div>
      </div>
    </div>
  );
}

/* ── Drawer ──────────────────────────────────────────── */
function DigitadorDrawer({ dig, onClose }) {
  if (!dig) return null;
  const sc = STATUS_CFG[dig.status] || STATUS_CFG.inativo;
  const totalProd = Object.values(dig.produtos).reduce((a, b) => a + b, 0);
  const pieData = [
    { name: "INSS", value: dig.produtos.consignadoINSS, color: "#6366F1" },
    { name: "FGTS", value: dig.produtos.fgts, color: "#06B6D4" },
    { name: "RMC", value: dig.produtos.rmc, color: "#F59E0B" },
    { name: "Pessoal", value: dig.produtos.pessoal, color: "#EF4444" },
  ];
  const histData = dig.historico.map((v, i) => ({
    semana: `S${i + 1}`, contratos: v, meta: Math.round(dig.meta / 6),
  }));

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 400,
      background: "#0D1525", borderLeft: "1px solid rgba(255,255,255,0.08)",
      zIndex: 200, display: "flex", flexDirection: "column",
      boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
    }}>
      {/* header */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "#fff",
            }}>{dig.avatar}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9" }}>{dig.nome}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4,
                  background: sc.color + "20", color: sc.color, fontWeight: 700 }}>{sc.label}</span>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4,
                  background: "rgba(255,255,255,0.08)", color: "#94A3B8", fontWeight: 600 }}>{dig.loja}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, color: "#94A3B8", cursor: "pointer", padding: "6px 10px", fontSize: 11,
          }}>✕ Fechar</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 16 }}>
          {[
            { l: "Contratos", v: `${dig.contratos}/${dig.meta}`, c: "#6366F1" },
            { l: "Produção", v: fmt(dig.producaoMes), c: "#4ADE80" },
            { l: "Ticket Médio", v: fmt(dig.ticketMedio), c: "#F59E0B" },
          ].map(({ l, v, c }) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, color: "#64748B", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* body */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* KPIs */}
        <div>
          <p style={{ ...S.label, marginBottom: 12 }}>Indicadores de performance</p>
          {[
            { label: "Taxa de Conversão", value: dig.taxaConversao, max: 100, color: "#6366F1", suffix: "%" },
            { label: "Taxa de Aprovação IA", value: dig.taxaAprovacao, max: 100, color: "#4ADE80", suffix: "%" },
            { label: "Meta Atingida", value: Math.round((dig.contratos / dig.meta) * 100), max: 100, color: "#F59E0B", suffix: "%" },
          ].map(({ label, value, max, color, suffix }, i) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}{suffix}</span>
              </div>
              <AnimBar pct={Math.min((value / max) * 100, 100)} color={color} height={6} delay={i * 100} />
            </div>
          ))}
        </div>

        {/* Histórico */}
        <div>
          <p style={{ ...S.label, marginBottom: 12 }}>Evolução de contratos (6 semanas)</p>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={histData}>
              <defs>
                <linearGradient id="drawerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="semana" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0D1525", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
              <Area dataKey="contratos" stroke="#6366F1" fill="url(#drawerGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Mix produto */}
        <div>
          <p style={{ ...S.label, marginBottom: 12 }}>Mix de produtos</p>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <PieChart width={110} height={110}>
              <Pie data={pieData} cx={50} cy={50} innerRadius={28} outerRadius={48}
                dataKey="value" stroke="none">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              {pieData.map(e => (
                <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color }} />
                  <span style={{ fontSize: 11, color: "#94A3B8", flex: 1 }}>{e.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: e.color }}>{e.value}</span>
                  <span style={{ fontSize: 10, color: "#64748B" }}>({Math.round((e.value / totalProd) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { l: "CPF", v: dig.cpf },
            { l: "Loja", v: dig.loja },
            { l: "Tempo médio proposta", v: `${dig.tempoMedio}h` },
            { l: "Ranking", v: `#${dig.ranking}` },
          ].map(({ l, v }) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ ...S.label, marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 12, color: "#E2E8F0", fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* footer */}
      <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10 }}>
        <button style={{
          flex: 1, padding: "10px 16px", borderRadius: 10,
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          border: "none", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Download size={14} /> Exportar PDF
        </button>
        <button style={{
          padding: "10px 16px", borderRadius: 10,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          color: "#94A3B8", fontWeight: 600, fontSize: 12, cursor: "pointer",
        }}>
          <Eye size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────────────── */
export default function Produtividade() {
  const [selected, setSelected]   = useState(null);
  const [sortBy, setSortBy]       = useState("ranking");
  const [filterStatus, setFilter] = useState("todos");
  const [pdfToast, setPdfToast]   = useState(false);

  const rel  = mockRelatorioMes;
  const digs = [...mockDigitadores]
    .filter(d => filterStatus === "todos" || d.status === filterStatus)
    .sort((a, b) => sortBy === "ranking" ? a.ranking - b.ranking
      : sortBy === "producao" ? b.producaoMes - a.producaoMes
      : b.taxaConversao - a.taxaConversao);

  function handleExportPdf() {
    setPdfToast(true);
    setTimeout(() => setPdfToast(false), 2800);
  }

  return (
    <div style={S.page}>
      {/* PDF toast */}
      {pdfToast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 999,
          background: "#4ADE80", color: "#050D18", borderRadius: 12,
          padding: "12px 20px", fontWeight: 700, fontSize: 13,
          boxShadow: "0 8px 32px rgba(74,222,128,0.35)",
          display: "flex", alignItems: "center", gap: 8,
          animation: "fadeIn .3s ease",
        }}>
          <CheckCircle size={16} /> PDF gerado com sucesso! Baixando...
        </div>
      )}

      {/* ── header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <BarChart2 size={22} color="#6366F1" />
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F1F5F9" }}>
              Produtividade — Corban Master
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
            Período: <strong style={{ color: "#94A3B8" }}>{rel.periodo}</strong> · Loja Master: SP-Centro
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportPdf} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            border: "none", borderRadius: 10, color: "#fff",
            fontWeight: 700, fontSize: 12, padding: "10px 18px", cursor: "pointer",
          }}>
            <Download size={14} /> Exportar PDF
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, color: "#94A3B8", fontWeight: 600, fontSize: 12,
            padding: "10px 14px", cursor: "pointer",
          }}>
            <Printer size={14} /> Imprimir
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        <KpiCard icon={Users} label="Digitadores Ativos" value={`${rel.ativos}/${rel.totalDigitadores}`}
          sub="Abr/2024" color="#6366F1" delta="+1" deltaUp />
        <KpiCard icon={FileText} label="Contratos no Mês" value={rel.totalContratos}
          sub={`Meta: ${Math.round(rel.totalContratos / 0.875)}`} color="#4ADE80"
          delta={`${rel.metaAtingimento}% da meta`} deltaUp />
        <KpiCard icon={TrendingUp} label="Produção Total" value={fmt(rel.producaoTotal)}
          sub="vs. mar: +R$63k" color="#F59E0B" delta="+13.5%" deltaUp />
        <KpiCard icon={Target} label="Conv. Média" value={`${rel.taxaConversaoMedia}%`}
          sub={`Aprovação: ${rel.taxaAprovacaoMedia}%`} color="#06B6D4" delta="+2.3pp" deltaUp />
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
        {/* Evolução semanal */}
        <div style={{ ...S.card, gridColumn: "1/3" }}>
          <p style={{ ...S.label, marginBottom: 16 }}>Evolução semanal de contratos — Abr/24</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={rel.evolucaoSemanal}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="semana" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0D1525", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                formatter={(v, n) => [n === "contratos" ? v : fmt(v), n === "contratos" ? "Contratos" : "Produção"]} />
              <Bar dataKey="contratos" fill="#6366F1" radius={[4,4,0,0]} name="contratos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mix produtos */}
        <div style={S.card}>
          <p style={{ ...S.label, marginBottom: 12 }}>Mix de produtos — Abr/24</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <PieChart width={140} height={140}>
              <Pie data={rel.distribuicaoProdutos} cx={65} cy={65} innerRadius={38} outerRadius={60}
                dataKey="contratos" stroke="none">
                {rel.distribuicaoProdutos.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
            </PieChart>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {rel.distribuicaoProdutos.map((p, i) => (
                <div key={p.produto} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "#94A3B8", flex: 1 }}>{p.produto}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: PIE_COLORS[i] }}>{p.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Ranking Table ── */}
      <div style={S.card}>
        {/* controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Award size={16} color="#6366F1" />
            <span style={S.h2}>Ranking de Digitadores</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {/* filter status */}
            {["todos", "ativo", "afastado"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                background: filterStatus === f ? "#6366F1" : "rgba(255,255,255,0.06)",
                color: filterStatus === f ? "#fff" : "#64748B",
                border: filterStatus === f ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}>
                {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <div style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />
            {/* sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "#94A3B8", fontSize: 11, padding: "6px 10px", cursor: "pointer",
            }}>
              <option value="ranking">Por Ranking</option>
              <option value="producao">Por Produção</option>
              <option value="conversao">Por Conversão</option>
            </select>
          </div>
        </div>

        {/* table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "36px 1fr 90px 90px 80px 80px 64px 56px",
          gap: 12, padding: "8px 16px", marginBottom: 4,
        }}>
          {["#","Nome / Barra de Produção","Contratos","Produção","Conversão","Aprovação","Histórico","T.Médio"].map(h => (
            <div key={h} style={{ ...S.label, textAlign: h === "#" ? "center" : "left" }}>{h}</div>
          ))}
        </div>

        {/* rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {digs.map((d, i) => (
            <RankingRow key={d.id} dig={d} rank={i} selected={selected?.id === d.id} onSelect={setSelected} />
          ))}
        </div>

        {/* summary row */}
        <div style={{
          display: "grid", gridTemplateColumns: "36px 1fr 90px 90px 80px 80px 64px 56px",
          gap: 12, padding: "14px 16px", marginTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div />
          <div style={{ fontSize: 11, fontWeight: 800, color: "#6366F1", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Total / Média
          </div>
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>
            {digs.reduce((a, d) => a + d.contratos, 0)}
          </div>
          <div style={{ textAlign: "right", fontSize: 12, fontWeight: 700, color: "#4ADE80" }}>
            {fmt(digs.reduce((a, d) => a + d.producaoMes, 0))}
          </div>
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>
            {(digs.reduce((a, d) => a + d.taxaConversao, 0) / (digs.length || 1)).toFixed(1)}%
          </div>
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#4ADE80" }}>
            {(digs.reduce((a, d) => a + d.taxaAprovacao, 0) / (digs.length || 1)).toFixed(1)}%
          </div>
          <div />
          <div />
        </div>
      </div>

      {/* drawer */}
      {selected && <DigitadorDrawer dig={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
