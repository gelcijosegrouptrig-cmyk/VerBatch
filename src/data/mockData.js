// VerBatch — Mock Data & AI Rules Engine

export const mockUser = {
  name: "Carlos Silva",
  cpf: "***.***.***-12",
  tipo: "INSS",
  matricula: "1234567",
  salarioBruto: 3200,
  salarioLiquido: 2650,
  margemDisponivel: 780,
  margemUsada: 560,
  margemTotal: 1340,
  score: 68,
  scoreLabel: "Regular",
  avatar: null,
};

export const mockDividas = [
  {
    id: 1,
    banco: "Banco do Brasil",
    tipo: "Consignado",
    parcela: 320,
    saldo: 8400,
    taxa: 1.72,
    prazo: 36,
    status: "ativo",
  },
  {
    id: 2,
    banco: "Nubank",
    tipo: "Cartão de Crédito",
    parcela: 0,
    saldo: 2100,
    taxa: 15.9,
    prazo: 0,
    status: "rotativo",
  },
  {
    id: 3,
    banco: "Caixa Econômica",
    tipo: "Empréstimo Pessoal",
    parcela: 240,
    saldo: 5200,
    taxa: 3.8,
    prazo: 24,
    status: "ativo",
  },
];

export const mockOfertas = [
  {
    id: 1,
    banco: "VerBatch Credit",
    tipo: "Consignado",
    valor: 15000,
    taxa: 1.45,
    prazo: 72,
    parcela: 298,
    destaque: true,
    badge: "Melhor Oferta",
  },
  {
    id: 2,
    banco: "Parceiro A",
    tipo: "Consignado",
    valor: 10000,
    taxa: 1.58,
    prazo: 60,
    parcela: 241,
    destaque: false,
    badge: null,
  },
  {
    id: 3,
    banco: "Parceiro B",
    tipo: "Consignado",
    valor: 8000,
    taxa: 1.63,
    prazo: 48,
    parcela: 235,
    destaque: false,
    badge: "Aprovação Rápida",
  },
];

export const mockTransacoes = [
  { id: 1, desc: "Parcela Consignado BB", valor: -320, data: "28/04", tipo: "debito" },
  { id: 2, desc: "Crédito Salário INSS", valor: 2650, data: "25/04", tipo: "credito" },
  { id: 3, desc: "Antecipação Recebível", valor: 500, data: "22/04", tipo: "credito" },
  { id: 4, desc: "Parcela Caixa", valor: -240, data: "20/04", tipo: "debito" },
  { id: 5, desc: "Fatura Nubank", valor: -320, data: "15/04", tipo: "debito" },
];

export const mockMetas = [
  { id: 1, titulo: "Quitar Nubank", progresso: 42, meta: 2100, atual: 882, prazo: "Jun/2025" },
  { id: 2, titulo: "Reserva emergência", progresso: 28, meta: 5000, atual: 1400, prazo: "Dez/2025" },
];

export const mockLicoes = [
  {
    id: 1,
    titulo: "O que é Margem Consignável?",
    duracao: "2 min",
    pontos: 50,
    categoria: "Consignado",
    concluido: true,
    emoji: "📋",
  },
  {
    id: 2,
    titulo: "Como o juros rotativo te destrói",
    duracao: "3 min",
    pontos: 80,
    categoria: "Cartão",
    concluido: true,
    emoji: "💳",
  },
  {
    id: 3,
    titulo: "Portabilidade: troque e economize",
    duracao: "4 min",
    pontos: 100,
    categoria: "Crédito",
    concluido: false,
    emoji: "🔄",
  },
  {
    id: 4,
    titulo: "Reserva de Emergência: como montar",
    duracao: "5 min",
    pontos: 120,
    categoria: "Poupança",
    concluido: false,
    emoji: "🛡️",
  },
  {
    id: 5,
    titulo: "Score de Crédito: como subir rápido",
    duracao: "4 min",
    pontos: 100,
    categoria: "Score",
    concluido: false,
    emoji: "⬆️",
  },
];

export const mockGraficoGastos = [
  { mes: "Nov", gasto: 560, receita: 2650 },
  { mes: "Dez", gasto: 620, receita: 2650 },
  { mes: "Jan", gasto: 580, receita: 2650 },
  { mes: "Fev", gasto: 560, receita: 2650 },
  { mes: "Mar", gasto: 600, receita: 2650 },
  { mes: "Abr", gasto: 560, receita: 2650 },
];

// ============================================================
// 🧠 IA RULES ENGINE — Motor de Regras de Anti-Endividamento
// ============================================================

export function runAIRules(user, dividas) {
  const alertas = [];

  // Regra 1: Comprometimento de renda alto
  const comprometimento = (user.margemUsada / user.salarioLiquido) * 100;
  if (comprometimento > 35) {
    alertas.push({
      id: "R001",
      nivel: "danger",
      titulo: "Renda comprometida acima de 35%",
      descricao: `Você está comprometendo ${comprometimento.toFixed(0)}% da sua renda com dívidas. Isso é um sinal de alerta.`,
      acao: "Ver opções de reequilíbrio",
      rota: "/reequilibrio",
      emoji: "🚨",
    });
  }

  // Regra 2: Juros alto no cartão de crédito
  const cartoesRotativos = dividas.filter(d => d.tipo === "Cartão de Crédito" && d.taxa > 10);
  if (cartoesRotativos.length > 0) {
    const totalRotativo = cartoesRotativos.reduce((acc, c) => acc + c.saldo, 0);
    alertas.push({
      id: "R002",
      nivel: "danger",
      titulo: "Juros do cartão estão te consumindo",
      descricao: `R$ ${totalRotativo.toLocaleString("pt-BR")} no rotativo a ${cartoesRotativos[0].taxa}% ao mês. Troque por consignado agora.`,
      acao: "Trocar por consignado",
      rota: "/credito",
      emoji: "💳",
    });
  }

  // Regra 3: Empréstimo pessoal com taxa maior que consignado
  const emprestimosCaros = dividas.filter(d => d.tipo === "Empréstimo Pessoal" && d.taxa > 2.5);
  if (emprestimosCaros.length > 0) {
    alertas.push({
      id: "R003",
      nivel: "warning",
      titulo: "Empréstimo com taxa alta detectado",
      descricao: `Você paga ${emprestimosCaros[0].taxa}% a.m. no empréstimo. Com consignado, pagaria menos de 1.5%.`,
      acao: "Simular portabilidade",
      rota: "/reequilibrio",
      emoji: "⚠️",
    });
  }

  // Regra 4: Margem disponível — oportunidade de crédito
  if (user.margemDisponivel > 500 && comprometimento < 30) {
    alertas.push({
      id: "R004",
      nivel: "success",
      titulo: "Você tem margem disponível",
      descricao: `R$ ${user.margemDisponivel.toLocaleString("pt-BR")} de margem livre. Ideal para projetos ou reserva de emergência.`,
      acao: "Ver crédito disponível",
      rota: "/credito",
      emoji: "✅",
    });
  }

  // Regra 5: Score baixo
  if (user.score < 70) {
    alertas.push({
      id: "R005",
      nivel: "warning",
      titulo: "Score regular — veja como melhorar",
      descricao: `Seu score de ${user.score} pode te custar taxas mais altas. Siga as dicas para subir rapidamente.`,
      acao: "Dicas de Score",
      rota: "/educacao",
      emoji: "📊",
    });
  }

  return alertas;
}

export function calcularSaudeFinanceira(user, dividas) {
  const comprometimento = (user.margemUsada / user.salarioLiquido) * 100;
  const totalDividas = dividas.reduce((acc, d) => acc + d.saldo, 0);
  const temRotativo = dividas.some(d => d.tipo === "Cartão de Crédito" && d.taxa > 10);

  let pontos = 100;
  if (comprometimento > 40) pontos -= 30;
  else if (comprometimento > 30) pontos -= 15;
  if (temRotativo) pontos -= 25;
  if (user.score < 60) pontos -= 20;
  else if (user.score < 70) pontos -= 10;
  if (totalDividas > user.salarioLiquido * 12) pontos -= 15;

  pontos = Math.max(0, Math.min(100, pontos));

  let label, cor;
  if (pontos >= 80) { label = "Saudável"; cor = "success"; }
  else if (pontos >= 60) { label = "Regular"; cor = "warning"; }
  else if (pontos >= 40) { label = "Atenção"; cor = "warning"; }
  else { label = "Crítico"; cor = "danger"; }

  return { pontos, label, cor };
}
