import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Esteira from "./pages/Esteira";
import Corban from "./pages/Corban";
import Produtos from "./pages/Produtos";
import Financeiro from "./pages/Financeiro";
import Compliance from "./pages/Compliance";
import Credito from "./pages/Credito";
import Reequilibrio from "./pages/Reequilibrio";
import Educacao from "./pages/Educacao";
import Perfil from "./pages/Perfil";
import Produtividade from "./pages/Produtividade";
import Seguros from "./pages/Seguros";
import Campanhas from "./pages/Campanhas";
import Seguranca from "./pages/Seguranca";

function AppShell() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar showBalance={showBalance} setShowBalance={setShowBalance} />
        <Routes>
          <Route path="/"               element={<Dashboard   showBalance={showBalance} />} />
          <Route path="/esteira"        element={<Esteira />} />
          <Route path="/corban"         element={<Corban />} />
          <Route path="/produtos"       element={<Produtos />} />
          <Route path="/financeiro"     element={<Financeiro />} />
          <Route path="/compliance"     element={<Compliance />} />
          <Route path="/credito"        element={<Credito     showBalance={showBalance} />} />
          <Route path="/reequilibrio"   element={<Reequilibrio />} />
          <Route path="/educacao"       element={<Educacao />} />
          <Route path="/perfil"         element={<Perfil showBalance={showBalance} />} />
          <Route path="/produtividade"  element={<Produtividade />} />
          <Route path="/seguros"        element={<Seguros />} />
          <Route path="/campanhas"      element={<Campanhas />} />
          <Route path="/seguranca"      element={<Seguranca />} />
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
