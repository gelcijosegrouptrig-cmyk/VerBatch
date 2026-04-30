import { useState } from "react";
import { mockUser, mockDividas } from "../data/mockData";
import {
  Shield, Bell, ChevronRight, LogOut, Eye, EyeOff,
  Lock, User, FileText, HelpCircle, Star, CreditCard,
  TrendingUp, Settings, CheckCircle, AlertTriangle,
  Smartphone, Key, Download, ExternalLink, Copy
} from "lucide-react";

function MenuItem({ icon: Icon, label, value, onClick, danger, badge, color }) {
  const c = color || (danger ? "#F87171" : "var(--text-3)");
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "13px 16px", cursor: "pointer",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background .15s",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: danger ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.06)",
        border: danger ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={16} color={c} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: danger ? "#F87171" : "var(--text-2)" }}>{label}</div>
        {value && <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 2 }}>{value}</div>}
      </div>
      {badge && (
        <div style={{
          background: "rgba(239,68,68,0.8)", color: "white",
          fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
        }}>{badge}</div>
      )}
      <ChevronRight size={14} color="var(--text-4)" />
    </div>
  );
}

function SectionCard({ title, icon: Icon, iconColor = "var(--text-3)", children }) {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{
        padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 9,
      }}>
        <Icon size={14} color={iconColor} />
        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: 0.7 }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function Perfil({ showBalance }) {
  const [show, setShow] = useState(showBalance);
  const totalDividas = mockDividas.reduce((s, d) => s + d.saldo, 0);
  const totalParcelas = mockDividas.reduce((s, d) => s + d.parcela, 0);
  const fmt = (v) => show
    ? `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    : "R$ ••••••";

  const scoreColor =
    mockUser.score >= 80 ? "var(--green)" :
    mockUser.score >= 60 ? "var(--orange)" : "#F87171";

  return (
    <div className="page">

      {/* ── MAIN LAYOUT ─────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>

        {/* LEFT: Perfil card + Resumo */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Card de identidade */}
          <div style={{
            background: "linear-gradient(135deg,rgba(124,58,237,0.15) 0%,rgba(0,200,150,0.08) 100%)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "var(--radius)", padding: 24,
            position: "relative", overflow: "hidden",
          }}>
            {/* BG glow */}
            <div style={{
              position: "absolute", top: -50, right: -50,
              width: 180, height: 180, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(124,58,237,0.15),transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: -30, left: -30,
              width: 120, height: 120, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(0,200,150,0.1),transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Avatar + nome */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "linear-gradient(135deg,#7C3AED,#00C896)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 900, color: "white",
                boxShadow: "0 6px 24px rgba(124,58,237,0.4)",
                border: "3px solid rgba(255,255,255,0.1)",
                flexShrink: 0,
              }}>
                {mockUser.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "white", letterSpacing: -0.5 }}>{mockUser.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>
                  CPF {mockUser.cpf}
                </div>
                <div style={{ marginTop: 7, display: "flex", gap: 6 }}>
                  <span className="chip chip-green">INSS Ativo</span>
                  <span className="chip chip-purple">Verificado</span>
                </div>
              </div>
            </div>

            {/* Dados bancários */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { l: "Matrícula", v: mockUser.matricula },
                { l: "Tipo", v: mockUser.tipo },
                { l: "Score", v: `${mockUser.score} pts`, color: scoreColor },
                { l: "Limite", v: show ? "R$ 15.000" : "R$ ••••", color: "var(--green)" },
              ].map(({ l, v, color }) => (
                <div key={l} style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.09)",
                  padding: "10px 12px",
                }}>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4, fontWeight: 700 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: color || "white" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Toggle balance */}
            <button
              onClick={() => setShow(s => !s)}
              style={{
                marginTop: 16, width: "100%",
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10, padding: "9px", color: "rgba(255,255,255,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
            >
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
              {show ? "Ocultar valores" : "Mostrar valores"}
            </button>
          </div>

          {/* Resumo financeiro */}
          <div className="card">
            <div className="section-title">
              <TrendingUp size={13} color="var(--text-3)" />
              Resumo Financeiro
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { l: "Salário Líquido",     v: fmt(mockUser.salarioLiquido),   color: "var(--green)" },
                { l: "Margem Disponível",   v: fmt(mockUser.margemDisponivel), color: "var(--green)" },
                { l: "Margem Usada",        v: fmt(mockUser.margemUsada),      color: "var(--orange)" },
                { l: "Total de Dívidas",    v: fmt(totalDividas),              color: "#F87171" },
                { l: "Parcelas Mensais",    v: fmt(totalParcelas),             color: "#F87171" },
              ].map(({ l, v, color }) => (
                <div key={l} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <span style={{ fontSize: 13, color: "var(--text-3)" }}>{l}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Score visual */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                  <circle cx="32" cy="32" r="24" fill="none"
                    stroke={scoreColor} strokeWidth="7"
                    strokeDasharray={`${2 * Math.PI * 24 * (mockUser.score / 100)} ${2 * Math.PI * 24}`}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                  />
                </svg>
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, color: scoreColor,
                }}>
                  {mockUser.score}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)" }}>Score {mockUser.scoreLabel}</div>
                <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 2, lineHeight: 1.5 }}>
                  Aumente pagando dívidas em dia e usando crédito com moderação
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Menus */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Status de verificação */}
          <div style={{
            background: "rgba(0,200,150,0.06)", border: "1px solid rgba(0,200,150,0.2)",
            borderRadius: "var(--radius)", padding: "14px 20px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <CheckCircle size={22} color="var(--green)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--green)", marginBottom: 2 }}>Conta verificada e ativa</div>
              <div style={{ fontSize: 12, color: "var(--text-4)" }}>
                Biometria facial confirmada · CPF válido · INSS ativo · LGPD consentida em 01/04/2026
              </div>
            </div>
            <button className="btn btn-outline" style={{ padding: "7px 16px", fontSize: 12, flexShrink: 0 }}>
              Ver detalhes
            </button>
          </div>

          {/* Grid 2x2 menus */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            {/* Conta */}
            <SectionCard title="Minha Conta" icon={User} iconColor="var(--blue-lt)">
              <MenuItem icon={User}     label="Dados pessoais"     value={`${mockUser.name} · CPF ${mockUser.cpf}`} />
              <MenuItem icon={FileText} label="Comprovantes"        value="Extratos e contratos" />
              <MenuItem icon={Download} label="Exportar dados"      value="PDF · CSV" />
              <MenuItem icon={Copy}     label="Matrícula INSS"      value={mockUser.matricula} badge={null} />
            </SectionCard>

            {/* Segurança */}
            <SectionCard title="Segurança" icon={Shield} iconColor="var(--green)">
              <MenuItem icon={Key}          label="Alterar senha"          value="Última alteração há 30 dias" />
              <MenuItem icon={Smartphone}   label="Biometria facial"       value="Ativa e configurada" color="var(--green)" />
              <MenuItem icon={Lock}         label="Autenticação em 2 fatores" value="SMS ativo" />
              <MenuItem icon={AlertTriangle} label="Dispositivos conectados" value="1 dispositivo ativo" />
            </SectionCard>

            {/* Financeiro */}
            <SectionCard title="Financeiro" icon={CreditCard} iconColor="var(--orange)">
              <MenuItem icon={CreditCard} label="Meus contratos"    value={`${mockDividas.length} contratos ativos`} />
              <MenuItem icon={TrendingUp} label="Extrato completo"  value="Últimos 12 meses" />
              <MenuItem icon={Star}       label="Programa de pontos" value={`130 pts acumulados`} color="var(--yellow)" />
              <MenuItem icon={Bell}       label="Alertas financeiros" value="5 alertas configurados" badge="5" />
            </SectionCard>

            {/* Suporte */}
            <SectionCard title="Suporte & Legal" icon={HelpCircle} iconColor="var(--purple-lt)">
              <MenuItem icon={HelpCircle}    label="Central de ajuda"    value="FAQ · Chat · Telefone" />
              <MenuItem icon={FileText}      label="Termos de uso"       value="Versão 2.1 · Ago/2025" />
              <MenuItem icon={Shield}        label="Política de privacidade" value="LGPD compliant" />
              <MenuItem icon={ExternalLink}  label="Banco Central"       value="Regulamentação BCB" />
            </SectionCard>
          </div>

          {/* Logout */}
          <div className="card" style={{ padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-3)" }}>Sessão ativa</div>
                <div style={{ fontSize: 11, color: "var(--text-4)", marginTop: 2 }}>
                  Último acesso: hoje às 23:10 · IP 187.xxx.xxx.12
                </div>
              </div>
              <button className="btn btn-danger" style={{ fontSize: 12, padding: "8px 18px" }}>
                <LogOut size={14} /> Sair da conta
              </button>
            </div>
          </div>

          {/* Versão / Info */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
            <span style={{ fontSize: 11, color: "var(--text-4)" }}>
              VerBatch Fintech v1.0.0 · Correspondente bancário regulado pelo BCB
            </span>
            <span style={{ fontSize: 11, color: "var(--text-4)" }}>
              © 2026 VerBatch · LGPD · Privacidade
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
