import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

// Pages
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
import DashboardAdmin       from "./pages/DashboardAdmin";
import DashboardFuncionario from "./pages/DashboardFuncionario";

/* ─────────────────────────────────────────────────────────────
   Shell MASTER — sidebar + topbar + todas as rotas operacionais
───────────────────────────────────────────────────────────── */
function MasterShell() {
  const [showBalance, setShowBalance] = useState(true);
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar showBalance={showBalance} setShowBalance={setShowBalance} />
        <Routes>
          <Route path="/"              element={<Dashboard      showBalance={showBalance} />} />
          <Route path="/esteira"       element={<Esteira />} />
          <Route path="/corban"        element={<Corban />} />
          <Route path="/produtos"      element={<Produtos />} />
          <Route path="/financeiro"    element={<Financeiro />} />
          <Route path="/compliance"    element={<Compliance />} />
          <Route path="/credito"       element={<Credito        showBalance={showBalance} />} />
          <Route path="/reequilibrio"  element={<Reequilibrio />} />
          <Route path="/educacao"      element={<Educacao />} />
          <Route path="/perfil"        element={<Perfil         showBalance={showBalance} />} />
          <Route path="/produtividade" element={<Produtividade />} />
          <Route path="/seguros"       element={<Seguros />} />
          <Route path="/campanhas"     element={<Campanhas />} />
          <Route path="/seguranca"     element={<Seguranca />} />
          <Route path="/baas"          element={<BaaS />} />
          <Route path="/ccb"           element={<CCB />} />
          <Route path="/fidc"          element={<FIDC />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Shell ADMIN — MESMA SIDEBAR + TOPBAR que o Master
   A home do admin é DashboardAdmin (painel global)
   Admin também acessa todas as páginas operacionais
───────────────────────────────────────────────────────────── */
function AdminShell() {
  const [showBalance, setShowBalance] = useState(true);
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar showBalance={showBalance} setShowBalance={setShowBalance} />
        <Routes>
          {/* Home do admin = DashboardAdmin */}
          <Route path="/"              element={<DashboardAdmin />} />
          <Route path="/admin"         element={<DashboardAdmin />} />
          {/* Admin acessa todas as páginas */}
          <Route path="/esteira"       element={<Esteira />} />
          <Route path="/corban"        element={<Corban />} />
          <Route path="/produtos"      element={<Produtos />} />
          <Route path="/financeiro"    element={<Financeiro />} />
          <Route path="/compliance"    element={<Compliance />} />
          <Route path="/credito"       element={<Credito        showBalance={showBalance} />} />
          <Route path="/reequilibrio"  element={<Reequilibrio />} />
          <Route path="/educacao"      element={<Educacao />} />
          <Route path="/perfil"        element={<Perfil         showBalance={showBalance} />} />
          <Route path="/produtividade" element={<Produtividade />} />
          <Route path="/seguros"       element={<Seguros />} />
          <Route path="/campanhas"     element={<Campanhas />} />
          <Route path="/seguranca"     element={<Seguranca />} />
          <Route path="/baas"          element={<BaaS />} />
          <Route path="/ccb"           element={<CCB />} />
          <Route path="/fidc"          element={<FIDC />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Router raiz — decide qual shell usar por role
───────────────────────────────────────────────────────────── */
function AppRouter() {
  const { user } = useAuth();

  // Não autenticado → login
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*"      element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // ADMIN → shell completo COM sidebar (igual ao Master, home = DashboardAdmin)
  if (user.role === "admin") {
    return (
      <Routes>
        <Route path="/*" element={<AdminShell />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // FUNCIONÁRIO → dashboard próprio (sem sidebar)
  if (user.role === "funcionario") {
    return (
      <Routes>
        <Route path="/func" element={<DashboardFuncionario />} />
        <Route path="*"     element={<Navigate to="/func" replace />} />
      </Routes>
    );
  }

  // MASTER → shell completo com sidebar + topbar
  return (
    <Routes>
      <Route path="/*" element={<MasterShell />} />
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
