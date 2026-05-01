// VerbaTech — Reequilíbrio Financeiro (Dark Theme v2)
import { useState, useEffect } from "react";
import {
  AlertTriangle, CheckCircle, Zap, ChevronRight,
  TrendingDown, ArrowDown, Shield, Calculator, RefreshCw
} from "lucide-react";
import { fmt } from "../data/verbatechData";

/* ── tokens ───────────────────────────────────────────── */
const S = {
  page:  { padding: 24, minHeight: "100vh", background: "#080E1A" },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};

/* ── Mock dívidas ─────────────────────────────────────── */
const DIVIDAS = [
  { id: 1, banco: "Banco do Brasil",  tipo: "Consignado",         parcela: 320, saldo: 8400,  taxa: 1.72, prazo: 36 },
  { id: 2, banco: "Nubank",           tipo: "Cartão de Crédito",  parcela: 0,   saldo: 2100,  taxa: 15.9, prazo: 0  },
  { id: 3, banco: "Caixa Econômica",  tipo: "Empréstimo Pessoal", parcela: 240, saldo: 5200,  taxa: 3.8,  prazo: 24 },
  { id: 4, banco: "Santander",        tipo: "Crédito Pessoal",    parcela: 180, saldo: 3600,  taxa: 4.5,  prazo: 20 },
];

/* ── Animated bar ─────────────────────────────────────── */
function AnimBar({ pct, color, height = 6 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 150); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: height }}>
      <div style={{ height: "100%", width: `${w}%`, borderRadius: height, background: color,
        transition: "width 0.9s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 6px ${color}55` }} />
    </div>
  );
}

/* ── Dívida Card ──────────────────────────────────────── */
function DividaCard({ divida, selecionada, onToggle }) {
  const urgente    = divida.taxa > 5;
  const isRotativo = divida.tipo === "Cartão de Crédito";
  const color      = urgente ? "#EF4444" : "#6366F1";

  return (
    <div onClick={() => onToggle(divida.id)} style={{
      ...S.card, padding: "14px 16px", cursor: "pointer",
      borderColor: selecionada ? (urgente ? "rgba(239,68,68,0.4)" : "rgba(99,102,241,0.4)") : "rgba(255,255,255,0.07)",
      background: selecionada ? (urgente ? "rgba(239,68,68,0.05)" : "rgba(99,102,241,0.05)") : "rgba(255,255,255,0.025)",
      transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: urgente ? "rgba(239,68,68,0.12)" : "rgba(99,102,241,0.1)",
            border: `1px solid ${urgente ? "rgba(239,68,68,0.25)" : "rgba(99,102,241,0.2)"}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            {urgente ? "🔴" : "🔵"}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#F1F5F9" }}>{divida.banco}</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>{divida.tipo}</div>
          </div>
        </div>
        <div style={{
          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
          border: selecionada ? "none" : "2px solid rgba(255,255,255,0.15)",
          background: selecionada ? "linear-gradient(135deg,#4ADE80,#10B981)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .2s", boxShadow: selecionada ? "0 0 10px rgba(74,222,128,0.4)" : "none",
        }}>
          {selecionada && <CheckCircle size={14} color="white" />}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { l: "Saldo",     v: fmt(divida.saldo),                                       danger: false },
          { l: "Taxa a.m.", v: `${divida.taxa}%`,                                        danger: divida.taxa > 3 },
          { l: isRotativo ? "Modalidade" : "Parcela", v: isRotativo ? "Rotativo" : fmt(divida.parcela), danger: isRotativo },
        ].map(({ l, v, danger }) => (
          <div key={l} style={{
            background: "rgba(255,255,255,0.04)", borderRadius: 9, padding: "9px 10px",
            border: danger ? "1px solid rgba(239,68,68,0.15)" : "1px solid transparent",
          }}>
            <div style={{ ...S.label, marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: danger ? "#F87171" : "#CBD5E1" }}>{v}</div>
          </div>
        ))}
      </div>

      {urgente && (
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#F87171", fontWeight: 700 }}>
          <AlertTriangle size={11} />
          Taxa {divida.taxa > 10 ? "muito alta" : "elevada"} — recomendado trocar por consignado
        </div>
      )}
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────────────── */
export default function Reequilibrio() {
  const [selecionadas, setSelecionadas] = useState([2, 3]);
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  function toggleDivida(id) {
    setSelecionadas(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);
  }

  const dividasSel        = DIVIDAS.filter(d => selecionadas.includes(d.id));
  const totalSaldo        = dividasSel.reduce((s, d) => s + d.saldo, 0);
  const parcelaMensalAtual = dividasSel.reduce((s, d) => s + (d.tipo === "Cartão de Crédito" ? d.saldo * 0.159 : d.parcela), 0);
  const taxaMedia         = dividasSel.length > 0 ? (dividasSel.reduce((s, d) => s + d.taxa, 0) / dividasSel.length).toFixed(2) : 0;
  const TAXA_CONS         = 1.45;
  const PRAZO             = 60;
  const r                 = TAXA_CONS / 100;
  const parcelaNova       = totalSaldo > 0 ? (totalSaldo * r * Math.pow(1 + r, PRAZO)) / (Math.pow(1 + r, PRAZO) - 1) : 0;
  const economia          = parcelaMensalAtual - parcelaNova;
  const economiaAnual     = economia * 12;

  const STEPS = ["Selecionar dívidas", "Ver proposta IA", "Confirmar"];

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Reequilíbrio Financeiro</h1>
        <p style={{ color: "#64748B", fontSize: 13 }}>Portabilidade inteligente · IA identifica dívidas caras · Parcela única consignada</p>
      </div>

      {/* Step progress */}
      <div style={{ ...S.card, padding: "16px 24px", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {STEPS.map((s, idx) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: idx < STEPS.length - 1 ? 1 : undefined }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: step > idx + 1 ? "#4ADE80" : step === idx + 1 ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: "#fff",
                  boxShadow: step === idx + 1 ? "0 0 14px rgba(99,102,241,0.4)" : "none",
                }}>
                  {step > idx + 1 ? <CheckCircle size={14} color="white" /> : idx + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: step >= idx + 1 ? "#F1F5F9" : "#475569" }}>{s}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: step > idx + 1 ? "#4ADE80" : "rgba(255,255,255,0.08)", margin: "0 16px" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>

        {/* LEFT: Dívidas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* IA banner */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, background: "linear-gradient(135deg,#7C3AED,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
              <Zap size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#C4B5FD", marginBottom: 4 }}>Análise IA VerbaTech</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>
                Detectamos <strong style={{ color: "#F1F5F9" }}>{DIVIDAS.filter(d => d.taxa > 3).length} dívidas</strong> com taxas acima da média consignada. Selecionando todas, você economizaria até <strong style={{ color: "#4ADE80" }}>R$ {economia > 0 ? economia.toFixed(0) : "210"}/mês</strong> e quitaria em <strong style={{ color: "#F1F5F9" }}>60 meses</strong> com taxa de <strong style={{ color: "#4ADE80" }}>1,45% a.m.</strong>
              </div>
            </div>
          </div>

          {/* Lista dívidas */}
          <div style={{ ...S.card, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingDown size={15} color="#EF4444" />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Suas Dívidas Ativas</span>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(248,113,113,0.15)", color: "#F87171", fontWeight: 700 }}>{DIVIDAS.length} encontradas</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setSelecionadas(DIVIDAS.map(d => d.id))} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 12px", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>Selecionar todas</button>
                <button onClick={() => setSelecionadas([])} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 12px", color: "#94A3B8", fontSize: 11, cursor: "pointer" }}>Limpar</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DIVIDAS.map(d => <DividaCard key={d.id} divida={d} selecionada={selecionadas.includes(d.id)} onToggle={toggleDivida} />)}
            </div>
          </div>

          {/* Como funciona */}
          <div style={{ ...S.card, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Shield size={15} color="#4ADE80" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>Como Funciona a Portabilidade</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { n: "01", title: "Seleção automática", desc: "IA identifica dívidas caras e calcula a economia", color: "#6366F1" },
                { n: "02", title: "Proposta em 2h",     desc: "Geramos proposta com menor taxa do mercado",        color: "#06B6D4" },
                { n: "03", title: "Banco quita tudo",   desc: "O banco parceiro paga suas dívidas diretamente",    color: "#10B981" },
                { n: "04", title: "Parcela única",       desc: "Você paga uma parcela menor via desconto em folha", color: "#A855F7" },
              ].map(({ n, title, desc, color }) => (
                <div key={n} style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: color + "18", border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color }}>
                    {n}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9", marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Proposta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...S.card, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <Calculator size={15} color="#818CF8" />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>Resumo da Proposta</span>
            </div>

            {dividasSel.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "#475569" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>👈</div>
                <div style={{ fontSize: 13 }}>Selecione dívidas para ver a proposta</div>
              </div>
            ) : (
              <>
                {/* Selecionadas */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ ...S.label, marginBottom: 10 }}>Dívidas selecionadas ({dividasSel.length})</div>
                  {dividasSel.map(d => (
                    <div key={d.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12 }}>
                      <span style={{ color: "#64748B" }}>{d.banco}</span>
                      <span style={{ color: "#F1F5F9", fontWeight: 700 }}>{fmt(d.saldo)}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, fontSize: 13, fontWeight: 800 }}>
                    <span style={{ color: "#64748B" }}>Total</span>
                    <span style={{ color: "#F87171" }}>{fmt(totalSaldo)}</span>
                  </div>
                </div>

                {/* Comparativo */}
                <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 11, padding: "13px 14px", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "#F87171", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>❌ Situação Atual</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#64748B" }}>Parcela mensal</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: "#F87171" }}>R$ {parcelaMensalAtual.toFixed(0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#64748B" }}>Taxa média</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#F87171" }}>{taxaMedia}% a.m.</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>
                  <ArrowDown size={18} color="#4ADE80" />
                </div>

                <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 11, padding: "13px 14px", marginBottom: 18 }}>
                  <div style={{ fontSize: 10, color: "#4ADE80", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>✅ Com Reequilíbrio VerbaTech</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#64748B" }}>Nova parcela</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: "#4ADE80" }}>R$ {parcelaNova.toFixed(0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "#64748B" }}>Taxa consignada</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#4ADE80" }}>1,45% a.m.</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#64748B" }}>Prazo</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#38BDF8" }}>60 meses</span>
                  </div>
                </div>

                {/* Economia destaque */}
                {economia > 0 && (
                  <div style={{ background: "linear-gradient(135deg,rgba(74,222,128,0.12),rgba(16,185,129,0.06))", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 13, padding: "16px", textAlign: "center", marginBottom: 18 }}>
                    <div style={{ ...S.label, marginBottom: 6 }}>Sua Economia Estimada</div>
                    <div style={{ fontSize: 34, fontWeight: 900, color: "#4ADE80", letterSpacing: -1, lineHeight: 1, marginBottom: 4 }}>
                      R$ {economia.toFixed(0)}<span style={{ fontSize: 16 }}>/mês</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>R$ {economiaAnual.toFixed(0)}/ano economizados</div>
                  </div>
                )}

                {!confirmed ? (
                  <button onClick={() => { setStep(2); setConfirmed(true); }} style={{
                    width: "100%", padding: "13px", borderRadius: 12, border: "none",
                    background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                    color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                  }}>
                    <Zap size={14} /> Gerar Proposta de Reequilíbrio <ChevronRight size={14} />
                  </button>
                ) : (
                  <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <CheckCircle size={16} color="#4ADE80" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#4ADE80" }}>Proposta gerada com sucesso!</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>📧 Contrato enviado para seu e-mail · Assinatura digital via ZapSign</div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>⏱ Aprovação em até 2 horas úteis</div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Proteção legal */}
          <div style={{ ...S.card, padding: 14 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Shield size={16} color="#4ADE80" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.6 }}>
                Portabilidade é <strong style={{ color: "#F1F5F9" }}>direito garantido por lei</strong> (Res. BCB 4.292/2013). Sem custo para você. Operação regulada pelo Banco Central do Brasil.
              </div>
            </div>
          </div>

          {/* Taxa comparison mini */}
          <div style={{ ...S.card, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", marginBottom: 14 }}>Por que consignado?</div>
            {[
              { tipo: "Consignado 1,45%",  bar: 9,   color: "#4ADE80" },
              { tipo: "Empréstimo 3,8%",   bar: 24,  color: "#F59E0B" },
              { tipo: "Crédito pessoal 5%",bar: 31,  color: "#F87171" },
              { tipo: "Cartão 15,9%",      bar: 100, color: "#DC2626" },
            ].map(({ tipo, bar, color }) => (
              <div key={tipo} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                <div style={{ width: 130, fontSize: 11, color: "#64748B", flexShrink: 0 }}>{tipo}</div>
                <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${bar}%`, background: color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
