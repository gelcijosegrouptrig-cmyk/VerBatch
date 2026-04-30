import { useState } from "react";
import { mockUser, mockDividas } from "../data/mockData";
import {
  Shield, Bell, ChevronRight, LogOut, Eye, EyeOff,
  Lock, User, FileText, HelpCircle, Star, CreditCard,
  TrendingUp, Settings, ExternalLink
} from "lucide-react";

function MenuItem({ icon: Icon, label, value, onClick, danger, badge, color }) {
  const c = color || (danger ? "#F87171" : "rgba(255,255,255,0.55)");
  return (
    <div onClick={onClick} style={{
      display:"flex", alignItems:"center", gap:14,
      padding:"14px 16px", cursor:"pointer",
      borderBottom:"1px solid rgba(255,255,255,0.04)",
      transition:"background 0.15s",
    }}
      onTouchStart={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
      onTouchEnd={e=>e.currentTarget.style.background="transparent"}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
    >
      <div style={{
        width:38, height:38, borderRadius:10, flexShrink:0,
        background: danger ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.06)",
        border: danger ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.07)",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <Icon size={17} color={c}/>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:600, color: danger ? "#F87171" : "rgba(255,255,255,0.85)" }}>{label}</div>
        {value && <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{value}</div>}
      </div>
      {badge && (
        <div style={{
          background:"rgba(239,68,68,0.8)", color:"white",
          fontSize:10, fontWeight:800, padding:"3px 8px", borderRadius:20,
        }}>{badge}</div>
      )}
      <ChevronRight size={15} color="rgba(255,255,255,0.15)"/>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
      borderRadius:20, overflow:"hidden", marginBottom:12,
    }}>
      <div style={{ padding:"12px 16px 10px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="section-label" style={{ marginBottom:0 }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

export default function Perfil() {
  const [showCpf, setShowCpf] = useState(false);

  const totalDividas = mockDividas.reduce((a,d)=>a+d.saldo,0);
  const comprometimento = ((mockUser.margemUsada/mockUser.salarioLiquido)*100).toFixed(0);

  const scoreColor = mockUser.score >= 70 ? "#00C896" : mockUser.score >= 50 ? "#F59E0B" : "#EF4444";
  const scoreLabel = mockUser.score >= 70 ? "Bom" : mockUser.score >= 50 ? "Regular" : "Baixo";

  return (
    <div className="page">

      {/* ——— HERO ——— */}
      <div style={{
        background:"linear-gradient(180deg,#0D1829 0%,#0A0E1A 100%)",
        padding:"52px 20px 28px", position:"relative", overflow:"hidden",
      }}>
        {/* BG blob */}
        <div style={{ position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:-40,left:-40,width:160,height:160,borderRadius:"50%", background:"radial-gradient(circle,rgba(0,200,150,0.08) 0%,transparent 70%)", pointerEvents:"none" }}/>

        {/* Avatar row */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
          <div style={{
            width:68, height:68, borderRadius:"50%", flexShrink:0,
            background:"linear-gradient(135deg,#7C3AED,#00C896)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:26, fontWeight:900, color:"white",
            boxShadow:"0 0 24px rgba(124,58,237,0.35)",
          }}>
            {mockUser.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
          </div>
          <div>
            <div style={{ fontSize:20, fontWeight:900, color:"white", marginBottom:4 }}>{mockUser.name}</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              <div className="chip chip-green">✓ Verificado</div>
              <div className="chip chip-purple">{mockUser.tipo}</div>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:4,
                padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
                background:`rgba(${mockUser.score>=70?"0,200,150":mockUser.score>=50?"245,158,11":"239,68,68"},0.15)`,
                color: scoreColor,
                border:`1px solid ${scoreColor}33`,
              }}>
                {mockUser.score} pts — {scoreLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Score arc */}
        <div style={{
          background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
          borderRadius:18, padding:"14px 18px", marginBottom:16,
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)" }}>Score de Crédito</span>
            <span style={{ fontSize:13, fontWeight:900, color: scoreColor }}>
              {mockUser.score}/1000
            </span>
          </div>
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:6, height:6, overflow:"hidden" }}>
            <div style={{
              height:"100%", borderRadius:6,
              background:`linear-gradient(90deg, ${scoreColor}, ${scoreColor}aa)`,
              width:`${mockUser.score/10}%`,
              boxShadow:`0 0 8px ${scoreColor}66`,
              transition:"width 1s ease",
            }}/>
          </div>
        </div>

        {/* Financials grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { l:"Salário Líquido", v:`R$ ${mockUser.salarioLiquido.toLocaleString("pt-BR")}`, e:"💼", c:"#00C896" },
            { l:"Total de Dívidas", v:`R$ ${totalDividas.toLocaleString("pt-BR")}`, e:"📋", c:"#F87171" },
            { l:"Margem Livre", v:`R$ ${mockUser.margemDisponivel.toLocaleString("pt-BR")}`, e:"✅", c:"#93C5FD" },
            { l:"Comprometimento", v:`${comprometimento}% da renda`, e:"⚠️", c:"#FCD34D" },
          ].map(({l,v,e,c})=>(
            <div key={l} style={{
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:14, padding:"13px",
            }}>
              <div style={{ fontSize:18, marginBottom:6 }}>{e}</div>
              <div style={{ fontSize:13, fontWeight:900, color:c, marginBottom:2 }}>{v}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"20px 16px" }}>

        {/* CPF */}
        <div style={{
          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
          borderRadius:16, padding:"14px 16px", marginBottom:12,
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:4 }}>CPF</div>
            <div style={{ fontSize:16, fontWeight:800, color:"rgba(255,255,255,0.85)", letterSpacing:2 }}>
              {showCpf ? "123.456.789-12" : mockUser.cpf}
            </div>
          </div>
          <button onClick={()=>setShowCpf(!showCpf)} style={{
            width:36, height:36, borderRadius:10,
            background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)",
            display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.4)",
          }}>
            {showCpf ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>
        </div>

        {/* Minha Conta */}
        <SectionCard title="Minha Conta">
          <MenuItem icon={User}    label="Dados Pessoais"  value="Editar informações" color="#93C5FD"/>
          <MenuItem icon={Lock}    label="Segurança"        value="Biometria e senha"  color="#A78BFA"/>
          <MenuItem icon={Bell}    label="Notificações"     value="Ativadas"           color="#FCD34D"/>
          <MenuItem icon={Shield}  label="Privacidade"      value="LGPD e dados"       color="#6EE7B7"/>
        </SectionCard>

        {/* Financeiro */}
        <SectionCard title="Financeiro">
          <MenuItem icon={FileText}   label="Contratos Ativos"   value="2 contratos"              badge="2" color="#93C5FD"/>
          <MenuItem icon={TrendingUp} label="Extrato Completo"   value="Histórico de transações"  color="#A78BFA"/>
          <MenuItem icon={CreditCard} label="Cartão Consignado"  value="Solicitar cartão"         color="#00C896"/>
        </SectionCard>

        {/* Suporte */}
        <SectionCard title="Suporte">
          <MenuItem icon={HelpCircle}   label="Central de Ajuda" value="FAQ e tutoriais"       color="#FCD34D"/>
          <MenuItem icon={ExternalLink} label="Fale Conosco"     value="Chat ou WhatsApp"      color="#93C5FD"/>
          <MenuItem icon={Star}         label="Avaliar o App"    value="Sua opinião importa"   color="#F59E0B"/>
        </SectionCard>

        {/* Sair */}
        <div style={{
          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(239,68,68,0.15)",
          borderRadius:20, overflow:"hidden", marginBottom:24,
        }}>
          <MenuItem icon={LogOut} label="Sair da Conta" danger/>
        </div>

        {/* Footer */}
        <div style={{ textAlign:"center", paddingBottom:8 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:20, padding:"6px 14px", marginBottom:8,
          }}>
            <div style={{ width:16,height:16,borderRadius:4, background:"linear-gradient(135deg,#00C896,#00A87A)", display:"flex",alignItems:"center",justifyContent:"center", fontSize:8, fontWeight:900, color:"white" }}>VB</div>
            <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.4)" }}>VerBatch v1.0.0</span>
          </div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>
            Correspondente Bancário Regulamentado • Bacen<br/>
            CNPJ 00.000.000/0001-00
          </div>
        </div>

      </div>
    </div>
  );
}
