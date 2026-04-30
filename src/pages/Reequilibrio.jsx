import { useState } from "react";
import { mockDividas, mockUser } from "../data/mockData";
import {
  AlertTriangle, CheckCircle, RefreshCw, Zap, ChevronRight,
  TrendingDown, TrendingUp, ArrowRight, Shield, Calculator
} from "lucide-react";

function DividaCard({ divida, selecionada, onToggle }) {
  const urgente = divida.taxa > 5;
  const isRotativo = divida.tipo === "Cartão de Crédito";

  return (
    <div
      className={`divida-card${selecionada ? " selected" : ""}`}
      onClick={() => onToggle(divida.id)}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: urgente ? "rgba(239,68,68,0.1)" : "rgba(59,130,246,0.1)",
            border: `1px solid ${urgente ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>
            {urgente ? "🔴" : "🔵"}
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--text-2)" }}>{divida.banco}</div>
            <div style={{ fontSize: 11, color: "var(--text-4)" }}>{divida.tipo}</div>
          </div>
        </div>

        <div style={{
          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
          border: selecionada ? "none" : "2px solid rgba(255,255,255,0.15)",
          background: selecionada ? "linear-gradient(135deg,var(--green),var(--green-dark))" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: selecionada ? "0 0 10px rgba(0,200,150,0.4)" : "none",
          transition: "all .2s",
        }}>
          {selecionada && <CheckCircle size={14} color="white" fill="white" />}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { l: "Saldo", v: `R$ ${divida.saldo.toLocaleString("pt-BR")}`, danger: false },
          { l: "Taxa a.m.", v: `${divida.taxa}%`, danger: divida.taxa > 3 },
          { l: isRotativo ? "Modalidade" : "Parcela", v: isRotativo ? "Rotativo" : `R$ ${divida.parcela}`, danger: isRotativo },
        ].map(({ l, v, danger }) => (
          <div key={l} style={{
            background: "rgba(255,255,255,0.04)", borderRadius: 9, padding: "9px 11px",
            border: danger ? "1px solid rgba(239,68,68,0.12)" : "1px solid transparent",
          }}>
            <div style={{ fontSize: 9.5, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, fontWeight: 700 }}>{l}</div>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: danger ? "#F87171" : "var(--text-2)" }}>{v}</div>
          </div>
        ))}
      </div>

      {urgente && (
        <div style={{
          marginTop: 10, display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, color: "#F87171", fontWeight: 700,
        }}>
          <AlertTriangle size={11} />
          Taxa {divida.taxa > 10 ? "muito alta" : "elevada"} — recomendado trocar por consignado
        </div>
      )}
    </div>
  );
}

export default function Reequilibrio() {
  const [selecionadas, setSelecionadas] = useState([2]);
  const [step, setStep] = useState(1);

  function toggleDivida(id) {
    setSelecionadas(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);
  }

  const dividasSel = mockDividas.filter(d => selecionadas.includes(d.id));
  const totalSaldo = dividasSel.reduce((s, d) => s + d.saldo, 0);
  const parcelaMensalAtual = dividasSel.reduce((s, d) => s + (d.tipo === "Cartão de Crédito" ? d.saldo * 0.159 : d.parcela), 0);
  const taxaMedia = dividasSel.length > 0
    ? (dividasSel.reduce((s, d) => s + d.taxa, 0) / dividasSel.length).toFixed(2)
    : 0;

  const TAXA_CONSIGNADO = 1.45;
  const PRAZO = 60;
  const r = TAXA_CONSIGNADO / 100;
  const parcelaNova = totalSaldo > 0
    ? (totalSaldo * r * Math.pow(1 + r, PRAZO)) / (Math.pow(1 + r, PRAZO) - 1)
    : 0;

  const economia = parcelaMensalAtual - parcelaNova;
  const economiaAnual = economia * 12;
  const totalAtual = parcelaMensalAtual * PRAZO;
  const totalNovo = parcelaNova * PRAZO;
  const economiaTotal = totalAtual - totalNovo;

  return (
    <div className="page">

      {/* ── STEPS HEADER ────────────────────────────── */}
      <div className="card card-sm" style={{ padding: "14px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {[
            { n: 1, l: "Selecionar dívidas" },
            { n: 2, l: "Ver proposta IA" },
            { n: 3, l: "Confirmar" },
          ].map(({ n, l }, idx, arr) => (
            <div key={n} style={{ display: "flex", alignItems: "center", flex: idx < arr.length - 1 ? 1 : undefined }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: step >= n ? "linear-gradient(135deg,var(--green),var(--green-dark))" : "rgba(255,255,255,0.07)",
                  border: step >= n ? "none" : "1px solid var(--card-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: step >= n ? "white" : "var(--text-4)",
                  boxShadow: step === n ? "0 0 12px rgba(0,200,150,0.4)" : "none",
                }}>
                  {step > n ? <CheckCircle size={14} color="white" fill="white" /> : n}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: step >= n ? "var(--text-2)" : "var(--text-4)" }}>
                  {l}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div style={{ flex: 1, height: 1, background: step > n ? "var(--green)" : "rgba(255,255,255,0.08)", margin: "0 16px" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT ─────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>

        {/* LEFT: Dívidas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* IA Insight banner */}
          <div style={{
            background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 14, padding: "16px 20px",
            display: "flex", alignItems: "flex-start", gap: 14,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11, flexShrink: 0,
              background: "linear-gradient(135deg,#7C3AED,#A78BFA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
            }}>
              <Zap size={18} color="white" fill="white" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#C4B5FD", marginBottom: 4 }}>
                Análise da IA VerBatch
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.6 }}>
                Detectamos <strong style={{ color: "white" }}>{mockDividas.filter(d => d.taxa > 3).length} dívidas</strong> com taxas acima da média consignada.
                Selecionando todas, você economizaria até <strong style={{ color: "var(--green)" }}>R$ 210/mês</strong> e quitaria em <strong style={{ color: "white" }}>60 meses</strong> com taxa de <strong style={{ color: "var(--green)" }}>1,45% a.m.</strong>
              </div>
            </div>
          </div>

          {/* Seleção de dívidas */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div className="section-title" style={{ margin: 0 }}>
                <TrendingDown size={13} color="#F87171" />
                Suas Dívidas Ativas
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: 11, padding: "6px 12px" }}
                  onClick={() => setSelecionadas(mockDividas.map(d => d.id))}
                >
                  Selecionar todas
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: 11, padding: "6px 12px" }}
                  onClick={() => setSelecionadas([])}
                >
                  Limpar
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mockDividas.map(d => (
                <DividaCard
                  key={d.id}
                  divida={d}
                  selecionada={selecionadas.includes(d.id)}
                  onToggle={toggleDivida}
                />
              ))}
            </div>
          </div>

          {/* Como funciona */}
          <div className="card card-sm">
            <div className="section-title" style={{ marginBottom: 14 }}>
              <Shield size={13} color="var(--green)" />
              Como Funciona a Portabilidade
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { n: "01", title: "Seleção automática", desc: "A IA identifica dívidas caras e calcula a economia" },
                { n: "02", title: "Proposta em 2h", desc: "Geramos uma proposta com a menor taxa do mercado" },
                { n: "03", title: "Banco quita tudo", desc: "O banco parceiro paga suas dívidas diretamente" },
                { n: "04", title: "Parcela única", desc: "Você paga uma parcela menor via desconto em folha" },
              ].map(({ n, title, desc }) => (
                <div key={n} style={{ display: "flex", gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 900, color: "var(--green)",
                  }}>{n}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-4)", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Resultado + CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Resumo seleção */}
          <div className="card">
            <div className="section-title">
              <Calculator size={13} color="var(--text-3)" />
              Resumo da Proposta
            </div>

            {dividasSel.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-4)" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>👈</div>
                <div style={{ fontSize: 13 }}>Selecione dívidas para ver a proposta</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10.5, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, fontWeight: 700 }}>
                    Dívidas selecionadas ({dividasSel.length})
                  </div>
                  {dividasSel.map(d => (
                    <div key={d.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12 }}>
                      <span style={{ color: "var(--text-3)" }}>{d.banco}</span>
                      <span style={{ color: "var(--text-2)", fontWeight: 700 }}>R$ {d.saldo.toLocaleString("pt-BR")}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, fontSize: 13, fontWeight: 800 }}>
                    <span style={{ color: "var(--text-3)" }}>Total</span>
                    <span style={{ color: "#F87171" }}>R$ {totalSaldo.toLocaleString("pt-BR")}</span>
                  </div>
                </div>

                {/* Comparativo */}
                <div style={{ marginBottom: 16 }}>
                  {/* Situação atual */}
                  <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 12, padding: 14, marginBottom: 10 }}>
                    <div style={{ fontSize: 10.5, color: "#F87171", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, fontWeight: 700 }}>
                      ❌ Situação Atual
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "var(--text-4)" }}>Parcela mensal</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color: "#F87171" }}>R$ {parcelaMensalAtual.toFixed(0)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "var(--text-4)" }}>Taxa média</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#F87171" }}>{taxaMedia}% a.m.</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                    <ArrowRight size={18} color="var(--green)" />
                  </div>

                  {/* Proposta VerBatch */}
                  <div style={{ background: "rgba(0,200,150,0.08)", border: "1px solid rgba(0,200,150,0.25)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 10.5, color: "var(--green)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, fontWeight: 700 }}>
                      ✅ Com Reequilíbrio VerBatch
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "var(--text-4)" }}>Nova parcela</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color: "var(--green)" }}>R$ {parcelaNova.toFixed(0)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "var(--text-4)" }}>Taxa consignada</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>1,45% a.m.</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "var(--text-4)" }}>Prazo</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--blue-lt)" }}>60 meses</span>
                    </div>
                  </div>
                </div>

                {/* Economia destaque */}
                {economia > 0 && (
                  <div style={{
                    background: "linear-gradient(135deg,rgba(0,200,150,0.12),rgba(0,168,122,0.06))",
                    border: "1px solid rgba(0,200,150,0.3)", borderRadius: 14,
                    padding: 16, textAlign: "center", marginBottom: 16,
                  }}>
                    <div style={{ fontSize: 10, color: "rgba(0,200,150,0.7)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontWeight: 700 }}>
                      Sua Economia Estimada
                    </div>
                    <div style={{ fontSize: 34, fontWeight: 900, color: "var(--green)", letterSpacing: -1.5, lineHeight: 1, marginBottom: 4 }}>
                      R$ {economia.toFixed(0)}/mês
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                      R$ {economiaAnual.toFixed(0)}/ano · R$ {economiaTotal.toFixed(0)} no total
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-green anim-glow"
                  style={{ width: "100%", fontSize: 13 }}
                  onClick={() => setStep(2)}
                >
                  <Zap size={14} fill="white" />
                  Gerar Proposta de Reequilíbrio
                  <ChevronRight size={14} />
                </button>
              </>
            )}
          </div>

          {/* Proteção */}
          <div className="card card-sm">
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Shield size={16} color="var(--green)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: 11.5, color: "var(--text-4)", lineHeight: 1.6 }}>
                Portabilidade é direito garantido por lei (Res. BCB 4.292/2013). Sem custo para você.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
