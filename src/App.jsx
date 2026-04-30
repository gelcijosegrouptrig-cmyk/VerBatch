import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Credito from "./pages/Credito";
import Reequilibrio from "./pages/Reequilibrio";
import Educacao from "./pages/Educacao";
import Perfil from "./pages/Perfil";

function AppShell() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar showBalance={showBalance} setShowBalance={setShowBalance} />
        <Routes>
          <Route path="/"             element={<Dashboard   showBalance={showBalance} />} />
          <Route path="/credito"      element={<Credito     showBalance={showBalance} />} />
          <Route path="/reequilibrio" element={<Reequilibrio />} />
          <Route path="/educacao"     element={<Educacao />} />
          <Route path="/perfil"       element={<Perfil showBalance={showBalance} />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
