import { useState } from "react";
import { mockLicoes } from "../data/mockData";
import { Play, CheckCircle, Trophy, Star, BookOpen } from "lucide-react";

const catColors = {
  Consignado: { bg:"rgba(59,130,246,0.12)",  text:"#93C5FD", border:"rgba(59,130,246,0.2)" },
  Cartão:     { bg:"rgba(239,68,68,0.12)",   text:"#F87171", border:"rgba(239,68,68,0.2)" },
  Crédito:    { bg:"rgba(124,58,237,0.12)",  text:"#A78BFA", border:"rgba(124,58,237,0.2)" },
  Poupança:   { bg:"rgba(0,200,150,0.12)",   text:"#00C896", border:"rgba(0,200,150,0.2)" },
  Score:      { bg:"rgba(245,158,11,0.12)",  text:"#FCD34D", border:"rgba(245,158,11,0.2)" },
};

const conteudos = {
  1:`A margem consignável é o percentual máximo do benefício que pode ser comprometido com descontos em folha.\n\nPara aposentados e pensionistas do INSS:\n\n• 35% para empréstimos consignados\n• 5% para cartão consignado\n• 5% para saque-complementar\n\nExemplo: Se você recebe R$ 2.000, pode comprometer até R$ 700 em descontos.\n\n💡 Sempre verifique sua margem antes de contratar qualquer crédito!`,
  2:`O rotativo do cartão é um dos juros mais altos do mercado — até 400% ao ano!\n\nA armadilha:\n1. Você paga só o mínimo da fatura\n2. O restante vai ao rotativo com 15-20% ao MÊS\n3. A dívida cresce exponencialmente\n\nExemplo real:\nDívida de R$ 2.000 a 15% a.m. → em 12 meses: R$ 8.700!\n\n💡 Solução: Quite o rotativo com consignado (1,5% a.m.) e economize muito.`,
  3:`A portabilidade permite transferir sua dívida para outro banco com condições melhores.\n\nVantagens:\n• Reduzir a taxa de juros\n• Diminuir o valor das parcelas\n• Liberar margem para outros fins\n\nComo fazer:\n1. Compare taxas de outros bancos\n2. Solicite a portabilidade no app\n3. O novo banco quita a dívida antiga\n4. Você passa a pagar ao novo banco\n\n💡 Portabilidade é direito garantido por lei. Use a seu favor!`,
  4:`A reserva de emergência é um valor para imprevistos: desemprego, doenças, reparos urgentes.\n\nMeta ideal: 6 a 12 meses de gastos essenciais\n\nComo montar:\n1. Calcule seus gastos mensais fixos\n2. Multiplique por 6\n3. Divida em metas mensais\n4. Guarde em conta de alta liquidez\n\nExemplo:\nGastos R$ 2.000/mês → Meta: R$ 12.000\nGuardando R$ 500/mês → pronto em 24 meses\n\n💡 Comece pequeno! Até R$ 1.000 já evita muitos problemas.`,
  5:`O Score vai de 0 a 1.000. Quanto maior, melhores as condições de crédito.\n\nO que piora seu score:\n✗ Dívidas em atraso\n✗ Nome no SPC/Serasa\n✗ Muitas consultas de crédito\n\nO que melhora seu score:\n✅ Pagar contas em dia\n✅ Quitar dívidas antigas\n✅ Usar crédito com moderação\n✅ Manter dados cadastrais atualizados\n✅ Participar do Cadastro Positivo\n\n💡 Score acima de 700 garante as melhores taxas!`,
};

function LicaoModal({ licao, onClose, onConcluir }) {
  const [done, setDone] = useState(false);
  const handleOk = () => {
    setDone(true);
    setTimeout(() => { onConcluir(licao.id); onClose(); }, 1400);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        {done ? (
          <div style={{ textAlign:"center", padding:"30px 0" }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
            <div style={{ fontSize:22, fontWeight:900, color:"white", marginBottom:8 }}>Lição Concluída!</div>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(0,200,150,0.12)", border:"1px solid rgba(0,200,150,0.25)",
              borderRadius:20, padding:"10px 20px",
            }}>
              <Star size={16} color="#00C896" fill="#00C896"/>
              <span style={{ fontSize:15, fontWeight:800, color:"#00C896" }}>+{licao.pontos} pontos</span>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
              <div style={{ fontSize:36 }}>{licao.emoji}</div>
              <div>
                <div style={{ fontSize:17, fontWeight:900, color:"white", lineHeight:1.3 }}>{licao.titulo}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:3 }}>
                  ⏱ {licao.duracao} • +{licao.pontos} pontos
                </div>
              </div>
            </div>

            <div style={{
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:16, padding:"18px", marginBottom:24,
              fontSize:14, color:"rgba(255,255,255,0.7)", lineHeight:1.75,
              whiteSpace:"pre-line",
            }}>
              {conteudos[licao.id] || "Conteúdo em breve..."}
            </div>

            <button onClick={handleOk} className="btn btn-green btn-full btn-lg" style={{ gap:10 }}>
              <CheckCircle size={18}/> Concluir • +{licao.pontos} pts
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Educacao() {
  const [licoes, setLicoes] = useState(mockLicoes);
  const [ativa, setAtiva] = useState(null);

  const pts = licoes.filter(l=>l.concluido).reduce((a,l)=>a+l.pontos,0);
  const prog = Math.round((licoes.filter(l=>l.concluido).length / licoes.length)*100);

  const concluir = id => setLicoes(p => p.map(l => l.id===id ? {...l,concluido:true} : l));

  const conquistas = [
    { emoji:"🎓", nome:"Iniciante", req:50 },
    { emoji:"📊", nome:"Analista", req:100 },
    { emoji:"💡", nome:"Esperto", req:200 },
    { emoji:"🚀", nome:"Expert", req:500 },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background:"linear-gradient(180deg,#0D1829 0%,#0A0E1A 100%)",
        padding:"52px 20px 24px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute",top:-50,right:-40,width:160,height:160,borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ fontSize:22, fontWeight:900, color:"white", marginBottom:4 }}>📚 Educação</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>Aprenda e converta pontos em desconto</div>

        {/* Gamification card */}
        <div style={{
          marginTop:16,
          background:"linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.1))",
          border:"1px solid rgba(124,58,237,0.25)", borderRadius:18, padding:"18px",
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div>
              <div style={{ fontSize:10, color:"rgba(167,139,250,0.7)", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Seus pontos</div>
              <div style={{ fontSize:32, fontWeight:900, color:"white" }}>
                {pts}
                <span style={{ fontSize:14, fontWeight:400, color:"rgba(255,255,255,0.3)" }}> pts</span>
              </div>
            </div>
            <Trophy size={44} color="rgba(167,139,250,0.35)" strokeWidth={1.5}/>
          </div>
          <div style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>Progresso das lições</span>
              <span style={{ fontSize:11, fontWeight:800, color:"#A78BFA" }}>{prog}%</span>
            </div>
            <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:6, height:6, overflow:"hidden" }}>
              <div style={{
                height:"100%", background:"linear-gradient(90deg,#7C3AED,#A78BFA)",
                width:`${prog}%`, borderRadius:6,
                boxShadow:"0 0 8px rgba(124,58,237,0.5)", transition:"width 0.8s",
              }}/>
            </div>
          </div>
          <div style={{
            background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.15)",
            borderRadius:10, padding:"9px 12px", fontSize:12, color:"rgba(167,139,250,0.8)",
          }}>
            🎁 <strong>500 pts</strong> = 0.1% desconto na taxa do consignado
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 16px", display:"flex", flexDirection:"column", gap:16 }}>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {[
            { l:"Concluídas", v:licoes.filter(l=>l.concluido).length, e:"✅" },
            { l:"Disponíveis", v:licoes.filter(l=>!l.concluido).length, e:"📖" },
            { l:"Pontos", v:pts, e:"⭐" },
          ].map(({l,v,e})=>(
            <div key={l} style={{
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:14, padding:"14px", textAlign:"center",
            }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{e}</div>
              <div style={{ fontSize:20, fontWeight:900, color:"white" }}>{v}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Lições */}
        <div>
          <div className="section-label">Todas as Lições</div>
          {licoes.map((licao, i) => {
            const cat = catColors[licao.categoria] || catColors.Consignado;
            return (
              <div key={licao.id} onClick={()=>!licao.concluido && setAtiva(licao)} style={{
                background: licao.concluido ? "rgba(0,200,150,0.05)" : "rgba(255,255,255,0.03)",
                border: licao.concluido ? "1px solid rgba(0,200,150,0.15)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius:16, padding:"14px 16px", marginBottom:10,
                cursor: licao.concluido ? "default" : "pointer",
                display:"flex", alignItems:"center", gap:14,
                animation:`fadeUp 0.4s ease ${i*0.07}s both`,
              }}>
                <div style={{
                  width:46, height:46, borderRadius:12, flexShrink:0,
                  background: licao.concluido ? "rgba(0,200,150,0.12)" : "rgba(255,255,255,0.05)",
                  border: licao.concluido ? "1px solid rgba(0,200,150,0.2)" : "1px solid rgba(255,255,255,0.07)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
                }}>
                  {licao.concluido ? "✅" : licao.emoji}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color: licao.concluido ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)", marginBottom:5 }}>
                    {licao.titulo}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:cat.bg, color:cat.text, border:`1px solid ${cat.border}` }}>
                      {licao.categoria}
                    </span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)" }}>⏱ {licao.duracao}</span>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  {licao.concluido ? (
                    <CheckCircle size={20} color="#00C896" fill="#00C896"/>
                  ) : (
                    <div style={{
                      width:34, height:34, borderRadius:"50%",
                      background:"linear-gradient(135deg,#7C3AED,#A78BFA)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:"0 0 12px rgba(124,58,237,0.4)",
                    }}>
                      <Play size={13} color="white" fill="white"/>
                    </div>
                  )}
                  <div style={{ fontSize:10, fontWeight:800, color: licao.concluido ? "#00C896" : "#FCD34D" }}>
                    +{licao.pontos}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Conquistas */}
        <div>
          <div className="section-label">🏆 Conquistas</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {conquistas.map(({emoji,nome,req})=>{
              const ok = pts >= req;
              return (
                <div key={nome} style={{
                  background: ok ? "rgba(0,200,150,0.08)" : "rgba(255,255,255,0.03)",
                  border: ok ? "1px solid rgba(0,200,150,0.2)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius:14, padding:"14px 8px", textAlign:"center",
                  opacity: ok ? 1 : 0.45,
                }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{emoji}</div>
                  <div style={{ fontSize:10, fontWeight:700, color: ok ? "#00C896" : "rgba(255,255,255,0.35)" }}>{nome}</div>
                  {!ok && <div style={{ fontSize:9, color:"rgba(255,255,255,0.2)", marginTop:2 }}>{req} pts</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {ativa && <LicaoModal licao={ativa} onClose={()=>setAtiva(null)} onConcluir={concluir}/>}
    </div>
  );
}
