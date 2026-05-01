// VerbaTech — Landing Page (Página Inicial Pública)
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, Shield, TrendingUp, Users, FileText, Globe, ArrowRight,
  CheckCircle, Star, BarChart2, Lock, Smartphone, ChevronDown,
  Play, Award, Building2, Landmark, PieChart, CreditCard,
  ArrowUpRight, Menu, X, Wifi, DollarSign, Target, Layers,
} from "lucide-react";

/* ── Animação de número ── */
function AnimNum({ target, prefix = "", suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(ease * target));
        if (p < 1) requestAnimationFrame(tick);
        else setVal(target);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString("pt-BR")}{suffix}</span>;
}

/* ── Partículas de fundo ── */
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    dur: Math.random() * 8 + 6,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: "50%",
          background: `rgba(99,102,241,${Math.random() * 0.4 + 0.1})`,
          animation: `float-particle ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
        }} />
      ))}
    </div>
  );
}

const FEATURES = [
  { icon: Landmark,   color: "#6366F1", title: "BaaS Integrado",         desc: "Conta Master + Subcontas com split automático. Segregação financeira sem dupla tributação." },
  { icon: FileText,   color: "#10B981", title: "CCB Digital",             desc: "Emissão, assinatura eletrônica e formalização 100% digital. Biometria facial e consentimento WhatsApp." },
  { icon: PieChart,   color: "#F59E0B", title: "FIDC Próprio",            desc: "Fundo de Investimento em Direitos Creditórios integrado. Cessão automática de carteira." },
  { icon: Shield,     color: "#EF4444", title: "Compliance & IA",         desc: "Motor de análise em tempo real. Score de risco, alerta de fraude e auditoria automática." },
  { icon: BarChart2,  color: "#8B5CF6", title: "CRM Corban Multinível",   desc: "Hierarquia Admin → Corban → Sub-Corban → Agente. Comissões automáticas por nível." },
  { icon: Globe,      color: "#06B6D4", title: "APIs & Integrações",      desc: "INSS/Dataprev, SIAPE, Receita Federal, Serasa. Conexão direta via API REST certificada." },
  { icon: CreditCard, color: "#EC4899", title: "Crédito Consignado",      desc: "Gestão completa INSS/FGTS/Governo. Margem em tempo real, averbação automática." },
  { icon: TrendingUp, color: "#4ADE80", title: "Dashboard em Tempo Real", desc: "KPIs, metas, produção e comissões ao vivo. Relatórios automáticos por período." },
];

const PLANS = [
  {
    name: "Starter",
    price: "R$ 497",
    period: "/mês",
    color: "#6366F1",
    desc: "Para Corbans iniciando operação",
    features: [
      "Até 3 usuários",
      "Esteira de propostas",
      "Integração INSS básica",
      "Dashboard de produção",
      "Suporte via chat",
    ],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Professional",
    price: "R$ 1.497",
    period: "/mês",
    color: "#10B981",
    desc: "Para operações em crescimento",
    features: [
      "Até 15 usuários",
      "BaaS + Split automático",
      "CCB Digital",
      "Compliance & IA",
      "CRM Corban multinível",
      "APIs INSS + FGTS + SIAPE",
      "Suporte prioritário",
    ],
    cta: "Mais popular",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    color: "#F59E0B",
    desc: "Para grandes redes Corban",
    features: [
      "Usuários ilimitados",
      "FIDC próprio integrado",
      "SCD/SEP white-label",
      "Sub-Corbans ilimitados",
      "Integrações customizadas",
      "Gerente de conta dedicado",
      "SLA 99.9% garantido",
    ],
    cta: "Falar com vendas",
    highlight: false,
  },
];

const TESTIMONIALS = [
  { name: "Marcos Oliveira", role: "CEO · Credimax Corban", text: "A VerbaTech revolucionou nossa operação. Crescemos 340% em produção em 8 meses sem aumentar nossa equipe.", stars: 5 },
  { name: "Patricia Lima",   role: "Diretora · FinanSul",  text: "A gestão de comissões automática eliminou 100% dos erros de repasse. Nosso time confia nos números agora.", stars: 5 },
  { name: "Roberto Mendes",  role: "Sócio · MegaCredito",  text: "O compliance com IA nos salvou de várias propostas fraudulentas. Plataforma indispensável para quem opera em escala.", stars: 5 },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#05080F", color: "#F1F5F9", fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05080F; }
        @keyframes float-particle {
          from { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          to   { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
        }
        @keyframes hero-glow {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-text { animation: fadeInUp .8s ease both; }
        .hero-text-2 { animation: fadeInUp .8s .15s ease both; }
        .hero-text-3 { animation: fadeInUp .8s .3s ease both; }
        .hero-btns  { animation: fadeInUp .8s .45s ease both; }
        .feature-card:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important; }
        .plan-card:hover { transform: translateY(-4px); }
        .nav-link { color: #94A3B8; font-size: 14px; font-weight: 500; cursor: pointer; transition: color .2s; background: none; border: none; }
        .nav-link:hover { color: #F1F5F9; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #05080F; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 3px; }
      `}</style>

      {/* ═══════════════════════════ NAVBAR ═══════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 5vw", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(5,8,15,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all .3s",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(99,102,241,0.5)",
          }}>
            <Zap size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#F1F5F9", letterSpacing: -0.5 }}>
            Verba<span style={{ color: "#6366F1" }}>Tech</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          {[["Produto","features"],["Planos","plans"],["Depoimentos","testimonials"],["Sobre","about"]].map(([l, id]) => (
            <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{l}</button>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => navigate("/login")} style={{
            padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600,
            background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
            color: "#CBD5E1", cursor: "pointer", transition: "all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366F1"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#CBD5E1"; }}
          >
            Entrar
          </button>
          <button onClick={() => navigate("/login")} style={{
            padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 700,
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            border: "none", color: "#fff", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            transition: "all .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 28px rgba(99,102,241,0.6)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.4)"}
          >
            Demo grátis →
          </button>
          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(v => !v)} style={{
            display: "none", background: "none", border: "none", color: "#fff", cursor: "pointer",
          }} className="mobile-menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 5vw 60px", overflow: "hidden" }}>
        {/* BG glows */}
        <div style={{ position: "absolute", top: "10%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", animation: "hero-glow 6s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", animation: "hero-glow 8s 2s ease-in-out infinite", pointerEvents: "none" }} />
        <Particles />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 860 }}>
          {/* Badge */}
          <div className="hero-text" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", animation: "pulse-dot 2s infinite" }} />
            <span style={{ fontSize: 12, color: "#A5B4FC", fontWeight: 700, letterSpacing: 0.5 }}>PLATAFORMA CORBAN #1 DO BRASIL</span>
          </div>

          {/* Headline */}
          <h1 className="hero-text-2" style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, marginBottom: 24 }}>
            A plataforma que{" "}
            <span style={{
              background: "linear-gradient(135deg,#6366F1,#8B5CF6,#06B6D4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              transforma seu Corban
            </span>
            <br />em uma fintech completa
          </h1>

          {/* Sub */}
          <p className="hero-text-3" style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#64748B", lineHeight: 1.7, marginBottom: 40, maxWidth: 620, margin: "0 auto 40px" }}>
            CRM, BaaS, CCB Digital, FIDC, Compliance com IA e gestão multinível de Corbans — tudo em uma única plataforma integrada para crédito consignado.
          </p>

          {/* CTAs */}
          <div className="hero-btns" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <button onClick={() => navigate("/login")} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              border: "none", color: "#fff", cursor: "pointer",
              boxShadow: "0 8px 32px rgba(99,102,241,0.45)",
              transition: "all .2s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              <Play size={16} fill="#fff" /> Acessar plataforma
            </button>
            <button onClick={() => scrollTo("features")} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
              color: "#CBD5E1", cursor: "pointer", transition: "all .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "none"; }}
            >
              Ver funcionalidades <ChevronDown size={16} />
            </button>
          </div>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: 0, justifyContent: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", maxWidth: 680, margin: "0 auto" }}>
            {[
              { label: "Corbans ativos",    value: 1200,  suffix: "+"   },
              { label: "Contratos/mês",     value: 45000, suffix: "+"   },
              { label: "Em produção (R$)",  value: 980,   prefix: "R$ ", suffix: "M+" },
              { label: "Uptime SLA",        value: 99,    suffix: ".9%" },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: "20px 12px", textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}>
                <div style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 900, color: "#F1F5F9", marginBottom: 4 }}>
                  <AnimNum target={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} />
                </div>
                <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.4, cursor: "pointer" }} onClick={() => scrollTo("features")}>
          <span style={{ fontSize: 10, color: "#64748B", letterSpacing: 1, textTransform: "uppercase" }}>Rolar</span>
          <ChevronDown size={16} color="#64748B" />
        </div>
      </section>

      {/* ═══════════════════════════ FEATURES ═══════════════════════════ */}
      <section id="features" style={{ padding: "100px 5vw" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 100, padding: "5px 16px", marginBottom: 16 }}>
            <span style={{ fontSize: 11, color: "#4ADE80", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Funcionalidades</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, marginBottom: 16, letterSpacing: -1 }}>
            Tudo que seu Corban precisa
            <br /><span style={{ color: "#6366F1" }}>em uma única plataforma</span>
          </h2>
          <p style={{ fontSize: 16, color: "#64748B", maxWidth: 520, margin: "0 auto" }}>
            Da originação ao repasse — um ecossistema completo para gestão de crédito consignado.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, maxWidth: 1200, margin: "0 auto" }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "24px 22px", transition: "all .3s", cursor: "default",
            }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: `0 0 20px ${f.color}22` }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */}
      <section style={{ padding: "80px 5vw", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>
              Como funciona o <span style={{ color: "#F59E0B" }}>fluxo completo</span>
            </h2>
            <p style={{ fontSize: 15, color: "#64748B" }}>Do cliente ao repasse — em minutos, não dias.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 2 }}>
            {[
              { step: "01", icon: Users,       color: "#6366F1", title: "Cadastro do Cliente",   desc: "Dados, margem e documentos via app ou tablet" },
              { step: "02", icon: Shield,       color: "#10B981", title: "Análise IA",            desc: "Score, compliance e consulta Dataprev em segundos" },
              { step: "03", icon: FileText,     color: "#F59E0B", title: "CCB Digital",           desc: "Biometria, assinatura eletrônica e averbação" },
              { step: "04", icon: DollarSign,   color: "#EF4444", title: "Liberação TED/PIX",    desc: "Crédito na conta do cliente em até 24h" },
              { step: "05", icon: TrendingUp,   color: "#8B5CF6", title: "Split de Comissões",   desc: "Repasse automático por nível de hierarquia" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "32px 20px", position: "relative" }}>
                {i < 4 && (
                  <div style={{ position: "absolute", right: 0, top: "40px", width: 2, height: 40, background: "linear-gradient(to bottom, " + s.color + "88, transparent)", display: "none" }} />
                )}
                <div style={{ width: 56, height: 56, borderRadius: 16, background: s.color + "18", border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, position: "relative" }}>
                  <s.icon size={24} color={s.color} />
                  <div style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>{s.step}</div>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", marginBottom: 8 }}>{s.title}</h4>
                <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ PLANS ═══════════════════════════ */}
      <section id="plans" style={{ padding: "100px 5vw" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 100, padding: "5px 16px", marginBottom: 16 }}>
            <span style={{ fontSize: 11, color: "#A5B4FC", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Planos</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>
            Escolha o plano ideal
            <br /><span style={{ color: "#6366F1" }}>para seu Corban</span>
          </h2>
          <p style={{ fontSize: 15, color: "#64748B" }}>Sem taxa de setup. Cancele quando quiser.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, maxWidth: 1000, margin: "0 auto" }}>
          {PLANS.map((plan, i) => (
            <div key={i} className="plan-card" style={{
              background: plan.highlight ? `linear-gradient(135deg,rgba(16,185,129,0.12),rgba(6,182,212,0.08))` : "rgba(255,255,255,0.025)",
              border: plan.highlight ? `2px solid rgba(16,185,129,0.4)` : "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: "32px 28px", position: "relative",
              transition: "all .3s", cursor: "default",
              boxShadow: plan.highlight ? "0 0 60px rgba(16,185,129,0.12)" : "none",
            }}>
              {plan.highlight && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#10B981,#06B6D4)", borderRadius: 100, padding: "4px 18px", fontSize: 11, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>
                  ⭐ MAIS POPULAR
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: plan.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: plan.price.includes("consulta") ? 20 : 36, fontWeight: 900, color: "#F1F5F9" }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: "#64748B" }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 13, color: "#64748B" }}>{plan.desc}</p>
              </div>
              <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckCircle size={15} color={plan.color} />
                    <span style={{ fontSize: 13, color: "#CBD5E1" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/login")} style={{
                width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                background: plan.highlight ? `linear-gradient(135deg,#10B981,#06B6D4)` : `rgba(${plan.color === "#6366F1" ? "99,102,241" : "245,158,11"},0.15)`,
                border: plan.highlight ? "none" : `1px solid ${plan.color}44`,
                color: plan.highlight ? "#fff" : plan.color,
                cursor: "pointer", transition: "all .2s",
                boxShadow: plan.highlight ? "0 4px 20px rgba(16,185,129,0.35)" : "none",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >
                {plan.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ TESTIMONIALS ═══════════════════════════ */}
      <section id="testimonials" style={{ padding: "80px 5vw", background: "rgba(255,255,255,0.012)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>
            O que dizem nossos <span style={{ color: "#F59E0B" }}>clientes</span>
          </h2>
          <p style={{ fontSize: 15, color: "#64748B" }}>+1.200 Corbans confiam na VerbaTech hoje.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, maxWidth: 1000, margin: "0 auto" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 24px" }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={14} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ ABOUT / TECH ═══════════════════════════ */}
      <section id="about" style={{ padding: "100px 5vw" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 100, padding: "5px 16px", marginBottom: 20 }}>
              <span style={{ fontSize: 11, color: "#F87171", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Infraestrutura</span>
            </div>
            <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 900, marginBottom: 20, letterSpacing: -1, lineHeight: 1.2 }}>
              Construído sobre a <span style={{ color: "#6366F1" }}>infraestrutura mais robusta</span> do mercado
            </h2>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.8, marginBottom: 28 }}>
              Integramos os melhores parceiros para garantir compliance, segurança e escala para sua operação de crédito.
            </p>
            {[
              { label: "Banking/BaaS",    partners: "Fitbank · Dock · Matera"       },
              { label: "Core Banking",    partners: "Pismo · Matera · Fintech2B"    },
              { label: "Motor de Crédito",partners: "Tuiv · Credit2B · Neurotech"  },
              { label: "INSS/Gov",        partners: "Dataprev · SIAPE · FGTS Digital" },
              { label: "CRM/COR",         partners: "Newcon · Saks · GYRA+"         },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366F1", flexShrink: 0, boxShadow: "0 0 8px #6366F1" }} />
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", marginRight: 8 }}>{r.label}:</span>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{r.partners}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { icon: Lock,        color: "#6366F1", label: "Criptografia AES-256",   val: "Dados protegidos" },
              { icon: Wifi,        color: "#10B981", label: "Uptime",                  val: "99.9% SLA" },
              { icon: Layers,      color: "#F59E0B", label: "APIs certificadas",       val: "Banco Central" },
              { icon: Award,       color: "#EF4444", label: "LGPD compliance",         val: "100% adequado" },
              { icon: Target,      color: "#8B5CF6", label: "Latência média",          val: "< 200ms" },
              { icon: Building2,   color: "#06B6D4", label: "Arquitetura",             val: "Microserviços" },
            ].map((c, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 16px" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: c.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <c.icon size={16} color={c.color} />
                </div>
                <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#F1F5F9" }}>{c.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CTA FINAL ═══════════════════════════ */}
      <section style={{ padding: "80px 5vw", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08),rgba(16,185,129,0.06))", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, border: "0", borderTop: "1px solid rgba(99,102,241,0.2)", borderBottom: "1px solid rgba(99,102,241,0.2)", pointerEvents: "none" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 660, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 900, marginBottom: 16, letterSpacing: -1, lineHeight: 1.15 }}>
            Pronto para <span style={{ background: "linear-gradient(135deg,#6366F1,#8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>turbinar seu Corban</span>?
          </h2>
          <p style={{ fontSize: 16, color: "#64748B", marginBottom: 40, lineHeight: 1.7 }}>
            Acesse agora a demo com dados reais. Sem cartão de crédito. Sem compromisso.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/login")} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "16px 40px", borderRadius: 14, fontSize: 16, fontWeight: 800,
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              border: "none", color: "#fff", cursor: "pointer",
              boxShadow: "0 8px 40px rgba(99,102,241,0.5)",
              transition: "all .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 50px rgba(99,102,241,0.65)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(99,102,241,0.5)"; }}
            >
              <Zap size={18} /> Acessar plataforma agora
            </button>
          </div>
          <p style={{ marginTop: 20, fontSize: 12, color: "#334155" }}>
            ✓ Acesso imediato &nbsp;·&nbsp; ✓ Dados demo realistas &nbsp;·&nbsp; ✓ Sem instalação
          </p>
        </div>
      </section>

      {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
      <footer style={{ padding: "40px 5vw 28px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#F1F5F9" }}>Verba<span style={{ color: "#6366F1" }}>Tech</span></span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Produto","Planos","API Docs","Suporte","LGPD"].map(l => (
              <span key={l} style={{ fontSize: 13, color: "#475569", cursor: "pointer", transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#94A3B8"}
                onMouseLeave={e => e.currentTarget.style.color = "#475569"}
              >{l}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, color: "#1E293B" }}>© 2025 VerbaTech Plataforma Corban. Todos os direitos reservados.</p>
          <p style={{ fontSize: 11, color: "#1E293B" }}>Regulado pelo Banco Central · LGPD compliant · ISO 27001</p>
        </div>
      </footer>

    </div>
  );
}
