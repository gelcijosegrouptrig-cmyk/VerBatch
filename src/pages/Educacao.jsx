// VerbaTech — Educação Financeira (Dark Theme v2)
import { useState, useEffect } from "react";
import {
  CheckCircle, Trophy, Star, BookOpen, Zap,
  Target, TrendingUp, Lock, Play, Clock, X, Award
} from "lucide-react";

/* ── tokens ───────────────────────────────────────────── */
const S = {
  page:  { padding: 24, minHeight: "100vh", background: "#080E1A" },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};

/* ── Mock lições ──────────────────────────────────────── */
const LICOES = [
  { id: 1, titulo: "Margem Consignável — entenda seus limites",   categoria: "Consignado", duracao: "5 min", pontos: 50,  emoji: "📊", concluido: true  },
  { id: 2, titulo: "Armadilha do Rotativo — como sair",           categoria: "Cartão",     duracao: "8 min", pontos: 80,  emoji: "💳", concluido: true  },
  { id: 3, titulo: "Portabilidade de Crédito na prática",         categoria: "Crédito",    duracao: "6 min", pontos: 70,  emoji: "🔄", concluido: false },
  { id: 4, titulo: "Reserva de Emergência — passo a passo",       categoria: "Poupança",   duracao: "7 min", pontos: 60,  emoji: "🏦", concluido: false },
  { id: 5, titulo: "Score de Crédito — como aumentar rápido",     categoria: "Score",      duracao: "9 min", pontos: 100, emoji: "⭐", concluido: false },
];

const CONTEUDOS = {
  1: `A margem consignável é o percentual máximo do benefício que pode ser comprometido com descontos em folha.\n\nPara aposentados e pensionistas do INSS:\n• 35% para empréstimos consignados\n• 5% para cartão consignado\n• 5% para saque-complementar\n\nExemplo: Se você recebe R$ 2.000, pode comprometer até R$ 700 em descontos.\n\n💡 Sempre verifique sua margem antes de contratar qualquer crédito!`,
  2: `O rotativo do cartão é um dos juros mais altos do mercado — até 400% ao ano!\n\nA armadilha:\n1. Você paga só o mínimo da fatura\n2. O restante vai ao rotativo com 15-20% ao MÊS\n3. A dívida cresce exponencialmente\n\nExemplo real:\nDívida de R$ 2.000 a 15% a.m. → em 12 meses: R$ 8.700!\n\n💡 Solução: Quite o rotativo com consignado (1,5% a.m.) e economize muito.`,
  3: `A portabilidade permite transferir sua dívida para outro banco com condições melhores.\n\nVantagens:\n• Reduzir a taxa de juros\n• Diminuir o valor das parcelas\n• Liberar margem para outros fins\n\nComo fazer:\n1. Compare taxas de outros bancos\n2. Solicite a portabilidade no app\n3. O novo banco quita a dívida antiga\n4. Você passa a pagar ao novo banco\n\n💡 Portabilidade é direito garantido por lei. Use a seu favor!`,
  4: `A reserva de emergência é um valor para imprevistos: desemprego, doenças, reparos urgentes.\n\nMeta ideal: 6 a 12 meses de gastos essenciais\n\nComo montar:\n1. Calcule seus gastos mensais fixos\n2. Multiplique por 6\n3. Divida em metas mensais\n4. Guarde em conta de alta liquidez\n\nExemplo:\nGastos R$ 2.000/mês → Meta: R$ 12.000\nGuardando R$ 500/mês → pronto em 24 meses\n\n💡 Comece pequeno! Até R$ 1.000 já evita muitos problemas.`,
  5: `O Score vai de 0 a 1.000. Quanto maior, melhores as condições de crédito.\n\nO que piora seu score:\n✗ Dívidas em atraso\n✗ Nome no SPC/Serasa\n✗ Muitas consultas de crédito\n\nO que melhora:\n✅ Pagar contas em dia\n✅ Quitar dívidas antigas\n✅ Usar crédito com moderação\n✅ Manter dados cadastrais atualizados\n✅ Participar do Cadastro Positivo\n\n💡 Score acima de 700 garante as melhores taxas!`,
};

const CAT_CFG = {
  Consignado: { color: "#38BDF8", bg: "rgba(56,189,248,0.1)"  },
  Cartão:     { color: "#F87171", bg: "rgba(248,113,113,0.1)" },
  Crédito:    { color: "#A78BFA", bg: "rgba(167,139,250,0.1)" },
  Poupança:   { color: "#4ADE80", bg: "rgba(74,222,128,0.1)"  },
  Score:      { color: "#FCD34D", bg: "rgba(252,211,77,0.1)"  },
};

const BADGES = [
  { id: 1, emoji: "🎓", titulo: "Primeiros Passos",   desc: "Complete sua 1ª lição",       ganho: true  },
  { id: 2, emoji: "🔥", titulo: "Em Chamas",           desc: "3 lições seguidas",           ganho: false },
  { id: 3, emoji: "💎", titulo: "Expert Consignado",   desc: "Complete módulo consignado",  ganho: false },
  { id: 4, emoji: "🏆", titulo: "Mestre Financeiro",   desc: "Complete todas as lições",    ganho: false },
];

/* ── Animated bar ─────────────────────────────────────── */
function AnimBar({ pct, color, height = 8 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 100); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: height }}>
      <div style={{ height: "100%", width: `${w}%`, borderRadius: height, background: color,
        transition: "width 0.9s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 8px ${color}55` }} />
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────────────── */
export default function Educacao() {
  const [licoes, setLicoes] = useState(LICOES);
  const [ativa, setAtiva]   = useState(null);
  const [concluindo, setConcluindo] = useState(false);

  const concluidas = licoes.filter(l => l.concluido).length;
  const pontos     = licoes.filter(l => l.concluido).reduce((s, l) => s + l.pontos, 0);
  const progresso  = Math.round((concluidas / licoes.length) * 100);

  function handleConcluir(id) {
    setConcluindo(true);
    setTimeout(() => {
      setLicoes(ls => ls.map(l => l.id === id ? { ...l, concluido: true } : l));
      setConcluindo(false);
      setAtiva(null);
    }, 1600);
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Educação Financeira</h1>
        <p style={{ color: "#64748B", fontSize: 13 }}>Aprenda · Ganhe pontos · Desbloqueie benefícios e melhores taxas</p>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { l: "Pontos Acumulados", v: `${pontos} pts`,               color: "#FCD34D", icon: Star },
          { l: "Lições Concluídas", v: `${concluidas}/${licoes.length}`, color: "#4ADE80", icon: CheckCircle },
          { l: "Progresso Total",   v: `${progresso}%`,               color: "#38BDF8", icon: TrendingUp },
          { l: "Badges Ganhos",     v: `${BADGES.filter(b=>b.ganho).length}/${BADGES.length}`, color: "#A78BFA", icon: Trophy },
        ].map(({ l, v, color, icon: Icon }) => (
          <div key={l} style={{ ...S.card, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 70, height: 70, background: `radial-gradient(circle at top right,${color}18,transparent 70%)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={S.label}>{l}</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} color={color} />
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

        {/* LEFT: Lições */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Progresso geral */}
          <div style={{ ...S.card, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", marginBottom: 3 }}>Trilha de Educação Financeira</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>{concluidas} de {licoes.length} lições completadas</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#4ADE80" }}>{progresso}%</div>
            </div>
            <AnimBar pct={progresso} color="#4ADE80" height={10} />
            {concluidas < licoes.length && (
              <div style={{ marginTop: 8, fontSize: 11, color: "#475569" }}>
                💡 Complete todas as lições e ganhe <strong style={{ color: "#FCD34D" }}>desconto de 0.10% nas taxas</strong>
              </div>
            )}
          </div>

          {/* Lista de lições */}
          <div style={{ ...S.card, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <BookOpen size={15} color="#818CF8" />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Módulos de Aprendizado</span>
              <span style={{ marginLeft: "auto", fontSize: 10, padding: "2px 9px", borderRadius: 20, background: "rgba(99,102,241,0.15)", color: "#818CF8", fontWeight: 700 }}>{licoes.length} lições</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {licoes.map((licao, idx) => {
                const cat     = CAT_CFG[licao.categoria] || CAT_CFG.Crédito;
                const isLocked = idx > 0 && !licoes[idx - 1].concluido && !licao.concluido;
                return (
                  <div key={licao.id} onClick={() => !isLocked && setAtiva(licao)} style={{
                    ...S.card, padding: "14px 16px", cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.45 : 1,
                    background: licao.concluido ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.025)",
                    borderColor: licao.concluido ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", gap: 14, transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { if (!isLocked) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = licao.concluido ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.025)"; }}
                  >
                    <div style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: licao.concluido ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.05)",
                      border: licao.concluido ? "1px solid rgba(74,222,128,0.25)" : "1px solid rgba(255,255,255,0.07)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                    }}>
                      {licao.concluido ? <CheckCircle size={22} color="#4ADE80" /> : licao.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: licao.concluido ? "#64748B" : "#F1F5F9", marginBottom: 6 }}>{licao.titulo}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, background: cat.bg, color: cat.color, border: `1px solid ${cat.color}30`, borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>{licao.categoria}</span>
                        <span style={{ fontSize: 11, color: "#475569", display: "flex", alignItems: "center", gap: 3 }}>
                          <Clock size={10} /> {licao.duracao}
                        </span>
                        <span style={{ fontSize: 11, color: "#FCD34D", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                          <Star size={10} /> +{licao.pontos} pts
                        </span>
                      </div>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {licao.concluido ? (
                        <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, background: "rgba(74,222,128,0.15)", color: "#4ADE80", fontWeight: 700 }}>Concluída</span>
                      ) : isLocked ? (
                        <Lock size={16} color="#475569" />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}>
                          <Play size={14} color="white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Gamificação */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Nível */}
          <div style={{ ...S.card, padding: 20, background: "rgba(252,211,77,0.04)", borderColor: "rgba(252,211,77,0.18)" }}>
            <div style={{ textAlign: "center", paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 18 }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>
                {pontos >= 350 ? "🏆" : pontos >= 150 ? "⭐" : "🎯"}
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#FCD34D" }}>
                {pontos >= 350 ? "Expert Financeiro" : pontos >= 150 ? "Aprendiz Avançado" : "Iniciante Curioso"}
              </div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>Seu nível atual</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#64748B" }}>Próximo nível</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#FCD34D" }}>{pontos}/350 pts</span>
            </div>
            <AnimBar pct={Math.min(100, (pontos / 350) * 100)} color="#FCD34D" />
          </div>

          {/* Benefícios */}
          <div style={{ ...S.card, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Zap size={14} color="#4ADE80" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>Benefícios Desbloqueados</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { pts: 0,   desc: "Simulador de crédito",          ganho: true           },
                { pts: 130, desc: "Desconto de 0,05% nas taxas",   ganho: pontos >= 130  },
                { pts: 250, desc: "Desconto de 0,10% nas taxas",   ganho: pontos >= 250  },
                { pts: 350, desc: "Taxa Expert: 1,25% a.m.",       ganho: pontos >= 350  },
                { pts: 450, desc: "Antecipação grátis",            ganho: pontos >= 450  },
              ].map(b => (
                <div key={b.pts} style={{ display: "flex", alignItems: "center", gap: 10, opacity: b.ganho ? 1 : 0.5 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: b.ganho ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${b.ganho ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {b.ganho ? <CheckCircle size={12} color="#4ADE80" /> : <Lock size={10} color="#475569" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: b.ganho ? "#F1F5F9" : "#475569" }}>{b.desc}</div>
                    {!b.ganho && <div style={{ fontSize: 10, color: "#334155" }}>{b.pts} pts</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div style={{ ...S.card, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Trophy size={14} color="#FCD34D" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>Conquistas</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {BADGES.map(b => (
                <div key={b.id} style={{
                  background: b.ganho ? "rgba(252,211,77,0.07)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${b.ganho ? "rgba(252,211,77,0.25)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 11, padding: "12px", textAlign: "center", opacity: b.ganho ? 1 : 0.5,
                }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{b.ganho ? b.emoji : "🔒"}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: b.ganho ? "#FCD34D" : "#475569", marginBottom: 3 }}>{b.titulo}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking */}
          <div style={{ ...S.card, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Target size={16} color="#4ADE80" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9", marginBottom: 3 }}>
                  Você está entre os <span style={{ color: "#4ADE80" }}>top 15%</span> dos usuários
                </div>
                <div style={{ fontSize: 11, color: "#64748B" }}>Continue aprendendo para garantir melhores taxas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal lição ───────────────────────────────── */}
      {ativa && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }} onClick={() => !concluindo && setAtiva(null)}>
          <div style={{
            background: "#0C1628", border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 20, padding: 28, width: 560, maxWidth: "95vw",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          }} onClick={e => e.stopPropagation()}>

            {concluindo ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#F1F5F9", marginBottom: 10 }}>Lição Concluída!</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 20, padding: "10px 22px" }}>
                  <Star size={16} color="#FCD34D" />
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#4ADE80" }}>+{ativa.pontos} pontos</span>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                      {ativa.emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 900, color: "#F1F5F9", marginBottom: 6 }}>{ativa.titulo}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {(() => { const cat = CAT_CFG[ativa.categoria] || CAT_CFG.Crédito; return (
                          <span style={{ fontSize: 10, background: cat.bg, color: cat.color, border: `1px solid ${cat.color}30`, borderRadius: 20, padding: "2px 9px", fontWeight: 700 }}>{ativa.categoria}</span>
                        ); })()}
                        <span style={{ fontSize: 11, color: "#475569", display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} /> {ativa.duracao}</span>
                        <span style={{ fontSize: 11, color: "#FCD34D", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}><Star size={11} /> +{ativa.pontos} pts</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setAtiva(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 7, cursor: "pointer", color: "#94A3B8" }}>
                    <X size={15} />
                  </button>
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px", marginBottom: 20, whiteSpace: "pre-line", fontSize: 13, color: "#CBD5E1", lineHeight: 1.9, maxHeight: "48vh", overflowY: "auto" }}>
                  {CONTEUDOS[ativa.id]}
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setAtiva(null)} style={{ flex: 1, padding: "11px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94A3B8", cursor: "pointer", fontSize: 13 }}>Fechar</button>
                  {!ativa.concluido && (
                    <button onClick={() => handleConcluir(ativa.id)} style={{ flex: 2, padding: "11px", background: "linear-gradient(135deg,#4ADE80,#10B981)", border: "none", borderRadius: 10, color: "#050D18", cursor: "pointer", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 18px rgba(74,222,128,0.4)" }}>
                      <CheckCircle size={14} /> Concluir Lição · +{ativa.pontos} pts
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
