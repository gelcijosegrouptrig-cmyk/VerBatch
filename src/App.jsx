import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Topbar  from "./components/Topbar";

/* ── Pages ─────────────────────────────────────────────── */
import Login                from "./pages/Login";
import Dashboard            from "./pages/Dashboard";
import Esteira              from "./pages/Esteira";
import Corban               from "./pages/Corban";
import Produtos             from "./pages/Produtos";
import Financeiro           from "./pages/Financeiro";
import Compliance           from "./pages/Compliance";
import Credito              from "./pages/Credito";
import Reequilibrio         from "./pages/Reequilibrio";
import Educacao             from "./pages/Educacao";
import Perfil               from "./pages/Perfil";
import Produtividade        from "./pages/Produtividade";
import Seguros              from "./pages/Seguros";
import Campanhas            from "./pages/Campanhas";
import Seguranca            from "./pages/Seguranca";
import BaaS                 from "./pages/BaaS";
import CCB                  from "./pages/CCB";
import FIDC                 from "./pages/FIDC";
import Configuracoes        from "./pages/Configuracoes";
import DashboardAdmin       from "./pages/DashboardAdmin";
import DashboardFuncionario from "./pages/DashboardFuncionario";

/* ─────────────────────────────────────────────────────────
   Shell reutilizável — Sidebar + Topbar + slot de rotas
   Aceita as rotas como children para reaproveitar em todos
   os perfis (admin, master, funcionário)
──────────────────────────────────────────────────────── */
function Shell({ children }) {
  const [showBalance, setShowBalance] = useState(true);
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar showBalance={showBalance} setShowBalance={setShowBalance} />
        <Routes>{children}</Routes>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ROTAS COMUNS — acessíveis por todos os perfis autenticados
──────────────────────────────────────────────────────── */
function RotasComuns({ showBalance }) {
  return (
    <>
      <Route path="/esteira"       element={<Esteira />} />
      <Route path="/produtos"      element={<Produtos />} />
      <Route path="/ccb"           element={<CCB />} />
      <Route path="/produtividade" element={<Produtividade />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   SHELL MASTER — acesso total à plataforma
──────────────────────────────────────────────────────── */
function MasterShell() {
  const [showBalance, setShowBalance] = useState(true);
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar showBalance={showBalance} setShowBalance={setShowBalance} />
        <Routes>
          {/* Home */}
          <Route path="/"              element={<Dashboard     showBalance={showBalance} />} />
          {/* Core */}
          <Route path="/esteira"       element={<Esteira />} />
          <Route path="/corban"        element={<Corban />} />
          <Route path="/produtos"      element={<Produtos />} />
          <Route path="/financeiro"    element={<Financeiro />} />
          <Route path="/compliance"    element={<Compliance />} />
          {/* Pessoal */}
          <Route path="/credito"       element={<Credito      showBalance={showBalance} />} />
          <Route path="/reequilibrio"  element={<Reequilibrio />} />
          <Route path="/educacao"      element={<Educacao />} />
          <Route path="/perfil"        element={<Perfil       showBalance={showBalance} />} />
          {/* BaaS */}
          <Route path="/baas"          element={<BaaS />} />
          <Route path="/ccb"           element={<CCB />} />
          {/* Gestão */}
          <Route path="/produtividade" element={<Produtividade />} />
          <Route path="/seguros"       element={<Seguros />} />
          <Route path="/campanhas"     element={<Campanhas />} />
          <Route path="/seguranca"     element={<Seguranca />} />
          {/* Sistema */}
          <Route path="/configuracoes" element={<Configuracoes />} />
          {/* Fallback */}
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SHELL ADMIN — acesso global + FIDC exclusivo
──────────────────────────────────────────────────────── */
function AdminShell() {
  const [showBalance, setShowBalance] = useState(true);
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar showBalance={showBalance} setShowBalance={setShowBalance} />
        <Routes>
          {/* Home admin = DashboardAdmin */}
          <Route path="/"              element={<DashboardAdmin />} />
          <Route path="/admin"         element={<DashboardAdmin />} />
          {/* Core */}
          <Route path="/esteira"       element={<Esteira />} />
          <Route path="/corban"        element={<Corban />} />
          <Route path="/produtos"      element={<Produtos />} />
          <Route path="/financeiro"    element={<Financeiro />} />
          <Route path="/compliance"    element={<Compliance />} />
          {/* BaaS — Admin tem acesso a TUDO incluindo FIDC */}
          <Route path="/baas"          element={<BaaS />} />
          <Route path="/ccb"           element={<CCB />} />
          <Route path="/fidc"          element={<FIDC />} />
          {/* Gestão */}
          <Route path="/produtividade" element={<Produtividade />} />
          <Route path="/seguros"       element={<Seguros />} />
          <Route path="/campanhas"     element={<Campanhas />} />
          <Route path="/seguranca"     element={<Seguranca />} />
          {/* Pessoal */}
          <Route path="/credito"       element={<Credito      showBalance={showBalance} />} />
          <Route path="/reequilibrio"  element={<Reequilibrio />} />
          <Route path="/educacao"      element={<Educacao />} />
          <Route path="/perfil"        element={<Perfil       showBalance={showBalance} />} />
          {/* Sistema */}
          <Route path="/configuracoes" element={<Configuracoes />} />
          {/* Fallback */}
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SHELL FUNCIONÁRIO — Sidebar + Topbar + rotas permitidas
   Funcionário agora tem menu lateral completo (filtrado por role)
──────────────────────────────────────────────────────── */
function FuncionarioShell() {
  const [showBalance, setShowBalance] = useState(true);
  return (
    <div className="shell">
      <Sidebar />                  {/* Sidebar já filtra itens por role="funcionario" */}
      <div className="main">
        <Topbar showBalance={showBalance} setShowBalance={setShowBalance} />
        <Routes>
          {/* Home do funcionário = DashboardFuncionario */}
          <Route path="/"              element={<DashboardFuncionario />} />
          {/* Rotas permitidas ao funcionário */}
          <Route path="/esteira"       element={<Esteira />} />
          <Route path="/produtos"      element={<Produtos />} />
          <Route path="/ccb"           element={<CCB />} />
          <Route path="/produtividade" element={<Produtividade />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          {/* Acesso negado para rotas restritas → redireciona home */}
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ROUTER RAIZ — decide qual shell usar por role
──────────────────────────────────────────────────────── */
function AppRouter() {
  const { user } = useAuth();

  /* Não autenticado → login */
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*"      element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  /* ADMIN → shell admin com Sidebar filtrada por role="admin" */
  if (user.role === "admin") {
    return (
      <Routes>
        <Route path="/*"     element={<AdminShell />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  /* FUNCIONÁRIO → shell com Sidebar filtrada por role="funcionario" */
  if (user.role === "funcionario") {
    return (
      <Routes>
        <Route path="/*"     element={<FuncionarioShell />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  /* MASTER → shell completo com Sidebar filtrada por role="master" */
  return (
    <Routes>
      <Route path="/*"     element={<MasterShell />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
