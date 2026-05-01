// VerbaTech — Perfil (Dark Theme v2 + AuthContext integration)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Bell, ChevronRight, LogOut, Eye, EyeOff,
  Lock, User, FileText, HelpCircle, Star, CreditCard,
  TrendingUp, Settings, CheckCircle, AlertTriangle,
  Smartphone, Key, Download, ExternalLink, Copy,
  Award, MapPin, Phone, Mail, Building2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { mockSession, fmt } from "../data/verbatechData";

/* ── tokens ───────────────────────────────────────────── */
const S = {
  page:  { padding: 24, minHeight: "100vh", background: "#080E1A" },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
};

const NIVEL_COLORS = {
  Diamante: { color: "#00BFFF", glow: "rgba(0,191,255,0.4)" },
  Ouro:     { color: "#FFD700", glow: "rgba(255,215,0,0.35)" },
  Prata:    { color: "#C0C0C0", glow: "rgba(192,192,192,0.3)" },
  Bronze:   { color: "#CD7F32", glow: "rgba(205,127,50,0.35)" },
};

/* ── MenuItem ─────────────────────────────────────────── */
function MenuItem({ icon: Icon, label, value, onClick, danger, badge, color }) {
  const c = color || (danger ? "#F87171" : "#64748B");
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px", cursor: "pointer",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      transition: "background .15s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: danger ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.06)", border: `1px solid ${danger ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={15} color={c} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: danger ? "#F87171" : "#E2E8F0" }}>{label}</div>
        {value && <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>{value}</div>}
      </div>
      {badge && (
        <span style={{ background: "rgba(239,68,68,0.8)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 20 }}>{badge}</span>
      )}
      <ChevronRight size={13} color="#334155" />
    </div>
  );
}

/* ── Section Card ─────────────────────────────────────── */
function SectionCard({ title, icon: Icon, iconColor = "#64748B", children }) {
  return (
    <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon size={13} color={iconColor} />
        <span style={{ ...S.label }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ── MAIN ─────────────────────────────────────────────── */
export default function Perfil({ showBalance }) {
  const navigate        = useNavigate();
  const { user, logout } = useAuth();
  const [show, setShow] = useState(showBalance ?? true);

  // Use authenticated user or fallback to mockSession
  const u = user || {
    nome: mockSession.name, role: mockSession.role, nivel: mockSession.nivel,
    empresa: mockSession.empresa, cnpj: mockSession.cnpj, telefone: mockSession.telefone,
    email: mockSession.email, saldoConta: mockSession.saldoConta,
    comissaoMes: mockSession.comissaoMes, comissaoPendente: mockSession.comissaoPendente,
    twoFA: true, twoFAMetodo: "app", ultimoLogin: "2024-04-30 09:12",
    loja: "Matriz — São Paulo/SP", avatar: "RM",
  };

  const nivelCfg   = NIVEL_COLORS[u.nivel] || NIVEL_COLORS.Ouro;
  const initials   = (u.nome || "??").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const fmtShow    = (v) => show ? fmt(v) : "R$ ••••••";

  function handleLogout() { logout(); navigate("/login"); }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ color: "#F1F5F9", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Meu Perfil</h1>
        <p style={{ color: "#64748B", fontSize: 13 }}>Dados da conta · Segurança · Preferências</p>
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20 }}>

        {/* LEFT: Identidade + Financeiro */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Identity card */}
          <div style={{
            background: `linear-gradient(135deg,${nivelCfg.color}18 0%,rgba(99,102,241,0.08) 100%)`,
            border: `1px solid ${nivelCfg.color}30`, borderRadius: 14, padding: 22, position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle,${nivelCfg.color}18,transparent 70%)`, pointerEvents: "none" }} />

            {/* Avatar + nome */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg,${nivelCfg.color}44,${nivelCfg.color}88)`,
                border: `3px solid ${nivelCfg.color}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 900, color: nivelCfg.color,
                boxShadow: `0 6px 24px ${nivelCfg.glow}`,
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#F1F5F9" }}>{u.nome}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                  <span style={{ background: nivelCfg.color + "22", color: nivelCfg.color, border: `1px solid ${nivelCfg.color}44`, borderRadius: 5, padding: "1px 8px", fontSize: 10, fontWeight: 800, letterSpacing: 0.5, boxShadow: `0 0 8px ${nivelCfg.glow}` }}>
                    {(u.nivel || "").toUpperCase()}
                  </span>
                  <span style={{ fontSize: 11, color: "#64748B", textTransform: "capitalize" }}>{u.role}</span>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { l: "Empresa",   v: u.empresa || "—" },
                { l: "Loja",      v: u.loja || "—" },
                { l: "E-mail",    v: u.email || "—" },
                { l: "Telefone",  v: u.telefone || "—" },
              ].map(({ l, v }) => (
                <div key={l} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 9, padding: "9px 11px" }}>
                  <div style={{ ...S.label, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#CBD5E1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, background: "rgba(74,222,128,0.12)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)", fontWeight: 700 }}>✓ Verificado</span>
              <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, background: "rgba(56,189,248,0.12)", color: "#38BDF8", border: "1px solid rgba(56,189,248,0.25)", fontWeight: 700 }}>LGPD OK</span>
              {u.twoFA && <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, background: "rgba(99,102,241,0.12)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.25)", fontWeight: 700 }}>2FA Ativo</span>}
            </div>

            <button onClick={() => setShow(s => !s)} style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, padding: "9px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {show ? <EyeOff size={13} /> : <Eye size={13} />}
              {show ? "Ocultar saldos" : "Mostrar saldos"}
            </button>
          </div>

          {/* Resumo financeiro */}
          <div style={{ ...S.card, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <TrendingUp size={14} color="#818CF8" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>Resumo Financeiro</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { l: "Saldo em Conta",       v: fmtShow(u.saldoConta || 0),          color: "#38BDF8" },
                { l: "Comissão do Mês",      v: fmtShow(u.comissaoMes || 0),         color: "#4ADE80" },
                { l: "Comissão Pendente",    v: fmtShow(u.comissaoPendente || 0),     color: "#FCD34D" },
              ].map(({ l, v, color }) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{l}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Último login */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 6px #4ADE80" }} />
              <span style={{ fontSize: 11, color: "#475569" }}>Último acesso: {u.ultimoLogin}</span>
            </div>
          </div>

          {/* 2FA Status */}
          <div style={{ ...S.card, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: u.twoFA ? "rgba(74,222,128,0.12)" : "rgba(239,68,68,0.12)", border: `1px solid ${u.twoFA ? "rgba(74,222,128,0.25)" : "rgba(239,68,68,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {u.twoFA ? <Shield size={18} color="#4ADE80" /> : <AlertTriangle size={18} color="#EF4444" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: u.twoFA ? "#4ADE80" : "#EF4444", marginBottom: 3 }}>
                  {u.twoFA ? `2FA Ativo — ${u.twoFAMetodo === "app" ? "Aplicativo Autenticador" : "SMS"}` : "2FA não configurado"}
                </div>
                <div style={{ fontSize: 11, color: "#64748B" }}>
                  {u.twoFA ? "Conta protegida contra acessos não autorizados" : "Ative agora para proteger sua conta"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Menu sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Status banner */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 12, padding: "14px 20px" }}>
            <CheckCircle size={22} color="#4ADE80" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#4ADE80", marginBottom: 2 }}>Conta verificada e ativa</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>
                Biometria confirmada · CPF válido · LGPD consentida em 01/04/2026 · Regulado BCB
              </div>
            </div>
            <button style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 8, color: "#4ADE80", fontSize: 11, fontWeight: 700, padding: "7px 14px", cursor: "pointer" }}>
              Ver detalhes
            </button>
          </div>

          {/* 2x2 grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            <SectionCard title="Minha Conta" icon={User} iconColor="#38BDF8">
              <MenuItem icon={User}        label="Dados pessoais"      value={`${u.nome} · ${u.cnpj || "—"}`} />
              <MenuItem icon={Building2}   label="Empresa / Loja"      value={u.empresa} />
              <MenuItem icon={FileText}    label="Comprovantes"        value="Contratos e extratos" />
              <MenuItem icon={Download}    label="Exportar dados"      value="PDF · CSV" />
            </SectionCard>

            <SectionCard title="Segurança" icon={Shield} iconColor="#4ADE80">
              <MenuItem icon={Key}          label="Alterar senha"              value="Última alteração há 30 dias" />
              <MenuItem icon={Smartphone}   label="Biometria facial"           value="Ativa e configurada"         color="#4ADE80" />
              <MenuItem icon={Lock}         label="2FA — Autenticação dupla"   value={u.twoFA ? `${u.twoFAMetodo === "app" ? "App Autenticador" : "SMS"} ativo` : "Não configurado"} color={u.twoFA ? "#4ADE80" : "#EF4444"} />
              <MenuItem icon={AlertTriangle} label="Dispositivos conectados"   value="1 dispositivo ativo" />
            </SectionCard>

            <SectionCard title="Financeiro" icon={CreditCard} iconColor="#F59E0B">
              <MenuItem icon={CreditCard} label="Meus contratos"      value="Ver todas as propostas" />
              <MenuItem icon={TrendingUp} label="Extrato de comissões" value="Últimos 12 meses" />
              <MenuItem icon={Star}       label="Nível e gamificação" value={`${u.nivel} · 12.840 pts`}   color={nivelCfg.color} />
              <MenuItem icon={Bell}       label="Alertas e notificações" value="5 alertas configurados"   badge="5" />
            </SectionCard>

            <SectionCard title="Suporte & Legal" icon={HelpCircle} iconColor="#A78BFA">
              <MenuItem icon={HelpCircle}   label="Central de ajuda"         value="FAQ · Chat · Telefone" />
              <MenuItem icon={FileText}     label="Termos de uso"            value="Versão 2.1 · Ago/2025" />
              <MenuItem icon={Shield}       label="Política de privacidade"  value="LGPD compliant" />
              <MenuItem icon={ExternalLink} label="Banco Central"            value="Regulamentação BCB" />
            </SectionCard>
          </div>

          {/* CNPJ / identificação fiscal */}
          <div style={{ ...S.card, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Award size={15} color="#818CF8" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>Identificação Fiscal</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[
                { l: "CNPJ", v: u.cnpj || "—" },
                { l: "Loja", v: u.loja || "—" },
                { l: "Nível", v: u.nivel || "—" },
              ].map(({ l, v }) => (
                <div key={l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "10px 12px" }}>
                  <div style={{ ...S.label, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessão / logout */}
          <div style={{ ...S.card, padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8" }}>Sessão ativa</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                  Último acesso: {u.ultimoLogin} · IP protegido · Dispositivo verificado
                </div>
              </div>
              <button onClick={handleLogout} style={{
                display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 9, color: "#F87171", fontSize: 13, fontWeight: 700, cursor: "pointer",
                transition: "all .2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }}
              >
                <LogOut size={14} /> Sair da conta
              </button>
            </div>
          </div>

          {/* Footer info */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px" }}>
            <span style={{ fontSize: 10, color: "#1E293B" }}>VerbaTech Corban Platform v2.0 · BCB regulado · LGPD compliant</span>
            <span style={{ fontSize: 10, color: "#1E293B" }}>© 2026 VerbaTech · Política de Privacidade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
