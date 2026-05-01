// VerbaTech — Crédito (Simulador + Ofertas — Dark Theme v2)
import { useState, useEffect } from "react";
import {
  Zap, TrendingDown, CheckCircle, ChevronRight,
  Calculator, Star, Shield, Clock, BarChart2,
  AlertCircle, Info, DollarSign, Target, CreditCard
} from "lucide-react";
import { mockProdutos, fmt, fmtPct, calcParcela } from "../data/verbatechData";

/* ── tokens ─────────────────────────────────────────── */
const S = {
  page:  { padding: 24, minHeight: "100vh", background: "#080E1A" },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};

/* ── Mock credit profile ─────────────────────────────── */
const PERFIL = {
  margem: 780,
  margemUsada: 560,
  margemTotal: 1340,
  score: 680,
  salario: 2650,
  tipo: "INSS",
  matricula: "1234567",
};

/* ── Ofertas mock ────────────────────────────────────── */
const OFERTAS = [
  { id: 1, banco: "VerbaTech Credit",  tipo: "Consignado INSS", valor: 15000, taxa: 1.45, prazo: 60, destaque: true,  badge: "Melhor taxa" },
  { id: 2, banco: "Caixa Econômica",   tipo: "Consignado INSS", valor: 12000, taxa: 1.72, prazo: 48, destaque: false, badge: null },
  { id: 3, banco: "Banco do Brasil",   tipo: "FGTS Antecipação",valor: 8000,  taxa: 1.89, prazo: 36, destaque: false, badge: "Sem margem" },
];

/* ── Animated bar ────────────────────────────────────── */
function AnimBar({ pct, color, height = 6 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 100); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: height }}>
      <div style={{ height: "100%", width: `${w}%`, borderRadius: height, background: color,
        transition: "width 0.8s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 6px ${color}55` }} />
    </div>
  );
}

/* ── Oferta Card ─────────────────────────────────────── */
function OfertaCard({ oferta, onContratar }) {
  const parcela = calcParcela(oferta.valor, oferta.taxa, oferta.prazo);
  const color   = oferta.destaque ? "#4ADE80" : "#818CF8";

  return (
    <div style={{
      ...S.card, padding: 18, position: "relative", overflow: "hidden",
      borderColor: oferta.destaque ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.07)",
      background: oferta.destaque ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.025)",
    }}>
      {oferta.badge && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: oferta.destaque ? "rgba(74,222,128,0.2)" : "rgba(99,102,241,0.2)",
          border: `1px solid ${oferta.destaque ? "rgba(74,222,128,0.4)" : "rgba(99,102,241,0.4)"}`,
          borderRadius: 20, padding: "2px 9px",
          fontSize: 9, fontWeight: 800, color: oferta.destaque ? "#4ADE80" : "#818CF8",
        }}>{oferta.badge}</div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11, flexShrink: 0,
          background: oferta.destaque ? "rgba(74,222,128,0.15)" : "rgba(99,102,241,0.1)",
          border: `1px solid ${oferta.destaque ? "rgba(74,222,128,0.3)" : "rgba(99,102,241,0.2)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {oferta.destaque ? <Zap size={17} color="#4ADE80" /> : <CreditCard size={17} color="#818CF8" />}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#F1F5F9" }}>{oferta.banco}</div>
          <div style={{ fontSize: 11, color: "#64748B" }}>{oferta.tipo}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { l: "Valor",    v: fmt(oferta.valor),        c: color },
          { l: "Taxa a.m.",v: `${oferta.taxa}%`,         c: oferta.taxa < 1.6 ? "#4ADE80" : "#F59E0B" },
          { l: "Prazo",    v: `${oferta.prazo}x`,        c: "#38BDF8" },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "10px 10px" }}>
            <div style={{ ...S.label, marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Parcela */}
      <div style={{
        background: oferta.destaque ? "rgba(74,222,128,0.07)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${oferta.destaque ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 10, padding: "11px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14,
      }}>
        <span style={{ fontSize: 12, color: "#64748B" }}>Parcela mensal</span>
        <span style={{ fontSize: 18, fontWeight: 900, color }}>R$ {parcela.toFixed(2).replace(".", ",")}</span>
      </div>

      {/* Features */}
      <div style={{ marginBottom: 14 }}>
        {["Desconto automático em folha", "Sem consulta SPC/Serasa", "Aprovação em até 2h"].map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
            <CheckCircle size={11} color="#4ADE80" />
            <span style={{ fontSize: 11, color: "#94A3B8" }}>{f}</span>
          </div>
        ))}
      </div>

      <button onClick={() => onContratar(oferta)} style={{
        width: "100%", padding: "11px", borderRadius: 10, border: "none", cursor: "pointer",
        background: oferta.destaque ? "linear-gradient(135deg,#4ADE80,#10B981)" : "rgba(99,102,241,0.15)",
        border: oferta.destaque ? "none" : "1px solid rgba(99,102,241,0.3)",
        color: oferta.destaque ? "#050D18" : "#818CF8",
        fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        boxShadow: oferta.destaque ? "0 4px 16px rgba(74,222,128,0.35)" : "none",
      }}>
        {oferta.destaque ? <><Zap size={14} />Contratar Agora</> : <><ChevronRight size={14} />Ver Detalhes</>}
      </button>
    </div>
  );
}

/* ── Contratação Modal ───────────────────────────────── */
function ContratacaoModal({ oferta, onClose }) {
  const [step, setStep] = useState(1);
  const parcela = calcParcela(oferta.valor, oferta.taxa, oferta.prazo);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#0C1628", border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 20, padding: 28, width: 460, maxWidth: "95vw",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}>
        {/* step progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {["Confirmar", "Biometria", "Assinatura"].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 4, borderRadius: 4, marginBottom: 5,
                background: i < step ? "#6366F1" : "rgba(255,255,255,0.08)" }} />
              <span style={{ fontSize: 9, color: i < step ? "#818CF8" : "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{s}</span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#F1F5F9", marginBottom: 6 }}>Proposta Pré-Aprovada!</div>
              <div style={{ fontSize: 13, color: "#64748B" }}>Confirme os dados para prosseguir</div>
            </div>
            <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 14, padding: 18, marginBottom: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { l: "Banco",   v: oferta.banco },
                  { l: "Valor",   v: fmt(oferta.valor) },
                  { l: "Taxa",    v: `${oferta.taxa}% a.m.` },
                  { l: "Prazo",   v: `${oferta.prazo} meses` },
                  { l: "Parcela", v: `R$ ${parcela.toFixed(2).replace(".", ",")}` },
                  { l: "Desconto",v: "Em folha INSS" },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <div style={{ ...S.label, marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 10, padding: "11px 14px", marginBottom: 20 }}>
              <Info size={14} color="#38BDF8" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.6 }}>
                Ao prosseguir, você autoriza a consulta ao Dataprev e o desconto em folha. Dados protegidos pela LGPD.
              </span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "11px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94A3B8", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
              <button onClick={() => setStep(2)} style={{ flex: 2, padding: "11px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontWeight: 800, fontSize: 13 }}>
                Continuar →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>🤳</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#F1F5F9", marginBottom: 8 }}>Validação Biométrica</div>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>Posicione seu rosto na câmera para validação de identidade</div>
              <div style={{ width: 140, height: 140, borderRadius: "50%", background: "rgba(99,102,241,0.1)", border: "2px dashed rgba(99,102,241,0.4)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 48 }}>👤</span>
              </div>
              <button onClick={() => setStep(3)} style={{ padding: "12px 32px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                Simular captura ✓
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>✍️</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#F1F5F9", marginBottom: 8 }}>Assinatura Digital</div>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Assine digitalmente via ZapSign — e-mail enviado para você</div>
              <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 12, padding: 18, marginBottom: 20, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <CheckCircle size={16} color="#4ADE80" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#4ADE80" }}>Contrato pronto para assinatura</span>
                </div>
                <div style={{ fontSize: 11, color: "#64748B" }}>📧 Link enviado para ricardo@verbatech.com.br</div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>⏱ Válido por 48 horas</div>
              </div>
              <button onClick={onClose} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#4ADE80,#10B981)", border: "none", borderRadius: 12, color: "#050D18", fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 20px rgba(74,222,128,0.4)" }}>
                🎉 Contrato enviado! Fechar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── MAIN ────────────────────────────────────────────── */
export default function Credito({ showBalance }) {
  const [valor,  setValor]  = useState(15000);
  const [prazo,  setPrazo]  = useState(60);
  const taxa = 1.45;
  const [modal, setModal]   = useState(null);

  const parcela       = calcParcela(valor, taxa, prazo);
  const totalPagar    = parcela * prazo;
  const totalJuros    = totalPagar - valor;
  const comprometido  = (parcela / PERFIL.salario) * 100;
  const margemOk      = parcela <= PERFIL.margem;
  const margemPct     = Math.min(100, ((PERFIL.margemUsada + parcela) / PERFIL.margemTotal) * 100);

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Crédito Consignado</h1>
        <p style={{ color: "#64748B", fontSize: 13 }}>Simule e contrate · Melhores taxas do mercado · Desconto automático em folha</p>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Margem Disponível", value: showBalance ? fmt(PERFIL.margem) : "R$ ••••", color: "#4ADE80", icon: TrendingDown },
          { label: "Score de Crédito",  value: `${PERFIL.score} pts`,                        color: "#F59E0B", icon: Target },
          { label: "Limite Simulado",   value: showBalance ? fmt(15000) : "R$ ••••",          color: "#38BDF8", icon: Calculator },
          { label: "Taxa Mínima",       value: "1,45% a.m.",                                  color: "#4ADE80", icon: Star },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{ ...S.card, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 70, height: 70, background: `radial-gradient(circle at top right, ${color}18, transparent 70%)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={S.label}>{label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} color={color} />
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>

        {/* Simulador */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...S.card, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calculator size={15} color="#818CF8" />
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9" }}>Simulador de Crédito</span>
            </div>

            {/* Valor */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <label style={S.label}>Valor desejado</label>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#4ADE80" }}>{fmt(valor)}</span>
              </div>
              <input type="range" min={1000} max={50000} step={500} value={valor} onChange={e => setValor(+e.target.value)}
                style={{ width: "100%", accentColor: "#4ADE80" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#334155", marginTop: 3 }}>
                <span>R$ 1.000</span><span>R$ 50.000</span>
              </div>
            </div>

            {/* Prazo */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <label style={S.label}>Prazo</label>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#38BDF8" }}>{prazo} meses</span>
              </div>
              <input type="range" min={6} max={96} step={6} value={prazo} onChange={e => setPrazo(+e.target.value)}
                style={{ width: "100%", accentColor: "#38BDF8" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#334155", marginTop: 3 }}>
                <span>6 meses</span><span>96 meses</span>
              </div>
            </div>

            {/* Resultado */}
            <div style={{
              background: margemOk ? "rgba(74,222,128,0.06)" : "rgba(239,68,68,0.07)",
              border: `1px solid ${margemOk ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`,
              borderRadius: 12, padding: 18, marginBottom: 16,
            }}>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <div style={{ ...S.label, marginBottom: 5 }}>Parcela Estimada</div>
                <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1, color: margemOk ? "#4ADE80" : "#F87171", lineHeight: 1 }}>
                  R$ {parcela.toFixed(2).replace(".", ",")}
                </div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 5 }}>por mês · taxa {taxa}% a.m.</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { l: "Total a pagar", v: fmt(totalPagar) },
                  { l: "Total de juros", v: fmt(totalJuros) },
                ].map(({ l, v }) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 9, padding: "9px 11px" }}>
                    <div style={{ ...S.label, marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#CBD5E1" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comprometimento */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: "#64748B" }}>Comprometimento de renda</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: margemOk ? "#4ADE80" : "#F87171" }}>{comprometido.toFixed(1)}%</span>
              </div>
              <AnimBar pct={Math.min(100, comprometido)} color={margemOk ? "#4ADE80" : "#EF4444"} />
              <div style={{ fontSize: 10, color: "#475569", marginTop: 5 }}>
                {margemOk ? "✅ Dentro da margem consignável (35%)" : "❌ Excede a margem disponível"}
              </div>
            </div>

            <button onClick={() => margemOk && setModal(OFERTAS[0])} disabled={!margemOk} style={{
              width: "100%", padding: "12px", borderRadius: 11, border: "none",
              background: margemOk ? "linear-gradient(135deg,#4ADE80,#10B981)" : "rgba(255,255,255,0.06)",
              color: margemOk ? "#050D18" : "#475569",
              fontWeight: 800, fontSize: 13, cursor: margemOk ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              boxShadow: margemOk ? "0 4px 18px rgba(74,222,128,0.4)" : "none",
            }}>
              <Zap size={14} />
              {margemOk ? "Solicitar com Melhor Oferta" : "Ajuste o valor ou prazo"}
            </button>
          </div>

          {/* Segurança */}
          <div style={{ ...S.card, padding: 16 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Shield size={18} color="#4ADE80" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", marginBottom: 5 }}>Contratação 100% segura</div>
                <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.7 }}>
                  Biometria facial · LGPD compliant · Regulado pelo Banco Central · Dados criptografados AES-256
                </div>
              </div>
            </div>
          </div>

          {/* Margem gauge */}
          <div style={{ ...S.card, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9" }}>Uso de Margem Consignada</span>
              <span style={{ fontSize: 11, color: "#64748B" }}>{margemPct.toFixed(0)}%</span>
            </div>
            <AnimBar pct={margemPct} color={margemPct > 80 ? "#EF4444" : margemPct > 60 ? "#F59E0B" : "#4ADE80"} height={8} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "#475569" }}>
              <span>Usada: {fmt(PERFIL.margemUsada + (margemOk ? parcela : 0))}</span>
              <span>Total: {fmt(PERFIL.margemTotal)}</span>
            </div>
          </div>
        </div>

        {/* Ofertas */}
        <div>
          {/* IA recomendação */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: 12, padding: "14px 18px", marginBottom: 18 }}>
            <Zap size={20} color="#4ADE80" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#4ADE80", marginBottom: 3 }}>Recomendação IA VerbaTech</div>
              <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>
                Com base no seu perfil INSS e margem livre de <strong style={{ color: "#F1F5F9" }}>R$ 780</strong>, a <strong style={{ color: "#F1F5F9" }}>VerbaTech Credit</strong> oferece a menor taxa disponível. Você economizaria <strong style={{ color: "#4ADE80" }}>R$ 520</strong> vs crédito pessoal.
              </div>
            </div>
          </div>

          {/* Ofertas grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 18 }}>
            {OFERTAS.map(o => <OfertaCard key={o.id} oferta={o} onContratar={setModal} />)}
          </div>

          {/* Comparativo de taxas */}
          <div style={{ ...S.card, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <BarChart2 size={15} color="#818CF8" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>Comparativo de Taxas no Mercado</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { tipo: "Consignado VerbaTech", taxa: 1.45, color: "#4ADE80", ref: true },
                { tipo: "Consignado Mercado",   taxa: 1.72, color: "#38BDF8" },
                { tipo: "Empréstimo Pessoal",   taxa: 3.80, color: "#F59E0B" },
                { tipo: "Crédito Rotativo",     taxa: 15.9, color: "#F87171" },
              ].map(({ tipo, taxa: t, color, ref }) => (
                <div key={tipo} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 160, fontSize: 12, color: ref ? "#4ADE80" : "#64748B", fontWeight: ref ? 700 : 400, flexShrink: 0 }}>
                    {ref && "★ "}{tipo}
                  </div>
                  <div style={{ flex: 1, height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, width: `${Math.min(100, (t / 15.9) * 100)}%`, background: color, transition: "width 0.6s ease" }} />
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

      {modal && <ContratacaoModal oferta={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
