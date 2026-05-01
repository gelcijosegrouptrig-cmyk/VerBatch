// VerbaTech — Login (3 perfis: Admin · Corban Master · Funcionário)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Eye, EyeOff, Shield, Lock, Mail, AlertCircle,
         ChevronRight, CheckCircle, Crown, Users, UserCheck } from "lucide-react";
import { useAuth, DEMO_ACCOUNTS } from "../context/AuthContext";

/* ── perfil cards para seleção rápida ───────────────────── */
const PERFIS = [
  {
    role: "admin",
    label: "Admin VerbaTech",
    desc: "Gestão global da plataforma",
    icon: Crown,
    color: "#EF4444",
    grad: "linear-gradient(135deg,#EF4444,#DC2626)",
    email: "admin@verbatech.com.br",
    senha: "Admin@2024",
  },
  {
    role: "master",
    label: "Corban Master",
    desc: "Dono da loja / gerente",
    icon: Shield,
    color: "#6366F1",
    grad: "linear-gradient(135deg,#6366F1,#8B5CF6)",
    email: "ricardo@verbatech.com.br",
    senha: "Master@2024",
  },
  {
    role: "funcionario",
    label: "Funcionário Corban",
    desc: "Digitador / agente de vendas",
    icon: Users,
    color: "#10B981",
    grad: "linear-gradient(135deg,#10B981,#059669)",
    email: "ana@verbatech.com.br",
    senha: "Func@2024",
  },
];

/* ── Animated dots (login loader) ──────────────────────── */
function LoadingDots({ color }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", justifyContent: "center" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: color,
          animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ── 2FA step ───────────────────────────────────────────── */
function TwoFAStep({ user, onConfirm, onBack, loading }) {
  const [code, setCode] = useState(["","","","","",""]);
  const refs = Array.from({ length: 6 }, () => null);
  const [refList, setRefList] = useState([]);

  useEffect(() => {
    const r = [];
    for (let i = 0; i < 6; i++) r.push(null);
    setRefList(r);
  }, []);

  function handleKey(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) {
      const nextEl = document.getElementById(`otp-${i + 1}`);
      if (nextEl) nextEl.focus();
    }
    if (next.every(d => d !== "") && val) {
      setTimeout(() => onConfirm(next.join("")), 80);
    }
  }

  function handleBackspace(i, e) {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      const prevEl = document.getElementById(`otp-${i - 1}`);
      if (prevEl) prevEl.focus();
    }
  }

  const metodoLabel = user?.twoFAMetodo === "app" ? "Aplicativo Autenticador" : "SMS";
  const metodoDetalhe = user?.twoFAMetodo === "app"
    ? "Abra o Google Authenticator ou Authy"
    : `Enviamos o código para ${user?.telefone}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      {/* icon */}
      <div style={{ position: "relative" }}>
        <div style={{ width: 68, height: 68, borderRadius: 20,
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}>
          <Shield size={30} color="#fff" />
        </div>
        <div style={{ position: "absolute", top: -4, right: -4, width: 22, height: 22,
          borderRadius: "50%", background: "#4ADE80",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={11} color="#050D18" />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#F1F5F9" }}>
          Verificação em 2 Etapas
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>{metodoLabel}</p>
        <p style={{ margin: "4px 0 0", fontSize: 11, color: "#475569" }}>{metodoDetalhe}</p>
      </div>

      {/* OTP boxes */}
      <div style={{ display: "flex", gap: 10 }}>
        {code.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleKey(i, e.target.value)}
            onKeyDown={e => handleBackspace(i, e)}
            style={{
              width: 46, height: 56, borderRadius: 12,
              background: digit ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.06)",
              border: `2px solid ${digit ? "#6366F1" : "rgba(255,255,255,0.1)"}`,
              color: "#F1F5F9", fontSize: 22, fontWeight: 800, textAlign: "center",
              outline: "none", transition: "all .2s", caretColor: "transparent",
              boxShadow: digit ? "0 0 14px rgba(99,102,241,0.3)" : "none",
            }}
          />
        ))}
      </div>

      {loading && <LoadingDots color="#6366F1" />}

      <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>
        Demo: qualquer 6 dígitos funciona
      </p>

      <button onClick={onBack} style={{
        background: "none", border: "none", color: "#64748B",
        fontSize: 12, cursor: "pointer", textDecoration: "underline",
      }}>
        ← Voltar ao login
      </button>
    </div>
  );
}

/* ── MAIN LOGIN ─────────────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [email,    setEmail]    = useState("");
  const [senha,    setSenha]    = useState("");
  const [showPass, setShowPass] = useState(false);
  const [step,     setStep]     = useState("login"); // login | 2fa
  const [pendingUser, setPendingUser] = useState(null);
  const [localErr, setLocalErr] = useState("");
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [shakeErr, setShakeErr] = useState(false);

  // BG particles state
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  function triggerShake() {
    setShakeErr(true);
    setTimeout(() => setShakeErr(false), 500);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLocalErr("");
    const result = await login(email, senha);
    if (result.ok) {
      // check if twoFA needed
      const account = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase().trim());
      if (account?.twoFA) {
        setPendingUser(account);
        setStep("2fa");
      } else {
        redirectByRole(result.role);
      }
    } else {
      triggerShake();
    }
  }

  function handleFillDemo(perfil) {
    setEmail(perfil.email);
    setSenha(perfil.senha);
    setLocalErr("");
  }

  async function handleTwoFA(code) {
    setTwoFALoading(true);
    await new Promise(r => setTimeout(r, 700));
    setTwoFALoading(false);
    // In demo, any 6-digit code works
    if (pendingUser) redirectByRole(pendingUser.role);
  }

  function redirectByRole(role) {
    if (role === "admin")       navigate("/admin");
    else if (role === "master") navigate("/");
    else                        navigate("/func");
  }

  const activeColor = PERFIS.find(p => {
    const acc = DEMO_ACCOUNTS.find(a => a.email === email);
    return acc?.role === p.role;
  })?.color || "#6366F1";

  return (
    <div style={{
      minHeight: "100vh", background: "#05080F",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* ── animated background grid ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />

      {/* ── glow orbs ── */}
      <div style={{ position: "absolute", top: "15%", left: "10%", width: 380, height: 380,
        background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)", borderRadius: "50%",
        animation: "orbFloat1 8s ease-in-out infinite",
      }} />
      <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 300, height: 300,
        background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)", borderRadius: "50%",
        animation: "orbFloat2 10s ease-in-out infinite",
      }} />
      <div style={{ position: "absolute", top: "55%", left: "5%", width: 200, height: 200,
        background: "radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)", borderRadius: "50%",
        animation: "orbFloat1 12s ease-in-out infinite reverse",
      }} />

      {/* ── card ── */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "100%", maxWidth: 440,
        background: "rgba(10,16,30,0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        backdropFilter: "blur(24px)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)",
        padding: "36px 36px 32px",
        animation: shakeErr ? "shake .4s ease" : "none",
      }}>
        {step === "login" ? (
          <>
            {/* ── Logo ── */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 14,
                  background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 24px rgba(99,102,241,0.5)",
                  animation: "logoPulse 3s ease-in-out infinite",
                }}>
                  <Zap size={22} color="#fff" />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#F1F5F9", letterSpacing: -0.5 }}>
                    Verba<span style={{ color: "#6366F1" }}>Tech</span>
                  </div>
                  <div style={{ fontSize: 9, color: "#4ADE80", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
                    Corban Platform
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "#64748B" }}>
                Acesse sua conta para continuar
              </p>
            </div>

            {/* ── Quick Select Perfis ── */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: 0.7, marginBottom: 10 }}>
                Selecionar perfil (demo)
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PERFIS.map(p => {
                  const Icon = p.icon;
                  const isActive = email === p.email;
                  return (
                    <button key={p.role} onClick={() => handleFillDemo(p)} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "11px 14px", borderRadius: 12, cursor: "pointer",
                      background: isActive
                        ? `linear-gradient(135deg, ${p.color}18, rgba(255,255,255,0.04))`
                        : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isActive ? p.color + "44" : "rgba(255,255,255,0.08)"}`,
                      transition: "all .2s",
                      transform: isActive ? "translateX(4px)" : "none",
                      boxShadow: isActive ? `0 4px 20px ${p.color}20` : "none",
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: p.grad,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={17} color="#fff" />
                      </div>
                      <div style={{ textAlign: "left", flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700,
                          color: isActive ? p.color : "#E2E8F0" }}>{p.label}</div>
                        <div style={{ fontSize: 10, color: "#64748B" }}>{p.desc}</div>
                      </div>
                      {isActive && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <CheckCircle size={14} color={p.color} />
                          <span style={{ fontSize: 9, fontWeight: 700, color: p.color }}>Selecionado</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── divider ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontSize: 10, color: "#334155", fontWeight: 700 }}>OU INSIRA SUAS CREDENCIAIS</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* email */}
              <div>
                <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 7 }}>
                  E-mail
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} color="#475569"
                    style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    required
                    style={{
                      width: "100%", padding: "12px 14px 12px 38px", borderRadius: 11,
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${email ? activeColor + "44" : "rgba(255,255,255,0.1)"}`,
                      color: "#F1F5F9", fontSize: 13, outline: "none",
                      boxSizing: "border-box", transition: "border .2s",
                      boxShadow: email ? `0 0 0 3px ${activeColor}12` : "none",
                    }}
                  />
                </div>
              </div>

              {/* senha */}
              <div>
                <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 7 }}>
                  Senha
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} color="#475569"
                    style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type={showPass ? "text" : "password"} value={senha}
                    onChange={e => setSenha(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    style={{
                      width: "100%", padding: "12px 40px 12px 38px", borderRadius: 11,
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${senha ? activeColor + "44" : "rgba(255,255,255,0.1)"}`,
                      color: "#F1F5F9", fontSize: 13, outline: "none",
                      boxSizing: "border-box", transition: "border .2s",
                      boxShadow: senha ? `0 0 0 3px ${activeColor}12` : "none",
                    }}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 2,
                  }}>
                    {showPass
                      ? <EyeOff size={15} color="#475569" />
                      : <Eye size={15} color="#475569" />}
                  </button>
                </div>
              </div>

              {/* error */}
              {(error || localErr) && (
                <div style={{ display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: 10, padding: "10px 14px" }}>
                  <AlertCircle size={14} color="#EF4444" />
                  <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 600 }}>
                    {error || localErr}
                  </span>
                </div>
              )}

              {/* submit */}
              <button type="submit" disabled={loading} style={{
                padding: "13px", borderRadius: 12, border: "none",
                background: loading
                  ? "rgba(99,102,241,0.4)"
                  : `linear-gradient(135deg, ${activeColor}, ${activeColor}cc)`,
                color: "#fff", fontWeight: 800, fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all .25s",
                boxShadow: loading ? "none" : `0 4px 20px ${activeColor}50`,
                marginTop: 4,
              }}>
                {loading ? (
                  <LoadingDots color="#fff" />
                ) : (
                  <><Lock size={15} /> Entrar na Plataforma</>
                )}
              </button>
            </form>

            {/* ── Credenciais demo ── */}
            <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12,
              background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
              <p style={{ fontSize: 10, color: "#6366F1", fontWeight: 800, textTransform: "uppercase",
                letterSpacing: 0.7, margin: "0 0 10px" }}>
                Credenciais Demo
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {DEMO_ACCOUNTS.map(a => (
                  <div key={a.id} style={{ display: "flex", justifyContent: "space-between",
                    fontSize: 10, fontFamily: "monospace" }}>
                    <span style={{ color: "#64748B" }}>{a.role === "admin" ? "Admin" : a.role === "master" ? "Master" : "Funcionário"}</span>
                    <span style={{ color: "#94A3B8" }}>{a.email}</span>
                    <span style={{ color: "#6366F1" }}>{a.senha}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <TwoFAStep
            user={pendingUser}
            onConfirm={handleTwoFA}
            onBack={() => { setStep("login"); setPendingUser(null); }}
            loading={twoFALoading}
          />
        )}
      </div>

      {/* ── footer ── */}
      <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontSize: 10, color: "#1E293B" }}>
          VerbaTech © 2024 · LGPD Compliant · BACEN Regulado
        </span>
      </div>

      <style>{`
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(20px,-20px) scale(1.05); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-15px,15px) scale(1.08); }
        }
        @keyframes logoPulse {
          0%,100% { box-shadow: 0 0 24px rgba(99,102,241,0.5); }
          50%      { box-shadow: 0 0 40px rgba(99,102,241,0.8); }
        }
        @keyframes dotBounce {
          0%,80%,100% { transform: scale(0.8); opacity: 0.5; }
          40%          { transform: scale(1.2); opacity: 1; }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-5px); }
          80%      { transform: translateX(5px); }
        }
        input::placeholder { color: #334155; }
        input:focus { border-color: rgba(99,102,241,0.5) !important;
                      box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; }
      `}</style>
    </div>
  );
}
