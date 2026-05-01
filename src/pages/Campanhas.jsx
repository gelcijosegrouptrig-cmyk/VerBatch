// VerbaTech — Campanhas CRM (WhatsApp + SMS + Email Automation)
import { useState, useEffect } from "react";
import {
  MessageSquare, Mail, Smartphone, Zap, Users, TrendingUp,
  CheckCircle, Clock, XCircle, AlertCircle, Plus, Eye,
  BarChart2, Target, Send, Filter, Calendar, Star,
  ChevronRight, ArrowUpRight, Search, Tag, Flame,
  Thermometer, Snowflake, Play, Pause, Settings,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { mockCampanhas, mockProspects, fmt } from "../data/verbatechData";

/* ── tokens ─────────────────────────────────────── */
const S = {
  page:  { padding: 24 },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
  h2:    { fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 },
};

const TIPO_CFG = {
  whatsapp: { label: "WhatsApp", color: "#25D366", icon: MessageSquare, grad: "linear-gradient(135deg,#25D366,#128C7E)" },
  sms:      { label: "SMS",      color: "#6366F1", icon: Smartphone,    grad: "linear-gradient(135deg,#6366F1,#4F46E5)" },
  email:    { label: "E-mail",   color: "#F59E0B", icon: Mail,          grad: "linear-gradient(135deg,#F59E0B,#D97706)" },
};

const STATUS_CFG = {
  ativa:     { label: "Ativa",     color: "#4ADE80", icon: Play },
  agendada:  { label: "Agendada",  color: "#38BDF8", icon: Clock },
  concluida: { label: "Concluída", color: "#94A3B8", icon: CheckCircle },
  pausada:   { label: "Pausada",   color: "#F59E0B", icon: Pause },
};

const LEAD_CFG = {
  quente: { label: "Quente", color: "#EF4444", icon: Flame,       bg: "#EF444418" },
  morno:  { label: "Morno",  color: "#F59E0B", icon: Thermometer, bg: "#F59E0B18" },
  frio:   { label: "Frio",   color: "#38BDF8", icon: Snowflake,   bg: "#38BDF818" },
};

const ORIGEM_CFG = {
  whatsapp:    { label: "WhatsApp",    color: "#25D366" },
  indicacao:   { label: "Indicação",   color: "#8B5CF6" },
  sms:         { label: "SMS",         color: "#6366F1" },
  landing_page:{ label: "Landing Page",color: "#F59E0B" },
};

const PIE_COLORS = ["#25D366","#6366F1","#F59E0B","#94A3B8"];

/* ── helpers ─────────────────────────────────────── */
function AnimBar({ pct, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 80 + delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 5 }}>
      <div style={{ height: "100%", width: `${w}%`, borderRadius: 5, background: color,
        transition: `width 0.85s cubic-bezier(.4,0,.2,1) ${delay}ms`, boxShadow: `0 0 6px ${color}55` }} />
    </div>
  );
}

function StatBubble({ label, value, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>{label}</div>
    </div>
  );
}

/* ── Campaign Card ─────────────────────────────────── */
function CampanhaCard({ camp, selected, onSelect }) {
  const tc = TIPO_CFG[camp.tipo]  || TIPO_CFG.whatsapp;
  const sc = STATUS_CFG[camp.status] || STATUS_CFG.pausada;
  const Icon  = tc.icon;
  const SIcon = sc.icon;
  const sentPct    = camp.total > 0 ? Math.round((camp.enviados   / camp.total) * 100) : 0;
  const openPct    = camp.enviados > 0 ? Math.round((camp.abertos / camp.enviados) * 100) : 0;
  const convPct    = camp.abertos > 0 ? Math.round((camp.convertidos / camp.abertos) * 100) : 0;

  return (
    <div onClick={() => onSelect(camp)} style={{
      ...S.card, cursor: "pointer", position: "relative", overflow: "hidden",
      border: selected ? `1px solid ${tc.color}44` : "1px solid rgba(255,255,255,0.07)",
      background: selected ? `linear-gradient(135deg,${tc.color}10,rgba(255,255,255,0.02))` : "rgba(255,255,255,0.025)",
      transform: selected ? "translateY(-2px)" : "none",
      boxShadow: selected ? `0 8px 28px ${tc.color}20` : "none",
      transition: "all .25s",
    }}>
      {/* glow */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90,
        background: `radial-gradient(circle, ${tc.color}18, transparent 70%)` }} />

      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: tc.grad,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={17} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", marginBottom: 3 }}>{camp.nome}</div>
          <div style={{ fontSize: 10, color: "#64748B" }}>{camp.publico}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <SIcon size={11} color={sc.color} />
          <span style={{ fontSize: 9, fontWeight: 700, color: sc.color }}>{sc.label}</span>
        </div>
      </div>

      {/* stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14,
        background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 8px" }}>
        <StatBubble label="Total" value={camp.total} color="#94A3B8" />
        <StatBubble label="Enviados" value={`${sentPct}%`} color={tc.color} />
        <StatBubble label="Abertos" value={`${openPct}%`} color="#F59E0B" />
        <StatBubble label="Convertidos" value={camp.convertidos} color="#4ADE80" />
      </div>

      {/* funnel bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#64748B" }}>Entrega</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: tc.color }}>{sentPct}%</span>
          </div>
          <AnimBar pct={sentPct} color={tc.color} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#64748B" }}>Abertura</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#F59E0B" }}>{camp.taxaAbertura.toFixed(1)}%</span>
          </div>
          <AnimBar pct={camp.taxaAbertura} color="#F59E0B" delay={100} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#64748B" }}>Conversão</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#4ADE80" }}>{camp.taxaConversao.toFixed(1)}%</span>
          </div>
          <AnimBar pct={camp.taxaConversao * 3} color="#4ADE80" delay={200} />
        </div>
      </div>

      {camp.producaoGerada > 0 && (
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 7,
          background: "rgba(74,222,128,0.06)", borderRadius: 8, padding: "7px 10px" }}>
          <TrendingUp size={12} color="#4ADE80" />
          <span style={{ fontSize: 10, color: "#4ADE80", fontWeight: 700 }}>
            Produção gerada: {fmt(camp.producaoGerada)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Campaign Detail ──────────────────────────────── */
function CampanhaDetail({ camp }) {
  if (!camp) return (
    <div style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: 200, gap: 12 }}>
      <MessageSquare size={32} color="#334155" />
      <p style={{ color: "#475569", fontSize: 13 }}>Selecione uma campanha</p>
    </div>
  );

  const tc = TIPO_CFG[camp.tipo] || TIPO_CFG.whatsapp;

  return (
    <div style={{ ...S.card, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Target size={16} color={tc.color} />
        <span style={{ ...S.h2, color: tc.color }}>{camp.nome}</span>
      </div>

      {/* template preview */}
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 14,
        border: `1px solid ${tc.color}20` }}>
        <div style={{ ...S.label, marginBottom: 8 }}>Template da mensagem</div>
        <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.7, fontStyle: "italic" }}>
          "{camp.template}"
        </div>
      </div>

      {/* segmentação */}
      <div>
        <div style={{ ...S.label, marginBottom: 8 }}>Segmentação do público</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {camp.segmentacao.map((s, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 700,
              background: tc.color + "18", color: tc.color,
              border: `1px solid ${tc.color}30`, borderRadius: 6, padding: "3px 9px" }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* datas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { l: "Data início", v: camp.dataInicio },
          { l: "Data fim",    v: camp.dataFim },
          { l: "Taxa abertura", v: `${camp.taxaAbertura.toFixed(1)}%` },
          { l: "Tx conversão", v: `${camp.taxaConversao.toFixed(1)}%` },
        ].map(({ l, v }) => (
          <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "9px 12px" }}>
            <div style={{ ...S.label, marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button style={{
          padding: "10px", borderRadius: 10, background: tc.grad,
          border: "none", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Eye size={13} /> Ver detalhes
        </button>
        <button style={{
          padding: "10px", borderRadius: 10,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          color: "#94A3B8", fontWeight: 600, fontSize: 12, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Settings size={13} /> Editar
        </button>
      </div>
    </div>
  );
}

/* ── Prospects Table ──────────────────────────────── */
function ProspectsTable() {
  const [search, setSearch] = useState("");
  const filtered = mockProspects.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.produto.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={S.card}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <Flame size={16} color="#EF4444" />
        <span style={S.h2}>Pipeline de Prospects</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={12} color="#64748B" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar prospect..."
              style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, color: "#E2E8F0", fontSize: 11, padding: "6px 10px 6px 26px",
                outline: "none", width: 160,
              }}
            />
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "linear-gradient(135deg,#25D366,#128C7E)",
            border: "none", borderRadius: 8, color: "#fff",
            fontWeight: 700, fontSize: 11, padding: "7px 13px", cursor: "pointer",
          }}>
            <Plus size={12} /> Novo Prospect
          </button>
        </div>
      </div>

      {/* header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 70px 70px 100px 80px",
        gap: 10, padding: "6px 12px", marginBottom: 4 }}>
        {["Nome","Origem","Produto","Score","Margem","Digitador","Status"].map(h => (
          <div key={h} style={S.label}>{h}</div>
        ))}
      </div>

      {filtered.map(p => {
        const lc = LEAD_CFG[p.status] || LEAD_CFG.frio;
        const oc = ORIGEM_CFG[p.origem] || ORIGEM_CFG.indicacao;
        const LIcon = lc.icon;
        return (
          <div key={p.id} style={{
            display: "grid", gridTemplateColumns: "1fr 80px 80px 70px 70px 100px 80px",
            gap: 10, padding: "10px 12px", alignItems: "center",
            background: "rgba(255,255,255,0.02)", borderRadius: 10, marginBottom: 4,
            transition: "background .2s", cursor: "pointer",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.045)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>{p.nome}</div>
              <div style={{ fontSize: 9, color: "#64748B" }}>{p.cpf}</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
              background: oc.color + "18", color: oc.color, border: `1px solid ${oc.color}30` }}>
              {oc.label}
            </span>
            <span style={{ fontSize: 10, color: "#94A3B8" }}>{p.produto}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%",
                background: p.score >= 700 ? "#4ADE8020" : p.score >= 600 ? "#F59E0B20" : "#F8717120",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 800,
                color: p.score >= 700 ? "#4ADE80" : p.score >= 600 ? "#F59E0B" : "#F87171",
              }}>{p.score}</div>
            </div>
            <span style={{ fontSize: 11, color: p.margem ? "#4ADE80" : "#64748B", fontWeight: 700 }}>
              {p.margem ? `R$${p.margem}` : "—"}
            </span>
            <span style={{ fontSize: 10, color: "#94A3B8" }}>{p.digitador.split(" ")[0]}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5,
              background: lc.bg, borderRadius: 6, padding: "3px 8px" }}>
              <LIcon size={11} color={lc.color} />
              <span style={{ fontSize: 9, fontWeight: 700, color: lc.color }}>{lc.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────────── */
export default function Campanhas() {
  const [selected, setSelected] = useState(mockCampanhas[0]);

  const totalConvertidos = mockCampanhas.reduce((a, c) => a + c.convertidos, 0);
  const totalEnviados    = mockCampanhas.reduce((a, c) => a + c.enviados, 0);
  const totalProducao    = mockCampanhas.reduce((a, c) => a + c.producaoGerada, 0);
  const ativas           = mockCampanhas.filter(c => c.status === "ativa").length;

  const tipoData = Object.entries(
    mockCampanhas.reduce((acc, c) => {
      acc[c.tipo] = (acc[c.tipo] || 0) + c.convertidos;
      return acc;
    }, {})
  ).map(([tipo, v]) => ({ name: TIPO_CFG[tipo]?.label || tipo, value: v, color: TIPO_CFG[tipo]?.color || "#6366F1" }));

  return (
    <div className="page">
      {/* ── header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Send size={22} color="#25D366" />
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F1F5F9" }}>Campanhas & CRM</h1>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20,
              background: "#25D36615", color: "#25D366", fontWeight: 700 }}>
              {ativas} ativas
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
            Automação de prospecção · WhatsApp · SMS · E-mail
          </p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "linear-gradient(135deg,#25D366,#128C7E)",
          border: "none", borderRadius: 10, color: "#fff",
          fontWeight: 700, fontSize: 12, padding: "10px 18px", cursor: "pointer",
        }}>
          <Plus size={14} /> Nova Campanha
        </button>
      </div>

      {/* ── KPI strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { l: "Campanhas Ativas", v: ativas, icon: Zap, color: "#25D366" },
          { l: "Mensagens Enviadas", v: totalEnviados.toLocaleString("pt-BR"), icon: Send, color: "#6366F1" },
          { l: "Convertidos", v: totalConvertidos, icon: CheckCircle, color: "#4ADE80" },
          { l: "Produção Gerada", v: fmt(totalProducao), icon: TrendingUp, color: "#F59E0B" },
        ].map(({ l, v, icon: Icon, color }) => (
          <div key={l} style={{ ...S.card, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 70, height: 70,
              background: `radial-gradient(circle at top right, ${color}18, transparent 70%)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: color + "20",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} color={color} />
              </div>
              <span style={S.label}>{l}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── main layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14, marginBottom: 24 }}>
        {/* left: campaign cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mockCampanhas.map(camp => (
            <CampanhaCard key={camp.id} camp={camp}
              selected={selected?.id === camp.id} onSelect={setSelected} />
          ))}
        </div>

        {/* right: detail + chart */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <CampanhaDetail camp={selected} />

          {/* conversão por canal */}
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 12 }}>Conversões por canal</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <PieChart width={140} height={140}>
                <Pie data={tipoData} cx={65} cy={65} innerRadius={38} outerRadius={58}
                  dataKey="value" stroke="none">
                  {tipoData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 7 }}>
                {tipoData.map(e => (
                  <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color }} />
                    <span style={{ fontSize: 11, color: "#94A3B8", flex: 1 }}>{e.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: e.color }}>{e.value} conv.</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp integration status */}
          <div style={{ ...S.card, background: "rgba(37,211,102,0.05)",
            border: "1px solid rgba(37,211,102,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <MessageSquare size={15} color="#25D366" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#25D366" }}>WhatsApp Business API</span>
            </div>
            {[
              { l: "Status", v: "Conectado", c: "#4ADE80" },
              { l: "Número", v: "+55 11 9xxxx-xxxx", c: "#E2E8F0" },
              { l: "Template aprovado", v: "3 ativos", c: "#F59E0B" },
              { l: "Rate limit", v: "1000 msg/dia", c: "#94A3B8" },
            ].map(({ l, v, c }) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between",
                padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 11, color: "#64748B" }}>{l}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Prospects ── */}
      <ProspectsTable />
    </div>
  );
}
