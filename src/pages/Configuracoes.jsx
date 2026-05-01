// VerbaTech — Configurações (todas as roles)
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Settings, User, Bell, Shield, Palette, Globe, Key,
  Smartphone, Eye, EyeOff, CheckCircle, Save, RefreshCw,
  Moon, Sun, Volume2, VolumeX, Mail, Lock, Zap, AlertTriangle,
} from "lucide-react";

const S = {
  page:  { padding: 28, minHeight: "100vh", background: "#05080F" },
  card:  { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 },
  label: { fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 },
  title: { fontSize: 14, fontWeight: 700, color: "#F1F5F9", marginBottom: 4 },
  sub:   { fontSize: 12, color: "#64748B" },
};

const TABS = [
  { id: "perfil",        label: "Perfil",         icon: User     },
  { id: "notificacoes",  label: "Notificações",    icon: Bell     },
  { id: "seguranca",     label: "Segurança",       icon: Shield   },
  { id: "aparencia",     label: "Aparência",       icon: Palette  },
];

/* ── Toggle Switch ─────────────────────────────────────── */
function Toggle({ value, onChange, color = "#6366F1" }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 42, height: 24, borderRadius: 12, cursor: "pointer",
        background: value ? color : "rgba(255,255,255,0.1)",
        position: "relative", transition: "background .2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: value ? 21 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: "#fff", transition: "left .2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }} />
    </div>
  );
}

/* ── Row de Configuração ───────────────────────────────── */
function ConfigRow({ icon: Icon, iconColor = "#6366F1", title, sub, children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: iconColor + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={16} color={iconColor} />
        </div>
        <div>
          <div style={S.title}>{title}</div>
          {sub && <div style={S.sub}>{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ── Input estilizado ──────────────────────────────────── */
function Field({ label, value, onChange, type = "text", placeholder }) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ ...S.label, marginBottom: 6 }}>{label}</div>
      <div style={{ position: "relative" }}>
        <input
          type={isPass && !show ? "password" : "text"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", padding: "10px 14px",
            paddingRight: isPass ? 44 : 14,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 9, color: "#F1F5F9", fontSize: 13,
            outline: "none", boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = "#6366F1"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />
        {isPass && (
          <button
            onClick={() => setShow(v => !v)}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            {show ? <EyeOff size={15} color="#475569" /> : <Eye size={15} color="#475569" />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Botão Salvar ─────────────────────────────────────── */
function SaveBtn({ onClick, saved }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        background: saved ? "rgba(74,222,128,0.15)" : "linear-gradient(135deg,#6366F1,#8B5CF6)",
        border: saved ? "1px solid rgba(74,222,128,0.35)" : "none",
        borderRadius: 10, color: saved ? "#4ADE80" : "#fff",
        fontWeight: 700, fontSize: 13, padding: "10px 22px",
        cursor: "pointer", transition: "all .3s",
        boxShadow: saved ? "none" : "0 4px 16px rgba(99,102,241,0.4)",
      }}
    >
      {saved
        ? <><CheckCircle size={15} /> Salvo!</>
        : <><Save size={15} /> Salvar alterações</>
      }
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   ABA: PERFIL
══════════════════════════════════════════════════════════ */
function TabPerfil({ user }) {
  const [nome, setNome]     = useState(user?.nome || "");
  const [email, setEmail]   = useState(user?.email || "");
  const [tel, setTel]       = useState(user?.telefone || "");
  const [empresa, setEmpresa] = useState(user?.empresa || "");
  const [saved, setSaved]   = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* info pessoal */}
      <div style={S.card}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9" }}>Informações Pessoais</div>
          <div style={S.sub}>Dados do seu perfil na plataforma</div>
        </div>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg,#6366F155,#8B5CF655)",
            border: "2px solid #6366F144",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 900, color: "#818CF8",
          }}>
            {(user?.avatar || user?.nome?.charAt(0) || "U")}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>{user?.nome}</div>
            <div style={{ fontSize: 11, color: "#64748B", marginBottom: 8 }}>{user?.email}</div>
            <span style={{
              fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
              background: "rgba(99,102,241,0.15)", color: "#818CF8",
              border: "1px solid rgba(99,102,241,0.3)",
            }}>
              {user?.role === "admin" ? "Administrador" : user?.role === "funcionario" ? "Funcionário" : "Master Corban"}
            </span>
          </div>
        </div>

        <Field label="Nome completo"  value={nome}   onChange={setNome}   placeholder="Seu nome" />
        <Field label="E-mail"         value={email}  onChange={setEmail}  placeholder="email@empresa.com.br" />
        <Field label="Telefone"       value={tel}    onChange={setTel}    placeholder="(11) 99999-0000" />
        <Field label="Empresa / Loja" value={empresa} onChange={setEmpresa} placeholder="Nome da empresa" />

        <div style={{ marginTop: 4 }}>
          <SaveBtn onClick={handleSave} saved={saved} />
        </div>
      </div>

      {/* info conta */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={S.card}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", marginBottom: 16 }}>
            Dados da Conta
          </div>
          {[
            { label: "ID do usuário",  value: user?.id || "—" },
            { label: "Role / Perfil",  value: user?.role === "admin" ? "Administrador" : user?.role === "funcionario" ? "Funcionário" : "Master Corban" },
            { label: "Nível",          value: user?.nivel || "—" },
            { label: "Último acesso",  value: user?.ultimoLogin || "—" },
            { label: "CNPJ",           value: user?.cnpj || "—" },
            { label: "Loja",           value: user?.loja || "—" },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 11, color: "#64748B" }}>{label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#CBD5E1" }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ ...S.card, background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <AlertTriangle size={16} color="#EF4444" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#EF4444" }}>Zona de Perigo</span>
          </div>
          <div style={S.sub}>Ações irreversíveis. Proceda com cuidado.</div>
          <button style={{
            marginTop: 14, padding: "9px 18px", borderRadius: 9,
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#EF4444", fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>
            Encerrar sessão em todos os dispositivos
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ABA: NOTIFICAÇÕES
══════════════════════════════════════════════════════════ */
function TabNotificacoes() {
  const [cfg, setCfg] = useState({
    emailPropostas: true,  emailComissoes: true,  emailAlertas: false,
    pushPropostas:  true,  pushComissoes:  false, pushAlertas:  true,
    smsUrgente:     true,  somNotificacao: true,
    whatsapp:       true,
  });
  const [saved, setSaved] = useState(false);

  const set = (k) => setCfg(p => ({ ...p, [k]: !p[k] }));

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2500); }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={S.card}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", marginBottom: 4 }}>E-mail</div>
        <div style={{ ...S.sub, marginBottom: 20 }}>Notificações enviadas para {" "}
          <span style={{ color: "#818CF8" }}>seu e-mail cadastrado</span>
        </div>
        <ConfigRow icon={Mail} iconColor="#6366F1" title="Novas propostas" sub="Quando uma proposta for criada ou atualizada">
          <Toggle value={cfg.emailPropostas} onChange={() => set("emailPropostas")} />
        </ConfigRow>
        <ConfigRow icon={Mail} iconColor="#10B981" title="Comissões disponíveis" sub="Créditos de comissão na sua conta">
          <Toggle value={cfg.emailComissoes} onChange={() => set("emailComissoes")} color="#10B981" />
        </ConfigRow>
        <ConfigRow icon={Mail} iconColor="#EF4444" title="Alertas de compliance" sub="Avisos críticos do motor de IA">
          <Toggle value={cfg.emailAlertas} onChange={() => set("emailAlertas")} color="#EF4444" />
        </ConfigRow>
      </div>

      <div style={S.card}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", marginBottom: 4 }}>Push & SMS</div>
        <div style={{ ...S.sub, marginBottom: 20 }}>Notificações em tempo real no dispositivo</div>
        <ConfigRow icon={Smartphone} iconColor="#8B5CF6" title="Push — Propostas" sub="Notificação push no app/browser">
          <Toggle value={cfg.pushPropostas} onChange={() => set("pushPropostas")} color="#8B5CF6" />
        </ConfigRow>
        <ConfigRow icon={Smartphone} iconColor="#F59E0B" title="Push — Comissões" sub="Alerta ao receber crédito">
          <Toggle value={cfg.pushComissoes} onChange={() => set("pushComissoes")} color="#F59E0B" />
        </ConfigRow>
        <ConfigRow icon={Smartphone} iconColor="#EF4444" title="SMS — Urgente" sub="Apenas alertas críticos de segurança">
          <Toggle value={cfg.smsUrgente} onChange={() => set("smsUrgente")} color="#EF4444" />
        </ConfigRow>
        <ConfigRow icon={Volume2} iconColor="#06B6D4" title="Som de notificação" sub="Tocar som ao receber alerta">
          <Toggle value={cfg.somNotificacao} onChange={() => set("somNotificacao")} color="#06B6D4" />
        </ConfigRow>
        <ConfigRow icon={Zap} iconColor="#25D366" title="WhatsApp Business" sub="Alertas via WhatsApp">
          <Toggle value={cfg.whatsapp} onChange={() => set("whatsapp")} color="#25D366" />
        </ConfigRow>
      </div>

      <div style={{ gridColumn: "1/-1", display: "flex" }}>
        <SaveBtn onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ABA: SEGURANÇA
══════════════════════════════════════════════════════════ */
function TabSeguranca({ user }) {
  const [senhaAtual, setSenhaAtual]   = useState("");
  const [senhaNova, setSenhaNova]     = useState("");
  const [senhaConf, setSenhaConf]     = useState("");
  const [twoFA, setTwoFA]             = useState(user?.twoFA || false);
  const [saved, setSaved]             = useState(false);
  const [salvouSenha, setSalvouSenha] = useState(false);

  function handleSaveSenha() {
    if (!senhaAtual || !senhaNova || senhaNova !== senhaConf) return;
    setSalvouSenha(true);
    setSenhaAtual(""); setSenhaNova(""); setSenhaConf("");
    setTimeout(() => setSalvouSenha(false), 2500);
  }

  function handle2FA() { setTwoFA(v => !v); setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* Alterar senha */}
      <div style={S.card}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", marginBottom: 4 }}>Alterar Senha</div>
        <div style={{ ...S.sub, marginBottom: 20 }}>Use uma senha forte com mínimo 8 caracteres</div>

        <Field label="Senha atual"       value={senhaAtual} onChange={setSenhaAtual} type="password" placeholder="••••••••" />
        <Field label="Nova senha"        value={senhaNova}  onChange={setSenhaNova}  type="password" placeholder="Mínimo 8 caracteres" />
        <Field label="Confirmar senha"   value={senhaConf}  onChange={setSenhaConf}  type="password" placeholder="Repita a nova senha" />

        {senhaNova && senhaConf && senhaNova !== senhaConf && (
          <div style={{ fontSize: 11, color: "#EF4444", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <AlertTriangle size={12} /> As senhas não coincidem
          </div>
        )}

        <SaveBtn onClick={handleSaveSenha} saved={salvouSenha} />
      </div>

      {/* 2FA + sessões */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={S.card}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", marginBottom: 16 }}>
            Autenticação em 2 Fatores
          </div>

          <ConfigRow
            icon={Shield}
            iconColor={twoFA ? "#4ADE80" : "#EF4444"}
            title="2FA Ativo"
            sub={twoFA
              ? `Método: ${user?.twoFAMetodo === "app" ? "App Autenticador" : "SMS"}`
              : "Sua conta está vulnerável sem 2FA"
            }
          >
            <Toggle value={twoFA} onChange={handle2FA} color="#4ADE80" />
          </ConfigRow>

          {!twoFA && (
            <div style={{
              marginTop: 12, padding: "10px 14px", borderRadius: 9,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            }}>
              <div style={{ fontSize: 11, color: "#EF4444", fontWeight: 700 }}>
                ⚠️ Ativar 2FA é fortemente recomendado para proteger sua conta
              </div>
            </div>
          )}

          {twoFA && (
            <div style={{
              marginTop: 12, padding: "10px 14px", borderRadius: 9,
              background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <CheckCircle size={14} color="#4ADE80" />
              <span style={{ fontSize: 11, color: "#4ADE80", fontWeight: 600 }}>
                Conta protegida com autenticação em dois fatores
              </span>
            </div>
          )}
        </div>

        <div style={S.card}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", marginBottom: 16 }}>
            Sessões Ativas
          </div>
          {[
            { dispositivo: "Chrome — Windows 11", ip: "192.168.1.10", local: "São Paulo, SP", atual: true  },
            { dispositivo: "Safari — iPhone 14",  ip: "189.23.45.67", local: "São Paulo, SP", atual: false },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 0", borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: s.atual ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.04)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Smartphone size={15} color={s.atual ? "#4ADE80" : "#475569"} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>{s.dispositivo}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>{s.ip} · {s.local}</div>
                </div>
              </div>
              {s.atual
                ? <span style={{ fontSize: 10, color: "#4ADE80", fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "rgba(74,222,128,0.12)" }}>Atual</span>
                : <button style={{ fontSize: 10, color: "#EF4444", fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", cursor: "pointer" }}>Encerrar</button>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ABA: APARÊNCIA
══════════════════════════════════════════════════════════ */
function TabAparencia() {
  const [tema, setTema]           = useState("dark");
  const [compacto, setCompacto]   = useState(false);
  const [animacoes, setAnimacoes] = useState(true);
  const [lingua, setLingua]       = useState("pt-BR");
  const [moeda, setMoeda]         = useState("BRL");
  const [saved, setSaved]         = useState(false);

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2500); }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div style={S.card}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", marginBottom: 4 }}>Tema & Visual</div>
        <div style={{ ...S.sub, marginBottom: 20 }}>Personalize a aparência da plataforma</div>

        {/* Seletor de tema */}
        <div style={{ ...S.label, marginBottom: 10 }}>Tema da interface</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[
            { id: "dark",  label: "Escuro",   icon: Moon, preview: "#060C18" },
            { id: "light", label: "Claro",    icon: Sun,  preview: "#F8FAFC" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTema(t.id)}
              style={{
                flex: 1, padding: "14px 10px", borderRadius: 12, cursor: "pointer",
                background: tema === t.id ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                border: `2px solid ${tema === t.id ? "#6366F1" : "rgba(255,255,255,0.08)"}`,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                transition: "all .2s",
              }}
            >
              <div style={{ width: 40, height: 24, borderRadius: 6, background: t.preview, border: "1px solid rgba(255,255,255,0.1)" }} />
              <t.icon size={14} color={tema === t.id ? "#818CF8" : "#475569"} />
              <span style={{ fontSize: 11, fontWeight: 600, color: tema === t.id ? "#818CF8" : "#475569" }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>

        <ConfigRow icon={Zap} iconColor="#F59E0B" title="Modo compacto" sub="Reduz espaçamentos para mais conteúdo">
          <Toggle value={compacto} onChange={setCompacto} color="#F59E0B" />
        </ConfigRow>
        <ConfigRow icon={RefreshCw} iconColor="#8B5CF6" title="Animações" sub="Transições e micro-animações">
          <Toggle value={animacoes} onChange={setAnimacoes} color="#8B5CF6" />
        </ConfigRow>
      </div>

      <div style={S.card}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", marginBottom: 4 }}>Regional</div>
        <div style={{ ...S.sub, marginBottom: 20 }}>Idioma, moeda e formatações</div>

        <div style={{ ...S.label, marginBottom: 6 }}>Idioma</div>
        <select
          value={lingua}
          onChange={e => setLingua(e.target.value)}
          style={{
            width: "100%", padding: "10px 14px", marginBottom: 16,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 9, color: "#F1F5F9", fontSize: 13,
          }}
        >
          <option value="pt-BR">🇧🇷 Português (Brasil)</option>
          <option value="en-US">🇺🇸 English (US)</option>
          <option value="es">🇪🇸 Español</option>
        </select>

        <div style={{ ...S.label, marginBottom: 6 }}>Moeda padrão</div>
        <select
          value={moeda}
          onChange={e => setMoeda(e.target.value)}
          style={{
            width: "100%", padding: "10px 14px", marginBottom: 20,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 9, color: "#F1F5F9", fontSize: 13,
          }}
        >
          <option value="BRL">BRL — Real Brasileiro</option>
          <option value="USD">USD — Dólar Americano</option>
          <option value="EUR">EUR — Euro</option>
        </select>

        {/* preview de formato */}
        <div style={{
          padding: "12px 16px", borderRadius: 9,
          background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)",
        }}>
          <div style={S.label}>Preview de formatação</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#818CF8", marginTop: 6 }}>
            {new Intl.NumberFormat(lingua, { style: "currency", currency: moeda }).format(42750.80)}
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>
            {new Date().toLocaleDateString(lingua, { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      <div style={{ gridColumn: "1/-1", display: "flex" }}>
        <SaveBtn onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL — Configurações
══════════════════════════════════════════════════════════ */
export default function Configuracoes() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Settings size={20} color="#818CF8" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F1F5F9" }}>
              Configurações
            </h1>
            <div style={{ fontSize: 12, color: "#64748B" }}>
              Gerencie seu perfil, segurança e preferências
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 18px", borderRadius: 10, cursor: "pointer",
                background: active ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.08)",
                color: active ? "#818CF8" : "#64748B",
                fontWeight: active ? 700 : 500, fontSize: 13,
                transition: "all .2s",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo da aba */}
      {activeTab === "perfil"       && <TabPerfil user={user} />}
      {activeTab === "notificacoes" && <TabNotificacoes />}
      {activeTab === "seguranca"    && <TabSeguranca user={user} />}
      {activeTab === "aparencia"    && <TabAparencia />}
    </div>
  );
}
