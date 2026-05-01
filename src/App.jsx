import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import RoleGuard from "./components/RoleGuard";

// Pages
import Login            from "./pages/Login";
import Dashboard        from "./pages/Dashboard";
import Esteira          from "./pages/Esteira";
import Corban           from "./pages/Corban";
import Produtos         from "./pages/Produtos";
import Financeiro       from "./pages/Financeiro";
import Compliance       from "./pages/Compliance";
import Credito          from "./pages/Credito";
import Reequilibrio     from "./pages/Reequilibrio";
import Educacao         from "./pages/Educacao";
import Perfil           from "./pages/Perfil";
import Produtividade    from "./pages/Produtividade";
import Seguros          from "./pages/Seguros";
import Campanhas        from "./pages/Campanhas";
import Seguranca        from "./pages/Seguranca";
import DashboardAdmin   from "./pages/DashboardAdmin";
import DashboardFuncionario from "./pages/DashboardFuncionario";

/* ── Shell para Master (sidebar + topbar completo) ── */
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
          {/* fallback */}
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

/* ── Router raiz (decide shell por role) ── */
function AppRouter() {
  const { user } = useAuth();

  // se não está logado e não está em /login → redireciona
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*"      element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // ADMIN → painel próprio sem sidebar padrão
  if (user.role === "admin") {
    return (
      <Routes>
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="*"      element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // FUNCIONÁRIO → dashboard próprio sem sidebar padrão
  if (user.role === "funcionario") {
    return (
      <Routes>
        <Route path="/func"  element={<DashboardFuncionario />} />
        <Route path="*"      element={<Navigate to="/func" replace />} />
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
