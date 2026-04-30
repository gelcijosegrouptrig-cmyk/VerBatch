import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import Credito from "./pages/Credito";
import Reequilibrio from "./pages/Reequilibrio";
import Educacao from "./pages/Educacao";
import Perfil from "./pages/Perfil";

function AppShell() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/credito" element={<Credito />} />
        <Route path="/reequilibrio" element={<Reequilibrio />} />
        <Route path="/educacao" element={<Educacao />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <BottomNav />
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
