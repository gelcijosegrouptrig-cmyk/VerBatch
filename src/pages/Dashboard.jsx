import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import AIAlertas from "../components/AIAlertas";
import { mockUser, mockDividas, mockTransacoes, mockMetas } from "../data/mockData";
import { ArrowUpRight, ArrowDownLeft, ChevronRight, Zap, Target, TrendingUp } from "lucide-react";

function QuickAction({ emoji, label, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: "16px 12px",
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 8,
      cursor: "pointer", transition: "all 0.2s",
      flex: 1,
    }}
      onTouchStart={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
      onTouchEnd={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20,
      }}>{emoji}</div>
      <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 1.3 }}>{label}</span>
    </button>
  );
}

function TxItem({ tx }) {
  const isC = tx.tipo === "credito";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: isC ? "rgba(0,200,150,0.12)" : "rgba(239,68,68,0.12)",
        border: `1px solid ${isC ? "rgba(0,200,150,0.2)" : "rgba(239,68,68,0.2)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {isC ? <ArrowDownLeft size={16} color="#00C896" /> : <ArrowUpRight size={16} color="#EF4444" />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{tx.desc}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{tx.data}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: isC ? "#00C896" : "#F87171" }}>
        {isC ? "+" : ""}R$ {Math.abs(tx.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}

function MetaCard({ meta }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: "14px 16px",
      minWidth: 188, flexShrink: 0,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 3 }}>{meta.titulo}</div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>Prazo: {meta.prazo}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: "#00C896", marginBottom: 10 }}>
        R$ {meta.atual.toLocaleString("pt-BR")}
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
          {" "}/ {meta.meta.toLocaleString("pt-BR")}
        </span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 5, overflow: "hidden", marginBottom: 4 }}>
        <div style={{
          height: "100%", background: "linear-gradient(90deg,#00C896,#00A87A)",
          width: `${meta.progresso}%`, borderRadius: 4,
          boxShadow: "0 0 6px rgba(0,200,150,0.4)",
        }} />
      </div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{meta.progresso}% concluído</div>
    </div>
  );
}

export default function Dashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="page">
      <TopHeader user={mockUser} showBalance={showBalance} setShowBalance={setShowBalance} />

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* === REEQUILÍBRIO CTA === */}
        <button onClick={() => navigate("/reequilibrio")} className="anim-glow-pulse" style={{
          width: "100%",
          background: "linear-gradient(135deg, rgba(0,200,150,0.12) 0%, rgba(0,168,122,0.08) 100%)",
          border: "1px solid rgba(0,200,150,0.3)",
          borderRadius: 20, padding: "18px 20px",
          display: "flex", alignItems: "center", gap: 14,
          cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 60%, rgba(0,200,150,0.05))", pointerEvents: "none" }} />
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: "linear-gradient(135deg,#00C896,#00A87A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,200,150,0.4)",
          }}>
            <Zap size={22} color="white" fill="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "rgba(0,200,150,0.7)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
              IA Detectou Oportunidade
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "white" }}>Economize R$ 210/mês</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Trocando dívida cara por consignado</div>
          </div>
          <ChevronRight size={18} color="#00C896" />
        </button>

        {/* === ALERTAS IA === */}
        <AIAlertas user={mockUser} dividas={mockDividas} />

        {/* === AÇÕES RÁPIDAS === */}
        <div>
          <div className="section-label">Ações Rápidas</div>
          <div style={{ display: "flex", gap: 10 }}>
            <QuickAction emoji="💰" label="Simular Crédito" color="#00C896" onClick={() => navigate("/credito")} />
            <QuickAction emoji="🔄" label="Portabilidade" color="#7C3AED" onClick={() => navigate("/reequilibrio")} />
            <QuickAction emoji="📚" label="Educação" color="#F59E0B" onClick={() => navigate("/educacao")} />
            <QuickAction emoji="👤" label="Perfil" color="#3B82F6" onClick={() => navigate("/perfil")} />
          </div>
        </div>

        {/* === METAS === */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div className="section-label" style={{ marginBottom: 0 }}>Minhas Metas</div>
            <button style={{ fontSize: 12, color: "#00C896", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
              Ver todas
            </button>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {mockMetas.map(m => <MetaCard key={m.id} meta={m} />)}
          </div>
        </div>

        {/* === EXTRATO === */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, padding: "18px 18px 6px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div className="section-label" style={{ marginBottom: 0 }}>Últimas Movimentações</div>
            <button style={{ fontSize: 12, color: "#00C896", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
              Ver todas
            </button>
          </div>
          {mockTransacoes.map(tx => <TxItem key={tx.id} tx={tx} />)}
        </div>

      </div>
    </div>
  );
}
