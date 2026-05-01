// VerbaTech — Dashboard Funcionário Corban (Digitador / Agente de Vendas)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, DollarSign, TrendingUp, Clock, CheckCircle, XCircle,
  AlertCircle, Plus, LogOut, Zap, Users, Target, ChevronRight,
  Phone, Star, ArrowUpRight, Award, BarChart2, Send,
  Smartphone, User, MapPin, Calendar, Eye, Shield,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import {
  mockPropostas, mockDigitadores, mockRelatorioMes,
  mockProspects, mockClientes, fmt, fmtPct,
} from "../data/verbatechData";

/* ── tokens ─────────────────────────────── */
const S = {
  page:  { padding: 24 },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};

const STATUS_CFG = {
  aprovado:    { label: "Aprovado",    color: "#4ADE80", icon: CheckCircle },
  pendente:    { label: "Pendente",    color: "#F59E0B", icon: Clock },
  analise:     { label: "Em análise",  color: "#38BDF8", icon: AlertCircle },
  reprovado:   { label: "Reprovado",   color: "#F87171", icon: XCircle },
  averbado:    { label: "Averbado",    color: "#A78BFA", icon: CheckCircle },
  formalizacao:{ label: "Formalização",color: "#F59E0B", icon: Clock },
};

const LEAD_TEMP = {
  quente: { color: "#EF4444", emoji: "🔥" },
  morno:  { color: "#F59E0B", emoji: "🌡️" },
  frio:   { color: "#38BDF8", emoji: "❄️" },
};

/* ── Animated bar ─────────────────────── */
function AnimBar({ pct, color, delay = 0, height = 5 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 100 + delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: height }}>
      <div style={{ height: "100%", width: `${w}%`, borderRadius: height,
        background: color, transition: `width 0.9s cubic-bezier(.4,0,.2,1) ${delay}ms`,
        boxShadow: `0 0 7px ${color}55` }} />
    </div>
  );
}

/* ── Topbar Funcionário ───────────────── */
function FuncTopbar({ user, onLogout, onNovaProposta }) {
  return (
    <div style={{
      height: 60, background: "rgba(8,14,26,0.97)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center",
      padding: "0 24px", gap: 14, position: "sticky", top: 0, zIndex: 100,
      backdropFilter: "blur(12px)",
    }}>
      {/* logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9,
          background: "linear-gradient(135deg,#10B981,#059669)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 14px rgba(16,185,129,0.4)" }}>
          <Zap size={14} color="#fff" />
        </div>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#F1F5F9" }}>
          Verba<span style={{ color: "#10B981" }}>Tech</span>
        </span>
      </div>

      {/* page title */}
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 13, color: "#64748B" }}>Meu Painel · </span>
        <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>{user?.loja}</span>
      </div>

      {/* nova proposta */}
      <button onClick={onNovaProposta} style={{
        display: "flex", alignItems: "center", gap: 7,
        background: "linear-gradient(135deg,#10B981,#059669)",
        border: "none", borderRadius: 10, color: "#fff",
        fontWeight: 700, fontSize: 12, padding: "8px 16px", cursor: "pointer",
        boxShadow: "0 4px 16px rgba(16,185,129,0.35)",
      }}>
        <Plus size={13} /> Nova Proposta
      </button>

      {/* user badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 9,
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10, padding: "7px 12px" }}>
        <div style={{ width: 28, height: 28, borderRadius: 8,
          background: "linear-gradient(135deg,#10B981,#059669)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color: "#fff" }}>
          {user?.avatar}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>{user?.nome.split(" ")[0]}</div>
          <div style={{ fontSize: 9, color: "#10B981", fontWeight: 700 }}>Funcionário Corban</div>
        </div>
        <button onClick={onLogout} title="Sair" style={{
          background: "none", border: "none", cursor: "pointer", padding: 4, marginLeft: 4,
        }}>
          <LogOut size={13} color="#64748B" />
        </button>
      </div>
    </div>
  );
}

/* ── KPI Card ─────────────────────────── */
function KpiCard({ icon: Icon, label, value, sub, color, delta, up, onClick }) {
  return (
    <div onClick={onClick} style={{ ...S.card, padding: 18, position: "relative", overflow: "hidden",
      cursor: onClick ? "pointer" : "default",
      transition: "transform .2s",
    }}
      onMouseEnter={e => onClick && (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => onClick && (e.currentTarget.style.transform = "none")}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: 75, height: 75,
        background: `radial-gradient(circle at top right, ${color}18, transparent 70%)` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: color + "20",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} color={color} />
        </div>
        <span style={S.label}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9", marginBottom: 4 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {delta && (
          <span style={{ fontSize: 10, fontWeight: 700,
            color: up ? "#4ADE80" : "#F87171",
            display: "flex", alignItems: "center", gap: 2 }}>
            <ArrowUpRight size={11} style={{ transform: up ? "none" : "rotate(90deg)" }} /> {delta}
          </span>
        )}
        <span style={{ fontSize: 10, color: "#64748B" }}>{sub}</span>
      </div>
    </div>
  );
}

/* ── Meta Gauge ──────────────────────── */
function MetaGauge({ pct, label, color }) {
  const [displayPct, setDisplayPct] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = pct / 40;
    const id = setInterval(() => {
      start += step;
      if (start >= pct) { setDisplayPct(pct); clearInterval(id); }
      else setDisplayPct(Math.round(start));
    }, 30);
    return () => clearInterval(id);
  }, [pct]);

  const radius = 54, stroke = 9;
  const circumference = 2 * Math.PI * radius;
  const dash = (displayPct / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: 130, height: 130 }}>
        <svg width={130} height={130} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={65} cy={65} r={radius} fill="none"
            stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
          <circle cx={65} cy={65} r={radius} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray .5s ease", filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#F1F5F9" }}>{displayPct}%</div>
          <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase" }}>da meta</div>
        </div>
      </div>
      <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>{label}</span>
    </div>
  );
}

/* ── Nova Proposta Modal ─────────────── */
function NovaProposta({ onClose }) {
  const [step, setStep] = useState(1);
  const [produto, setProduto] = useState("consignadoINSS");
  const [valor, setValor] = useState(15000);
  const [prazo, setPrazo] = useState(48);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");

  const produtos = [
    { id:"consignadoINSS", label:"Consignado INSS", color:"#6366F1", taxa:1.80 },
    { id:"fgts",           label:"FGTS",            color:"#06B6D4", taxa:1.55 },
    { id:"rmc",            label:"Cartão RMC",      color:"#F59E0B", taxa:2.10 },
    { id:"pessoal",        label:"Crédito Pessoal", color:"#EF4444", taxa:3.50 },
  ];
  const sel = produtos.find(p => p.id === produto);
  const r = sel.taxa / 100;
  const parcela = (valor * r * Math.pow(1+r,prazo)) / (Math.pow(1+r,prazo) - 1);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
      zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#0D1525", borderRadius:20, width:480,
        border:"1px solid rgba(255,255,255,0.1)", boxShadow:"0 24px 60px rgba(0,0,0,0.6)" }}>
        {/* header */}
        <div style={{ padding:"20px 24px 16px",
          background:"linear-gradient(135deg,rgba(16,185,129,0.12),rgba(255,255,255,0.02))",
          borderBottom:"1px solid rgba(255,255,255,0.07)",
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#F1F5F9" }}>Nova Proposta</div>
            <div style={{ fontSize:11, color:"#64748B" }}>
              Passo {step} de 2 · {step === 1 ? "Dados do cliente" : "Produto & simulação"}
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {[1,2].map(s => (
              <div key={s} style={{ width:32, height:5, borderRadius:5,
                background: s <= step ? "#10B981" : "rgba(255,255,255,0.1)",
                transition:"background .3s" }} />
            ))}
          </div>
        </div>

        <div style={{ padding:"20px 24px" }}>
          {step === 1 ? (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ ...S.label, display:"block", marginBottom:7 }}>CPF do Cliente</label>
                <input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00"
                  style={{ width:"100%", padding:"11px 14px", borderRadius:10,
                    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                    color:"#F1F5F9", fontSize:13, outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ ...S.label, display:"block", marginBottom:7 }}>Nome Completo</label>
                <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome do cliente"
                  style={{ width:"100%", padding:"11px 14px", borderRadius:10,
                    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                    color:"#F1F5F9", fontSize:13, outline:"none", boxSizing:"border-box" }} />
              </div>
              <div style={{ background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.15)",
                borderRadius:10, padding:"11px 14px" }}>
                <div style={{ fontSize:11, color:"#64748B", marginBottom:6 }}>
                  Consulta automática ao digitar CPF:
                </div>
                {["Dataprev (margem INSS)","Serasa OpenFinance (score)","CAIXA (saldo FGTS)"].map(s=>(
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <CheckCircle size={11} color="#10B981"/>
                    <span style={{ fontSize:11, color:"#94A3B8" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {/* seleção produto */}
              <div>
                <label style={{ ...S.label, display:"block", marginBottom:9 }}>Produto</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {produtos.map(p => (
                    <button key={p.id} onClick={()=>setProduto(p.id)} style={{
                      padding:"10px 12px", borderRadius:10, cursor:"pointer",
                      background: produto===p.id ? p.color+"18" : "rgba(255,255,255,0.04)",
                      border:`1px solid ${produto===p.id ? p.color+"44" : "rgba(255,255,255,0.08)"}`,
                      color: produto===p.id ? p.color : "#94A3B8",
                      fontSize:12, fontWeight:700, transition:"all .2s",
                    }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* sliders */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                  <label style={S.label}>Valor</label>
                  <span style={{ fontSize:13, fontWeight:700, color:sel.color }}>{fmt(valor)}</span>
                </div>
                <input type="range" min={1000} max={50000} step={500} value={valor}
                  onChange={e=>setValor(+e.target.value)}
                  style={{ width:"100%", accentColor:sel.color }} />
              </div>
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                  <label style={S.label}>Prazo</label>
                  <span style={{ fontSize:13, fontWeight:700, color:sel.color }}>{prazo} meses</span>
                </div>
                <input type="range" min={12} max={84} step={6} value={prazo}
                  onChange={e=>setPrazo(+e.target.value)}
                  style={{ width:"100%", accentColor:sel.color }} />
              </div>

              {/* resultado */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {[
                  { l:"Parcela", v:fmt(parcela), c:sel.color },
                  { l:"Taxa", v:`${sel.taxa}% a.m.`, c:"#94A3B8" },
                  { l:"Minha comissão", v:fmt(valor*0.03), c:"#4ADE80" },
                ].map(({l,v,c})=>(
                  <div key={l} style={{ background:"rgba(255,255,255,0.04)", borderRadius:9, padding:"10px 12px" }}>
                    <div style={{ ...S.label, marginBottom:4 }}>{l}</div>
                    <div style={{ fontSize:13, fontWeight:800, color:c }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div style={{ padding:"14px 24px 20px",
          borderTop:"1px solid rgba(255,255,255,0.07)",
          display:"flex", gap:10 }}>
          <button onClick={step===1 ? onClose : ()=>setStep(1)} style={{
            flex:1, padding:"11px", borderRadius:11,
            background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
            color:"#94A3B8", fontWeight:700, fontSize:13, cursor:"pointer",
          }}>
            {step===1 ? "Cancelar" : "← Voltar"}
          </button>
          <button onClick={step===1 ? ()=>setStep(2) : onClose} style={{
            flex:2, padding:"11px", borderRadius:11,
            background:"linear-gradient(135deg,#10B981,#059669)",
            border:"none", color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer",
            boxShadow:"0 4px 20px rgba(16,185,129,0.35)",
          }}>
            {step===1 ? "Próximo →" : "✓ Enviar Proposta"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ────────────────────────────── */
export default function DashboardFuncionario() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // pega dados do digitador correspondente
  const meusDados = {
    meta: 50, contratos: 48, producaoMes: 142000, ticketMedio: 18200,
    taxaConversao: 74.2, taxaAprovacao: 91.5,
    historico: [
      { sem:"S1", contratos:10, meta:12 },
      { sem:"S2", contratos:13, meta:12 },
      { sem:"S3", contratos:14, meta:12 },
      { sem:"S4", contratos:11, meta:12 },
    ],
    metaPct: Math.round((48/50)*100),
  };

  const minhasPropostas = mockPropostas.slice(0, 5);
  const meusProspects   = mockProspects.slice(0, 4);

  function handleLogout() { logout(); navigate("/login"); }

  return (
    <div className="page">
        {/* ── Boas vindas ── */}
        <div style={{ marginBottom:24,
          background:"linear-gradient(135deg,rgba(16,185,129,0.12),rgba(6,182,212,0.06))",
          border:"1px solid rgba(16,185,129,0.2)", borderRadius:16, padding:"18px 22px",
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:4 }}>
              <span style={{ fontSize:20 }}>👋</span>
              <h1 style={{ margin:0, fontSize:19, fontWeight:800, color:"#F1F5F9" }}>
                Olá, {user?.nome.split(" ")[0]}!
              </h1>
              <span style={{ fontSize:11, padding:"2px 9px", borderRadius:6,
                background:"rgba(16,185,129,0.15)", color:"#10B981",
                fontWeight:800, border:"1px solid rgba(16,185,129,0.3)" }}>
                Nível {user?.nivel}
              </span>
            </div>
            <p style={{ margin:0, fontSize:12, color:"#64748B" }}>
              Loja: <strong style={{ color:"#94A3B8" }}>{user?.loja}</strong>
              {" · "}Master: <strong style={{ color:"#94A3B8" }}>{user?.masterNome}</strong>
              {" · "}{new Date().toLocaleDateString("pt-BR", { weekday:"long", day:"2-digit", month:"long" })}
            </p>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:"#64748B", marginBottom:3 }}>Comissão do mês</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#4ADE80" }}>
              {fmt(user?.comissaoMes || 4820)}
            </div>
            <div style={{ fontSize:10, color:"#F59E0B", fontWeight:700 }}>
              + {fmt(user?.comissaoPendente || 1240)} pendente
            </div>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
          <KpiCard icon={FileText} label="Contratos Mês" value={`${meusDados.contratos}/${meusDados.meta}`}
            sub={`${meusDados.metaPct}% da meta`} color="#10B981" delta="+8 vs mar" up />
          <KpiCard icon={DollarSign} label="Produção" value={fmt(meusDados.producaoMes)}
            sub="Abr/2024" color="#6366F1" delta="+12%" up />
          <KpiCard icon={TrendingUp} label="Conversão" value={`${meusDados.taxaConversao}%`}
            sub="Proposta→Aprovação" color="#F59E0B" delta="+3.2pp" up />
          <KpiCard icon={Award} label="Aprovação IA" value={`${meusDados.taxaAprovacao}%`}
            sub="Score médio 88" color="#06B6D4" delta="+1.5pp" up />
        </div>

        {/* ── main grid ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 220px", gap:14, marginBottom:24 }}>
          {/* histórico semanal */}
          <div style={{ ...S.card, padding:20 }}>
            <p style={{ ...S.label, marginBottom:14 }}>Contratos por semana — Abr/24</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={meusDados.historico}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false}/>
                <XAxis dataKey="sem" tick={{fill:"#64748B",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#64748B",fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#0D1525",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:11}}/>
                <Bar dataKey="contratos" fill="#10B981" radius={[4,4,0,0]} name="Contratos"/>
                <Bar dataKey="meta" fill="rgba(255,255,255,0.08)" radius={[4,4,0,0]} name="Meta"/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* minhas métricas */}
          <div style={{ ...S.card, padding:20 }}>
            <p style={{ ...S.label, marginBottom:14 }}>Meu desempenho</p>
            {[
              { l:"Taxa de Conversão", v:meusDados.taxaConversao, color:"#10B981" },
              { l:"Taxa de Aprovação", v:meusDados.taxaAprovacao, color:"#6366F1" },
              { l:"Meta Mensal",       v:meusDados.metaPct,       color:"#F59E0B" },
            ].map(({l,v,color},i)=>(
              <div key={l} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:12, color:"#94A3B8" }}>{l}</span>
                  <span style={{ fontSize:12, fontWeight:700, color }}>{v}%</span>
                </div>
                <AnimBar pct={v} color={color} delay={i*100}/>
              </div>
            ))}
            <div style={{ marginTop:4, background:"rgba(16,185,129,0.06)",
              border:"1px solid rgba(16,185,129,0.15)", borderRadius:9, padding:"9px 12px" }}>
              <div style={{ fontSize:10, color:"#64748B", marginBottom:2 }}>Ranking na loja</div>
              <div style={{ fontSize:15, fontWeight:800, color:"#10B981" }}>🥇 1º lugar</div>
            </div>
          </div>

          {/* gauge meta */}
          <div style={{ ...S.card, padding:18,
            display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:10 }}>
            <MetaGauge pct={meusDados.metaPct} label={`${meusDados.contratos} de ${meusDados.meta} contratos`} color="#10B981"/>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:11, color:"#64748B" }}>Faltam</div>
              <div style={{ fontSize:17, fontWeight:800, color:"#F1F5F9" }}>
                {meusDados.meta - meusDados.contratos} contratos
              </div>
              <div style={{ fontSize:10, color:"#64748B" }}>para bater a meta</div>
            </div>
          </div>
        </div>

        {/* ── Minhas Propostas + Prospects ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {/* propostas recentes */}
          <div style={{ ...S.card, padding:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <FileText size={15} color="#10B981"/>
              <span style={{ fontSize:14, fontWeight:700, color:"#F1F5F9" }}>Minhas Propostas</span>
              <button onClick={()=>navigate("/esteira")} style={{
                marginLeft:"auto", display:"flex", alignItems:"center", gap:5,
                background:"none", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:7, color:"#64748B", fontSize:11, padding:"4px 10px", cursor:"pointer",
              }}>
                Ver todas <ChevronRight size={11}/>
              </button>
            </div>
            {minhasPropostas.map(prop => {
              const sc = STATUS_CFG[prop.status] || STATUS_CFG.pendente;
              const Icon = sc.icon;
              return (
                <div key={prop.id} style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"9px 12px", background:"rgba(255,255,255,0.02)",
                  borderRadius:9, marginBottom:6,
                }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:sc.color, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#E2E8F0" }}>{prop.cliente}</div>
                    <div style={{ fontSize:9, color:"#64748B" }}>{prop.produto} · {prop.id}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#4ADE80" }}>{fmt(prop.valor)}</div>
                    <div style={{ fontSize:9, fontWeight:700, color:sc.color }}>{sc.label}</div>
                  </div>
                </div>
              );
            })}
            <button onClick={()=>setShowModal(true)} style={{
              width:"100%", marginTop:8, padding:"10px", borderRadius:10,
              background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)",
              color:"#10B981", fontWeight:700, fontSize:12, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:7,
            }}>
              <Plus size={13}/> Nova Proposta
            </button>
          </div>

          {/* meus prospects */}
          <div style={{ ...S.card, padding:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <Users size={15} color="#6366F1"/>
              <span style={{ fontSize:14, fontWeight:700, color:"#F1F5F9" }}>Meus Prospects</span>
              <span style={{ marginLeft:"auto", fontSize:10, padding:"3px 9px", borderRadius:20,
                background:"rgba(99,102,241,0.15)", color:"#6366F1", fontWeight:700 }}>
                {meusProspects.length} ativos
              </span>
            </div>
            {meusProspects.map(p => {
              const lt = LEAD_TEMP[p.status] || LEAD_TEMP.frio;
              return (
                <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10,
                  padding:"10px 12px", background:"rgba(255,255,255,0.02)",
                  borderRadius:9, marginBottom:6, cursor:"pointer",
                  transition:"background .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                >
                  <span style={{ fontSize:16 }}>{lt.emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#E2E8F0" }}>{p.nome}</div>
                    <div style={{ fontSize:9, color:"#64748B" }}>{p.produto} · Score {p.score}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    {p.margem && (
                      <div style={{ fontSize:11, fontWeight:700, color:"#4ADE80" }}>
                        R$ {p.margem}
                      </div>
                    )}
                    <div style={{ fontSize:9, color:"#64748B" }}>{p.ultimoContato}</div>
                  </div>
                  <button style={{ background:"rgba(16,185,129,0.12)",
                    border:"1px solid rgba(16,185,129,0.2)",
                    borderRadius:7, color:"#10B981", fontSize:10, fontWeight:700,
                    padding:"4px 8px", cursor:"pointer" }}>
                    Contatar
                  </button>
                </div>
              );
            })}

            {/* dicas rápidas */}
            <div style={{ marginTop:8, background:"rgba(6,182,212,0.06)",
              border:"1px solid rgba(6,182,212,0.15)", borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:10, color:"#06B6D4", fontWeight:800,
                textTransform:"uppercase", marginBottom:8 }}>💡 Dicas da IA</div>
              {[
                "Antônio Barros: margem R$850 — ofereça consignado agora",
                "Vera Campos: score 780 — aprovação garantida",
              ].map((d,i)=>(
                <div key={i} style={{ fontSize:11, color:"#94A3B8", marginBottom:i<1?6:0,
                  paddingLeft:8, borderLeft:`2px solid #06B6D4` }}>
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>

      {showModal && <NovaProposta onClose={()=>setShowModal(false)}/>}

      <style>{`
        @keyframes pulse {
          0%,100%{ opacity:.3; transform:scale(1); }
          50%{ opacity:.8; transform:scale(1.3); }
        }
      `}</style>
    </div>
  );
}
