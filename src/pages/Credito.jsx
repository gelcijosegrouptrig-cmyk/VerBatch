import { useState } from "react";
import { mockUser, mockOfertas } from "../data/mockData";
import { ChevronRight, TrendingDown, Sliders, CheckCircle, Sparkles, Shield } from "lucide-react";

function SimuladorRapido() {
  const [valor, setValor] = useState(8000);
  const [prazo, setPrazo] = useState(48);
  const taxa = 1.45;
  const parcela = (valor * (taxa/100) * Math.pow(1+taxa/100, prazo)) / (Math.pow(1+taxa/100, prazo)-1);
  const total = parcela * prazo;
  const juros = total - valor;

  return (
    <div style={{
      background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
      borderRadius:20, padding:"20px",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
        <div style={{ width:32,height:32,borderRadius:8, background:"rgba(0,200,150,0.15)", border:"1px solid rgba(0,200,150,0.2)", display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Sliders size={15} color="#00C896"/>
        </div>
        <span style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.8)" }}>Simulador</span>
      </div>

      {/* valor */}
      <div style={{ marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>Valor desejado</span>
          <span style={{ fontSize:15, fontWeight:900, color:"#00C896" }}>
            R$ {valor.toLocaleString("pt-BR")}
          </span>
        </div>
        <input type="range" min={1000} max={50000} step={500}
          value={valor} onChange={e=>setValor(+e.target.value)}
          style={{ accentColor:"#00C896" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>R$ 1k</span>
          <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>R$ 50k</span>
        </div>
      </div>

      {/* prazo */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>Prazo</span>
          <span style={{ fontSize:15, fontWeight:900, color:"#7C3AED" }}>{prazo} meses</span>
        </div>
        <input type="range" min={12} max={96} step={12}
          value={prazo} onChange={e=>setPrazo(+e.target.value)}
          style={{ accentColor:"#7C3AED" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>12x</span>
          <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>96x</span>
        </div>
      </div>

      {/* result */}
      <div style={{
        background:"linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,168,122,0.06))",
        border:"1px solid rgba(0,200,150,0.2)",
        borderRadius:16, padding:"16px",
        display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8,
      }}>
        {[
          { l:"Parcela/mês", v:`R$ ${parcela.toFixed(0)}`, c:"#00C896" },
          { l:"Total", v:`R$ ${total.toLocaleString("pt-BR",{maximumFractionDigits:0})}`, c:"rgba(255,255,255,0.7)" },
          { l:"Juros", v:`R$ ${juros.toLocaleString("pt-BR",{maximumFractionDigits:0})}`, c:"#F59E0B" },
        ].map(({l,v,c})=>(
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:13, fontWeight:900, color:c }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center", marginTop:8, fontSize:10, color:"rgba(255,255,255,0.2)" }}>
        Taxa {taxa}% a.m. — Consignado INSS / Servidor
      </div>
    </div>
  );
}

function OfertaCard({ oferta, onContratar }) {
  return (
    <div style={{
      background: oferta.destaque
        ? "linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,168,122,0.05))"
        : "rgba(255,255,255,0.03)",
      border: oferta.destaque
        ? "1px solid rgba(0,200,150,0.3)"
        : "1px solid rgba(255,255,255,0.07)",
      borderRadius:20, padding:"18px",
      marginBottom:12, position:"relative", overflow:"hidden",
    }}>
      {oferta.badge && (
        <div style={{
          position:"absolute", top:0, right:0,
          background: oferta.destaque
            ? "linear-gradient(135deg,#00C896,#00A87A)"
            : "rgba(124,58,237,0.8)",
          color:"white", fontSize:10, fontWeight:800,
          padding:"5px 14px", borderRadius:"0 18px 0 12px",
          letterSpacing:0.5,
        }}>{oferta.badge}</div>
      )}

      {/* banco */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        <div style={{
          width:42, height:42, borderRadius:12, flexShrink:0,
          background: oferta.destaque
            ? "linear-gradient(135deg,#00C896,#00A87A)"
            : "rgba(255,255,255,0.08)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontWeight:900, fontSize:14, color:"white",
        }}>{oferta.banco.slice(0,2).toUpperCase()}</div>
        <div>
          <div style={{ fontSize:14, fontWeight:800, color:"rgba(255,255,255,0.9)" }}>{oferta.banco}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{oferta.tipo}</div>
        </div>
      </div>

      {/* numeros */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
        {[
          { l:"Valor", v:`R$ ${oferta.valor.toLocaleString("pt-BR")}` },
          { l:"Taxa a.m.", v:`${oferta.taxa}%`, danger: oferta.taxa > 1.6 },
          { l:"Parcela", v:`R$ ${oferta.parcela}` },
        ].map(({l,v,danger})=>(
          <div key={l} style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:0.4, marginBottom:3 }}>{l}</div>
            <div style={{ fontSize:13, fontWeight:800, color: danger?"#F59E0B":"rgba(255,255,255,0.85)" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <button style={{
          background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:12, padding:"12px", fontSize:13, fontWeight:700,
          color:"rgba(255,255,255,0.6)", cursor:"pointer",
        }}>Simular</button>
        <button onClick={()=>onContratar(oferta)} style={{
          background: oferta.destaque
            ? "linear-gradient(135deg,#00C896,#00A87A)"
            : "rgba(255,255,255,0.1)",
          border:"none", borderRadius:12, padding:"12px",
          fontSize:13, fontWeight:800, color:"white", cursor:"pointer",
          boxShadow: oferta.destaque ? "0 4px 16px rgba(0,200,150,0.3)" : "none",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
        }}>
          Contratar <ChevronRight size={14}/>
        </button>
      </div>
    </div>
  );
}

export default function Credito() {
  const [contratado, setContratado] = useState(null);

  if (contratado) return (
    <div className="page" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 24px", minHeight:"100vh" }}>
      <div style={{ fontSize:72, marginBottom:20, animation:"float 2s ease-in-out infinite" }}>🎉</div>
      <div style={{ fontSize:24, fontWeight:900, color:"white", marginBottom:8, textAlign:"center" }}>Solicitação Enviada!</div>
      <div style={{ fontSize:14, color:"rgba(255,255,255,0.45)", textAlign:"center", lineHeight:1.6, marginBottom:28 }}>
        Proposta com <strong style={{color:"#00C896"}}>{contratado.banco}</strong> registrada.<br/>
        Em breve você receberá a confirmação.
      </div>
      <div style={{
        background:"rgba(0,200,150,0.08)", border:"1px solid rgba(0,200,150,0.25)",
        borderRadius:16, padding:"16px 20px", marginBottom:28, width:"100%",
        display:"flex", alignItems:"center", gap:12,
      }}>
        <CheckCircle size={22} color="#00C896"/>
        <div style={{ fontSize:13, fontWeight:700, color:"#00C896" }}>
          R$ {contratado.parcela}/mês por {contratado.prazo}x — Aprovado
        </div>
      </div>
      <button onClick={()=>setContratado(null)} className="btn btn-green btn-full btn-lg">
        Voltar às Ofertas
      </button>
    </div>
  );

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background:"linear-gradient(180deg, #0D1829 0%, #0A0E1A 100%)",
        padding:"52px 20px 24px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%", background:"radial-gradient(circle,rgba(0,200,150,0.1) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ fontSize:22, fontWeight:900, color:"white", marginBottom:4 }}>💰 Crédito Inteligente</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>Ofertas personalizadas para seu perfil</div>

        {/* margem pill */}
        <div style={{
          marginTop:16, background:"rgba(0,200,150,0.1)", border:"1px solid rgba(0,200,150,0.2)",
          borderRadius:12, padding:"12px 16px",
          display:"flex", alignItems:"center", gap:12,
        }}>
          <TrendingDown size={18} color="#00C896"/>
          <div>
            <div style={{ fontSize:10, color:"rgba(0,200,150,0.7)", textTransform:"uppercase", letterSpacing:0.8 }}>Margem disponível</div>
            <div style={{ fontSize:17, fontWeight:900, color:"#00C896" }}>
              R$ {mockUser.margemDisponivel.toLocaleString("pt-BR")} / mês
            </div>
          </div>
          <div className="chip chip-green" style={{ marginLeft:"auto" }}>
            <Shield size={10}/> Aprovação Rápida
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 16px", display:"flex", flexDirection:"column", gap:16 }}>
        <SimuladorRapido/>

        <div>
          <div className="section-label">Melhores Ofertas Para Você</div>
          {mockOfertas.map(o=><OfertaCard key={o.id} oferta={o} onContratar={setContratado}/>)}
        </div>

        <div style={{
          background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)",
          borderRadius:14, padding:"14px 16px",
        }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", lineHeight:1.6 }}>
            ⚡ Simulações baseadas no seu perfil. Taxas reais sujeitas à análise de crédito e aprovação do correspondente bancário parceiro.
          </div>
        </div>
      </div>
    </div>
  );
}
