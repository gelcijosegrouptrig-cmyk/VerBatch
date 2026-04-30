import { useNavigate } from "react-router-dom";
import {
  mockUser, mockDividas, mockTransacoes, mockMetas,
  runAIRules, calcularSaudeFinanceira
} from "../data/mockData";
import {
  ArrowUpRight, ArrowDownLeft, ChevronRight, Zap,
  TrendingUp, TrendingDown, AlertTriangle, Target,
  Activity, DollarSign, BarChart2, Clock
} from "lucide-react";

function StatCard({ label, value, sub, color = "var(--green)", icon: Icon, glow }) {
  return (
    <div className="stat-card" style={{ borderColor: glow ? `${color}28` : undefined }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div className="stat-label">{label}</div>
        {Icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `${color}14`, border: `1px solid ${color}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={15} color={color} />
          </div>
        )}
      </div>
      <div className="stat-value" style={{ color }}>{value}</div>
      {sub && <div className="stat-sub" style={{ marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function AlertRow({ a, onClick }) {
  const colorMap = {
    danger:  { cls: "alert-danger",  tc: "#F87171" },
    warning: { cls: "alert-warning", tc: "var(--orange)" },
    success: { cls: "alert-success", tc: "var(--green)" },
  };
  const { cls, tc } = colorMap[a.nivel] || colorMap.warning;
  return (
    <div className={`alert ${cls}`} onClick={onClick}>
      <span style={{ fontSize: 17, flexShrink: 0, marginTop: 1 }}>{a.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: tc, marginBottom: 2 }}>{a.titulo}</div>
        <div style={{ fontSize: 11.5, color: "var(--text-3)", lineHeight: 1.5 }}>{a.descricao}</div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: tc,
        whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 2, flexShrink: 0,
      }}>
        {a.acao} <ChevronRight size={11} />
      </div>
    </div>
  );
}

function MiniChart({ data }) {
  const max = Math.max(...data.map(d => d.receita));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 48, marginTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{
            width: "100%", borderRadius: 4,
            background: i === data.length - 1
              ? "linear-gradient(180deg,var(--green),var(--green-dark))"
              : "rgba(255,255,255,0.07)",
            height: `${(d.gasto / max) * 100}%`,
            minHeight: 6,
          }} />
          <div style={{ fontSize: 9, color: "var(--text-4)" }}>{d.mes}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ showBalance }) {
  const navigate = useNavigate();
  const alertas = runAIRules(mockUser, mockDividas);
  const saude = calcularSaudeFinanceira(mockUser, mockDividas);
  const saudeColor =
    saude.cor === "success" ? "var(--green)" :
    saude.cor === "warning" ? "var(--orange)" : "var(--red)";

  const pctMargem = Math.round((mockUser.margemUsada / mockUser.margemTotal) * 100);
  const barColor =
    pctMargem > 70 ? "var(--red)" :
    pctMargem > 50 ? "var(--orange)" : "var(--green)";

  const fmt = (v) =>
    showBalance
      ? `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : "R$ ••••••";

  const mockChart = [
    { mes: "Nov", gasto: 540, receita: 2650 },
    { mes: "Dez", gasto: 620, receita: 2650 },
    { mes: "Jan", gasto: 580, receita: 2650 },
    { mes: "Fev", gasto: 555, receita: 2650 },
    { mes: "Mar", gasto: 605, receita: 2650 },
    { mes: "Abr", gasto: 560, receita: 2650 },
  ];

  return (
    <div className="page">

      {/* ── ROW 1: Hero + 3 Stats ─────────────────────────── */}
      <div className="grid-4">

        {/* Hero — Margem consignável */}
        <div className="hero-card">
          <div style={{ fontSize: 10.5, color: "rgba(0,200,150,0.7)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>
            Margem Consignável Disponível
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5, color: "white", marginBottom: 3 }}>
            {fmt(mockUser.margemDisponivel)}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-3)", marginBottom: 20 }}>
            de {showBalance ? `R$ ${mockUser.margemTotal.toLocaleString("pt-BR")}` : "R$ ••••"} total
          </div>

          <div className="prog-track" style={{ marginBottom: 8 }}>
            <div className="prog-fill" style={{
              width: `${pctMargem}%`,
              background: `linear-gradient(90deg,${barColor},${barColor}aa)`,
              boxShadow: `0 0 8px ${barColor}55`,
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-4)" }}>
            <span>Usado {showBalance ? `R$ ${mockUser.margemUsada.toLocaleString("pt-BR")}` : "R$ ••••"}</span>
            <span style={{ color: barColor, fontWeight: 700 }}>{pctMargem}% comprometido</span>
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
            <span className="chip chip-green">INSS Ativo</span>
            <span className="chip chip-blue">Margem livre</span>
          </div>
        </div>

        <StatCard
          label="Salário Líquido"
          value={showBalance ? `R$ ${mockUser.salarioLiquido.toLocaleString("pt-BR")}` : "R$ ••••"}
          sub={`Bruto R$ ${mockUser.salarioBruto.toLocaleString("pt-BR")} · ${mockUser.tipo}`}
          color="var(--green)" icon={DollarSign}
        />
        <StatCard
          label="Saúde Financeira"
          value={`${saude.pontos}/100`}
          sub={saude.label + " — clique para melhorar"}
          color={saudeColor} icon={Activity} glow
        />
        <StatCard
          label="Score de Crédito"
          value={`${mockUser.score} pts`}
          sub={mockUser.scoreLabel + " · Consulta Serasa"}
          color={mockUser.score >= 70 ? "var(--green)" : "var(--orange)"}
          icon={BarChart2}
        />
      </div>

      {/* ── ROW 2: Alertas IA + Extrato + Metas ──────────── */}
      <div className="grid-3">

        {/* Alertas IA */}
        <div className="card">
          <div className="section-title">
            <AlertTriangle size={13} color="var(--orange)" />
            Alertas Inteligentes IA
            {alertas.filter(a => a.nivel === "danger").length > 0 && (
              <span className="chip chip-red" style={{ marginLeft: "auto" }}>
                {alertas.filter(a => a.nivel === "danger").length} crítico(s)
              </span>
            )}
          </div>
          <div>
            {alertas.map(a => (
              <AlertRow key={a.id} a={a} onClick={() => navigate(a.rota)} />
            ))}
          </div>
          <button
            onClick={() => navigate("/reequilibrio")}
            className="btn btn-outline"
            style={{ width: "100%", marginTop: 14, fontSize: 12 }}
          >
            <Zap size={13} fill="currentColor" /> Ver plano de reequilíbrio completo
          </button>
        </div>

        {/* Extrato recente */}
        <div className="card">
          <div className="section-title">
            <Clock size={13} color="var(--text-3)" />
            Movimentações Recentes
            <button className="link-sm">Ver extrato</button>
          </div>

          {mockTransacoes.map(tx => {
            const isC = tx.tipo === "credito";
            return (
              <div key={tx.id} className="table-row">
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: isC ? "rgba(0,200,150,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${isC ? "rgba(0,200,150,0.2)" : "rgba(239,68,68,0.2)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {isC
                    ? <ArrowDownLeft size={14} color="var(--green)" />
                    : <ArrowUpRight size={14} color="#F87171" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {tx.desc}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-4)" }}>{tx.data}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: isC ? "var(--green)" : "#F87171", flexShrink: 0 }}>
                  {isC ? "+" : ""}
                  {showBalance
                    ? `R$ ${Math.abs(tx.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    : "R$ ••••"}
                </div>
              </div>
            );
          })}

          {/* Mini chart */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: 10.5, color: "var(--text-4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 2 }}>
              Despesas últimos 6 meses
            </div>
            <MiniChart data={mockChart} />
          </div>
        </div>

        {/* Metas financeiras */}
        <div className="card">
          <div className="section-title">
            <Target size={13} color="var(--text-3)" />
            Metas Financeiras
            <button className="link-sm">+ Nova</button>
          </div>

          {mockMetas.map(m => (
            <div key={m.id} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)" }}>{m.titulo}</div>
                  <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 2 }}>Meta até {m.prazo}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: "var(--green)", lineHeight: 1 }}>
                    {showBalance ? `R$ ${m.atual.toLocaleString("pt-BR")}` : "R$ ••••"}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-4)", marginTop: 2 }}>
                    de {showBalance ? `R$ ${m.meta.toLocaleString("pt-BR")}` : "R$ ••••"}
                  </div>
                </div>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{
                  width: `${m.progresso}%`,
                  background: "linear-gradient(90deg,var(--green),var(--green-dark))",
                  boxShadow: "0 0 6px rgba(0,200,150,0.3)",
                }} />
              </div>
              <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 4, textAlign: "right" }}>
                {m.progresso}% concluído
              </div>
            </div>
          ))}

          {/* Score ring visual */}
          <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="36" cy="36" r="28" fill="none"
                  stroke="var(--green)" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 28 * (mockUser.score / 100)} ${2 * Math.PI * 28}`}
                  strokeLinecap="round"
                  transform="rotate(-90 36 36)"
                />
              </svg>
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 900, color: "var(--green)",
              }}>
                {mockUser.score}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)" }}>Score Serasa</div>
              <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 2 }}>{mockUser.scoreLabel}</div>
              <button onClick={() => navigate("/educacao")} style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: "var(--green)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Como melhorar →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 3: CTA + Ações Rápidas + Dívidas Resumo ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.4fr", gap: 18 }}>

        {/* CTA Reequilíbrio */}
        <button onClick={() => navigate("/reequilibrio")} className="anim-glow" style={{
          background: "linear-gradient(135deg, rgba(0,200,150,0.10), rgba(0,168,122,0.05))",
          border: "1px solid rgba(0,200,150,0.28)", borderRadius: "var(--radius)",
          padding: "22px 24px", display: "flex", alignItems: "center", gap: 16,
          cursor: "pointer", textAlign: "left", width: "100%",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -30, right: -30,
            width: 120, height: 120, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,200,150,0.12), transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            width: 54, height: 54, borderRadius: 14, flexShrink: 0,
            background: "linear-gradient(135deg,var(--green),var(--green-dark))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 24px rgba(0,200,150,0.45)",
          }}>
            <Zap size={24} color="white" fill="white" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: "rgba(0,200,150,0.8)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontWeight: 700 }}>
              IA Detectou Oportunidade
            </div>
            <div style={{ fontSize: 19, fontWeight: 900, color: "white", marginBottom: 3, letterSpacing: -0.5 }}>
              Economize R$ 210/mês
            </div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>
              Trocando dívidas caras por crédito consignado
            </div>
          </div>
          <ChevronRight size={18} color="var(--green)" style={{ flexShrink: 0 }} />
        </button>

        {/* Ações rápidas */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 12 }}>Ações Rápidas</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { e: "💰", l: "Simular Crédito",    c: "var(--green)",    r: "/credito" },
              { e: "🔄", l: "Portabilidade",       c: "var(--purple-lt)", r: "/reequilibrio" },
              { e: "📚", l: "Educação",             c: "var(--yellow)",   r: "/educacao" },
              { e: "👤", l: "Meu Perfil",           c: "var(--blue-lt)",  r: "/perfil" },
            ].map(({ e, l, c, r }) => (
              <button key={l} onClick={() => navigate(r)} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid var(--card-border)",
                borderRadius: 11, padding: "13px 12px",
                display: "flex", alignItems: "center", gap: 9,
                cursor: "pointer", textAlign: "left", transition: "all .15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "var(--card-border)"; }}
              >
                <span style={{ fontSize: 20 }}>{e}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: c }}>{l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resumo dívidas */}
        <div className="card">
          <div className="section-title">
            <TrendingDown size={13} color="#F87171" />
            Dívidas Ativas
            <span className="chip chip-red" style={{ marginLeft: "auto" }}>
              {mockDividas.length} contratos
            </span>
          </div>
          {mockDividas.map(d => {
            const isHigh = d.taxa > 5;
            return (
              <div key={d.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: isHigh ? "rgba(239,68,68,0.1)" : "rgba(59,130,246,0.1)",
                  border: `1px solid ${isHigh ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                }}>
                  {isHigh ? "🔴" : "🔵"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.banco}</div>
                  <div style={{ fontSize: 11, color: "var(--text-4)" }}>{d.tipo}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: isHigh ? "#F87171" : "var(--text-2)" }}>
                    {showBalance ? `R$ ${d.saldo.toLocaleString("pt-BR")}` : "R$ ••••"}
                  </div>
                  <div style={{ fontSize: 10, color: isHigh ? "#F87171" : "var(--text-4)", fontWeight: 700 }}>
                    {d.taxa}% a.m.
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--text-4)" }}>Total em dívidas:</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#F87171" }}>
              {showBalance
                ? `R$ ${mockDividas.reduce((s, d) => s + d.saldo, 0).toLocaleString("pt-BR")}`
                : "R$ ••••"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
