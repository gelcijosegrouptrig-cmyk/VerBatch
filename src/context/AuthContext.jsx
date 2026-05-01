// VerbaTech — AuthContext (Global Auth State)
import { createContext, useContext, useState, useCallback } from "react";

export const AuthContext = createContext(null);

// ─── Contas demo para cada perfil ───────────────────────────
export const DEMO_ACCOUNTS = [
  {
    id: "usr_admin",
    email: "admin@verbatech.com.br",
    senha: "Admin@2024",
    nome: "Carlos Administrativo",
    role: "admin",
    nivel: "Diamante",
    avatar: "CA",
    empresa: "VerbaTech S.A.",
    cnpj: "00.001.234/0001-01",
    loja: "Sede — São Paulo/SP",
    telefone: "(11) 3000-0001",
    saldoConta: 0,
    comissaoMes: 0,
    comissaoPendente: 0,
    permissoes: ["dashboard_admin", "usuarios", "corbans", "relatorios", "compliance",
                 "financeiro_global", "seguranca", "configuracoes", "campanhas"],
    twoFA: true, twoFAMetodo: "app",
    ultimoLogin: "2024-04-30 09:00",
  },
  {
    id: "usr_master",
    email: "ricardo@verbatech.com.br",
    senha: "Master@2024",
    nome: "Ricardo Mendes",
    role: "master",
    nivel: "Diamante",
    avatar: "RM",
    empresa: "VerbaTech Financeira",
    cnpj: "12.345.678/0001-99",
    loja: "Matriz — São Paulo/SP",
    telefone: "(11) 99999-1234",
    saldoConta: 42750.80,
    comissaoMes: 23410.50,
    comissaoPendente: 8320.00,
    permissoes: ["dashboard", "esteira", "corban", "produtos", "financeiro",
                 "compliance", "produtividade", "seguros", "campanhas", "seguranca"],
    twoFA: true, twoFAMetodo: "app",
    ultimoLogin: "2024-04-30 09:12",
  },
  {
    id: "usr_func",
    email: "ana@verbatech.com.br",
    senha: "Func@2024",
    nome: "Ana Paula Santos",
    role: "funcionario",
    nivel: "Ouro",
    avatar: "AP",
    empresa: "VerbaTech Financeira",
    cnpj: "12.345.678/0001-99",
    loja: "SP-Centro",
    masterId: "usr_master",
    masterNome: "Ricardo Mendes",
    telefone: "(11) 98888-5678",
    saldoConta: 0,
    comissaoMes: 4820.00,
    comissaoPendente: 1240.00,
    permissoes: ["dashboard_func", "esteira", "propostas", "clientes"],
    twoFA: true, twoFAMetodo: "sms",
    ultimoLogin: "2024-04-30 08:45",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const login = useCallback(async (email, senha) => {
    setLoading(true);
    setError("");
    // simula delay de API
    await new Promise(r => setTimeout(r, 900));
    const found = DEMO_ACCOUNTS.find(
      a => a.email.toLowerCase() === email.toLowerCase().trim() && a.senha === senha
    );
    if (found) {
      setUser({ ...found, loginAt: new Date().toISOString() });
      setLoading(false);
      return { ok: true, role: found.role };
    } else {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return { ok: false };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError("");
  }, []);

  const hasPermission = useCallback((perm) => {
    if (!user) return false;
    return user.permissoes.includes(perm);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
