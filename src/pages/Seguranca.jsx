// VerbaTech — Segurança (2FA, Activity Log, IP Restrictions, CPF Linking)
import { useState, useEffect } from "react";
import {
  Shield, Lock, Key, Smartphone, Monitor, AlertTriangle,
  CheckCircle, XCircle, Clock, Eye, EyeOff, Wifi, WifiOff,
  Users, Settings, RefreshCw, Plus, Search, Filter,
  AlertCircle, LogIn, LogOut, FileText, Globe, Ban,
  Activity, TrendingUp, ChevronRight, ToggleLeft, ToggleRight,
  UserCheck, UserX, Fingerprint, QrCode,
} from "lucide-react";
import {
  mockUsuariosSistema, mockActivityLog, mockIpRestrictions, fmt,
} from "../data/verbatechData";

/* ── tokens ─────────────────────────────────────── */
const S = {
  page:  { padding: 24, minHeight: "100vh", background: "#080E1A" },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 },
  h2:    { fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 },
};

const RISCO_CFG = {
  baixo: { label: "Baixo",  color: "#4ADE80", bg: "#4ADE8018" },
  medio: { label: "Médio",  color: "#F59E0B", bg: "#F59E0B18" },
  alto:  { label: "Alto",   color: "#EF4444", bg: "#EF444418" },
};

const LOG_STATUS = {
  success: { icon: CheckCircle, color: "#4ADE80" },
  warning: { icon: AlertCircle, color: "#F59E0B" },
  error:   { icon: XCircle,     color: "#EF4444" },
};

const ROLE_CFG = {
  master:    { label: "Master",    color: "#00BFFF" },
  agente:    { label: "Agente",    color: "#FFD700" },
  sub_agente:{ label: "Sub-agente",color: "#C0C0C0" },
  admin:     { label: "Admin",     color: "#F87171" },
};

const USER_STATUS = {
  ativo:    { label: "Ativo",    color: "#4ADE80" },
  suspenso: { label: "Suspenso", color: "#EF4444" },
  inativo:  { label: "Inativo",  color: "#64748B" },
};

/* ── AnimBar ─────────────────────────────────────── */
function AnimBar({ pct, color, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 80 + delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 5 }}>
      <div style={{ height: "100%", width: `${w}%`, borderRadius: 5, background: color,
        transition: `width 0.85s cubic-bezier(.4,0,.2,1) ${delay}ms`, boxShadow: `0 0 6px ${color}55` }} />
    </div>
  );
}

/* ── 2FA Badge ───────────────────────────────────── */
function TwoFABadge({ enabled, metodo }) {
  if (!enabled) return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9,
      fontWeight: 700, padding: "2px 8px", borderRadius: 5,
      background: "#EF444418", color: "#EF4444", border: "1px solid #EF444430" }}>
      <XCircle size={9} /> Sem 2FA
    </span>
  );
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9,
      fontWeight: 700, padding: "2px 8px", borderRadius: 5,
      background: "#4ADE8018", color: "#4ADE80", border: "1px solid #4ADE8030" }}>
      <CheckCircle size={9} /> 2FA {metodo === "app" ? "App" : "SMS"}
    </span>
  );
}

/* ── User Card ───────────────────────────────────── */
function UserRow({ usr, onSelect, selected }) {
  const uc = USER_STATUS[usr.status] || USER_STATUS.inativo;
  const rc = ROLE_CFG[usr.role] || ROLE_CFG.agente;
  const warn = !usr.twoFA || usr.tentativasFalhas >= 2;
  return (
    <div onClick={() => onSelect(usr)} style={{
      display: "grid", gridTemplateColumns: "1fr 80px 100px 80px 60px 90px 80px",
      alignItems: "center", gap: 12, padding: "11px 14px",
      background: selected ? "rgba(99,102,241,0.1)" : warn ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.02)",
      borderRadius: 10, cursor: "pointer",
      border: selected ? "1px solid rgba(99,102,241,0.3)" : warn ? "1px solid rgba(239,68,68,0.15)" : "1px solid transparent",
      transition: "all .2s",
    }}>
      {/* name */}
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
          background: warn ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 800, color: warn ? "#EF4444" : "#6366F1",
        }}>
          {usr.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0", display: "flex", alignItems: "center", gap: 5 }}>
            {usr.nome}
            {warn && <AlertTriangle size={11} color="#F59E0B" />}
          </div>
          <div style={{ fontSize: 9, color: "#64748B" }}>{usr.email}</div>
        </div>
      </div>
      {/* role */}
      <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
        background: rc.color + "18", color: rc.color, border: `1px solid ${rc.color}30` }}>
        {rc.label}
      </span>
      {/* 2FA */}
      <TwoFABadge enabled={usr.twoFA} metodo={usr.twoFAMetodo} />
      {/* status */}
      <span style={{ fontSize: 9, fontWeight: 700, color: uc.color }}>{uc.label}</span>
      {/* tentativas */}
      <span style={{ fontSize: 12, fontWeight: 700,
        color: usr.tentativasFalhas >= 3 ? "#EF4444" : usr.tentativasFalhas >= 1 ? "#F59E0B" : "#4ADE80",
        textAlign: "center" }}>
        {usr.tentativasFalhas}
      </span>
      {/* sessões */}
      <span style={{ fontSize: 11, color: "#94A3B8", textAlign: "center" }}>
        {usr.sessoes} sessão{usr.sessoes !== 1 ? "ões" : ""}
      </span>
      {/* último login */}
      <span style={{ fontSize: 9, color: "#64748B" }}>{usr.ultimoLogin.split(" ")[0]}</span>
    </div>
  );
}

/* ── User Detail Panel ───────────────────────────── */
function UserDetail({ usr, onClose }) {
  const [show2FAModal, setShow2FAModal] = useState(false);
  if (!usr) return (
    <div style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: 260, gap: 12 }}>
      <Shield size={32} color="#334155" />
      <p style={{ color: "#475569", fontSize: 13 }}>Selecione um usuário</p>
    </div>
  );

  const uc = USER_STATUS[usr.status] || USER_STATUS.inativo;
  const rc = ROLE_CFG[usr.role] || ROLE_CFG.agente;
  const warn = !usr.twoFA || usr.tentativasFalhas >= 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* user header */}
      <div style={{ ...S.card, background: warn
        ? "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(255,255,255,0.02))"
        : "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(255,255,255,0.02))",
        border: warn ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(99,102,241,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13,
              background: warn ? "rgba(239,68,68,0.2)" : "linear-gradient(135deg,#6366F1,#8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: warn ? "#EF4444" : "#fff",
            }}>
              {usr.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>{usr.nome}</div>
              <div style={{ fontSize: 10, color: "#64748B" }}>{usr.email}</div>
            </div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6,
            background: uc.color + "20", color: uc.color }}>{uc.label}</span>
        </div>

        {warn && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
            background: "rgba(239,68,68,0.1)", borderRadius: 8, padding: "9px 12px",
            border: "1px solid rgba(239,68,68,0.2)" }}>
            <AlertTriangle size={14} color="#EF4444" />
            <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600 }}>
              {!usr.twoFA ? "2FA não ativado — risco de segurança" : ""}
              {usr.tentativasFalhas >= 2 ? ` · ${usr.tentativasFalhas} tentativas falhas de login` : ""}
            </span>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { l: "Papel", v: rc.label, c: rc.color },
            { l: "Loja", v: usr.loja, c: "#E2E8F0" },
            { l: "IP Atual", v: usr.ip, c: "#94A3B8" },
            { l: "Horário", v: usr.horarioPermitido, c: "#E2E8F0" },
            { l: "Sessões", v: usr.sessoes, c: "#F59E0B" },
            { l: "CPF Vinculado", v: usr.cpf, c: "#94A3B8" },
          ].map(({ l, v, c }) => (
            <div key={l} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ ...S.label, marginBottom: 3 }}>{l}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2FA control */}
      <div style={S.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Fingerprint size={15} color={usr.twoFA ? "#4ADE80" : "#EF4444"} />
          <span style={S.h2}>Autenticação em 2 Fatores</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          background: usr.twoFA ? "rgba(74,222,128,0.06)" : "rgba(239,68,68,0.06)",
          border: `1px solid ${usr.twoFA ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.15)"}`,
          borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: usr.twoFA ? "#4ADE80" : "#EF4444", marginBottom: 4 }}>
              {usr.twoFA ? `2FA Ativo — via ${usr.twoFAMetodo === "app" ? "Aplicativo Autenticador" : "SMS"}` : "2FA Desativado"}
            </div>
            <div style={{ fontSize: 11, color: "#64748B" }}>
              {usr.twoFA ? "Segundo fator configurado e validado" : "Usuário vulnerável a ataques de credencial"}
            </div>
          </div>
          <div style={{
            width: 44, height: 24, borderRadius: 12, cursor: "pointer",
            background: usr.twoFA ? "#4ADE80" : "#334155", position: "relative",
            transition: "background .3s",
          }}>
            <div style={{
              position: "absolute", top: 3, left: usr.twoFA ? 22 : 2, width: 18, height: 18,
              borderRadius: "50%", background: "#fff", transition: "left .3s",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }} />
          </div>
        </div>

        {usr.twoFA ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px",
              display: "flex", alignItems: "center", gap: 8 }}>
              {usr.twoFAMetodo === "app" ? <QrCode size={14} color="#6366F1" /> : <Smartphone size={14} color="#6366F1" />}
              <div>
                <div style={{ ...S.label, marginBottom: 2 }}>Método</div>
                <div style={{ fontSize: 11, color: "#E2E8F0", fontWeight: 600 }}>
                  {usr.twoFAMetodo === "app" ? "Authenticator App" : "SMS"}
                </div>
              </div>
            </div>
            <button onClick={() => setShow2FAModal(true)} style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 8, color: "#EF4444", fontWeight: 700, fontSize: 11,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Key size={13} /> Revogar 2FA
            </button>
          </div>
        ) : (
          <button onClick={() => setShow2FAModal(true)} style={{
            width: "100%", padding: "11px", borderRadius: 10,
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            border: "none", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <Shield size={14} /> Forçar Ativação de 2FA
          </button>
        )}
      </div>

      {/* permissões */}
      <div style={S.card}>
        <p style={{ ...S.label, marginBottom: 10 }}>Permissões do usuário</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {usr.permissoes.length > 0 ? usr.permissoes.map(p => (
            <span key={p} style={{ fontSize: 10, fontWeight: 700,
              background: "rgba(99,102,241,0.12)", color: "#818CF8",
              border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, padding: "3px 9px" }}>
              {p}
            </span>
          )) : (
            <span style={{ fontSize: 11, color: "#EF4444" }}>Sem permissões ativas (conta suspensa)</span>
          )}
        </div>
      </div>

      {/* restrição horário */}
      <div style={S.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Clock size={15} color="#F59E0B" />
          <span style={S.h2}>Restrição de Horário</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12,
          background: "rgba(245,158,11,0.06)", borderRadius: 10, padding: "12px 14px",
          border: "1px solid rgba(245,158,11,0.15)" }}>
          <Clock size={22} color="#F59E0B" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#F59E0B" }}>{usr.horarioPermitido}</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>Acessos fora deste horário são bloqueados automaticamente</div>
          </div>
        </div>
      </div>

      {/* actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button style={{
          padding: "11px", borderRadius: 10,
          background: usr.status === "ativo" ? "rgba(239,68,68,0.12)" : "rgba(74,222,128,0.12)",
          border: `1px solid ${usr.status === "ativo" ? "rgba(239,68,68,0.25)" : "rgba(74,222,128,0.25)"}`,
          color: usr.status === "ativo" ? "#EF4444" : "#4ADE80",
          fontWeight: 700, fontSize: 12, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}>
          {usr.status === "ativo" ? <><UserX size={14} /> Suspender</> : <><UserCheck size={14} /> Reativar</>}
        </button>
        <button style={{
          padding: "11px", borderRadius: 10,
          background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
          color: "#818CF8", fontWeight: 700, fontSize: 12, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}>
          <Settings size={14} /> Permissões
        </button>
      </div>

      {/* 2FA modal */}
      {show2FAModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 500,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#0D1525", borderRadius: 18, padding: 28, width: 380,
            border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <QrCode size={20} color="#6366F1" />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#F1F5F9" }}>
                {usr.twoFA ? "Revogar 2FA" : "Ativar 2FA"}
              </h3>
            </div>
            <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20, lineHeight: 1.6 }}>
              {usr.twoFA
                ? "Tem certeza que deseja revogar o 2FA deste usuário? Isso aumenta o risco de segurança."
                : `Enviar notificação para ${usr.email} solicitando ativação do 2FA obrigatório?`}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button onClick={() => setShow2FAModal(false)} style={{
                padding: "11px", borderRadius: 10,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#94A3B8", fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}>Cancelar</button>
              <button onClick={() => setShow2FAModal(false)} style={{
                padding: "11px", borderRadius: 10,
                background: usr.twoFA
                  ? "linear-gradient(135deg,#EF4444,#DC2626)"
                  : "linear-gradient(135deg,#6366F1,#8B5CF6)",
                border: "none", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}>
                {usr.twoFA ? "Confirmar Revogação" : "Enviar Convite 2FA"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Activity Log ─────────────────────────────────── */
function ActivityLog() {
  const [filterRisco, setFilter] = useState("todos");
  const logs = mockActivityLog.filter(l => filterRisco === "todos" || l.risco === filterRisco);
  return (
    <div style={S.card}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Activity size={16} color="#6366F1" />
        <span style={S.h2}>Log de Atividades</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 7 }}>
          {["todos","baixo","medio","alto"].map(r => (
            <button key={r} onClick={() => setFilter(r)} style={{
              padding: "5px 11px", borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: "pointer",
              background: filterRisco === r ? (r === "alto" ? "#EF4444" : r === "medio" ? "#F59E0B" : r === "baixo" ? "#4ADE80" : "#6366F1") : "rgba(255,255,255,0.06)",
              color: filterRisco === r ? (r === "todos" ? "#fff" : "#050D18") : "#64748B",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              {r === "todos" ? "Todos" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {logs.map(log => {
          const sc = LOG_STATUS[log.status] || LOG_STATUS.success;
          const rc = RISCO_CFG[log.risco] || RISCO_CFG.baixo;
          const Icon = sc.icon;
          return (
            <div key={log.id} style={{
              display: "grid", gridTemplateColumns: "28px 1fr 120px 100px 80px 70px",
              alignItems: "center", gap: 10, padding: "9px 12px",
              background: log.risco === "alto" ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.02)",
              borderRadius: 9, border: log.risco === "alto" ? "1px solid rgba(239,68,68,0.12)" : "1px solid transparent",
            }}>
              <Icon size={14} color={sc.color} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#E2E8F0" }}>{log.acao}</div>
                <div style={{ fontSize: 9, color: "#64748B" }}>{log.usuario}</div>
              </div>
              <span style={{ fontSize: 10, color: "#64748B", fontFamily: "monospace" }}>{log.ip}</span>
              <span style={{ fontSize: 9, color: "#64748B" }}>{log.dispositivo}</span>
              <span style={{ fontSize: 9, color: "#64748B" }}>{log.data.split(" ")[0]}</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                background: rc.bg, color: rc.color }}>{rc.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── IP Restrictions ──────────────────────────────── */
function IPRestrictions() {
  return (
    <div style={S.card}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Globe size={15} color="#6366F1" />
        <span style={S.h2}>Restrições de IP</span>
        <button style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          border: "none", borderRadius: 8, color: "#fff",
          fontWeight: 700, fontSize: 10, padding: "6px 12px", cursor: "pointer" }}>
          <Plus size={11} /> Adicionar IP
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {mockIpRestrictions.map(ip => (
          <div key={ip.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
            background: ip.tipo === "bloqueado" ? "rgba(239,68,68,0.05)" : "rgba(74,222,128,0.05)",
            borderRadius: 10,
            border: `1px solid ${ip.tipo === "bloqueado" ? "rgba(239,68,68,0.15)" : "rgba(74,222,128,0.12)"}`,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: ip.tipo === "bloqueado" ? "rgba(239,68,68,0.15)" : "rgba(74,222,128,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {ip.tipo === "bloqueado" ? <Ban size={14} color="#EF4444" /> : <Wifi size={14} color="#4ADE80" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0", marginBottom: 2 }}>{ip.descricao}</div>
              <div style={{ fontSize: 10, color: "#64748B", fontFamily: "monospace" }}>{ip.range}</div>
              {ip.usuarios.length > 0 && (
                <div style={{ fontSize: 9, color: "#94A3B8", marginTop: 3 }}>
                  Usuários: {ip.usuarios.join(", ")}
                </div>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6,
              background: ip.tipo === "bloqueado" ? "#EF444420" : "#4ADE8020",
              color: ip.tipo === "bloqueado" ? "#EF4444" : "#4ADE80",
              border: `1px solid ${ip.tipo === "bloqueado" ? "#EF444440" : "#4ADE8040"}`,
            }}>
              {ip.tipo === "bloqueado" ? "Bloqueado" : "Permitido"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN ────────────────────────────────────────── */
export default function Seguranca() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm,   setSearch]       = useState("");

  const total      = mockUsuariosSistema.length;
  const sem2FA     = mockUsuariosSistema.filter(u => !u.twoFA).length;
  const suspensos  = mockUsuariosSistema.filter(u => u.status === "suspenso").length;
  const alertasAlto = mockActivityLog.filter(l => l.risco === "alto").length;

  const users = mockUsuariosSistema.filter(u =>
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={S.page}>
      {/* ── header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Lock size={22} color="#6366F1" />
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F1F5F9" }}>Segurança & Acesso</h1>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>
            2FA · Logs de atividade · Restrição IP/horário · Vinculação CPF-Loja
          </p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          border: "none", borderRadius: 10, color: "#fff",
          fontWeight: 700, fontSize: 12, padding: "10px 18px", cursor: "pointer",
        }}>
          <Plus size={14} /> Novo Usuário
        </button>
      </div>

      {/* ── KPI strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { l: "Usuários Totais", v: total, icon: Users, color: "#6366F1" },
          { l: "Sem 2FA", v: sem2FA, icon: AlertTriangle, color: "#EF4444", alert: sem2FA > 0 },
          { l: "Contas Suspensas", v: suspensos, icon: UserX, color: "#F59E0B" },
          { l: "Alertas de Risco Alto", v: alertasAlto, icon: Shield, color: "#EF4444", alert: alertasAlto > 0 },
        ].map(({ l, v, icon: Icon, color, alert }) => (
          <div key={l} style={{ ...S.card, position: "relative", overflow: "hidden",
            border: alert ? `1px solid ${color}30` : "1px solid rgba(255,255,255,0.07)",
            background: alert ? `linear-gradient(135deg,${color}08,rgba(255,255,255,0.02))` : "rgba(255,255,255,0.025)",
          }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 70, height: 70,
              background: `radial-gradient(circle at top right, ${color}18, transparent 70%)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: color + "20",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} color={color} />
              </div>
              <span style={S.label}>{l}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: alert ? color : "#F1F5F9" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── Security alerts banner ── */}
      {sem2FA > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 12, padding: "14px 18px" }}>
          <AlertTriangle size={18} color="#EF4444" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#EF4444", marginBottom: 2 }}>
              {sem2FA} usuário{sem2FA > 1 ? "s" : ""} sem 2FA ativado
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>
              Recomendamos forçar a ativação do segundo fator para todos os digitadores vinculados à sua loja.
            </div>
          </div>
          <button style={{
            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8, color: "#EF4444", fontWeight: 700, fontSize: 11,
            padding: "7px 14px", cursor: "pointer",
          }}>
            Forçar 2FA para todos
          </button>
        </div>
      )}

      {/* ── Users table + detail ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14, marginBottom: 24 }}>
        {/* left: users */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Users size={16} color="#6366F1" />
            <span style={S.h2}>Gestão de Usuários</span>
            <div style={{ marginLeft: "auto", position: "relative" }}>
              <Search size={12} color="#64748B" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
              <input value={searchTerm} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar usuário..."
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, color: "#E2E8F0", fontSize: 11, padding: "6px 10px 6px 26px",
                  outline: "none", width: 170 }} />
            </div>
          </div>

          {/* table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 80px 60px 90px 80px",
            gap: 12, padding: "6px 14px", marginBottom: 4 }}>
            {["Usuário","Papel","2FA","Status","Falhas","Sessões","Último Login"].map(h => (
              <div key={h} style={S.label}>{h}</div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {users.map(usr => (
              <UserRow key={usr.id} usr={usr}
                selected={selectedUser?.id === usr.id} onSelect={setSelectedUser} />
            ))}
          </div>
        </div>

        {/* right: detail */}
        <UserDetail usr={selectedUser} onClose={() => setSelectedUser(null)} />
      </div>

      {/* ── Activity Log ── */}
      <div style={{ marginBottom: 24 }}>
        <ActivityLog />
      </div>

      {/* ── IP Restrictions ── */}
      <IPRestrictions />
    </div>
  );
}
