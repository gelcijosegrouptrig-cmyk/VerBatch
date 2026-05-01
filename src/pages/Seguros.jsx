// VerbaTech — Seguros (Multiproduct Insurance CRM)
import { useState, useEffect } from "react";
import {
  Shield, Heart, Home, Smile, Activity, TrendingUp, DollarSign,
  CheckCircle, Clock, XCircle, AlertCircle, ChevronRight, Zap,
  BarChart2, Users, Star, Package, FileText, Plus, Eye,
  ArrowUpRight, Wifi, WifiOff, Settings,
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { mockSeguros, mockSegurosPipeline, fmt, fmtPct } from "../data/verbatechData";

/* ── tokens ───────────────────────────────────────── */
const S = {
  page:  { padding: 24, minHeight: "100vh", background: "#080E1A" },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
  h2:    { fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 },
};

const TYPE_CFG = {
  Vida:         { icon: Heart,    color: "#EF4444", grad: "linear-gradient(135deg,#EF4444,#DC2626)" },
  Prestamista:  { icon: Shield,   color: "#6366F1", grad: "linear-gradient(135deg,#6366F1,#4F46E5)" },
  Residencial:  { icon: Home,     color: "#10B981", grad: "linear-gradient(135deg,#10B981,#059669)" },
  Saúde:        { icon: Activity, color: "#06B6D4", grad: "linear-gradient(135deg,#06B6D4,#0891B2)" },
  Odontológico: { icon: Smile,    color: "#F59E0B", grad: "linear-gradient(135deg,#F59E0B,#D97706)" },
};

const STATUS_CFG = {
  online:         { label: "Online",        color: "#4ADE80" },
  parcial:        { label: "Parcial",       color: "#F59E0B" },
  em_implantacao: { label: "Em implantação",color: "#38BDF8" },
  offline:        { label: "Offline",       color: "#F87171" },
};

const PIPE_STATUS = {
  aprovado:     { label: "Aprovado",       color: "#4ADE80", icon: CheckCircle },
  analise:      { label: "Em análise",     color: "#38BDF8", icon: Clock },
  pendente_doc: { label: "Pendente doc.",  color: "#F59E0B", icon: AlertCircle },
  recusado:     { label: "Recusado",       color: "#F87171", icon: XCircle },
};

const PIE_COLORS = ["#EF4444","#6366F1","#10B981","#06B6D4","#F59E0B"];

/* ── Animated bar ─────────────────────────────────── */
function AnimBar({ pct, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 120 + delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 5 }}>
      <div style={{ height: "100%", width: `${w}%`, borderRadius: 5, background: color,
        transition: `width 0.85s cubic-bezier(.4,0,.2,1) ${delay}ms`, boxShadow: `0 0 6px ${color}55` }} />
    </div>
  );
}

/* ── Pulse dot ────────────────────────────────────── */
function PulseDot({ color }) {
  return (
    <div style={{ position: "relative", width: 10, height: 10 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color,
        animation: "pulse 2s infinite", opacity: 0.35 }} />
      <div style={{ position: "absolute", inset: 2, borderRadius: "50%", background: color }} />
    </div>
  );
}

/* ── Seguro Card ──────────────────────────────────── */
function SeguroCard({ seg, selected, onSelect }) {
  const tc   = TYPE_CFG[seg.tipo] || TYPE_CFG.Vida;
  const sc   = STATUS_CFG[seg.status] || STATUS_CFG.offline;
  const Icon = tc.icon;
  return (
    <div onClick={() => onSelect(seg)} style={{
      background: selected
        ? `linear-gradient(135deg, ${tc.color}15, rgba(255,255,255,0.03))`
        : "rgba(255,255,255,0.025)",
      border: selected ? `1px solid ${tc.color}44` : "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: 18, cursor: "pointer",
      transition: "all .25s", position: "relative", overflow: "hidden",
      transform: selected ? "translateY(-2px)" : "none",
      boxShadow: selected ? `0 8px 32px ${tc.color}25` : "none",
    }}>
      {/* glow */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80,
        background: `radial-gradient(circle, ${tc.color}20, transparent 70%)`, borderRadius: "50%" }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: tc.grad,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={19} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9" }}>{seg.nome}</div>
            <div style={{ fontSize: 10, color: "#64748B" }}>{seg.seguradora}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <PulseDot color={sc.color} />
          <span style={{ fontSize: 9, color: sc.color, fontWeight: 700 }}>{sc.label}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
          <div style={{ fontSize: 9, color: "#64748B", marginBottom: 3 }}>Comissão</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: tc.color }}>{seg.comissaoBase}%</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px" }}>
          <div style={{ fontSize: 9, color: "#64748B", marginBottom: 3 }}>Contratos/mês</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9" }}>{seg.contratosMes}</div>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 10, color: "#64748B" }}>Conversão</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: tc.color }}>{seg.taxaConversao}%</span>
        </div>
        <AnimBar pct={seg.taxaConversao} color={tc.color} />
      </div>

      <div style={{ marginTop: 10, fontSize: 10, color: "#64748B" }}>
        Prêmio: <span style={{ color: "#94A3B8" }}>R$ {seg.premioMin}–{seg.premioMax}</span>
        {seg.prazoCarencia === 0 && (
          <span style={{ marginLeft: 8, background: "#4ADE8022", color: "#4ADE80",
            padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>Zero carência</span>
        )}
      </div>
    </div>
  );
}

/* ── Detail Panel ─────────────────────────────────── */
function SeguroDetail({ seg }) {
  if (!seg) return (
    <div style={{ ...S.card, display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 300, gap: 12 }}>
      <Shield size={36} color="#334155" />
      <p style={{ color: "#475569", fontSize: 13 }}>Selecione um seguro para ver detalhes</p>
    </div>
  );

  const tc = TYPE_CFG[seg.tipo] || TYPE_CFG.Vida;
  const sc = STATUS_CFG[seg.status] || STATUS_CFG.offline;
  const Icon = tc.icon;

  return (
    <div style={{ ...S.card, display: "flex", flexDirection: "column", gap: 18 }}>
      {/* hero */}
      <div style={{ background: `linear-gradient(135deg,${tc.color}18,rgba(255,255,255,0.02))`,
        borderRadius: 12, padding: "16px 18px", border: `1px solid ${tc.color}25` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: tc.grad,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#F1F5F9" }}>{seg.nome}</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>{seg.seguradora} · {seg.api}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <PulseDot color={sc.color} />
            <span style={{ fontSize: 10, fontWeight: 700, color: sc.color }}>{sc.label}</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[
            { l: "Comissão", v: `${seg.comissaoBase}%`, c: tc.color },
            { l: "Contratos/mês", v: seg.contratosMes, c: "#F1F5F9" },
            { l: "Produção Mês", v: fmt(seg.producaoMes), c: "#4ADE80" },
            { l: "Comissão Mês", v: fmt(seg.comissaoMes), c: "#F59E0B" },
          ].map(({ l, v, c }) => (
            <div key={l} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ ...S.label, marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* benefícios */}
      <div>
        <p style={{ ...S.label, marginBottom: 10 }}>Coberturas incluídas</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {seg.beneficios.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9,
              background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 12px" }}>
              <CheckCircle size={13} color={tc.color} />
              <span style={{ fontSize: 12, color: "#CBD5E1" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* vantagens */}
      <div>
        <p style={{ ...S.label, marginBottom: 10 }}>Vantagens para o Corban</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {seg.vantagens.map((v, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 600,
              background: tc.color + "18", color: tc.color,
              border: `1px solid ${tc.color}30`, borderRadius: 8, padding: "4px 10px" }}>{v}</span>
          ))}
        </div>
      </div>

      {/* público alvo */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px",
        display: "flex", alignItems: "center", gap: 10 }}>
        <Users size={16} color="#6366F1" />
        <div>
          <div style={{ fontSize: 9, color: "#64748B", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Público-alvo</div>
          <div style={{ fontSize: 12, color: "#CBD5E1" }}>{seg.publico}</div>
        </div>
        {seg.prazoCarencia > 0 && (
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ ...S.label, marginBottom: 2 }}>Carência</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B" }}>{seg.prazoCarencia} dias</div>
          </div>
        )}
      </div>

      {seg.cobertura && (
        <div style={{ display: "flex", alignItems: "center", gap: 8,
          background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)",
          borderRadius: 10, padding: "10px 14px" }}>
          <Shield size={14} color="#4ADE80" />
          <span style={{ fontSize: 12, color: "#4ADE80", fontWeight: 700 }}>
            Cobertura máxima: {fmt(seg.cobertura)}
          </span>
        </div>
      )}

      <button style={{
        padding: "12px 16px", borderRadius: 12,
        background: tc.grad, border: "none", color: "#fff",
        fontWeight: 700, fontSize: 13, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        boxShadow: `0 4px 20px ${tc.color}40`,
      }}>
        <Plus size={15} /> Nova Proposta de Seguro
      </button>
    </div>
  );
}

/* ── Pipeline Table ───────────────────────────────── */
function PipelineTable() {
  return (
    <div style={S.card}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <FileText size={16} color="#6366F1" />
        <span style={S.h2}>Pipeline de Seguros</span>
        <span style={{ marginLeft: "auto", fontSize: 10, padding: "3px 10px", borderRadius: 20,
          background: "#6366F122", color: "#6366F1", fontWeight: 700 }}>
          {mockSegurosPipeline.length} propostas
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {mockSegurosPipeline.map(p => {
          const pc = PIPE_STATUS[p.status] || PIPE_STATUS.analise;
          const PIcon = pc.icon;
          const tc = TYPE_CFG[p.tipo] || TYPE_CFG.Vida;
          const TIcon = tc.icon;
          return (
            <div key={p.id} style={{
              display: "grid", gridTemplateColumns: "28px 1fr 100px 80px 100px 110px 90px",
              alignItems: "center", gap: 12, padding: "10px 12px",
              background: "rgba(255,255,255,0.025)", borderRadius: 10,
              transition: "background .2s", cursor: "pointer",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.045)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: tc.color + "20",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TIcon size={13} color={tc.color} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>{p.cliente}</div>
                <div style={{ fontSize: 10, color: "#64748B" }}>{p.cpf}</div>
              </div>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>{p.tipo}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9" }}>R$ {p.premio}/m</span>
              <span style={{ fontSize: 11, color: "#64748B" }}>{p.seguradora}</span>
              <span style={{ fontSize: 11, color: "#64748B" }}>{p.digitador.split(" ")[0]}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <PIcon size={12} color={pc.color} />
                <span style={{ fontSize: 10, fontWeight: 700, color: pc.color }}>{pc.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── MAIN ──────────────────────────────────────────── */
export default function Seguros() {
  const [selected, setSelected] = useState(mockSeguros[1]); // default Prestamista

  const totalContratos = mockSeguros.reduce((a, s) => a + s.contratosMes, 0);
  const totalProducao  = mockSeguros.reduce((a, s) => a + s.producaoMes, 0);
  const totalComissao  = mockSeguros.reduce((a, s) => a + s.comissaoMes, 0);

  const pieData = mockSeguros.map((s, i) => ({
    name: s.tipo, value: s.contratosMes, color: PIE_COLORS[i],
  }));

  const barData = mockSeguros.map(s => ({
    tipo: s.tipo, comissao: s.comissaoMes, conversao: s.taxaConversao,
  }));

  return (
    <div style={S.page}>
      {/* ── header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Shield size={22} color="#EF4444" />
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F1F5F9" }}>Seguros</h1>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20,
              background: "rgba(239,68,68,0.15)", color: "#EF4444", fontWeight: 700 }}>Multiproduct</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
            Gestão de seguros + pipeline · {mockSeguros.filter(s => s.status === "online").length} seguradoras online
          </p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "linear-gradient(135deg,#EF4444,#DC2626)",
          border: "none", borderRadius: 10, color: "#fff",
          fontWeight: 700, fontSize: 12, padding: "10px 18px", cursor: "pointer",
        }}>
          <Plus size={14} /> Nova Cotação
        </button>
      </div>

      {/* ── KPI strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { l: "Produtos ativos", v: mockSeguros.filter(s => s.status === "online").length, icon: Package, color: "#6366F1" },
          { l: "Contratos no Mês", v: totalContratos, icon: FileText, color: "#4ADE80" },
          { l: "Produção Seguros", v: fmt(totalProducao), icon: TrendingUp, color: "#F59E0B" },
          { l: "Comissão Gerada", v: fmt(totalComissao), icon: DollarSign, color: "#EF4444" },
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 14, marginBottom: 24 }}>
        {/* left: product grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {mockSeguros.map(seg => (
              <SeguroCard key={seg.id} seg={seg} selected={selected?.id === seg.id}
                onSelect={s => setSelected(s)} />
            ))}
          </div>
          <PipelineTable />
        </div>

        {/* right: detail + charts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SeguroDetail seg={selected} />

          {/* pie chart */}
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 12 }}>Mix contratos por produto</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <PieChart width={160} height={160}>
                <Pie data={pieData} cx={75} cy={75} innerRadius={40} outerRadius={68}
                  dataKey="value" stroke="none">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 7 }}>
                {pieData.filter(d => d.value > 0).map(e => (
                  <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color }} />
                    <span style={{ fontSize: 11, color: "#94A3B8", flex: 1 }}>{e.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: e.color }}>{e.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* comissão por produto bar */}
          <div style={S.card}>
            <p style={{ ...S.label, marginBottom: 12 }}>Comissão gerada (R$)</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `R$${Math.round(v)}`} />
                <YAxis type="category" dataKey="tipo" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} width={72} />
                <Tooltip contentStyle={{ background: "#0D1525", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }}
                  formatter={v => [fmt(v), "Comissão"]} />
                <Bar dataKey="comissao" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
