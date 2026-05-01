// VerbaTech — Dashboard Admin (Gestão Global da Plataforma)
import { useState } from "react";
import {
  Crown, Users, DollarSign, TrendingUp, Shield, Zap,
  AlertTriangle, Globe, Lock, Activity,
  Building2, Server, ArrowUpRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import {
  mockCorbans, mockGraficoProducao, mockGraficoProdutos,
  mockIntegracoes, mockActivityLog, mockUsuariosSistema,
  mockCampanhas, fmt,
} from "../data/verbatechData";

/* ── tokens ─────────────────────────────── */
const S = {
  page:  { padding: 28, minHeight: "100vh", background: "#05080F" },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};

const PIE_COLORS = ["#6366F1","#06B6D4","#F59E0B","#10B981","#EF4444","#8B5CF6"];

/* ── KPI card ───────────────────────────── */
function KpiCard({ icon: Icon, label, value, sub, color, delta, up }) {
  return (
    <div style={{ ...S.card, padding: 18, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${color}18, transparent 70%)` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: color + "22",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={color} />
        </div>
        <span style={S.label}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#F1F5F9", marginBottom: 5 }}>{value}</div>
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

/* ── Corban Row ────────────────────────── */
function CorbanRow({ corban, index }) {
  const NIVEL_COLOR = { Diamante:"#00BFFF", Ouro:"#FFD700", Prata:"#C0C0C0", Bronze:"#CD7F32" };
  const color = NIVEL_COLOR[corban.nivel] || "#6366F1";
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "32px 1fr 80px 80px 100px 90px 80px",
      alignItems: "center", gap: 12, padding: "10px 14px",
      background: "rgba(255,255,255,0.02)", borderRadius: 10, marginBottom: 4,
    }}>
      <div style={{ fontSize: 14, textAlign: "center" }}>
        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index+1}`}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9,
          background: color + "22", border: `1px solid ${color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color }}>
          {corban.nome.charAt(0)}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>{corban.nome}</div>
          <div style={{ fontSize: 9, color: "#64748B" }}>{corban.cidade}</div>
        </div>
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
        background: color + "18", color, border: `1px solid ${color}30` }}>{corban.nivel}</span>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80" }}>
        {fmt(corban.producaoMes)}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B" }}>
        {fmt(corban.comissaoMes)}
      </div>
      <div style={{ fontSize: 11, color: "#94A3B8" }}>{corban.contratos}</div>
      <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
        background: corban.status === "ativo" ? "#4ADE8018" : "#F8717118",
        color: corban.status === "ativo" ? "#4ADE80" : "#F87171",
        border: `1px solid ${corban.status === "ativo" ? "#4ADE8030" : "#F8717130"}` }}>
        {corban.status === "ativo" ? "Ativo" : "Inativo"}
      </span>
    </div>
  );
}

/* ── Integração Row ────────────────────── */
function IntRow({ integ }) {
  const color = integ.status === "online" ? "#4ADE80"
    : integ.status === "parcial" ? "#F59E0B" : "#F87171";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px",
      background: "rgba(255,255,255,0.02)", borderRadius: 9, marginBottom: 4 }}>
      <div style={{ position: "relative", width: 10, height: 10 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
          background: color, opacity: 0.3, animation: "pulse 2s infinite" }} />
        <div style={{ position: "absolute", inset: 2, borderRadius: "50%", background: color }} />
      </div>
      <span style={{ fontSize: 12, color: "#CBD5E1", flex: 1 }}>{integ.nome}</span>
      <span style={{ fontSize: 10, color: "#64748B" }}>{integ.tipo}</span>
      {integ.latencia && (
        <span style={{ fontSize: 10, fontWeight: 700, color: integ.latencia < 300 ? "#4ADE80" : integ.latencia < 600 ? "#F59E0B" : "#F87171" }}>
          {integ.latencia}ms
        </span>
      )}
      <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 5,
        background: color + "18", color, border: `1px solid ${color}30` }}>
        {integ.status === "online" ? "Online" : integ.status === "parcial" ? "Parcial" : "Manutenção"}
      </span>
    </div>
  );
}

/* ── MAIN ───────────────────────────────── */
export default function DashboardAdmin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const sem2FA    = mockUsuariosSistema.filter(u => !u.twoFA).length;
  const online    = mockIntegracoes.filter(i => i.status === "online").length;
  const totalProd = mockGraficoProducao.reduce((a, m) => a + m.producao, 0);

  return (
    <div style={S.page}>

        {/* ── Boas vindas ── */}
        <div style={{ marginBottom: 24,
          background: "linear-gradient(135deg,rgba(239,68,68,0.12),rgba(99,102,241,0.08))",
          border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, padding: "20px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <Crown size={20} color="#EF4444" />
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#F1F5F9" }}>
                Olá, {user?.nome.split(" ")[0]}
              </h1>
              <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 6,
                background: "rgba(239,68,68,0.15)", color: "#EF4444", fontWeight: 800, border: "1px solid rgba(239,68,68,0.3)" }}>
                SUPER ADMIN
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
              Visão global da plataforma VerbaTech · {new Date().toLocaleDateString("pt-BR", { weekday:"long", day:"2-digit", month:"long" })}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {sem2FA > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 10, padding: "8px 14px" }}>
                <AlertTriangle size={14} color="#EF4444" />
                <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 700 }}>
                  {sem2FA} usuários sem 2FA
                </span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8,
              background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)",
              borderRadius: 10, padding: "8px 14px" }}>
              <Server size={14} color="#4ADE80" />
              <span style={{ fontSize: 11, color: "#4ADE80", fontWeight: 700 }}>
                {online}/{mockIntegracoes.length} APIs online
              </span>
            </div>
          </div>
        </div>

        {/* ── KPI strip ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 24 }}>
          <KpiCard icon={Building2} label="Corbans Ativos" value={mockCorbans.filter(c=>c.status==="ativo").length}
            sub="na rede" color="#6366F1" delta="+2 mês" up />
          <KpiCard icon={Users} label="Usuários" value={mockUsuariosSistema.length}
            sub={`${sem2FA} sem 2FA`} color="#EF4444" delta={`${sem2FA} alertas`} up={false} />
          <KpiCard icon={TrendingUp} label="Prod. Acumulada" value={fmt(totalProd)}
            sub="últimos 6 meses" color="#4ADE80" delta="+18.4%" up />
          <KpiCard icon={DollarSign} label="Comissões Pagas" value={fmt(89200)}
            sub="Abr/2024" color="#F59E0B" delta="+9.6%" up />
          <KpiCard icon={Shield} label="Compliance Score" value="97.3%"
            sub="1.847 análises IA" color="#06B6D4" delta="+2.1pp" up />
        </div>

        {/* ── tabs ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            { id: "overview",   label: "Visão Geral" },
            { id: "corbans",    label: "Corbans" },
            { id: "integracoes",label: "Integrações" },
            { id: "seguranca",  label: "Segurança" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: activeTab === tab.id ? "#EF4444" : "rgba(255,255,255,0.05)",
              color: activeTab === tab.id ? "#fff" : "#64748B",
              border: activeTab === tab.id ? "none" : "1px solid rgba(255,255,255,0.1)",
              transition: "all .2s",
            }}>{tab.label}</button>
          ))}
        </div>

        {/* ── TAB: Overview ── */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* produção chart */}
            <div style={{ ...S.card, padding: 20 }}>
              <p style={{ ...S.label, marginBottom: 14 }}>Produção da rede (últimos 6 meses)</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mockGraficoProducao}>
                  <defs>
                    <linearGradient id="adminProd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false}/>
                  <XAxis dataKey="mes" tick={{fill:"#64748B",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#64748B",fontSize:11}} axisLine={false} tickLine={false}
                    tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip contentStyle={{background:"#0D1525",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:11}}
                    formatter={v=>[fmt(v),"Produção"]}/>
                  <Area dataKey="producao" stroke="#EF4444" fill="url(#adminProd)" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* mix produtos pie */}
            <div style={{ ...S.card, padding: 20 }}>
              <p style={{ ...S.label, marginBottom: 14 }}>Mix de produtos — rede completa</p>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <PieChart width={170} height={170}>
                  <Pie data={mockGraficoProdutos} cx={80} cy={80} innerRadius={44} outerRadius={72}
                    dataKey="valor" stroke="none">
                    {mockGraficoProdutos.map((e,i) => <Cell key={i} fill={e.cor}/>)}
                  </Pie>
                </PieChart>
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
                  {mockGraficoProdutos.map(p => (
                    <div key={p.nome} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:2, background:p.cor, flexShrink:0 }}/>
                      <span style={{ fontSize:11, color:"#94A3B8", flex:1 }}>{p.nome}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:p.cor }}>{p.valor}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* campanhas resumo */}
            <div style={{ ...S.card, padding: 20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <Zap size={15} color="#F59E0B"/>
                <span style={{ fontSize:14, fontWeight:700, color:"#F1F5F9" }}>Campanhas Ativas</span>
              </div>
              {mockCampanhas.filter(c=>c.status==="ativa").map(camp => (
                <div key={camp.id} style={{ display:"flex", alignItems:"center", gap:10,
                  padding:"10px 12px", background:"rgba(255,255,255,0.02)", borderRadius:9, marginBottom:6 }}>
                  <div style={{ fontSize:18 }}>
                    {camp.tipo==="whatsapp"?"📲":camp.tipo==="sms"?"📱":"📧"}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#E2E8F0" }}>{camp.nome}</div>
                    <div style={{ fontSize:10, color:"#64748B" }}>{camp.enviados} enviados · {camp.convertidos} convertidos</div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, color:"#4ADE80" }}>
                    {fmt(camp.producaoGerada)}
                  </span>
                </div>
              ))}
            </div>

            {/* audit log resumo */}
            <div style={{ ...S.card, padding: 20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <Activity size={15} color="#6366F1"/>
                <span style={{ fontSize:14, fontWeight:700, color:"#F1F5F9" }}>Log de Auditoria Recente</span>
              </div>
              {mockActivityLog.slice(0,5).map(log => {
                const color = log.status==="success"?"#4ADE80":log.status==="warning"?"#F59E0B":"#EF4444";
                return (
                  <div key={log.id} style={{ display:"flex", gap:10, padding:"8px 0",
                    borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%",
                      background:color, flexShrink:0, marginTop:4 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, color:"#CBD5E1" }}>{log.acao}</div>
                      <div style={{ fontSize:9, color:"#475569" }}>{log.usuario} · {log.data}</div>
                    </div>
                    <span style={{ fontSize:9, fontWeight:700,
                      padding:"2px 7px", borderRadius:4,
                      background:color+"18", color, border:`1px solid ${color}30` }}>
                      {log.risco}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: Corbans ── */}
        {activeTab === "corbans" && (
          <div style={{ ...S.card, padding: 20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <Building2 size={16} color="#EF4444"/>
              <span style={{ fontSize:15, fontWeight:700, color:"#F1F5F9" }}>Ranking de Corbans</span>
              <span style={{ marginLeft:"auto", fontSize:10, padding:"3px 10px", borderRadius:20,
                background:"rgba(239,68,68,0.15)", color:"#EF4444", fontWeight:700 }}>
                {mockCorbans.length} registros
              </span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"32px 1fr 80px 80px 100px 90px 80px",
              gap:12, padding:"6px 14px", marginBottom:4 }}>
              {["#","Nome","Nível","Produção","Comissão","Contratos","Status"].map(h=>(
                <div key={h} style={S.label}>{h}</div>
              ))}
            </div>
            {mockCorbans.filter(c=>c.producaoMes>0).sort((a,b)=>b.producaoMes-a.producaoMes).map((c,i)=>(
              <CorbanRow key={c.id} corban={c} index={i}/>
            ))}
          </div>
        )}

        {/* ── TAB: Integrações ── */}
        {activeTab === "integracoes" && (
          <div style={{ ...S.card, padding: 20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <Globe size={16} color="#06B6D4"/>
              <span style={{ fontSize:15, fontWeight:700, color:"#F1F5F9" }}>APIs & Integrações</span>
              <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                <span style={{ fontSize:10, padding:"3px 10px", borderRadius:20,
                  background:"rgba(74,222,128,0.15)", color:"#4ADE80", fontWeight:700 }}>
                  {online} Online
                </span>
                <span style={{ fontSize:10, padding:"3px 10px", borderRadius:20,
                  background:"rgba(245,158,11,0.15)", color:"#F59E0B", fontWeight:700 }}>
                  {mockIntegracoes.filter(i=>i.status==="parcial").length} Parcial
                </span>
                <span style={{ fontSize:10, padding:"3px 10px", borderRadius:20,
                  background:"rgba(248,113,113,0.15)", color:"#F87171", fontWeight:700 }}>
                  {mockIntegracoes.filter(i=>i.status==="manutencao").length} Manutenção
                </span>
              </div>
            </div>
            {mockIntegracoes.map(integ => <IntRow key={integ.nome} integ={integ}/>)}
          </div>
        )}

        {/* ── TAB: Segurança ── */}
        {activeTab === "seguranca" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {sem2FA > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:14,
                background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)",
                borderRadius:12, padding:"16px 20px" }}>
                <AlertTriangle size={22} color="#EF4444"/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:"#EF4444", marginBottom:3 }}>
                    {sem2FA} usuários sem 2FA ativado
                  </div>
                  <div style={{ fontSize:12, color:"#94A3B8" }}>
                    Risco de acesso não autorizado. Recomendamos forçar ativação imediata.
                  </div>
                </div>
                <button style={{ background:"rgba(239,68,68,0.2)", border:"1px solid rgba(239,68,68,0.4)",
                  borderRadius:9, color:"#EF4444", fontWeight:700, fontSize:12,
                  padding:"9px 16px", cursor:"pointer" }}>
                  Forçar 2FA global
                </button>
              </div>
            )}

            <div style={{ ...S.card, padding:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <Lock size={15} color="#6366F1"/>
                <span style={{ fontSize:15, fontWeight:700, color:"#F1F5F9" }}>Usuários do Sistema</span>
              </div>
              {mockUsuariosSistema.map(usr => {
                const warn = !usr.twoFA || usr.tentativasFalhas >= 2;
                const roleColor = usr.role==="master" ? "#FFD700" : usr.role==="agente" ? "#C0C0C0" : "#EF4444";
                return (
                  <div key={usr.id} style={{
                    display:"grid", gridTemplateColumns:"1fr 80px 90px 70px 60px 80px",
                    gap:12, alignItems:"center", padding:"10px 14px",
                    background: warn ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.02)",
                    borderRadius:10, marginBottom:4,
                    border: warn ? "1px solid rgba(239,68,68,0.12)" : "1px solid transparent",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:30, height:30, borderRadius:9,
                        background: warn ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.15)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:10, fontWeight:800, color: warn ? "#EF4444" : "#6366F1" }}>
                        {usr.nome.split(" ").map(n=>n[0]).slice(0,2).join("")}
                      </div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600, color:"#E2E8F0", display:"flex", gap:6, alignItems:"center" }}>
                          {usr.nome} {warn && <AlertTriangle size={11} color="#F59E0B"/>}
                        </div>
                        <div style={{ fontSize:9, color:"#64748B" }}>{usr.email}</div>
                      </div>
                    </div>
                    <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:5,
                      background:roleColor+"18", color:roleColor }}>{usr.role}</span>
                    <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:5,
                      background: usr.twoFA ? "#4ADE8018" : "#EF444418",
                      color: usr.twoFA ? "#4ADE80" : "#EF4444",
                      border:`1px solid ${usr.twoFA ? "#4ADE8030" : "#EF444430"}` }}>
                      {usr.twoFA ? `2FA ${usr.twoFAMetodo}` : "Sem 2FA"}
                    </span>
                    <span style={{ fontSize:9, fontWeight:700,
                      color: usr.status==="ativo" ? "#4ADE80" : "#EF4444" }}>
                      {usr.status}
                    </span>
                    <span style={{ fontSize:12, fontWeight:700, textAlign:"center",
                      color: usr.tentativasFalhas>=3?"#EF4444":usr.tentativasFalhas>=1?"#F59E0B":"#4ADE80" }}>
                      {usr.tentativasFalhas}×
                    </span>
                    <span style={{ fontSize:9, color:"#64748B" }}>
                      {usr.ultimoLogin.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      <style>{`
        @keyframes pulse {
          0%,100%{ opacity:.3; transform:scale(1); }
          50%{ opacity:.8; transform:scale(1.3); }
        }
      `}</style>
    </div>
  );
}
