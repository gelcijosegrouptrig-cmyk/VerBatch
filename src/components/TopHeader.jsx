import { useState } from "react";
import { Eye, EyeOff, Bell, Settings } from "lucide-react";

export default function TopHeader({ user, showBalance, setShowBalance }) {
  const pct = Math.round((user.margemUsada / user.margemTotal) * 100);
  const barColor = pct > 70 ? "#EF4444" : pct > 50 ? "#F59E0B" : "#00C896";

  return (
    <div style={{
      background: "linear-gradient(180deg, #0D1829 0%, #0A0E1A 100%)",
      padding: "52px 20px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* BG glow blob */}
      <div style={{
        position: "absolute", top: -60, right: -60,
        width: 220, height: 220, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Row 1 */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 24 }}>
        <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
          {/* Logo */}
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#00C896,#00A87A)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight: 900, fontSize: 13, color: "white", letterSpacing: -0.5,
            flexShrink: 0,
          }}>VB</div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform:"uppercase" }}>Bem-vindo de volta</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "white", marginTop: 1 }}>
              {user.name.split(" ")[0]} 👋
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap: 8 }}>
          <button style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            display:"flex", alignItems:"center", justifyContent:"center", color: "rgba(255,255,255,0.6)",
          }}>
            <Bell size={16} />
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#7C3AED,#00C896)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight: 800, color: "white", fontSize: 13,
          }}>
            {user.name.split(" ").map(n => n[0]).join("").slice(0,2)}
          </div>
        </div>
      </div>

      {/* Main Balance Card */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "20px",
        marginBottom: 16,
        position: "relative", overflow: "hidden",
      }}>
        {/* inner glow */}
        <div style={{
          position:"absolute", bottom:-30, left:-20,
          width:160, height:160, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(0,200,150,0.08) 0%, transparent 70%)",
          pointerEvents:"none",
        }}/>

        <div style={{ fontSize: 11, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:1, marginBottom: 8 }}>
          Margem Consignável Disponível
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 34, fontWeight: 900, color:"white", letterSpacing: -1 }}>
            {showBalance
              ? `R$ ${user.margemDisponivel.toLocaleString("pt-BR",{minimumFractionDigits:2})}`
              : "R$ ••••••"}
          </div>
          <button onClick={() => setShowBalance(!showBalance)} style={{
            width: 36, height: 36, borderRadius: 10,
            background:"rgba(255,255,255,0.08)", border:"none", color:"rgba(255,255,255,0.5)",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            {showBalance ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>
              Usado R$ {user.margemUsada.toLocaleString("pt-BR")}
            </span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>
              Total R$ {user.margemTotal.toLocaleString("pt-BR")}
            </span>
          </div>
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:6, height:6, overflow:"hidden" }}>
            <div style={{
              height:"100%", borderRadius:6, width:`${pct}%`,
              background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
              boxShadow: `0 0 8px ${barColor}66`,
              transition:"width 0.8s ease",
            }}/>
          </div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginTop:4 }}>
            {pct}% da margem comprometida
          </div>
        </div>
      </div>

      {/* Pills row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {[
          { label:"Tipo", value: user.tipo, color:"#00C896" },
          { label:"Score", value:`${user.score} pts`, color: user.score >= 70 ? "#00C896" : "#F59E0B" },
          { label:"Salário", value: showBalance ? `R$ ${user.salarioLiquido.toLocaleString("pt-BR")}` : "R$ ••••", color:"white" },
        ].map(({label,value,color})=>(
          <div key={label} style={{
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:12, padding:"10px 12px",
          }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:3 }}>{label}</div>
            <div style={{ fontSize:14, fontWeight:800, color }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
