import { useState } from "react";
import { mockLicoes } from "../data/mockData";
import {
  CheckCircle, Trophy, Star, BookOpen, Zap,
  Target, TrendingUp, Lock, Play, Clock, X
} from "lucide-react";

const catColors = {
  Consignado: { bg: "rgba(59,130,246,0.1)",  text: "#93C5FD",      border: "rgba(59,130,246,0.2)"  },
  Cartão:     { bg: "rgba(239,68,68,0.1)",   text: "#F87171",      border: "rgba(239,68,68,0.2)"   },
  Crédito:    { bg: "rgba(124,58,237,0.1)",  text: "#A78BFA",      border: "rgba(124,58,237,0.2)"  },
  Poupança:   { bg: "rgba(0,200,150,0.1)",   text: "var(--green)", border: "rgba(0,200,150,0.2)"   },
  Score:      { bg: "rgba(245,158,11,0.1)",  text: "var(--yellow)",border: "rgba(245,158,11,0.2)"  },
};

const conteudos = {
  1: `A margem consignável é o percentual máximo do benefício que pode ser comprometido com descontos em folha.\n\nPara aposentados e pensionistas do INSS:\n• 35% para empréstimos consignados\n• 5% para cartão consignado\n• 5% para saque-complementar\n\nExemplo: Se você recebe R$ 2.000, pode comprometer até R$ 700 em descontos.\n\n💡 Sempre verifique sua margem antes de contratar qualquer crédito!`,
  2: `O rotativo do cartão é um dos juros mais altos do mercado — até 400% ao ano!\n\nA armadilha:\n1. Você paga só o mínimo da fatura\n2. O restante vai ao rotativo com 15-20% ao MÊS\n3. A dívida cresce exponencialmente\n\nExemplo real:\nDívida de R$ 2.000 a 15% a.m. → em 12 meses: R$ 8.700!\n\n💡 Solução: Quite o rotativo com consignado (1,5% a.m.) e economize muito.`,
  3: `A portabilidade permite transferir sua dívida para outro banco com condições melhores.\n\nVantagens:\n• Reduzir a taxa de juros\n• Diminuir o valor das parcelas\n• Liberar margem para outros fins\n\nComo fazer:\n1. Compare taxas de outros bancos\n2. Solicite a portabilidade no app\n3. O novo banco quita a dívida antiga\n4. Você passa a pagar ao novo banco\n\n💡 Portabilidade é direito garantido por lei. Use a seu favor!`,
  4: `A reserva de emergência é um valor para imprevistos: desemprego, doenças, reparos urgentes.\n\nMeta ideal: 6 a 12 meses de gastos essenciais\n\nComo montar:\n1. Calcule seus gastos mensais fixos\n2. Multiplique por 6\n3. Divida em metas mensais\n4. Guarde em conta de alta liquidez\n\nExemplo:\nGastos R$ 2.000/mês → Meta: R$ 12.000\nGuardando R$ 500/mês → pronto em 24 meses\n\n💡 Comece pequeno! Até R$ 1.000 já evita muitos problemas.`,
  5: `O Score vai de 0 a 1.000. Quanto maior, melhores as condições de crédito.\n\nO que piora seu score:\n✗ Dívidas em atraso\n✗ Nome no SPC/Serasa\n✗ Muitas consultas de crédito\n\nO que melhora seu score:\n✅ Pagar contas em dia\n✅ Quitar dívidas antigas\n✅ Usar crédito com moderação\n✅ Manter dados cadastrais atualizados\n✅ Participar do Cadastro Positivo\n\n💡 Score acima de 700 garante as melhores taxas!`,
};

const badges = [
  { id: 1, emoji: "🎓", titulo: "Primeiros Passos",   desc: "Complete sua 1ª lição",        ganho: true  },
  { id: 2, emoji: "🔥", titulo: "Em Chamas",          desc: "3 lições seguidas",            ganho: false },
  { id: 3, emoji: "💎", titulo: "Expert Consignado",  desc: "Complete módulo consignado",   ganho: false },
  { id: 4, emoji: "🏆", titulo: "Mestre Financeiro",  desc: "Complete todas as lições",     ganho: false },
];

export default function Educacao() {
  const [licoes, setLicoes] = useState(mockLicoes);
  const [ativa, setAtiva] = useState(null);
  const [concluindo, setConcluindo] = useState(false);

  const concluidas = licoes.filter(l => l.concluido).length;
  const pontos = licoes.filter(l => l.concluido).reduce((s, l) => s + l.pontos, 0);
  const progresso = Math.round((concluidas / licoes.length) * 100);

  function handleConcluir(id) {
    setConcluindo(true);
    setTimeout(() => {
      setLicoes(ls => ls.map(l => l.id === id ? { ...l, concluido: true } : l));
      setConcluindo(false);
      setAtiva(null);
    }, 1600);
  }

  return (
    <div className="page">

      {/* ── TOP ROW: Stats ─────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 18 }}>
        {[
          { l: "Pontos Acumulados", v: `${pontos} pts`,             color: "var(--yellow)", icon: Star },
          { l: "Lições Concluídas", v: `${concluidas}/${licoes.length}`, color: "var(--green)", icon: CheckCircle },
          { l: "Progresso Total",   v: `${progresso}%`,             color: "var(--blue-lt)", icon: TrendingUp },
          { l: "Badges Ganhos",     v: `${badges.filter(b => b.ganho).length}/${badges.length}`, color: "var(--purple-lt)", icon: Trophy },
        ].map(({ l, v, color, icon: Icon }) => (
          <div key={l} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div className="stat-label">{l}</div>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}14`, border: `1px solid ${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} color={color} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color, letterSpacing: -0.5 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── MAIN LAYOUT ─────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

        {/* LEFT: Lições */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Progress bar geral */}
          <div className="card card-sm" style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--text-2)" }}>Trilha de Educação Financeira</div>
                <div style={{ fontSize: 11.5, color: "var(--text-4)", marginTop: 2 }}>{concluidas} de {licoes.length} lições completadas</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--green)", letterSpacing: -1 }}>{progresso}%</div>
            </div>
            <div className="prog-track" style={{ height: 10 }}>
              <div className="prog-fill" style={{
                width: `${progresso}%`,
                background: "linear-gradient(90deg,var(--green),var(--green-dark))",
                boxShadow: "0 0 10px rgba(0,200,150,0.4)",
              }} />
            </div>
            {concluidas < licoes.length && (
              <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-4)" }}>
                💡 Complete todas as lições e ganhe <strong style={{ color: "var(--yellow)" }}>50% de desconto</strong> na próxima contratação
              </div>
            )}
          </div>

          {/* Lista de lições */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: 16 }}>
              <BookOpen size={13} color="var(--text-3)" />
              Módulos de Aprendizado
              <span className="chip chip-green" style={{ marginLeft: "auto" }}>{licoes.length} lições</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {licoes.map((licao, idx) => {
                const cat = catColors[licao.categoria] || catColors.Crédito;
                const isLocked = idx > 0 && !licoes[idx - 1].concluido && !licao.concluido;

                return (
                  <div
                    key={licao.id}
                    className={`licao-card${licao.concluido ? " done" : ""}`}
                    onClick={() => !isLocked && setAtiva(licao)}
                    style={{ opacity: isLocked ? 0.45 : 1, cursor: isLocked ? "not-allowed" : "pointer" }}
                  >
                    {/* Emoji */}
                    <div style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: licao.concluido ? "rgba(0,200,150,0.1)" : "rgba(255,255,255,0.05)",
                      border: licao.concluido ? "1px solid rgba(0,200,150,0.25)" : "1px solid var(--card-border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22,
                    }}>
                      {licao.concluido ? <CheckCircle size={22} color="var(--green)" fill="rgba(0,200,150,0.2)" /> : licao.emoji}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: licao.concluido ? "var(--text-3)" : "var(--text-2)" }}>
                          {licao.titulo}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10.5, background: cat.bg, color: cat.text, border: `1px solid ${cat.border}`, borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>
                          {licao.categoria}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--text-4)", display: "flex", alignItems: "center", gap: 3 }}>
                          <Clock size={10} /> {licao.duracao}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                          <Star size={10} fill="var(--yellow)" /> +{licao.pontos} pts
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{ flexShrink: 0 }}>
                      {licao.concluido ? (
                        <span className="chip chip-green">Concluída</span>
                      ) : isLocked ? (
                        <Lock size={16} color="var(--text-4)" />
                      ) : (
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: "linear-gradient(135deg,var(--green),var(--green-dark))",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(0,200,150,0.35)",
                        }}>
                          <Play size={14} color="white" fill="white" />
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

          {/* Nível atual */}
          <div className="card" style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.09),rgba(252,211,77,0.04))", border: "1px solid rgba(245,158,11,0.2)" }}>
            <div style={{ textAlign: "center", paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 18 }}>
              <div style={{ fontSize: 52, marginBottom: 6 }}>
                {pontos >= 350 ? "🏆" : pontos >= 150 ? "⭐" : "🎯"}
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "var(--yellow)", letterSpacing: -0.5 }}>
                {pontos >= 350 ? "Expert Financeiro" : pontos >= 150 ? "Aprendiz Avançado" : "Iniciante Curioso"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 4 }}>Seu nível atual</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "var(--text-4)" }}>Pontos para o próximo nível</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--yellow)" }}>{pontos}/350</span>
            </div>
            <div className="prog-track" style={{ height: 8 }}>
              <div className="prog-fill" style={{
                width: `${Math.min(100, (pontos / 350) * 100)}%`,
                background: "linear-gradient(90deg,var(--yellow),var(--orange))",
                boxShadow: "0 0 8px rgba(245,158,11,0.4)",
              }} />
            </div>
          </div>

          {/* Benefícios desbloqueados */}
          <div className="card">
            <div className="section-title">
              <Zap size={13} color="var(--green)" />
              Benefícios Desbloqueados
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { pts: 0,   desc: "Acesso ao simulador de crédito",  ganho: true  },
                { pts: 130, desc: "Desconto de 0,05% nas taxas",     ganho: pontos >= 130 },
                { pts: 250, desc: "Desconto de 0,10% nas taxas",     ganho: pontos >= 250 },
                { pts: 350, desc: "Taxa exclusiva Expert: 1,25% a.m.", ganho: pontos >= 350 },
                { pts: 450, desc: "Antecipação de recebíveis grátis",  ganho: pontos >= 450 },
              ].map(b => (
                <div key={b.pts} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  opacity: b.ganho ? 1 : 0.45,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: b.ganho ? "rgba(0,200,150,0.12)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${b.ganho ? "rgba(0,200,150,0.25)" : "var(--card-border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {b.ganho
                      ? <CheckCircle size={13} color="var(--green)" />
                      : <Lock size={11} color="var(--text-4)" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: b.ganho ? "var(--text-2)" : "var(--text-4)" }}>
                      {b.desc}
                    </div>
                    {!b.ganho && (
                      <div style={{ fontSize: 10, color: "var(--text-4)", marginTop: 1 }}>
                        Desbloqueie com {b.pts} pts
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="card">
            <div className="section-title">
              <Trophy size={13} color="var(--yellow)" />
              Conquistas
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {badges.map(b => (
                <div key={b.id} style={{
                  background: b.ganho ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${b.ganho ? "rgba(245,158,11,0.25)" : "var(--card-border)"}`,
                  borderRadius: 12, padding: "12px",
                  textAlign: "center", opacity: b.ganho ? 1 : 0.5,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{b.ganho ? b.emoji : "🔒"}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: b.ganho ? "var(--yellow)" : "var(--text-4)", marginBottom: 3 }}>
                    {b.titulo}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-4)" }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking */}
          <div className="card card-sm" style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Target size={18} color="var(--green)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-2)", marginBottom: 2 }}>
                  Você está entre os <strong style={{ color: "var(--green)" }}>top 15%</strong> dos usuários
                </div>
                <div style={{ fontSize: 11, color: "var(--text-4)" }}>
                  Continue aprendendo para subir no ranking e garantir melhores taxas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL LIÇÃO ──────────────────────────────── */}
      {ativa && (
        <div className="modal-overlay" onClick={() => !concluindo && setAtiva(null)}>
          <div className="modal-box" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>

            {concluindo ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "white", marginBottom: 8 }}>Lição Concluída!</div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(0,200,150,0.12)", border: "1px solid rgba(0,200,150,0.3)",
                  borderRadius: 20, padding: "10px 22px",
                }}>
                  <Star size={16} color="var(--yellow)" fill="var(--yellow)" />
                  <span style={{ fontSize: 16, fontWeight: 800, color: "var(--green)" }}>+{ativa.pontos} pontos</span>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
                    }}>
                      {ativa.emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: "white", marginBottom: 5 }}>{ativa.titulo}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ ...Object.fromEntries(Object.entries(catColors[ativa.categoria] || {}).map(([k, v]) => [k === "bg" ? "background" : k === "text" ? "color" : "border" === k ? "border" : k, v])), fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px" }}>
                          {ativa.categoria}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--text-4)", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} /> {ativa.duracao}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--yellow)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                          <Star size={11} fill="var(--yellow)" /> +{ativa.pontos} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="topbar-btn" onClick={() => setAtiva(null)}><X size={16} /></button>
                </div>

                {/* Conteúdo */}
                <div style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid var(--card-border)",
                  borderRadius: 14, padding: "20px 22px", marginBottom: 22,
                  whiteSpace: "pre-line", fontSize: 14, color: "var(--text-2)", lineHeight: 1.8,
                  maxHeight: "50vh", overflowY: "auto",
                }}>
                  {conteudos[ativa.id]}
                </div>

                {/* CTA */}
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAtiva(null)}>
                    Fechar
                  </button>
                  {!ativa.concluido && (
                    <button className="btn btn-green" style={{ flex: 2 }} onClick={() => handleConcluir(ativa.id)}>
                      <CheckCircle size={15} /> Marcar como Concluída · +{ativa.pontos} pts
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
