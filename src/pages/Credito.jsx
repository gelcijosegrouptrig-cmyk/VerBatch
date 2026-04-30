import { useState } from "react";
import { mockOfertas, mockUser } from "../data/mockData";
import {
  Zap, TrendingDown, CheckCircle, ChevronRight,
  Calculator, Star, Info, Shield, Clock, BarChart2
} from "lucide-react";

function calcParcela(valor, taxa, prazo) {
  if (prazo === 0) return 0;
  const r = taxa / 100;
  return (valor * r * Math.pow(1 + r, prazo)) / (Math.pow(1 + r, prazo) - 1);
}

function OfertaCard({ oferta, onContratar }) {
  return (
    <div className={`oferta-card${oferta.destaque ? " destaque" : ""}`} style={{ position: "relative" }}>
      {oferta.badge && (
        <div className={`badge ${oferta.destaque ? "badge-green" : "badge-blue"}`}>
          {oferta.badge}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: oferta.destaque
            ? "linear-gradient(135deg,var(--green),var(--green-dark))"
            : "rgba(255,255,255,0.06)",
          border: oferta.destaque ? "none" : "1px solid var(--card-border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: oferta.destaque ? undefined : 18,
          fontWeight: 900, fontSize: 13, color: "white",
          boxShadow: oferta.destaque ? "0 4px 16px rgba(0,200,150,0.4)" : "none",
        }}>
          {oferta.banco === "VerBatch Credit" ? <Zap size={18} color="white" fill="white" /> : "🏦"}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{oferta.banco}</div>
          <div style={{ fontSize: 11.5, color: "var(--text-4)", marginTop: 2 }}>{oferta.tipo}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { l: "Valor", v: `R$ ${oferta.valor.toLocaleString("pt-BR")}`, color: "var(--green)", highlight: true },
          { l: "Taxa a.m.", v: `${oferta.taxa}%`, color: oferta.taxa < 1.5 ? "var(--green)" : "var(--orange)" },
          { l: "Prazo", v: `${oferta.prazo}x`, color: "var(--blue-lt)" },
        ].map(({ l, v, color, highlight }) => (
          <div key={l} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 10, padding: "11px 12px",
          }}>
            <div style={{ fontSize: 9.5, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 5, fontWeight: 700 }}>{l}</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: highlight ? color : "var(--text-2)" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Parcela destaque */}
      <div style={{
        background: oferta.destaque ? "rgba(0,200,150,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${oferta.destaque ? "rgba(0,200,150,0.2)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 11, padding: "12px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 12, color: "var(--text-3)" }}>Parcela mensal</span>
        <span style={{ fontSize: 20, fontWeight: 900, color: oferta.destaque ? "var(--green)" : "var(--text)" }}>
          R$ {oferta.parcela.toLocaleString("pt-BR")}
        </span>
      </div>

      {/* Features */}
      <div style={{ marginBottom: 18 }}>
        {[
          "Desconto em folha automático",
          "Sem consulta ao SPC/Serasa",
          "Aprovação em até 2 horas",
        ].map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <CheckCircle size={12} color="var(--green)" />
            <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>{f}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button onClick={() => onContratar(oferta)} className={`btn ${oferta.destaque ? "btn-green" : "btn-ghost"}`} style={{ width: "100%", fontSize: 13 }}>
        {oferta.destaque ? <><Zap size={14} fill="white" /> Contratar Agora</> : "Ver Detalhes"}
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

export default function Credito({ showBalance }) {
  const [valor, setValor] = useState(10000);
  const [prazo, setPrazo] = useState(60);
  const [taxa] = useState(1.45);
  const [showModal, setShowModal] = useState(false);
  const [ofertaSelecionada, setOfertaSelecionada] = useState(null);

  const parcela = calcParcela(valor, taxa, prazo);
  const totalPagar = parcela * prazo;
  const totalJuros = totalPagar - valor;
  const comprometimento = ((parcela / mockUser.salarioLiquido) * 100).toFixed(1);
  const margemOk = parcela <= mockUser.margemDisponivel;

  function handleContratar(oferta) {
    setOfertaSelecionada(oferta);
    setShowModal(true);
  }

  return (
    <div className="page">

      {/* ── TOP ROW: Perfil de crédito ─────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 18 }}>
        {[
          { l: "Margem Disponível", v: showBalance ? `R$ ${mockUser.margemDisponivel.toLocaleString("pt-BR")}` : "R$ ••••", color: "var(--green)", icon: TrendingDown },
          { l: "Score de Crédito",   v: `${mockUser.score} pts`,      color: "var(--orange)", icon: BarChart2 },
          { l: "Limite Simulado",    v: showBalance ? `R$ 15.000` : "R$ ••••", color: "var(--blue-lt)", icon: Calculator },
          { l: "Taxa Mínima",        v: "1,45% a.m.",                 color: "var(--green)", icon: Star },
        ].map(({ l, v, color, icon: Icon }) => (
          <div key={l} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div className="stat-label">{l}</div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}14`, border: `1px solid ${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} color={color} />
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color, letterSpacing: -0.5 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── MAIN ROW: Simulador + Ofertas ─────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>

        {/* Simulador */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="section-title">
              <Calculator size={13} color="var(--text-3)" />
              Simulador de Crédito
            </div>

            {/* Valor slider */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label className="input-label">Valor desejado</label>
                <span style={{ fontSize: 17, fontWeight: 900, color: "var(--green)", letterSpacing: -0.5 }}>
                  R$ {valor.toLocaleString("pt-BR")}
                </span>
              </div>
              <input
                type="range" min={500} max={30000} step={500}
                value={valor} onChange={e => setValor(+e.target.value)}
                style={{ accentColor: "var(--green)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-4)", marginTop: 4 }}>
                <span>R$ 500</span><span>R$ 30.000</span>
              </div>
            </div>

            {/* Prazo slider */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label className="input-label">Prazo</label>
                <span style={{ fontSize: 17, fontWeight: 900, color: "var(--blue-lt)", letterSpacing: -0.5 }}>
                  {prazo} meses
                </span>
              </div>
              <input
                type="range" min={6} max={96} step={6}
                value={prazo} onChange={e => setPrazo(+e.target.value)}
                style={{ accentColor: "var(--blue)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-4)", marginTop: 4 }}>
                <span>6 meses</span><span>96 meses</span>
              </div>
            </div>

            {/* Resultado */}
            <div style={{
              background: margemOk ? "rgba(0,200,150,0.07)" : "rgba(239,68,68,0.07)",
              border: `1px solid ${margemOk ? "rgba(0,200,150,0.2)" : "rgba(239,68,68,0.2)"}`,
              borderRadius: 14, padding: 18, marginBottom: 16,
            }}>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4, fontWeight: 700 }}>
                  Parcela Estimada
                </div>
                <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, color: margemOk ? "var(--green)" : "#F87171", lineHeight: 1 }}>
                  R$ {parcela.toFixed(2).replace(".", ",")}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-4)", marginTop: 6 }}>por mês · taxa {taxa}% a.m.</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { l: "Total a pagar", v: `R$ ${totalPagar.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` },
                  { l: "Total de juros", v: `R$ ${totalJuros.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` },
                ].map(({ l, v }) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 9, padding: "9px 12px" }}>
                    <div style={{ fontSize: 9.5, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3, fontWeight: 700 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-2)" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comprometimento */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
                <span style={{ color: "var(--text-4)" }}>Comprometimento de renda</span>
                <span style={{ color: margemOk ? "var(--green)" : "#F87171", fontWeight: 800 }}>{comprometimento}%</span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{
                  width: `${Math.min(100, comprometimento)}%`,
                  background: `linear-gradient(90deg,${margemOk ? "var(--green)" : "#F87171"},${margemOk ? "var(--green-dark)" : "#DC2626"})`,
                }} />
              </div>
              <div style={{ fontSize: 10.5, color: "var(--text-4)", marginTop: 4 }}>
                {margemOk
                  ? "✅ Dentro da margem consignável"
                  : "❌ Excede a margem disponível"}
              </div>
            </div>

            <button
              onClick={() => handleContratar(mockOfertas[0])}
              disabled={!margemOk}
              className="btn btn-green"
              style={{ width: "100%", opacity: margemOk ? 1 : 0.5 }}
            >
              <Zap size={14} fill="white" />
              {margemOk ? "Solicitar com Melhor Oferta" : "Ajuste o valor/prazo"}
            </button>
          </div>

          {/* Proteções */}
          <div className="card card-sm">
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Shield size={18} color="var(--green)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-2)", marginBottom: 4 }}>Contratação 100% segura</div>
                <div style={{ fontSize: 11, color: "var(--text-4)", lineHeight: 1.6 }}>
                  Biometria facial · LGPD compliant · Regulado pelo Banco Central · Dados criptografados
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ofertas */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div className="section-title" style={{ margin: 0 }}>
              <Star size={13} color="var(--yellow)" />
              Ofertas Personalizadas para Você
            </div>
            <span className="chip chip-green">{mockOfertas.length} disponíveis</span>
            <span className="chip chip-blue" style={{ marginLeft: "auto" }}>
              <Clock size={9} /> Expira em 24h
            </span>
          </div>

          {/* IA recomendação */}
          <div style={{
            background: "rgba(0,200,150,0.06)", border: "1px solid rgba(0,200,150,0.18)",
            borderRadius: 14, padding: "14px 18px", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <Zap size={18} color="var(--green)" fill="var(--green)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--green)", marginBottom: 3 }}>
                Recomendação da IA VerBatch
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>
                Com base no seu perfil INSS e margem livre de R$ 780, a <strong style={{ color: "white" }}>VerBatch Credit</strong> oferece a menor taxa disponível. Você economizaria <strong style={{ color: "var(--green)" }}>R$ 520</strong> comparando com crédito pessoal.
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {mockOfertas.map(o => (
              <OfertaCard key={o.id} oferta={o} onContratar={handleContratar} />
            ))}
          </div>

          {/* Comparativo de taxa */}
          <div className="card" style={{ marginTop: 16 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>
              <BarChart2 size={13} color="var(--text-3)" />
              Comparativo de Taxas no Mercado
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { tipo: "Consignado VerBatch",    taxa: 1.45, color: "var(--green)", ref: true },
                { tipo: "Consignado Mercado",     taxa: 1.72, color: "var(--blue-lt)" },
                { tipo: "Empréstimo Pessoal",     taxa: 3.80, color: "var(--orange)" },
                { tipo: "Crédito Rotativo Cartão",taxa: 15.9, color: "#F87171" },
              ].map(({ tipo, taxa: t, color, ref }) => (
                <div key={tipo} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 150, fontSize: 12, color: ref ? "var(--green)" : "var(--text-3)", fontWeight: ref ? 700 : 500, flexShrink: 0 }}>
                    {ref && "★ "}{tipo}
                  </div>
                  <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      width: `${Math.min(100, (t / 15.9) * 100)}%`,
                      background: color,
                    }} />
                  </div>
                  <div style={{ width: 70, fontSize: 12, fontWeight: 800, color, textAlign: "right", flexShrink: 0 }}>
                    {t}% a.m.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL CONTRATAÇÃO ─────────────────────────── */}
      {showModal && ofertaSelecionada && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 6 }}>
                Proposta Pré-Aprovada!
              </div>
              <div style={{ fontSize: 14, color: "var(--text-3)" }}>
                Confirme os dados para prosseguir com a contratação
              </div>
            </div>

            <div style={{ background: "rgba(0,200,150,0.07)", border: "1px solid rgba(0,200,150,0.2)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { l: "Banco", v: ofertaSelecionada.banco },
                  { l: "Valor", v: `R$ ${ofertaSelecionada.valor.toLocaleString("pt-BR")}` },
                  { l: "Taxa", v: `${ofertaSelecionada.taxa}% a.m.` },
                  { l: "Prazo", v: `${ofertaSelecionada.prazo} meses` },
                  { l: "Parcela", v: `R$ ${ofertaSelecionada.parcela}/mês` },
                  { l: "Desconto", v: "Em folha de pagamento" },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 3, fontWeight: 700 }}>{l}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text)" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
              <Info size={16} color="var(--blue-lt)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.6 }}>
                Ao prosseguir, você autoriza a consulta ao Dataprev/SIAPE e o desconto em folha do INSS conforme regulamentação do Banco Central. Dados protegidos pela LGPD.
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-green" style={{ flex: 2 }} onClick={() => setShowModal(false)}>
                <CheckCircle size={15} /> Confirmar Contratação
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
