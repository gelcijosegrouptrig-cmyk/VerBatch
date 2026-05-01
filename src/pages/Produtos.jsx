// VerbaTech — Produtos Financeiros (Production Polish v2 — Full Cards + Rates + Simulator)
import { useState, useEffect } from "react";
import {
  CreditCard, Zap, Building2, Users, ChevronRight, CheckCircle,
  AlertCircle, Clock, TrendingUp, DollarSign, Shield, Info,
  Star, BarChart2, ArrowUpRight, Sparkles
} from "lucide-react";
import { mockProdutos, tabelaTaxas, fmt, fmtPct, calcParcela } from "../data/verbatechData";

/* ── tokens ─────────────────────────────────── */
const S = {
  page: { padding: 24 },
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};

const PROD_META = {
  consignadoINSS:              { emoji: "🏛️", color: "#6366F1", category: "Consignado" },
  consignadoSIAPE:             { emoji: "🏢", color: "#8B5CF6", category: "Consignado" },
  consignadoEstadualMunicipal: { emoji: "🏗️", color: "#06B6D4", category: "Consignado" },
  fgts:                        { emoji: "💰", color: "#10B981", category: "FGTS" },
  rmc:                         { emoji: "💳", color: "#F59E0B", category: "Cartão" },
  rcc:                         { emoji: "🛒", color: "#EF4444", category: "Cartão" },
  pessoal:                     { emoji: "👤", color: "#EC4899", category: "Pessoal" },
};

const STATUS_INTEG = {
  online:         { label: "Online",          color: "#4ADE80", pulse: true },
  parcial:        { label: "Parcial",         color: "#FCD34D", pulse: false },
  em_implantacao: { label: "Em implantação",  color: "#38BDF8", pulse: false },
  beta:           { label: "Beta",            color: "#A78BFA", pulse: false },
  manutencao:     { label: "Manutenção",      color: "#F87171", pulse: false },
};

/* ── Animated bar ─────────────────────────────── */
function AnimBar({ pct, color, height = 5, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 80 + delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: height }}>
      <div style={{
        height: "100%", width: `${w}%`, borderRadius: height, background: color,
        transition: "width 0.85s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 5px ${color}66`,
      }} />
    </div>
  );
}

/* ── Consignado Simulator ─────────────────────── */
function SimuladorConsignado() {
  const [margem, setMargem] = useState(820);
  const [prazo, setPrazo] = useState(60);
  const taxa = tabelaTaxas.find(t => t.prazo === prazo) || tabelaTaxas[4];
  const r = taxa.taxa / 100;
  const valorMax = margem > 0 ? Math.floor(
    (margem * ((Math.pow(1 + r, prazo) - 1) / (r * Math.pow(1 + r, prazo)))) / 100
  ) * 100 : 0;
  const parcela = calcParcela(valorMax, taxa.taxa, prazo);
  const comissao = valorMax * 0.03;

  return (
    <div style={{
      background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.25)",
      borderRadius: 16, padding: 22,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Zap size={15} color="#818CF8" />
        </div>
        <span style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 15 }}>Simulador Consignado INSS</span>
      </div>

      {/* Margem slider */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <label style={{ ...S.label }}>Margem disponível</label>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#A78BFA" }}>{fmt(margem)}</span>
        </div>
        <input type="range" min={200} max={2500} step={50} value={margem}
          onChange={e => setMargem(+e.target.value)}
          style={{ width: "100%", accentColor: "#6366F1" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          <span style={{ fontSize: 10, color: "#334155" }}>R$ 200</span>
          <span style={{ fontSize: 10, color: "#334155" }}>R$ 2.500</span>
        </div>
      </div>

      {/* Prazo pills */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ ...S.label, display: "block", marginBottom: 8 }}>Prazo</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tabelaTaxas.map(t => (
            <button key={t.prazo} onClick={() => setPrazo(t.prazo)} style={{
              padding: "5px 12px", borderRadius: 7,
              border: `1px solid ${t.prazo === prazo ? "#6366F1" : "rgba(255,255,255,0.1)"}`,
              background: t.prazo === prazo ? "#6366F1" : "rgba(255,255,255,0.04)",
              color: t.prazo === prazo ? "#fff" : "#94A3B8",
              cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
            }}>{t.prazo}x</button>
          ))}
        </div>
      </div>

      {/* Result box */}
      <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>Valor liberado</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#A78BFA", letterSpacing: -0.5 }}>{fmt(valorMax)}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>Parcela/mês</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#4ADE80", letterSpacing: -0.5 }}>{fmt(parcela)}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "Taxa", value: `${taxa.taxa}% a.m.`, color: "#FCD34D" },
            { label: "CET",  value: `${taxa.cetAa}% a.a.`, color: "#FCD34D" },
            { label: "Sua comissão", value: fmt(comissao), color: "#4ADE80" },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: "center", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 6px" }}>
              <div style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      <button style={{
        width: "100%", padding: "12px 0",
        background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
        border: "none", borderRadius: 10, color: "#fff",
        cursor: "pointer", fontWeight: 700, fontSize: 14,
        boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
      }}>
        Gerar Proposta →
      </button>
    </div>
  );
}

/* ── Product Card ─────────────────────────────── */
function ProdutoCard({ prodKey, prod, onSelect, selected }) {
  const meta = PROD_META[prodKey] || { emoji: "💡", color: "#6366F1", category: "" };
  const integ = STATUS_INTEG[prod.statusIntegracao] || STATUS_INTEG.online;

  return (
    <div onClick={() => onSelect(prodKey)} style={{
      background: selected ? `${meta.color}10` : "rgba(255,255,255,0.025)",
      border: `1px solid ${selected ? meta.color + "44" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.18s",
      position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = meta.color + "33";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      {/* color wash */}
      {selected && (
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at top right, ${meta.color}10, transparent 70%)`,
          pointerEvents: "none",
        }} />
      )}

      <div style={{ position: "relative" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 26 }}>{meta.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 14 }}>{prod.nome}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", background: integ.color,
                  boxShadow: `0 0 5px ${integ.color}99`,
                  animation: integ.pulse ? "anim-blink 2s ease-in-out infinite" : "none",
                }} />
                <span style={{ fontSize: 10, color: integ.color, fontWeight: 600 }}>{integ.label}</span>
                <span style={{ fontSize: 10, color: "#334155", marginLeft: 4 }}>·</span>
                <span style={{ fontSize: 10, color: "#475569" }}>{meta.category}</span>
              </div>
            </div>
          </div>
          <div style={{
            background: meta.color + "22", border: `1px solid ${meta.color}33`,
            borderRadius: 9, padding: "5px 10px", textAlign: "center",
          }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: meta.color }}>{prod.taxaMin}%</div>
            <div style={{ fontSize: 9, color: "#64748B" }}>a.m.</div>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.55, marginBottom: 12 }}>{prod.descricao}</p>

        {/* Vantagens chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          {prod.vantagens.slice(0, 3).map((v, i) => (
            <span key={i} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6, padding: "2px 9px", fontSize: 10, color: "#94A3B8",
            }}>✓ {v}</span>
          ))}
          {prod.vantagens.length > 3 && (
            <span style={{ fontSize: 10, color: "#475569" }}>+{prod.vantagens.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontSize: 11, color: "#64748B" }}>
              Comissão: <strong style={{ color: "#4ADE80" }}>{prod.comissaoBase}%</strong>
            </span>
            <span style={{ fontSize: 11, color: "#64748B" }}>
              Prazo: <strong style={{ color: "#A78BFA" }}>{prod.prazoMax}{prodKey === "fgts" ? " anos" : "x"}</strong>
            </span>
          </div>
          <span style={{ fontSize: 10, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={10} /> {prod.prazoAprovacao}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Product Detail Panel ─────────────────────── */
function ProdutoDetail({ prodKey, prod }) {
  const meta = PROD_META[prodKey] || { emoji: "💡", color: "#6366F1" };
  const metrics = [
    ["Taxa mín.", `${prod.taxaMin}% a.m.`, "#4ADE80"],
    ["Taxa máx.", `${prod.taxaMax}% a.m.`, "#F87171"],
    ["Prazo mín.", `${prod.prazoMin}${prodKey === "fgts" ? " ano" : "x"}`, "#CBD5E1"],
    ["Prazo máx.", `${prod.prazoMax}${prodKey === "fgts" ? " anos" : "x"}`, "#CBD5E1"],
    ["Valor mín.", fmt(prod.valorMin), "#A78BFA"],
    ["Valor máx.", fmt(prod.valorMax), "#A78BFA"],
    ["Margem máx.", prod.margemMax ? `${prod.margemMax * 100}%` : "Livre", "#FCD34D"],
    ["Comissão base", `${prod.comissaoBase}%`, "#4ADE80"],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ ...S.card, padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 32 }}>{meta.emoji}</span>
          <div>
            <h3 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 17, marginBottom: 2 }}>{prod.nome}</h3>
            <p style={{ fontSize: 12, color: "#94A3B8" }}>{prod.descricao}</p>
          </div>
        </div>

        {/* Metrics grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {metrics.map(([k, v, c]) => (
            <div key={k} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comissão bar */}
      <div style={{ ...S.card, padding: 16 }}>
        <div style={{ ...S.label, marginBottom: 10 }}>Comissão base</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>{prod.nome}</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#4ADE80" }}>{prod.comissaoBase}%</span>
        </div>
        <AnimBar pct={(prod.comissaoBase / 5) * 100} color="#4ADE80" height={6} />
        <div style={{ fontSize: 10, color: "#475569", marginTop: 6 }}>
          Ex: sobre R$ 100.000 → <strong style={{ color: "#4ADE80" }}>{fmt(100000 * prod.comissaoBase / 100)}</strong> de comissão
        </div>
      </div>

      {/* Integrations */}
      <div style={{ ...S.card, padding: 16 }}>
        <div style={{ ...S.label, marginBottom: 10 }}>Integrações</div>
        {prod.integracoes.map((integ, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 5px rgba(74,222,128,0.6)" }} />
            <span style={{ fontSize: 12, color: "#CBD5E1" }}>{integ}</span>
          </div>
        ))}
      </div>

      {/* Beneficiários */}
      <div style={{ ...S.card, padding: 16 }}>
        <div style={{ ...S.label, marginBottom: 10 }}>Beneficiários</div>
        {prod.destinatarios.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <Users size={11} color="#6366F1" />
            <span style={{ fontSize: 12, color: "#CBD5E1" }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Rates Table ──────────────────────────────── */
function TabelaTaxas() {
  return (
    <div style={{ ...S.card, overflow: "hidden", marginTop: 20 }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 8 }}>
        <BarChart2 size={14} color="#818CF8" />
        <span style={{ fontWeight: 800, color: "#F1F5F9", fontSize: 14 }}>Tabela de Taxas — Consignado INSS</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {["Prazo", "Taxa a.m.", "CET a.a.", "Parcela / R$1.000", "Valor p/ R$500 margem", "Popular"].map(h => (
              <th key={h} style={{ padding: "9px 14px", textAlign: "left", ...S.label }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabelaTaxas.map((t, i) => {
            const isPopular = t.prazo === 60;
            return (
              <tr key={i} style={{
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: isPopular ? "rgba(99,102,241,0.05)" : "transparent",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                onMouseLeave={e => e.currentTarget.style.background = isPopular ? "rgba(99,102,241,0.05)" : "transparent"}
              >
                <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#CBD5E1" }}>{t.prazo}x</td>
                <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 800, color: "#FCD34D" }}>{t.taxa}%</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: "#94A3B8" }}>{t.cetAa}%</td>
                <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 800, color: "#A78BFA" }}>{fmt(calcParcela(1000, t.taxa, t.prazo))}</td>
                <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 800, color: "#4ADE80" }}>
                  {fmt(Math.floor(500 / calcParcela(1000, t.taxa, t.prazo) * 1000 / 100) * 100)}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  {isPopular && (
                    <span style={{
                      background: "rgba(99,102,241,0.15)", color: "#818CF8",
                      borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700,
                      display: "inline-flex", alignItems: "center", gap: 4,
                    }}>
                      <Star size={9} /> Popular
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main ─────────────────────────────────────── */
export default function Produtos() {
  const [selected, setSelected] = useState("consignadoINSS");
  const [catFilter, setCatFilter] = useState("all");

  const keys = Object.keys(mockProdutos);
  const filtered = catFilter === "all"
    ? keys
    : keys.filter(k => (PROD_META[k]?.category || "").toLowerCase() === catFilter);

  const categories = ["all", ...new Set(keys.map(k => PROD_META[k]?.category?.toLowerCase()).filter(Boolean))];

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Portfólio de Produtos</h1>
        <p style={{ color: "#64748B", fontSize: 13 }}>Consignado · FGTS · Cartões RMC/RCC · Crédito Pessoal · Tabelas & Simuladores</p>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)} style={{
            padding: "6px 14px", borderRadius: 20,
            background: catFilter === cat ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${catFilter === cat ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
            color: catFilter === cat ? "#818CF8" : "#64748B",
            cursor: "pointer", fontSize: 12, fontWeight: catFilter === cat ? 700 : 500,
            textTransform: catFilter === "all" ? "none" : "capitalize",
            transition: "all 0.15s",
          }}>
            {cat === "all" ? "Todos" : cat}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#475569", alignSelf: "center" }}>
          {filtered.length} produtos
        </span>
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 22, alignItems: "start" }}>
        {/* Left: cards + rates table */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
            {filtered.map(k => (
              <ProdutoCard key={k} prodKey={k} prod={mockProdutos[k]}
                onSelect={setSelected} selected={selected === k} />
            ))}
          </div>
          <TabelaTaxas />
        </div>

        {/* Right: Simulator + Detail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SimuladorConsignado />
          {selected && mockProdutos[selected] && (
            <ProdutoDetail prodKey={selected} prod={mockProdutos[selected]} />
          )}
        </div>
      </div>
    </div>
  );
}
