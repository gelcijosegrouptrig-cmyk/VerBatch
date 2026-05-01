// VerbaTech — Login Full Screen (split layout)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, Eye, EyeOff, Shield, Lock, Mail, AlertCircle,
  CheckCircle, Crown, Users, TrendingUp, BarChart2,
  FileText, Building2, ArrowRight, Landmark, Star,
} from "lucide-react";
import { useAuth, DEMO_ACCOUNTS } from "../context/AuthContext";

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

const FEATURES = [
  { icon: TrendingUp,  color: "#6366F1", label: "Produção em tempo real"    },
  { icon: FileText,    color: "#10B981", label: "CCB Digital integrado"      },
  { icon: Landmark,    color: "#F59E0B", label: "BaaS + Split automático"    },
  { icon: Shield,      color: "#EF4444", label: "Compliance com IA"          },
  { icon: BarChart2,   color: "#8B5CF6", label: "Dashboard multinível"       },
  { icon: Building2,   color: "#06B6D4", label: "Gestão de rede Corban"      },
];

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

function TwoFAStep({ user, onConfirm, onBack, loading }) {
  const [code, setCode] = useState(["","","","","",""]);
  function handleKey(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...code]; next[i] = val; setCode(next);
    if (val && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
    if (next.every(d => d !== "") && val) setTimeout(() => onConfirm(next.join("")), 80);
  }
  function handleBackspace(i, e) {
    if (e.key === "Backspace" && !code[i] && i > 0) document.getElementById(`otp-${i-1}`)?.focus();
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
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
        <h3 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#F1F5F9" }}>Verificação em 2 Etapas</h3>
        <p style={{ margin: 0, fontSize: 12, color: "#64748B" }}>Demo: qualquer 6 dígitos funciona</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {code.map((digit, i) => (
          <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1}
            value={digit} onChange={e => handleKey(i, e.target.value)}
            onKeyDown={e => handleBackspace(i, e)}
            style={{
              width: 46, height: 56, borderRadius: 12,
              background: digit ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.06)",
              border: `2px solid ${digit ? "#6366F1" : "rgba(255,255,255,0.1)"}`,
              color: "#F1F5F9", fontSize: 22, fontWeight: 800, textAlign: "center",
              outline: "none", transition: "all .2s", caretColor: "transparent",
            }}
          />
        ))}
      </div>
      {loading && <LoadingDots color="#6366F1" />}
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748B", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
        ← Voltar ao login
      </button>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email,    setEmail]    = useState("");
  const [senha,    setSenha]    = useState("");
  const [showPass, setShowPass] = useState(false);
  const [step,     setStep]     = useState("login");
  const [pendingUser, setPendingUser] = useState(null);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [shakeErr, setShakeErr] = useState(false);
  const [statIdx,  setStatIdx]  = useState(0);

  // Rotate stats on left panel
  const STATS = [
    { val: "R$ 980M+", label: "Em produção / mês" },
    { val: "1.200+",   label: "Corbans ativos"    },
    { val: "45.000+",  label: "Contratos / mês"   },
    { val: "99.9%",    label: "Uptime garantido"  },
  ];
  useEffect(() => {
    const id = setInterval(() => setStatIdx(i => (i + 1) % STATS.length), 3000);
    return () => clearInterval(id);
  }, []);

  function triggerShake() { setShakeErr(true); setTimeout(() => setShakeErr(false), 500); }

  async function handleLogin(e) {
    e.preventDefault();
    const result = await login(email, senha);
    if (result.ok) {
      const account = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase().trim());
      if (account?.twoFA) { setPendingUser(account); setStep("2fa"); }
      else redirectByRole(result.role);
    } else { triggerShake(); }
  }

  function handleFillDemo(perfil) { setEmail(perfil.email); setSenha(perfil.senha); }

  async function handleTwoFA(code) {
    setTwoFALoading(true);
    await new Promise(r => setTimeout(r, 700));
    setTwoFALoading(false);
    if (pendingUser) redirectByRole(pendingUser.role);
  }

  function redirectByRole(role) {
    if (role === "admin") navigate("/");
    else if (role === "master") navigate("/");
    else navigate("/");
  }

  const activeColor = PERFIS.find(p => {
    const acc = DEMO_ACCOUNTS.find(a => a.email === email);
    return acc?.role === p.role;
  })?.color || "#6366F1";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#05080F", fontFamily: "'Inter',sans-serif", overflow: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(30px,-30px) scale(1.08); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-20px,20px) scale(1.06); }
        }
        @keyframes orbFloat3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(15px,25px) scale(1.04); }
        }
        @keyframes logoPulse {
          0%,100% { box-shadow: 0 0 28px rgba(99,102,241,0.55); }
          50%      { box-shadow: 0 0 48px rgba(99,102,241,0.85); }
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
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes statFade {
          0%   { opacity: 0; transform: translateY(10px); }
          15%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes gridMove {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(1.5); }
        }
        input::placeholder { color: #2D3748; }
        input:focus {
          border-color: rgba(99,102,241,0.6) !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.18) !important;
          outline: none;
        }
        .perfil-btn:hover { background: rgba(255,255,255,0.07) !important; transform: translateX(3px) !important; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }

        /* Responsive */
        @media (max-width: 768px) {
          .left-panel { display: none !important; }
          .right-panel { width: 100% !important; }
        }
      `}</style>

      {/* ══════════════ LEFT PANEL — Branding ══════════════ */}
      <div className="left-panel" style={{
        flex: 1, position: "relative", overflow: "hidden",
        background: "linear-gradient(145deg, #060C1A 0%, #0A1228 50%, #060C1A 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 52px",
      }}>
        {/* Animated grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.4,
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          animation: "gridMove 8s linear infinite",
        }} />

        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "5%",  left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)", animation: "orbFloat1 10s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)", animation: "orbFloat2 13s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", right: "20%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)", animation: "orbFloat3 9s ease-in-out infinite", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 15,
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 32px rgba(99,102,241,0.6)",
              animation: "logoPulse 3s ease-in-out infinite",
              flexShrink: 0,
            }}>
              <Zap size={24} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#F1F5F9", letterSpacing: -0.8 }}>
                Verba<span style={{ color: "#6366F1" }}>Tech</span>
              </div>
              <div style={{ fontSize: 10, color: "#4ADE80", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                Corban Platform
              </div>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 100, padding: "5px 14px", marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", animation: "pulse-dot 2s infinite" }} />
            <span style={{ fontSize: 11, color: "#A5B4FC", fontWeight: 700, letterSpacing: 0.5 }}>PLATAFORMA #1 DO BRASIL</span>
          </div>

          <h1 style={{ fontSize: "clamp(28px,3.2vw,44px)", fontWeight: 900, color: "#F1F5F9", lineHeight: 1.15, letterSpacing: -1.5, marginBottom: 18 }}>
            A plataforma que<br />
            <span style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              transforma seu Corban
            </span><br />
            em uma fintech
          </h1>

          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.75, marginBottom: 40, maxWidth: 400 }}>
            CRM, BaaS, CCB Digital, FIDC, Compliance com IA e gestão multinível — tudo integrado para crédito consignado.
          </p>

          {/* Feature list */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px", marginBottom: 48 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <f.icon size={13} color={f.color} />
                </div>
                <span style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{f.label}</span>
              </div>
            ))}
          </div>

          {/* Animated stat */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px", overflow: "hidden", position: "relative", minHeight: 80 }}>
            <div key={statIdx} style={{ animation: "statFade 3s ease forwards" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#F1F5F9", letterSpacing: -1, marginBottom: 4 }}>
                {STATS[statIdx].val}
              </div>
              <div style={{ fontSize: 12, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.7 }}>
                {STATS[statIdx].label}
              </div>
            </div>
            {/* dots */}
            <div style={{ position: "absolute", bottom: 14, right: 16, display: "flex", gap: 5 }}>
              {STATS.map((_, i) => (
                <div key={i} style={{ width: i === statIdx ? 16 : 5, height: 5, borderRadius: 3, background: i === statIdx ? "#6366F1" : "rgba(255,255,255,0.1)", transition: "all .4s" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />)}
            <span style={{ fontSize: 12, color: "#64748B", marginLeft: 8 }}>Avaliado por +1.200 Corbans</span>
          </div>
          <p style={{ fontSize: 11, color: "#1E293B" }}>
            © 2025 VerbaTech · LGPD Compliant · Regulado pelo BACEN
          </p>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL — Login Form ══════════════ */}
      <div className="right-panel" style={{
        width: "480px", flexShrink: 0,
        background: "#05080F",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "48px 52px", position: "relative", overflowY: "auto",
        minHeight: "100vh",
      }}>
        {/* subtle bg dots */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(99,102,241,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, animation: shakeErr ? "shake .4s ease" : "fadeUp .5s ease both" }}>

          {step === "login" ? (
            <>
              {/* Header */}
              <div style={{ marginBottom: 36 }}>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: "#F1F5F9", marginBottom: 6, letterSpacing: -0.5 }}>
                  Bem-vindo de volta 👋
                </h2>
                <p style={{ fontSize: 14, color: "#475569" }}>
                  Entre na sua conta para acessar a plataforma
                </p>
              </div>

              {/* Perfil quick select */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 10, color: "#334155", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                  Acesso rápido (demo)
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {PERFIS.map(p => {
                    const Icon = p.icon;
                    const isActive = email === p.email;
                    return (
                      <button key={p.role} className="perfil-btn" onClick={() => handleFillDemo(p)} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                        borderRadius: 12, cursor: "pointer", border: `1px solid ${isActive ? p.color + "44" : "rgba(255,255,255,0.07)"}`,
                        background: isActive ? p.color + "14" : "rgba(255,255,255,0.03)",
                        transition: "all .2s", transform: isActive ? "translateX(4px)" : "none",
                        boxShadow: isActive ? `0 0 20px ${p.color}18` : "none",
                      }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: p.grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={16} color="#fff" />
                        </div>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? p.color : "#CBD5E1" }}>{p.label}</div>
                          <div style={{ fontSize: 10, color: "#475569" }}>{p.desc}</div>
                        </div>
                        {isActive
                          ? <CheckCircle size={15} color={p.color} />
                          : <ArrowRight size={13} color="#334155" />
                        }
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                <span style={{ fontSize: 10, color: "#1E293B", fontWeight: 700 }}>OU INSIRA SUAS CREDENCIAIS</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* E-mail */}
                <div>
                  <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, display: "block", marginBottom: 8 }}>E-mail</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={15} color="#334155" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com" autoComplete="email" required
                      style={{
                        width: "100%", padding: "13px 14px 13px 40px", borderRadius: 12,
                        background: "rgba(255,255,255,0.05)", border: `1.5px solid ${email ? activeColor + "50" : "rgba(255,255,255,0.09)"}`,
                        color: "#F1F5F9", fontSize: 14, transition: "all .2s",
                        boxShadow: email ? `0 0 0 3px ${activeColor}12` : "none",
                      }}
                    />
                  </div>
                </div>

                {/* Senha */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>Senha</label>
                    <span style={{ fontSize: 11, color: "#6366F1", cursor: "pointer", fontWeight: 600 }}>Esqueceu?</span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} color="#334155" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input
                      type={showPass ? "text" : "password"} value={senha} onChange={e => setSenha(e.target.value)}
                      placeholder="••••••••" autoComplete="current-password" required
                      style={{
                        width: "100%", padding: "13px 44px 13px 40px", borderRadius: 12,
                        background: "rgba(255,255,255,0.05)", border: `1.5px solid ${senha ? activeColor + "50" : "rgba(255,255,255,0.09)"}`,
                        color: "#F1F5F9", fontSize: 14, transition: "all .2s",
                        boxShadow: senha ? `0 0 0 3px ${activeColor}12` : "none",
                      }}
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 2 }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{ display: "flex", alignItems: "center", gap: 9, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 14px" }}>
                    <AlertCircle size={14} color="#EF4444" />
                    <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 600 }}>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" className="submit-btn" disabled={loading} style={{
                  padding: "14px", borderRadius: 12, border: "none", marginTop: 4,
                  background: loading ? "rgba(99,102,241,0.4)" : `linear-gradient(135deg,${activeColor},${activeColor}bb)`,
                  color: "#fff", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                  transition: "all .25s",
                  boxShadow: loading ? "none" : `0 6px 28px ${activeColor}45`,
                }}>
                  {loading ? <LoadingDots color="#fff" /> : <><Lock size={16} /> Entrar na Plataforma</>}
                </button>
              </form>

              {/* Credenciais demo */}
              <div style={{ marginTop: 24, padding: "14px 16px", borderRadius: 12, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.14)" }}>
                <p style={{ fontSize: 10, color: "#6366F1", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 10 }}>Credenciais Demo</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {DEMO_ACCOUNTS.map(a => (
                    <div key={a.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "monospace" }}>
                      <span style={{ color: "#475569", minWidth: 70 }}>{a.role === "admin" ? "Admin" : a.role === "master" ? "Master" : "Funcionário"}</span>
                      <span style={{ color: "#64748B", flex: 1, textAlign: "center" }}>{a.email}</span>
                      <span style={{ color: "#6366F1", fontWeight: 700 }}>{a.senha}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <p style={{ marginTop: 24, textAlign: "center", fontSize: 11, color: "#1E293B" }}>
                © 2025 VerbaTech · LGPD · BACEN
              </p>
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
      </div>
    </div>
  );
}
