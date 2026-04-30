import { useNavigate } from "react-router-dom";
import { runAIRules, calcularSaudeFinanceira } from "../data/mockData";
import { ChevronRight, Zap, AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react";

export default function AIAlertas({ user, dividas }) {
  const navigate = useNavigate();
  const alertas = runAIRules(user, dividas);
  const saude = calcularSaudeFinanceira(user, dividas);

  const saudeConfig = {
    success: { color: "#00C896", glow: "rgba(0,200,150,0.2)", label: "Saudável" },
    warning: { color: "#F59E0B", glow: "rgba(245,158,11,0.2)", label: "Regular" },
    danger:  { color: "#EF4444", glow: "rgba(239,68,68,0.2)",  label: "Crítico" },
  };
  const sc = saudeConfig[saude.cor];

  const alertConfig = {
    danger:  { bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)",  textColor: "#F87171" },
    warning: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", textColor: "#FCD34D" },
    success: { bg: "rgba(0,200,150,0.08)",  border: "rgba(0,200,150,0.2)",  textColor: "#00C896" },
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

      {/* Saúde Financeira */}
      <div style={{
        background: `rgba(255,255,255,0.03)`,
        border: `1px solid ${sc.glow}`,
        borderRadius: 20, padding: "18px 20px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position:"absolute", top:-40, right:-40, width:120, height:120, borderRadius:"50%",
          background:`radial-gradient(circle, ${sc.glow} 0%, transparent 70%)`,
          pointerEvents:"none",
        }}/>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>
          Saúde Financeira
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ fontSize:26, fontWeight:900, color: sc.color }}>
            {saude.pontos}
            <span style={{ fontSize:14, fontWeight:500, color:"rgba(255,255,255,0.3)" }}>/100</span>
            <span style={{ fontSize:16, fontWeight:700, color: sc.color, marginLeft:8 }}>— {saude.label}</span>
          </div>
          {saude.cor === "danger" ? <TrendingDown size={28} color={sc.color} strokeWidth={1.8}/>
            : saude.cor === "warning" ? <TrendingDown size={28} color={sc.color} strokeWidth={1.8}/>
            : <TrendingUp size={28} color={sc.color} strokeWidth={1.8}/>}
        </div>
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:6, height:6, overflow:"hidden" }}>
          <div style={{
            height:"100%", borderRadius:6, background:`linear-gradient(90deg, ${sc.color}, ${sc.color}aa)`,
            width:`${saude.pontos}%`, transition:"width 0.8s ease",
            boxShadow:`0 0 8px ${sc.glow}`,
          }}/>
        </div>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.7)" }}>
              Alertas Inteligentes
            </div>
            {alertas.filter(a => a.nivel==="danger").length > 0 && (
              <div className="chip chip-red">
                <AlertTriangle size={10}/> {alertas.filter(a=>a.nivel==="danger").length} crítico{alertas.filter(a=>a.nivel==="danger").length>1?"s":""}
              </div>
            )}
          </div>
          {alertas.map((a, i) => {
            const ac = alertConfig[a.nivel] || alertConfig.warning;
            return (
              <div
                key={a.id}
                onClick={() => navigate(a.rota)}
                style={{
                  background: ac.bg, border:`1px solid ${ac.border}`,
                  borderRadius:16, padding:"14px 16px", marginBottom:8,
                  cursor:"pointer", display:"flex", alignItems:"flex-start", gap:12,
                  animation:`fadeUp 0.4s ease ${i*0.08}s both`,
                }}
              >
                <div style={{ fontSize:20, lineHeight:1, flexShrink:0, marginTop:1 }}>{a.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color: ac.textColor, marginBottom:3 }}>{a.titulo}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>{a.descricao}</div>
                  <div style={{ fontSize:12, fontWeight:700, color: ac.textColor, marginTop:6, display:"flex", alignItems:"center", gap:4 }}>
                    {a.acao} <ChevronRight size={12}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
