import { useState } from "react";
import { mockDividas, mockUser } from "../data/mockData";
import { AlertTriangle, CheckCircle, RefreshCw, Zap, ChevronRight, ArrowRight } from "lucide-react";

function DividaCard({ divida, selecionada, onToggle }) {
  const urgente = divida.taxa > 5;
  const isRotativo = divida.tipo === "Cartão de Crédito";

  return (
    <div onClick={() => onToggle(divida.id)} style={{
      background: selecionada
        ? "rgba(0,200,150,0.08)"
        : "rgba(255,255,255,0.03)",
      border: selecionada
        ? "1px solid rgba(0,200,150,0.35)"
        : "1px solid rgba(255,255,255,0.07)",
      borderRadius: 18, padding: "16px", marginBottom: 10,
      cursor: "pointer", transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {urgente && <span style={{ fontSize: 16 }}>🔴</span>}
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>{divida.banco}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{divida.tipo}</div>
          </div>
        </div>
        <div style={{
          width: 24, height: 24, borderRadius: "50%",
          border: selecionada ? "none" : "2px solid rgba(255,255,255,0.15)",
          background: selecionada ? "linear-gradient(135deg,#00C896,#00A87A)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: selecionada ? "0 0 8px rgba(0,200,150,0.4)" : "none",
          transition: "all 0.2s",
        }}>
          {selecionada && <CheckCircle size={14} color="white" fill="white" />}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { l: "Saldo", v: `R$ ${divida.saldo.toLocaleString("pt-BR")}`, danger: false },
          { l: "Taxa a.m.", v: `${divida.taxa}%`, danger: divida.taxa > 3 },
          { l: isRotativo ? "Modal." : "Parcela", v: isRotativo ? "Rotativo" : `R$ ${divida.parcela}`, danger: isRotativo },
        ].map(({ l, v, danger }) => (
          <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "9px 10px" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: danger ? "#F87171" : "rgba(255,255,255,0.8)" }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultBox({ dividas, selecionadas }) {
  const sel = dividas.filter(d => selecionadas.includes(d.id));
  if (!sel.length) return null;

  const totalSaldo = sel.reduce((a, d) => a + d.saldo, 0);
  const totalParcelas = sel.reduce((a, d) => a + (d.parcela || d.saldo * 0.03), 0);
  const novaParcela = (totalSaldo * 0.0145 * Math.pow(1.0145, 60)) / (Math.pow(1.0145, 60) - 1);
  const economia = totalParcelas - novaParcela;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(0,200,150,0.1), rgba(0,168,122,0.05))",
      border: "1px solid rgba(0,200,150,0.25)",
      borderRadius: 20, padding: "20px", marginBottom: 16,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,200,150,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Zap size={16} color="#00C896" fill="#00C896" />
        <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.8)" }}>Resultado da Portabilidade</span>
      </div>

      {/* Antes x Depois */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: "12px" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Você paga hoje</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#F87171" }}>R$ {totalParcelas.toFixed(0)}<span style={{ fontSize: 11, fontWeight: 400 }}>/mês</span></div>
        </div>
        <ArrowRight size={18} color="rgba(255,255,255,0.3)" />
        <div style={{ flex: 1, background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.2)", borderRadius: 14, padding: "12px" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Nova parcela</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#00C896" }}>R$ {novaParcela.toFixed(0)}<span style={{ fontSize: 11, fontWeight: 400 }}>/mês</span></div>
        </div>
      </div>

      {/* Economia */}
      {economia > 0 && (
        <div style={{
          background: "rgba(0,200,150,0.12)", border: "1px solid rgba(0,200,150,0.25)",
          borderRadius: 14, padding: "14px 16px", marginBottom: 16,
        }}>
          <div style={{ fontSize: 11, color: "rgba(0,200,150,0.7)", marginBottom: 3 }}>💚 Economia mensal estimada</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#00C896" }}>
            R$ {economia.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(0,200,150,0.6)" }}>/mês</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(0,200,150,0.5)", marginTop: 2 }}>
            = R$ {(economia * 12).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} economizados por ano
          </div>
        </div>
      )}

      <button style={{
        width: "100%", background: "linear-gradient(135deg,#00C896,#00A87A)",
        border: "none", borderRadius: 14, padding: "15px",
        fontSize: 15, fontWeight: 800, color: "white", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        boxShadow: "0 4px 20px rgba(0,200,150,0.35)",
      }}>
        <RefreshCw size={17} /> Solicitar Portabilidade Agora
      </button>
    </div>
  );
}

export default function Reequilibrio() {
  const [selecionadas, setSelecionadas] = useState([]);

  const toggle = id => setSelecionadas(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const totalSaldo = mockDividas.reduce((a, d) => a + d.saldo, 0);
  const taxaMedia = (mockDividas.reduce((a, d) => a + d.taxa, 0) / mockDividas.length).toFixed(2);

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg,#0D1829 0%,#0A0E1A 100%)",
        padding: "52px 20px 24px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(239,68,68,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 4 }}>🔄 Reequilíbrio</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Troque dívidas caras por crédito inteligente</div>

        {/* Diagnóstico */}
        <div style={{
          marginTop: 16, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 14, padding: "14px 16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <AlertTriangle size={14} color="#F87171" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#F87171" }}>Diagnóstico de Endividamento</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { l: "Total de Dívidas", v: `R$ ${totalSaldo.toLocaleString("pt-BR")}`, c: "#F87171" },
              { l: "Taxa Média", v: `${taxaMedia}% a.m.`, c: "#FCD34D" },
              { l: "Comprometimento", v: "21% da renda", c: "#FCD34D" },
              { l: "Maior Problema", v: "Cartão Rotativo", c: "#F87171" },
            ].map(({ l, v, c }) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "9px 10px" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 4 }}>

        {/* Instrução */}
        <div style={{
          background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 12, padding: "11px 14px", marginBottom: 12,
          fontSize: 13, color: "rgba(147,197,253,0.9)", fontWeight: 500,
        }}>
          👆 Selecione as dívidas que deseja portar para o consignado
        </div>

        {/* Dívidas */}
        {mockDividas.map(d => (
          <DividaCard key={d.id} divida={d} selecionada={selecionadas.includes(d.id)} onToggle={toggle} />
        ))}

        {/* Resultado */}
        <div style={{ marginTop: 8 }}>
          <ResultBox dividas={mockDividas} selecionadas={selecionadas} />
        </div>

        {/* Como funciona */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, padding: "18px",
        }}>
          <div className="section-label">Como funciona?</div>
          {[
            { n: "1", t: "Selecione as dívidas", d: "Escolha quais dívidas quer trocar acima", c: "#00C896" },
            { n: "2", t: "Analisamos sua margem", d: "Verificamos se cabe na sua folha INSS/Servidor", c: "#7C3AED" },
            { n: "3", t: "Aprovação em minutos", d: "Nossa IA processa e envia ao banco parceiro", c: "#3B82F6" },
            { n: "4", t: "Dívida antiga quitada", d: "Banco parceiro quita e você paga menos", c: "#F59E0B" },
          ].map(({ n, t, d, c }) => (
            <div key={n} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                background: `${c}20`, border: `1px solid ${c}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 900, color: c,
              }}>{n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 2 }}>{t}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
