// VerbaTech — Full Platform Mock Data & Business Logic Engine
// Covers: Corban CRM, Esteira, Produtos, Financeiro, Compliance/IA, Dashboard

// ─────────────────────────────────────────────────────────────
// SESSION / USUÁRIO LOGADO (Corban Master)
// ─────────────────────────────────────────────────────────────
export const mockSession = {
  id: "usr_001",
  name: "Ricardo Mendes",
  role: "master",        // master | agente | sub_agente | admin
  empresa: "VerbaTech Financeira",
  cnpj: "12.345.678/0001-99",
  email: "ricardo@verbatech.com.br",
  telefone: "(11) 99999-1234",
  contaDigital: "VBT-00123-4",
  saldoConta: 42750.80,
  comissaoPendente: 8320.00,
  comissaoMes: 23410.50,
  comissaoAno: 198340.00,
  nivel: "Diamante",
  pontos: 12840,
  avatar: null,
};

// ─────────────────────────────────────────────────────────────
// HIERARQUIA CORBAN (Multinível: Master → Agente → Sub-agente)
// ─────────────────────────────────────────────────────────────
export const mockCorbans = [
  {
    id: "c001", nome: "Ricardo Mendes",     role: "master",
    email: "ricardo@verba.com",       telefone: "(11) 99999-1234",
    cidade: "São Paulo/SP",           ativo: true,
    contratos: 148, producaoMes: 420000, comissaoMes: 12600,
    nivel: "Diamante", parent: null,
    dataCadastro: "2023-03-10",       agentes: 4,
    docStatus: "aprovado",
  },
  {
    id: "c002", nome: "Ana Paula Ferreira", role: "agente",
    email: "ana@verba.com",           telefone: "(21) 98888-5678",
    cidade: "Rio de Janeiro/RJ",      ativo: true,
    contratos: 62,  producaoMes: 186000, comissaoMes: 4650,
    nivel: "Ouro",  parent: "c001",
    dataCadastro: "2023-06-15",       agentes: 2,
    docStatus: "aprovado",
  },
  {
    id: "c003", nome: "Carlos Almeida",     role: "agente",
    email: "carlos@verba.com",        telefone: "(31) 97777-9012",
    cidade: "Belo Horizonte/MG",      ativo: true,
    contratos: 38,  producaoMes: 114000, comissaoMes: 2850,
    nivel: "Prata", parent: "c001",
    dataCadastro: "2023-09-02",       agentes: 1,
    docStatus: "aprovado",
  },
  {
    id: "c004", nome: "Juliana Costa",      role: "sub_agente",
    email: "juliana@verba.com",       telefone: "(21) 96666-3456",
    cidade: "Niterói/RJ",             ativo: true,
    contratos: 24,  producaoMes: 72000,  comissaoMes: 1440,
    nivel: "Bronze",parent: "c002",
    dataCadastro: "2024-01-20",       agentes: 0,
    docStatus: "aprovado",
  },
  {
    id: "c005", nome: "Marcos Oliveira",    role: "sub_agente",
    email: "marcos@verba.com",        telefone: "(21) 95555-7890",
    cidade: "Duque de Caxias/RJ",     ativo: false,
    contratos: 9,   producaoMes: 27000,  comissaoMes: 540,
    nivel: "Bronze",parent: "c002",
    dataCadastro: "2024-03-05",       agentes: 0,
    docStatus: "pendente",
  },
  {
    id: "c006", nome: "Fernanda Lima",      role: "sub_agente",
    email: "fernanda@verba.com",      telefone: "(31) 94444-1122",
    cidade: "Contagem/MG",            ativo: true,
    contratos: 17,  producaoMes: 51000,  comissaoMes: 1020,
    nivel: "Bronze",parent: "c003",
    dataCadastro: "2024-02-12",       agentes: 0,
    docStatus: "em_analise",
  },
  {
    id: "c007", nome: "Paulo Rodrigues",    role: "sub_agente",
    email: "paulo@verba.com",         telefone: "(11) 93333-4455",
    cidade: "Campinas/SP",            ativo: true,
    contratos: 31,  producaoMes: 93000,  comissaoMes: 2325,
    nivel: "Prata", parent: "c001",
    dataCadastro: "2024-04-01",       agentes: 0,
    docStatus: "aprovado",
  },
];

export const nivelConfig = {
  Bronze:   { cor: "#CD7F32", min: 0,      max: 50000,  comissao: 2.0 },
  Prata:    { cor: "#C0C0C0", min: 50001,  max: 150000, comissao: 2.5 },
  Ouro:     { cor: "#FFD700", min: 150001, max: 350000, comissao: 3.0 },
  Diamante: { cor: "#00BFFF", min: 350001, max: Infinity, comissao: 3.5 },
};

// ─────────────────────────────────────────────────────────────
// CLIENTES / TOMADORES
// ─────────────────────────────────────────────────────────────
export const mockClientes = [
  {
    id: "cli001", nome: "Carlos Silva",     cpf: "***.***.***-12",
    tipo: "INSS",    matricula: "1234567",  orgao: "INSS",
    salarioBruto: 3200, salarioLiquido: 2650,
    margemDisponivel: 780, margemUsada: 560, margemTotal: 1340,
    score: 68, scoreLabel: "Regular",
    nascimento: "1965-04-20", cidade: "São Paulo/SP",
    telefone: "(11) 98765-0001", email: "carlos.silva@email.com",
    agente: "c002", dataCadastro: "2024-02-10",
  },
  {
    id: "cli002", nome: "Maria Santos",     cpf: "***.***.***-33",
    tipo: "Servidor", matricula: "8901234", orgao: "Prefeitura SP",
    salarioBruto: 5800, salarioLiquido: 4650,
    margemDisponivel: 1395, margemUsada: 580, margemTotal: 1975,
    score: 82, scoreLabel: "Bom",
    nascimento: "1978-11-02", cidade: "São Paulo/SP",
    telefone: "(11) 97654-0002", email: "maria.s@email.com",
    agente: "c001", dataCadastro: "2024-03-15",
  },
  {
    id: "cli003", nome: "José Pereira",     cpf: "***.***.***-55",
    tipo: "INSS",    matricula: "4567890",  orgao: "INSS",
    salarioBruto: 1900, salarioLiquido: 1650,
    margemDisponivel: 495, margemUsada: 0,  margemTotal: 495,
    score: 74, scoreLabel: "Bom",
    nascimento: "1958-07-30", cidade: "Rio de Janeiro/RJ",
    telefone: "(21) 96543-0003", email: "jose.p@email.com",
    agente: "c002", dataCadastro: "2024-03-28",
  },
  {
    id: "cli004", nome: "Luciana Ferraz",   cpf: "***.***.***-78",
    tipo: "SIAPE",   matricula: "3456789",  orgao: "Ministério Educação",
    salarioBruto: 8200, salarioLiquido: 6380,
    margemDisponivel: 1914, margemUsada: 960, margemTotal: 2874,
    score: 91, scoreLabel: "Excelente",
    nascimento: "1982-01-14", cidade: "Brasília/DF",
    telefone: "(61) 95432-0004", email: "luciana.f@email.com",
    agente: "c003", dataCadastro: "2024-04-02",
  },
  {
    id: "cli005", nome: "Roberto Gomes",    cpf: "***.***.***-90",
    tipo: "INSS",    matricula: "6789012",  orgao: "INSS",
    salarioBruto: 2800, salarioLiquido: 2350,
    margemDisponivel: 320, margemUsada: 385, margemTotal: 705,
    score: 52, scoreLabel: "Regular",
    nascimento: "1961-09-08", cidade: "Belo Horizonte/MG",
    telefone: "(31) 94321-0005", email: "roberto.g@email.com",
    agente: "c006", dataCadastro: "2024-04-10",
  },
];

// ─────────────────────────────────────────────────────────────
// PROPOSTAS / ESTEIRA DE CONTRATAÇÃO
// ─────────────────────────────────────────────────────────────
export const statusFlow = [
  "Digitação", "Análise IA", "Pendência Doc", "Aprovado", "Averbação", "Pago", "Cancelado",
];

export const statusColors = {
  "Digitação":   { bg: "rgba(99,102,241,0.15)",  text: "#818CF8", dot: "#818CF8" },
  "Análise IA":  { bg: "rgba(251,191,36,0.15)",  text: "#FCD34D", dot: "#FCD34D" },
  "Pendência Doc":{ bg: "rgba(249,115,22,0.15)", text: "#FB923C", dot: "#FB923C" },
  "Aprovado":    { bg: "rgba(34,197,94,0.15)",   text: "#4ADE80", dot: "#4ADE80" },
  "Averbação":   { bg: "rgba(56,189,248,0.15)",  text: "#38BDF8", dot: "#38BDF8" },
  "Pago":        { bg: "rgba(20,184,166,0.15)",  text: "#2DD4BF", dot: "#2DD4BF" },
  "Cancelado":   { bg: "rgba(239,68,68,0.15)",   text: "#F87171", dot: "#F87171" },
};

export const mockPropostas = [
  {
    id: "VBT-2024-001", clienteId: "cli001", cliente: "Carlos Silva",
    produto: "Consignado INSS", valor: 15000, parcela: 320.50,
    prazo: 60, taxa: 1.72, orgao: "INSS", matricula: "1234567",
    status: "Pago", agente: "Ana Paula Ferreira", agenteId: "c002",
    comissao: 450, dataDigitacao: "2024-02-15", dataAprovacao: "2024-02-17",
    dataPagamento: "2024-02-20", origem: "App",
    docs: { rg: true, cpf: true, compRenda: true, selfie: true },
    iaScore: 88, iaAlerta: null,
    historico: [
      { status: "Digitação", data: "2024-02-15 09:30", usuario: "Ana Paula" },
      { status: "Análise IA", data: "2024-02-15 09:31", usuario: "Sistema" },
      { status: "Aprovado", data: "2024-02-17 14:20", usuario: "Sistema" },
      { status: "Averbação", data: "2024-02-18 10:00", usuario: "INSS API" },
      { status: "Pago", data: "2024-02-20 08:00", usuario: "BaaS" },
    ],
  },
  {
    id: "VBT-2024-002", clienteId: "cli002", cliente: "Maria Santos",
    produto: "Consignado Servidor", valor: 28000, parcela: 680.00,
    prazo: 60, taxa: 1.58, orgao: "Prefeitura SP", matricula: "8901234",
    status: "Aprovado", agente: "Ricardo Mendes", agenteId: "c001",
    comissao: 840, dataDigitacao: "2024-04-20", dataAprovacao: "2024-04-22",
    dataPagamento: null, origem: "Portal",
    docs: { rg: true, cpf: true, compRenda: true, selfie: true },
    iaScore: 94, iaAlerta: null,
    historico: [
      { status: "Digitação", data: "2024-04-20 11:00", usuario: "Ricardo" },
      { status: "Análise IA", data: "2024-04-20 11:01", usuario: "Sistema" },
      { status: "Aprovado", data: "2024-04-22 09:15", usuario: "Sistema" },
    ],
  },
  {
    id: "VBT-2024-003", clienteId: "cli003", cliente: "José Pereira",
    produto: "FGTS Antecipação", valor: 4800, parcela: null,
    prazo: null, taxa: 1.29, orgao: "INSS", matricula: "4567890",
    status: "Análise IA", agente: "Ana Paula Ferreira", agenteId: "c002",
    comissao: 144, dataDigitacao: "2024-04-28", dataAprovacao: null,
    dataPagamento: null, origem: "App",
    docs: { rg: true, cpf: true, compRenda: false, selfie: true },
    iaScore: 71, iaAlerta: "Renda não comprovada — aguardando holerite",
    historico: [
      { status: "Digitação", data: "2024-04-28 14:00", usuario: "Ana Paula" },
      { status: "Análise IA", data: "2024-04-28 14:01", usuario: "Sistema" },
    ],
  },
  {
    id: "VBT-2024-004", clienteId: "cli004", cliente: "Luciana Ferraz",
    produto: "Consignado SIAPE", valor: 42000, parcela: 960.00,
    prazo: 60, taxa: 1.45, orgao: "Ministério Educação", matricula: "3456789",
    status: "Averbação", agente: "Carlos Almeida", agenteId: "c003",
    comissao: 1260, dataDigitacao: "2024-04-25", dataAprovacao: "2024-04-27",
    dataPagamento: null, origem: "Portal",
    docs: { rg: true, cpf: true, compRenda: true, selfie: true },
    iaScore: 97, iaAlerta: null,
    historico: [
      { status: "Digitação", data: "2024-04-25 08:00", usuario: "Carlos" },
      { status: "Análise IA", data: "2024-04-25 08:01", usuario: "Sistema" },
      { status: "Aprovado", data: "2024-04-27 10:30", usuario: "Sistema" },
      { status: "Averbação", data: "2024-04-28 08:00", usuario: "SIAPE API" },
    ],
  },
  {
    id: "VBT-2024-005", clienteId: "cli005", cliente: "Roberto Gomes",
    produto: "RMC Cartão", valor: 2000, parcela: 80.00,
    prazo: 36, taxa: 2.99, orgao: "INSS", matricula: "6789012",
    status: "Pendência Doc", agente: "Fernanda Lima", agenteId: "c006",
    comissao: 60, dataDigitacao: "2024-04-29", dataAprovacao: null,
    dataPagamento: null, origem: "App",
    docs: { rg: true, cpf: false, compRenda: false, selfie: false },
    iaScore: 45, iaAlerta: "Score abaixo do mínimo — possível superendividamento detectado",
    historico: [
      { status: "Digitação", data: "2024-04-29 16:00", usuario: "Fernanda" },
      { status: "Análise IA", data: "2024-04-29 16:01", usuario: "Sistema" },
      { status: "Pendência Doc", data: "2024-04-29 16:02", usuario: "Sistema" },
    ],
  },
  {
    id: "VBT-2024-006", clienteId: "cli002", cliente: "Maria Santos",
    produto: "Refinanciamento", valor: 35000, parcela: 810.00,
    prazo: 60, taxa: 1.62, orgao: "Prefeitura SP", matricula: "8901234",
    status: "Digitação", agente: "Paulo Rodrigues", agenteId: "c007",
    comissao: 1050, dataDigitacao: "2024-04-30", dataAprovacao: null,
    dataPagamento: null, origem: "Portal",
    docs: { rg: false, cpf: false, compRenda: false, selfie: false },
    iaScore: null, iaAlerta: null,
    historico: [
      { status: "Digitação", data: "2024-04-30 10:00", usuario: "Paulo" },
    ],
  },
  {
    id: "VBT-2024-007", clienteId: "cli001", cliente: "Carlos Silva",
    produto: "Crédito Pessoal", valor: 5000, parcela: 195.00,
    prazo: 30, taxa: 3.5, orgao: null, matricula: null,
    status: "Cancelado", agente: "Ana Paula Ferreira", agenteId: "c002",
    comissao: 0, dataDigitacao: "2024-03-10", dataAprovacao: null,
    dataPagamento: null, origem: "App",
    docs: { rg: true, cpf: true, compRenda: true, selfie: true },
    iaScore: 38, iaAlerta: "Comprometimento de renda acima de 35% — proposta recusada por IA anti-superendividamento",
    historico: [
      { status: "Digitação", data: "2024-03-10 10:00", usuario: "Ana Paula" },
      { status: "Análise IA", data: "2024-03-10 10:01", usuario: "Sistema" },
      { status: "Cancelado", data: "2024-03-10 10:03", usuario: "IA Engine" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// PRODUTOS FINANCEIROS
// ─────────────────────────────────────────────────────────────
export const mockProdutos = {
  consignadoINSS: {
    nome: "Consignado INSS",
    descricao: "Crédito com desconto direto no benefício previdenciário via Dataprev",
    taxaMin: 1.66, taxaMax: 1.97,
    prazoMin: 12, prazoMax: 84,
    valorMin: 500, valorMax: 200000,
    margemMax: 0.40, // 40% da renda líquida
    comissaoBase: 3.0,
    integracoes: ["Dataprev", "iGovSocial"],
    destinatarios: ["Aposentados INSS", "Pensionistas INSS"],
    vantagens: ["Menor taxa de mercado", "Desconto em folha garantido", "Aprovação automática via API"],
    prazoAprovacao: "2-4 horas",
    statusIntegracao: "online",
  },
  consignadoSIAPE: {
    nome: "Consignado SIAPE",
    descricao: "Crédito para servidores federais via SIAPE — desconto em folha",
    taxaMin: 1.45, taxaMax: 1.80,
    prazoMin: 12, prazoMax: 96,
    valorMin: 1000, valorMax: 500000,
    margemMax: 0.35,
    comissaoBase: 3.0,
    integracoes: ["SIAPE", "SouGov"],
    destinatarios: ["Servidores Federais Ativos", "Servidores Federais Aposentados"],
    vantagens: ["Taxa diferenciada para federal", "Margem até 35%", "Integração direta SouGov"],
    prazoAprovacao: "4-8 horas",
    statusIntegracao: "online",
  },
  consignadoEstadualMunicipal: {
    nome: "Consignado Est./Mun.",
    descricao: "Crédito para servidores estaduais e municipais — convênios diretos",
    taxaMin: 1.58, taxaMax: 2.10,
    prazoMin: 12, prazoMax: 84,
    valorMin: 500, valorMax: 300000,
    margemMax: 0.35,
    comissaoBase: 2.8,
    integracoes: ["Prefeituras parceiras", "Governos Estaduais"],
    destinatarios: ["Servidores Estaduais", "Servidores Municipais"],
    vantagens: ["Cobertura em 12 estados", "Aprovação em até 48h", "Sem consulta SPC/Serasa"],
    prazoAprovacao: "24-48 horas",
    statusIntegracao: "parcial",
  },
  fgts: {
    nome: "Antecipação FGTS",
    descricao: "Antecipação do saque-aniversário FGTS até 10 anos à frente",
    taxaMin: 1.29, taxaMax: 1.80,
    prazoMin: 1, prazoMax: 10, // anos
    valorMin: 200, valorMax: 50000,
    margemMax: null,
    comissaoBase: 3.0,
    integracoes: ["CAIXA API", "Banco Inter", "Celcoin"],
    destinatarios: ["CLT com saldo FGTS", "Modalidade Saque-Aniversário"],
    vantagens: ["Liberação em até 2 horas", "Sem comprometer margem consignável", "Não afeta score"],
    prazoAprovacao: "2-4 horas",
    statusIntegracao: "online",
  },
  rmc: {
    nome: "Cartão RMC",
    descricao: "Reserva de Margem Consignável — cartão crédito com desconto em folha",
    taxaMin: 1.80, taxaMax: 3.06,
    prazoMin: 1, prazoMax: 84,
    valorMin: 300, valorMax: 20000,
    margemMax: 0.05, // 5% margem específica RMC
    comissaoBase: 2.5,
    integracoes: ["Dock", "Zoop", "Celcoin"],
    destinatarios: ["Beneficiários INSS", "Servidores Públicos"],
    vantagens: ["Limite pré-aprovado", "Saque disponível", "Fatura no contracheque"],
    prazoAprovacao: "24 horas",
    statusIntegracao: "online",
  },
  rcc: {
    nome: "Cartão RCC",
    descricao: "Reserva de Compras Consignável — cartão compras com parcelamento em folha",
    taxaMin: 1.80, taxaMax: 3.06,
    prazoMin: 1, prazoMax: 84,
    valorMin: 300, valorMax: 15000,
    margemMax: 0.05,
    comissaoBase: 2.5,
    integracoes: ["Dock", "Zoop"],
    destinatarios: ["Beneficiários INSS", "Servidores Públicos"],
    vantagens: ["Compras parceladas em folha", "Sem juros rotativo", "Aceito em toda rede"],
    prazoAprovacao: "24 horas",
    statusIntegracao: "em_implantacao",
  },
  pessoal: {
    nome: "Crédito Pessoal",
    descricao: "Crédito pessoal com engine de risco próprio — débito em conta ou boleto",
    taxaMin: 2.99, taxaMax: 5.99,
    prazoMin: 6, prazoMax: 36,
    valorMin: 500, valorMax: 15000,
    margemMax: 0.30,
    comissaoBase: 4.0,
    integracoes: ["QI Tech", "BMP Money Plus", "Serasa Experian"],
    destinatarios: ["CPF ativo", "Renda comprovada", "Score mínimo 550"],
    vantagens: ["Análise em minutos", "Sem burocracia", "Débito automático"],
    prazoAprovacao: "30 minutos",
    statusIntegracao: "beta",
  },
};

// ─────────────────────────────────────────────────────────────
// TABELAS DE TAXAS POR PRAZO (Consignado INSS)
// ─────────────────────────────────────────────────────────────
export const tabelaTaxas = [
  { prazo: 12, taxa: 1.66, cetAa: 21.8 },
  { prazo: 18, taxa: 1.68, cetAa: 22.1 },
  { prazo: 24, taxa: 1.70, cetAa: 22.4 },
  { prazo: 36, taxa: 1.72, cetAa: 22.8 },
  { prazo: 48, taxa: 1.80, cetAa: 23.9 },
  { prazo: 60, taxa: 1.85, cetAa: 24.7 },
  { prazo: 72, taxa: 1.90, cetAa: 25.5 },
  { prazo: 84, taxa: 1.97, cetAa: 26.5 },
];

// ─────────────────────────────────────────────────────────────
// FINANCEIRO — CONTA DIGITAL CORBAN
// ─────────────────────────────────────────────────────────────
export const mockContaDigital = {
  numero: "VBT-00123-4",
  agencia: "0001",
  banco: "VerbaTech BaaS (Celcoin)",
  saldo: 42750.80,
  rendimentoDia: 12.40,
  limitePix: 50000,
  limiteTransferencia: 100000,
};

export const mockExtrato = [
  { id: "tx001", tipo: "credito", descricao: "Comissão — VBT-2024-001", valor: 450.00,  data: "2024-02-20", categoria: "comissao",     saldo: 42750.80 },
  { id: "tx002", tipo: "credito", descricao: "Comissão — VBT-2024-002", valor: 840.00,  data: "2024-04-22", categoria: "comissao",     saldo: 42300.80 },
  { id: "tx003", tipo: "debito",  descricao: "PIX — Ana Paula Ferreira", valor: 1200.00, data: "2024-04-23", categoria: "transferencia", saldo: 41460.80 },
  { id: "tx004", tipo: "credito", descricao: "Repasse Master — Produção Rede", valor: 3200.00, data: "2024-04-25", categoria: "repasse", saldo: 42660.80 },
  { id: "tx005", tipo: "debito",  descricao: "TED — Carlos Almeida",   valor: 850.00,  data: "2024-04-26", categoria: "transferencia", saldo: 39460.80 },
  { id: "tx006", tipo: "credito", descricao: "Comissão — VBT-2024-004", valor: 1260.00, data: "2024-04-28", categoria: "comissao",     saldo: 40720.80 },
  { id: "tx007", tipo: "credito", descricao: "Rendimento Saldo",       valor: 86.80,   data: "2024-04-29", categoria: "rendimento",   saldo: 41980.80 },
  { id: "tx008", tipo: "debito",  descricao: "Boleto — AWS Infraestrutura", valor: 1230.00, data: "2024-04-29", categoria: "operacional", saldo: 40750.80 },
  { id: "tx009", tipo: "credito", descricao: "Antecipação Comissão",   valor: 4200.00, data: "2024-04-30", categoria: "antecipacao",  saldo: 44950.80 },
  { id: "tx010", tipo: "debito",  descricao: "Pagamento VerbaTech Card", valor: 2200.00, data: "2024-04-30", categoria: "cartao",      saldo: 42750.80 },
];

export const mockComissoes = {
  mes: [
    { mes: "Nov/23", producao: 310000, comissao: 9300,  contratos: 104 },
    { mes: "Dez/23", producao: 380000, comissao: 11400, contratos: 127 },
    { mes: "Jan/24", producao: 290000, comissao: 8700,  contratos: 97  },
    { mes: "Fev/24", producao: 420000, comissao: 12600, contratos: 140 },
    { mes: "Mar/24", producao: 465000, comissao: 13950, contratos: 155 },
    { mes: "Abr/24", producao: 510000, comissao: 15300, contratos: 170 },
  ],
  detalhes: [
    { origem: "Consig. INSS — Rede",    valor: 8420.00, contratos: 62,  data: "2024-04-30", status: "pago"     },
    { origem: "FGTS Antecipação",        valor: 3180.00, contratos: 24,  data: "2024-04-28", status: "pago"     },
    { origem: "RMC/RCC — Rede",          valor: 1240.00, contratos: 11,  data: "2024-04-25", status: "pago"     },
    { origem: "Consig. SIAPE",           valor: 2660.00, contratos: 19,  data: "2024-04-22", status: "pago"     },
    { origem: "Repasse Master Bônus",    valor: 1800.00, contratos: 0,   data: "2024-04-30", status: "pendente" },
    { origem: "Antecipação Comissão Mai",valor: 4200.00, contratos: 0,   data: "2024-05-05", status: "pendente" },
  ],
  splitConfig: {
    master: 3.5,
    agente: 2.5,
    subAgente: 2.0,
    plataforma: 0.5,
  },
};

// ─────────────────────────────────────────────────────────────
// IA ANTI-SUPERENDIVIDAMENTO ENGINE
// ─────────────────────────────────────────────────────────────
export const mockIAEngine = {
  versao: "v2.4.1",
  modeloBase: "VerbaTech Credit Score + Serasa Open Finance",
  totalAnalises: 1847,
  taxaAprovacao: 78.5,
  taxaRejeicao: 21.5,
  acuracia: 92.3,
  propostas: {
    aprovadas: 1543,
    recusadas: 189,
    pendentes: 115,
  },
  taxaAcerto: 97.3,
  economiaGerada: 2840000,
  alertasAtivos: 12,
  riskModels: [
    { nome: "Score INSS",       acuracia: 94.2, tipo: "gradient_boost" },
    { nome: "Fraude Docs",      acuracia: 97.8, tipo: "neural_net"     },
    { nome: "Capacidade Pagto", acuracia: 91.5, tipo: "regression"     },
    { nome: "Risco Corban",     acuracia: 88.7, tipo: "ensemble"       },
  ],
};

export const mockAlertasIA = [
  {
    id: "alr001", clienteId: "cli005", cliente: "Roberto Gomes",
    tipo: "superendividamento", nivel: "critico",
    mensagem: "Comprometimento de renda: 65.4% — limite regulatório BACEN é 35%",
    acao: "Recusar proposta e acionar jornada de educação financeira",
    data: "2024-04-29 16:02", tempo: "há 2h", scoreIA: 42,
    proposta: "VBT-2024-005",
  },
  {
    id: "alr002", clienteId: "cli001", cliente: "Carlos Silva",
    tipo: "portabilidade", nivel: "oportunidade",
    mensagem: "Taxa atual 1.72% — disponível portabilidade para 1.45% (economia R$ 28/mês)",
    acao: "Oferecer simulação de portabilidade",
    data: "2024-04-28 09:00", tempo: "há 1 dia", scoreIA: 87,
    proposta: null,
  },
  {
    id: "alr003", clienteId: "cli003", cliente: "José Pereira",
    tipo: "margem_disponivel", nivel: "oportunidade",
    mensagem: "Margem R$ 495 disponível sem nenhum uso — potencial R$ 4.800 em consignado",
    acao: "Acionar agente para oferta ativa",
    data: "2024-04-27 11:30", tempo: "há 2 dias", scoreIA: 81,
    proposta: null,
  },
  {
    id: "alr004", clienteId: "cli005", cliente: "Roberto Gomes",
    tipo: "fgts", nivel: "atencao",
    mensagem: "Saldo FGTS estimado R$ 8.200 — antecipação pode quitar dívida rotativo",
    acao: "Sugerir antecipação FGTS para desendividamento",
    data: "2024-04-30 08:00", tempo: "há 4h", scoreIA: 65,
    proposta: null,
  },
  {
    id: "alr005", clienteId: "cli007", cliente: "Luciana Martins",
    tipo: "irregularidade", nivel: "atencao",
    mensagem: "Documentos com divergência de dados — CPF vs RG inconsistente",
    acao: "Solicitar atualização documental ao cliente",
    data: "2024-04-30 10:15", tempo: "há 1h", scoreIA: 58,
    proposta: "VBT-2024-009",
  },
];

export const mockRegrasCompliance = [
  { id: "r001", nome: "Comprometimento máx. renda",   limite: "35%",        ativo: true,  baseLegal: "Resolução BACEN 4.966" },
  { id: "r002", nome: "Taxa máx. consignado INSS",    limite: "1.97% a.m.", ativo: true,  baseLegal: "Portaria MPS 1.696/2024" },
  { id: "r003", nome: "Margem RMC",                   limite: "5% renda",   ativo: true,  baseLegal: "IN INSS 28/2008" },
  { id: "r004", nome: "Prazo máx. INSS",              limite: "84 meses",   ativo: true,  baseLegal: "Resolução CNPS 1.347" },
  { id: "r005", nome: "Consentimento digital (LGPD)", limite: "Obrigatório",ativo: true,  baseLegal: "Lei 13.709/2018" },
  { id: "r006", nome: "Biometria facial KYC",         limite: "Nível 3",    ativo: true,  baseLegal: "Instrução CVM 617" },
  { id: "r007", nome: "Score mínimo crédito pessoal", limite: "550 pts",    ativo: true,  baseLegal: "Política interna VerbaTech" },
  { id: "r008", nome: "Carência refinanciamento",     limite: "180 dias",   ativo: false, baseLegal: "Circular BACEN 3.939" },
];

export const mockAuditLog = [
  { id: "aud001", usuario: "Sistema IA", acao: "Análise de crédito automática", entidade: "VBT-2024-005", status: "warning", data: "2024-04-29 16:02", ip: "10.0.0.1" },
  { id: "aud002", usuario: "Ana Paula",  acao: "Digitação de proposta",         entidade: "VBT-2024-003", status: "success", data: "2024-04-28 14:00", ip: "192.168.1.42" },
  { id: "aud003", usuario: "Sistema",    acao: "Averbação SIAPE concluída",     entidade: "VBT-2024-004", status: "success", data: "2024-04-28 08:00", ip: "10.0.0.1" },
  { id: "aud004", usuario: "Ricardo M.", acao: "Aprovação manual de proposta",  entidade: "VBT-2024-002", status: "success", data: "2024-04-22 09:15", ip: "192.168.1.10" },
  { id: "aud005", usuario: "Carlos A.",  acao: "Cadastro de sub-agente",        entidade: "c006",         status: "success", data: "2024-04-20 14:30", ip: "192.168.1.55" },
  { id: "aud006", usuario: "Sistema",    acao: "Split pagamento comissão",      entidade: "VBT-2024-001", status: "success", data: "2024-02-20 08:05", ip: "10.0.0.1" },
  { id: "aud007", usuario: "Sistema IA", acao: "Alerta superendividamento",     entidade: "cli005",       status: "error",   data: "2024-04-29 16:03", ip: "10.0.0.1" },
];

// ─────────────────────────────────────────────────────────────
// DASHBOARD KPIs
// ─────────────────────────────────────────────────────────────
export const mockKPIs = {
  producaoTotal: { valor: 963000, variacao: "+18.4%", tendencia: "up",   label: "Produção Total Mês", formato: "brl",  sub: "vs mar/24" },
  contratos:     { valor: 282,    variacao: "+12.1%", tendencia: "up",   label: "Contratos Ativos",  formato: "num",  sub: "↑ 30 vs mês ant." },
  comissaoMes:   { valor: 23410,  variacao: "+9.6%",  tendencia: "up",   label: "Comissão do Mês",   formato: "brl",  sub: "Liquidação em 05/05" },
  ticketMedio:   { valor: 18200,  variacao: "+5.3%",  tendencia: "up",   label: "Ticket Médio",      formato: "brl",  sub: "↑ R$ 920 vs mar" },
  taxaAprovacao: { valor: 89.1,   variacao: "+2.1%",  tendencia: "up",   label: "Taxa Aprovação IA", formato: "pct",  sub: "Score médio: 82" },
  rede:          { valor: 7,      variacao: "+16.7%", tendencia: "up",   label: "Agentes na Rede",   formato: "num",  sub: "3 Diamante · 2 Ouro" },
  alertasIA:     { valor: 5,      variacao: "-8.3%",  tendencia: "down", label: "Alertas IA Ativos", formato: "num",  sub: "2 críticos · 3 atenção" },
  defaultRate:   { valor: 0.8,    variacao: "-0.2%",  tendencia: "down", label: "Inadimplência",     formato: "pct",  sub: "Abaixo da meta 1.2%" },
};

export const mockGraficoProducao = [
  { mes: "Nov", producao: 310000, comissao: 9300,  contratos: 104, aprovacao: 86.2 },
  { mes: "Dez", producao: 380000, comissao: 11400, contratos: 127, aprovacao: 87.5 },
  { mes: "Jan", producao: 290000, comissao: 8700,  contratos: 97,  aprovacao: 85.9 },
  { mes: "Fev", producao: 420000, comissao: 12600, contratos: 140, aprovacao: 88.1 },
  { mes: "Mar", producao: 465000, comissao: 13950, contratos: 155, aprovacao: 89.0 },
  { mes: "Abr", producao: 510000, comissao: 15300, contratos: 170, aprovacao: 89.1 },
];

export const mockGraficoProdutos = [
  { nome: "Consig. INSS",     valor: 42,  cor: "#6366F1" },
  { nome: "Consig. SIAPE",    valor: 18,  cor: "#8B5CF6" },
  { nome: "FGTS Antecip.",    valor: 21,  cor: "#06B6D4" },
  { nome: "Est./Municipal",   valor: 11,  cor: "#10B981" },
  { nome: "RMC/RCC",         valor: 5,   cor: "#F59E0B" },
  { nome: "Pessoal",          valor: 3,   cor: "#EF4444" },
];

// ─────────────────────────────────────────────────────────────
// INTEGRAÇÕES (status em tempo real)
// ─────────────────────────────────────────────────────────────
export const mockIntegracoes = [
  { nome: "Dataprev (INSS)",     status: "online",    latencia: 320,  ultimoCheck: "há 2 min",  tipo: "Consulta margem" },
  { nome: "SIAPE / SouGov",      status: "online",    latencia: 480,  ultimoCheck: "há 5 min",  tipo: "Averbação federal" },
  { nome: "CAIXA FGTS API",      status: "online",    latencia: 210,  ultimoCheck: "há 1 min",  tipo: "Saque-aniversário" },
  { nome: "Celcoin BaaS",        status: "online",    latencia: 145,  ultimoCheck: "há 1 min",  tipo: "Conta digital/PIX" },
  { nome: "Dock (RMC/RCC)",      status: "online",    latencia: 390,  ultimoCheck: "há 3 min",  tipo: "Emissão cartão" },
  { nome: "QI Tech (Pessoal)",   status: "online",    latencia: 520,  ultimoCheck: "há 4 min",  tipo: "Crédito pessoal" },
  { nome: "Serasa OpenFinance",  status: "online",    latencia: 280,  ultimoCheck: "há 2 min",  tipo: "Score / Bureau" },
  { nome: "ZapSign (Assinatura)",status: "online",    latencia: 180,  ultimoCheck: "há 1 min",  tipo: "Assinatura digital" },
  { nome: "Prefeituras Conv.",   status: "parcial",   latencia: 1240, ultimoCheck: "há 8 min",  tipo: "Consig. municipal" },
  { nome: "BMP Money Plus",      status: "manutencao",latencia: null, ultimoCheck: "há 22 min", tipo: "Crédito pessoal B" },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
export const fmt = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export const fmtPct = (v) =>
  `${Number(v).toFixed(1)}%`;

export const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleDateString("pt-BR");
};

export const calcParcela = (valor, taxa, prazo) => {
  const r = taxa / 100;
  return (valor * r * Math.pow(1 + r, prazo)) / (Math.pow(1 + r, prazo) - 1);
};

// ─────────────────────────────────────────────────────────────
// PRODUTIVIDADE — Digitadores & Relatórios
// ─────────────────────────────────────────────────────────────
export const mockDigitadores = [
  {
    id: "dig001", nome: "Ana Paula Santos", cpf: "045.xxx.xxx-12", avatar: "AP",
    masterId: "c001", loja: "SP-Centro", status: "ativo",
    meta: 50, contratos: 48, producaoMes: 142000, ticketMedio: 18200,
    taxaConversao: 74.2, taxaAprovacao: 91.5, tempoMedio: 2.4,
    produtos: { consignadoINSS: 28, fgts: 12, rmc: 5, pessoal: 3 },
    historico: [32,38,41,44,46,48], ranking: 1,
  },
  {
    id: "dig002", nome: "Carlos Mendes Silva", cpf: "067.xxx.xxx-34", avatar: "CM",
    masterId: "c001", loja: "SP-Centro", status: "ativo",
    meta: 40, contratos: 37, producaoMes: 108000, ticketMedio: 16500,
    taxaConversao: 68.5, taxaAprovacao: 87.3, tempoMedio: 3.1,
    produtos: { consignadoINSS: 22, fgts: 9, rmc: 4, pessoal: 2 },
    historico: [25,28,31,34,35,37], ranking: 2,
  },
  {
    id: "dig003", nome: "Fernanda Lima", cpf: "089.xxx.xxx-56", avatar: "FL",
    masterId: "c001", loja: "SP-Pinheiros", status: "ativo",
    meta: 35, contratos: 34, producaoMes: 98500, ticketMedio: 17200,
    taxaConversao: 71.8, taxaAprovacao: 89.0, tempoMedio: 2.8,
    produtos: { consignadoINSS: 20, fgts: 8, rmc: 4, pessoal: 2 },
    historico: [22,25,28,30,32,34], ranking: 3,
  },
  {
    id: "dig004", nome: "Roberto Alves", cpf: "012.xxx.xxx-78", avatar: "RA",
    masterId: "c002", loja: "RJ-Zona Sul", status: "ativo",
    meta: 30, contratos: 29, producaoMes: 84000, ticketMedio: 15800,
    taxaConversao: 62.3, taxaAprovacao: 83.4, tempoMedio: 3.5,
    produtos: { consignadoINSS: 17, fgts: 7, rmc: 3, pessoal: 2 },
    historico: [18,20,22,25,27,29], ranking: 4,
  },
  {
    id: "dig005", nome: "Patricia Costa", cpf: "034.xxx.xxx-90", avatar: "PC",
    masterId: "c002", loja: "RJ-Centro", status: "ativo",
    meta: 25, contratos: 21, producaoMes: 61000, ticketMedio: 14200,
    taxaConversao: 55.6, taxaAprovacao: 79.8, tempoMedio: 4.2,
    produtos: { consignadoINSS: 13, fgts: 5, rmc: 2, pessoal: 1 },
    historico: [14,15,17,18,20,21], ranking: 5,
  },
  {
    id: "dig006", nome: "Lucas Ferreira", cpf: "056.xxx.xxx-01", avatar: "LF",
    masterId: "c003", loja: "BH-Savassi", status: "afastado",
    meta: 30, contratos: 12, producaoMes: 34500, ticketMedio: 13800,
    taxaConversao: 40.0, taxaAprovacao: 71.2, tempoMedio: 5.8,
    produtos: { consignadoINSS: 8, fgts: 3, rmc: 1, pessoal: 0 },
    historico: [18,20,19,16,14,12], ranking: 6,
  },
];

export const mockRelatorioMes = {
  periodo: "Abril/2024",
  totalDigitadores: 6,
  ativos: 5,
  afastados: 1,
  totalContratos: 181,
  producaoTotal: 528000,
  ticketMedioGeral: 16000,
  taxaConversaoMedia: 62.1,
  taxaAprovacaoMedia: 83.7,
  metaAtingimento: 87.5,
  topProduto: "Consignado INSS",
  distribuicaoProdutos: [
    { produto: "Consig. INSS", contratos: 108, producao: 312000, pct: 59.0 },
    { produto: "FGTS", contratos: 44, producao: 127000, pct: 24.0 },
    { produto: "RMC/RCC", contratos: 19, producao: 55000, pct: 10.5 },
    { produto: "Pessoal", contratos: 10, producao: 34000, pct: 6.5 },
  ],
  evolucaoSemanal: [
    { semana: "S1", contratos: 38, producao: 110000 },
    { semana: "S2", contratos: 44, producao: 128000 },
    { semana: "S3", contratos: 52, producao: 152000 },
    { semana: "S4", contratos: 47, producao: 138000 },
  ],
};

// ─────────────────────────────────────────────────────────────
// SEGUROS — Multiproduct Insurance
// ─────────────────────────────────────────────────────────────
export const mockSeguros = [
  {
    id: "seg001", tipo: "Vida", nome: "VerbaTech Vida Proteção", seguradora: "SulAmérica",
    api: "SulAmérica API v3", status: "online", comissaoBase: 8.0,
    premioMin: 29.90, premioMax: 299.90, cobertura: 50000,
    contratosMes: 42, producaoMes: 3890, comissaoMes: 311.20,
    publico: "Beneficiários INSS, Servidores", prazoCarencia: 30,
    beneficios: ["Morte natural", "Morte acidental", "Invalidez permanente", "Doenças graves"],
    vantagens: ["Sem carência para acidente", "Desconto em folha", "Cobertura nacional"],
    taxaConversao: 38.5,
  },
  {
    id: "seg002", tipo: "Prestamista", nome: "Proteção Consignado", seguradora: "Tokio Marine",
    api: "Tokio API v2", status: "online", comissaoBase: 6.5,
    premioMin: 0.50, premioMax: 2.20, cobertura: null,
    contratosMes: 87, producaoMes: 6200, comissaoMes: 403.00,
    publico: "Todos tomadores de crédito consignado", prazoCarencia: 0,
    beneficios: ["Quita saldo devedor em caso de morte", "Cobre desemprego involuntário", "Invalidez total"],
    vantagens: ["Embutido na proposta", "Zero carência", "Aprovação automática"],
    taxaConversao: 82.4,
  },
  {
    id: "seg003", tipo: "Residencial", nome: "Lar Seguro VBT", seguradora: "Porto Seguro",
    api: "Porto API v4", status: "parcial", comissaoBase: 12.0,
    premioMin: 49.90, premioMax: 399.90, cobertura: 200000,
    contratosMes: 18, producaoMes: 5400, comissaoMes: 648.00,
    publico: "Proprietários e locatários", prazoCarencia: 30,
    beneficios: ["Incêndio e explosão", "Roubo e furto", "Danos elétricos", "Responsabilidade civil"],
    vantagens: ["Vistoria digital", "Acionamento 24h", "App de sinistro"],
    taxaConversao: 22.8,
  },
  {
    id: "seg004", tipo: "Saúde", nome: "VerbaTech Saúde", seguradora: "Amil",
    api: "Amil API v1", status: "em_implantacao", comissaoBase: 15.0,
    premioMin: 189.90, premioMax: 899.90, cobertura: null,
    contratosMes: 0, producaoMes: 0, comissaoMes: 0,
    publico: "Pessoa física ativa", prazoCarencia: 180,
    beneficios: ["Consultas ambulatoriais", "Exames", "Internação", "Pronto-socorro"],
    vantagens: ["Cobertura nacional", "Telemedicina inclusa", "Rede credenciada ampla"],
    taxaConversao: 0,
  },
  {
    id: "seg005", tipo: "Odontológico", nome: "VBT Odonto", seguradora: "OdontoPrev",
    api: "OdontoPrev API v2", status: "online", comissaoBase: 10.0,
    premioMin: 24.90, premioMax: 89.90, cobertura: null,
    contratosMes: 31, producaoMes: 1980, comissaoMes: 198.00,
    publico: "Pessoa física e dependentes", prazoCarencia: 90,
    beneficios: ["Consultas e procedimentos básicos", "Ortodontia parcial", "Próteses"],
    vantagens: ["Maior rede do Brasil", "Sem limite de uso", "App de agendamento"],
    taxaConversao: 29.3,
  },
];

export const mockSegurosPipeline = [
  { id: "sp001", cliente: "João Silveira", cpf: "xxx.456.xxx-89", tipo: "Prestamista", seguradora: "Tokio Marine", premio: 1.20, status: "aprovado", digitador: "Ana Paula Santos", data: "2024-04-29" },
  { id: "sp002", cliente: "Maria Ferreira", cpf: "xxx.789.xxx-12", tipo: "Vida", seguradora: "SulAmérica", premio: 89.90, status: "analise", digitador: "Carlos Mendes", data: "2024-04-29" },
  { id: "sp003", cliente: "Pedro Oliveira", cpf: "xxx.123.xxx-45", tipo: "Residencial", seguradora: "Porto Seguro", premio: 149.90, status: "pendente_doc", digitador: "Fernanda Lima", data: "2024-04-28" },
  { id: "sp004", cliente: "Lucia Ramos", cpf: "xxx.321.xxx-67", tipo: "Odontológico", seguradora: "OdontoPrev", premio: 49.90, status: "aprovado", digitador: "Ana Paula Santos", data: "2024-04-28" },
  { id: "sp005", cliente: "Carlos Dias", cpf: "xxx.654.xxx-90", tipo: "Prestamista", seguradora: "Tokio Marine", premio: 0.90, status: "recusado", digitador: "Roberto Alves", data: "2024-04-27" },
];

// ─────────────────────────────────────────────────────────────
// CAMPANHAS — CRM Automation / WhatsApp
// ─────────────────────────────────────────────────────────────
export const mockCampanhas = [
  {
    id: "camp001", nome: "Renovação INSS Abril", tipo: "whatsapp", status: "ativa",
    publico: "Clientes com contrato vencendo em 60 dias", total: 342, enviados: 289, abertos: 201,
    convertidos: 44, dataInicio: "2024-04-15", dataFim: "2024-04-30",
    taxaAbertura: 69.6, taxaConversao: 21.9, producaoGerada: 638000,
    template: "Olá {nome}! Seu contrato consignado vence em breve. Temos condições especiais de renovação. Clique para simular: {link}",
    segmentacao: ["INSS", "Contrato ativo", ">= 60 anos"],
  },
  {
    id: "camp002", nome: "Cross-sell RMC", tipo: "sms", status: "ativa",
    publico: "Clientes sem cartão RMC com margem disponível", total: 187, enviados: 187, abertos: 142,
    convertidos: 18, dataInicio: "2024-04-20", dataFim: "2024-05-05",
    taxaAbertura: 75.9, taxaConversao: 12.7, producaoGerada: 94000,
    template: "VerbaTech: Você tem margem disponível para o Cartão RMC! Benefício sem sair de casa. Responda SIM para mais info.",
    segmentacao: ["INSS", "Sem RMC", "Margem > R$200"],
  },
  {
    id: "camp003", nome: "Prospecção FGTS", tipo: "whatsapp", status: "agendada",
    publico: "CLT com mais de 2 anos de registro", total: 520, enviados: 0, abertos: 0,
    convertidos: 0, dataInicio: "2024-05-02", dataFim: "2024-05-15",
    taxaAbertura: 0, taxaConversao: 0, producaoGerada: 0,
    template: "Olá {nome}! Sabia que você pode antecipar seu FGTS sem comprometer sua margem? Simule agora: {link}",
    segmentacao: ["CLT ativo", "FGTS > R$3.000", "> 2 anos registro"],
  },
  {
    id: "camp004", nome: "Reativação Inativos", tipo: "email", status: "concluida",
    publico: "Clientes sem proposta nos últimos 90 dias", total: 215, enviados: 215, abertos: 89,
    convertidos: 12, dataInicio: "2024-03-01", dataFim: "2024-03-15",
    taxaAbertura: 41.4, taxaConversao: 13.5, producaoGerada: 178000,
    template: "Sentimos sua falta! Confira nossas novas condições de crédito consignado com taxas a partir de 1,66% a.m.",
    segmentacao: ["Sem proposta 90d", "Score > 550"],
  },
];

export const mockProspects = [
  { id: "pr001", nome: "Antônio Barros", cpf: "xxx.111.xxx-22", origem: "whatsapp", produto: "Consignado INSS", status: "quente", score: 720, margem: 850, ultimoContato: "2024-04-29", digitador: "Ana Paula Santos" },
  { id: "pr002", nome: "Sônia Pinto", cpf: "xxx.222.xxx-33", origem: "indicacao", produto: "FGTS", status: "morno", score: 640, margem: null, ultimoContato: "2024-04-28", digitador: "Carlos Mendes" },
  { id: "pr003", nome: "Gilberto Souza", cpf: "xxx.333.xxx-44", origem: "sms", produto: "RMC", status: "frio", score: 580, margem: 320, ultimoContato: "2024-04-26", digitador: "Fernanda Lima" },
  { id: "pr004", nome: "Vera Campos", cpf: "xxx.444.xxx-55", origem: "whatsapp", produto: "Consignado INSS", status: "quente", score: 780, margem: 1200, ultimoContato: "2024-04-30", digitador: "Ana Paula Santos" },
  { id: "pr005", nome: "Renato Lima", cpf: "xxx.555.xxx-66", origem: "landing_page", produto: "Pessoal", status: "morno", score: 620, margem: null, ultimoContato: "2024-04-27", digitador: "Roberto Alves" },
];

// ─────────────────────────────────────────────────────────────
// SEGURANÇA — 2FA, Logs, Restrições
// ─────────────────────────────────────────────────────────────
export const mockUsuariosSistema = [
  {
    id: "usr001", nome: "Ricardo Mendes", cpf: "001.xxx.xxx-01", email: "ricardo@verbatech.com.br",
    role: "master", masterId: null, loja: "Matriz SP", status: "ativo",
    twoFA: true, twoFAMetodo: "app", ultimoLogin: "2024-04-30 09:12",
    ip: "192.168.1.10", sessoes: 3, tentativasFalhas: 0,
    restricaoIP: ["192.168.1.0/24"], horarioPermitido: "06:00-22:00",
    permissoes: ["dashboard", "corban", "financeiro", "compliance", "relatorios", "usuarios", "campanhas"],
  },
  {
    id: "usr002", nome: "Ana Paula Santos", cpf: "045.xxx.xxx-12", email: "ana@verbatech.com.br",
    role: "agente", masterId: "c001", loja: "SP-Centro", status: "ativo",
    twoFA: true, twoFAMetodo: "sms", ultimoLogin: "2024-04-30 08:45",
    ip: "187.12.34.56", sessoes: 1, tentativasFalhas: 0,
    restricaoIP: [], horarioPermitido: "07:00-20:00",
    permissoes: ["dashboard", "esteira", "propostas"],
  },
  {
    id: "usr003", nome: "Carlos Mendes Silva", cpf: "067.xxx.xxx-34", email: "carlos.m@verbatech.com.br",
    role: "agente", masterId: "c001", loja: "SP-Centro", status: "ativo",
    twoFA: false, twoFAMetodo: null, ultimoLogin: "2024-04-29 17:22",
    ip: "187.45.67.89", sessoes: 1, tentativasFalhas: 2,
    restricaoIP: [], horarioPermitido: "07:00-20:00",
    permissoes: ["dashboard", "esteira", "propostas"],
  },
  {
    id: "usr004", nome: "Fernanda Lima", cpf: "089.xxx.xxx-56", email: "fernanda@verbatech.com.br",
    role: "agente", masterId: "c001", loja: "SP-Pinheiros", status: "ativo",
    twoFA: true, twoFAMetodo: "app", ultimoLogin: "2024-04-30 09:01",
    ip: "189.23.45.67", sessoes: 1, tentativasFalhas: 0,
    restricaoIP: [], horarioPermitido: "07:00-20:00",
    permissoes: ["dashboard", "esteira", "propostas"],
  },
  {
    id: "usr005", nome: "Roberto Alves", cpf: "012.xxx.xxx-78", email: "roberto@verbatech.com.br",
    role: "agente", masterId: "c002", loja: "RJ-Zona Sul", status: "ativo",
    twoFA: false, twoFAMetodo: null, ultimoLogin: "2024-04-29 16:30",
    ip: "179.34.56.78", sessoes: 1, tentativasFalhas: 1,
    restricaoIP: [], horarioPermitido: "08:00-19:00",
    permissoes: ["dashboard", "esteira", "propostas"],
  },
  {
    id: "usr006", nome: "Lucas Ferreira", cpf: "056.xxx.xxx-01", email: "lucas@verbatech.com.br",
    role: "agente", masterId: "c003", loja: "BH-Savassi", status: "suspenso",
    twoFA: false, twoFAMetodo: null, ultimoLogin: "2024-04-20 11:00",
    ip: "200.45.67.89", sessoes: 0, tentativasFalhas: 5,
    restricaoIP: [], horarioPermitido: "08:00-18:00",
    permissoes: [],
  },
];

export const mockActivityLog = [
  { id: "act001", usuario: "Ricardo Mendes", acao: "Login realizado", ip: "192.168.1.10", dispositivo: "Chrome/Windows", data: "2024-04-30 09:12", status: "success", risco: "baixo" },
  { id: "act002", usuario: "Ana Paula Santos", acao: "Proposta criada VBT-2024-089", ip: "187.12.34.56", dispositivo: "Safari/iPhone", data: "2024-04-30 08:50", status: "success", risco: "baixo" },
  { id: "act003", usuario: "Carlos Mendes", acao: "Tentativa de login falhou (2FA incorreto)", ip: "187.45.67.89", dispositivo: "Chrome/Android", data: "2024-04-29 17:18", status: "warning", risco: "medio" },
  { id: "act004", usuario: "Carlos Mendes", acao: "Login realizado após 2ª tentativa", ip: "187.45.67.89", dispositivo: "Chrome/Android", data: "2024-04-29 17:22", status: "success", risco: "baixo" },
  { id: "act005", usuario: "Lucas Ferreira", acao: "5 tentativas de login falhas — conta suspensa", ip: "200.45.67.89", dispositivo: "Firefox/Linux", data: "2024-04-20 10:58", status: "error", risco: "alto" },
  { id: "act006", usuario: "Desconhecido", acao: "Tentativa de acesso de IP bloqueado", ip: "45.33.32.156", dispositivo: "curl/bot", data: "2024-04-29 03:22", status: "error", risco: "alto" },
  { id: "act007", usuario: "Ricardo Mendes", acao: "Relatório de produtividade exportado (PDF)", ip: "192.168.1.10", dispositivo: "Chrome/Windows", data: "2024-04-29 15:40", status: "success", risco: "baixo" },
  { id: "act008", usuario: "Fernanda Lima", acao: "Cliente consultado: CPF xxx.089.xxx-56", ip: "189.23.45.67", dispositivo: "Chrome/Mac", data: "2024-04-30 09:05", status: "success", risco: "baixo" },
  { id: "act009", usuario: "Sistema", acao: "Bloqueio automático IP fora de horário", ip: "45.33.32.157", dispositivo: "—", data: "2024-04-28 02:11", status: "error", risco: "alto" },
  { id: "act010", usuario: "Ricardo Mendes", acao: "Usuário Carlos Mendes — alerta 2FA desativado", ip: "192.168.1.10", dispositivo: "Chrome/Windows", data: "2024-04-28 14:00", status: "warning", risco: "medio" },
];

export const mockIpRestrictions = [
  { id: "ip001", descricao: "Rede Escritório SP", range: "192.168.1.0/24", tipo: "permitido", usuarios: ["Ricardo Mendes", "Ana Paula Santos"] },
  { id: "ip002", descricao: "Escritório RJ", range: "187.12.34.0/24", tipo: "permitido", usuarios: ["Roberto Alves", "Patricia Costa"] },
  { id: "ip003", descricao: "IP Bot Detectado", range: "45.33.32.0/24", tipo: "bloqueado", usuarios: [] },
  { id: "ip004", descricao: "Tor Exit Node", range: "185.220.101.0/24", tipo: "bloqueado", usuarios: [] },
];

// ─────────────────────────────────────────────────────────────
// BAAS — Banking as a Service: Conta Master + Subcontas + Split
// ─────────────────────────────────────────────────────────────
export const mockContaMaster = {
  numero: "VBT-00001-0",
  banco: "QI Tech / Celcoin",
  agencia: "0001",
  tipo: "Conta Pagamento Master",
  saldo: 1_842_390.50,
  saldoBloqueado: 312_000.00,   // em custódia (CCBs em aberto)
  saldoDisponivel: 1_530_390.50,
  saldoFIDC: 8_400_000.00,      // PL do fundo aportado
  limiteCredito: 12_000_000.00,
  pixKey: "financeiro@verbatech.com.br",
  ispb: "23114447",
  parceiro: "QI Tech (SCD)",
  licenca: "SCD via White Label QI Tech",
  ultimaAtualizacao: "30/04/2025 09:15",
};

export const mockSubcontas = [
  {
    id: "sub001", corbanId: "c001", nome: "Ricardo Mendes — Matriz SP",
    numero: "VBT-00123-4", saldo: 42_750.80, saldoPendente: 8_320.00,
    splitPct: 3.0, totalRecebido: 198_340.00, status: "ativa",
    banco: "VerbaTech Digital", pixKey: "ricardo@verba.com",
    ultimoCredito: "2025-04-29", ultimoValor: 4_820.00,
  },
  {
    id: "sub002", corbanId: "c002", nome: "Ana Paula Ferreira — RJ",
    numero: "VBT-00124-5", saldo: 12_450.30, saldoPendente: 2_100.00,
    splitPct: 2.5, totalRecebido: 54_600.00, status: "ativa",
    banco: "VerbaTech Digital", pixKey: "ana@verba.com",
    ultimoCredito: "2025-04-29", ultimoValor: 1_860.00,
  },
  {
    id: "sub003", corbanId: "c003", nome: "Carlos Almeida — BH",
    numero: "VBT-00125-6", saldo: 7_880.00, saldoPendente: 950.00,
    splitPct: 2.5, totalRecebido: 32_400.00, status: "ativa",
    banco: "VerbaTech Digital", pixKey: "carlos@verba.com",
    ultimoCredito: "2025-04-28", ultimoValor: 1_140.00,
  },
  {
    id: "sub004", corbanId: "c007", nome: "Paulo Rodrigues — Campinas",
    numero: "VBT-00126-7", saldo: 5_210.00, saldoPendente: 620.00,
    splitPct: 2.0, totalRecebido: 21_800.00, status: "ativa",
    banco: "VerbaTech Digital", pixKey: "paulo@verba.com",
    ultimoCredito: "2025-04-27", ultimoValor: 930.00,
  },
  {
    id: "sub005", corbanId: "c004", nome: "Juliana Costa — Niterói",
    numero: "VBT-00127-8", saldo: 2_340.00, saldoPendente: 310.00,
    splitPct: 2.0, totalRecebido: 14_400.00, status: "ativa",
    banco: "VerbaTech Digital", pixKey: "juliana@verba.com",
    ultimoCredito: "2025-04-26", ultimoValor: 576.00,
  },
  {
    id: "sub006", corbanId: "c005", nome: "Marcos Oliveira — Duque de Caxias",
    numero: "VBT-00128-9", saldo: 0.00, saldoPendente: 0.00,
    splitPct: 2.0, totalRecebido: 5_400.00, status: "bloqueada",
    banco: "VerbaTech Digital", pixKey: "marcos@verba.com",
    ultimoCredito: "2025-03-15", ultimoValor: 270.00,
  },
];

export const mockSplitRegras = {
  plataforma: 1.5,        // % que a plataforma retém de cada contrato
  corbanMin: 1.0,         // % mínimo garantido ao Corban
  corbanMax: 3.5,         // % máximo permitido ao Corban
  vendedorMin: 0.3,       // % mínimo para o vendedor (do split do Corban)
  vendedorMax: 1.5,
  parceiroBaaS: 0.4,      // custo de infra QI Tech / Celcoin
  fundo: 94.6,            // % que retorna ao FIDC (capital + spread)
  exemploContrato: {
    valor: 20_000,
    totalLiberar: 20_000,
    retornoFundo: 18_920,
    taxaPlataforma: 300,
    comissaoCorban: 600,
    comissaoVendedor: 180,
    custoBaaS: 80,
  },
};

export const mockTransacoesSplit = [
  { id: "trx001", data: "2025-04-30 09:12", ccbId: "CCB-2025-089", cliente: "José Pereira", valor: 18_000, tipo: "liberacao",
    split: { fundo: 17_028, plataforma: 270, corban: 540, vendedor: 162 }, corban: "Ana Paula — SP-Centro", status: "liquidado" },
  { id: "trx002", data: "2025-04-30 08:45", ccbId: "CCB-2025-088", cliente: "Maria Souza", valor: 25_000, tipo: "liberacao",
    split: { fundo: 23_650, plataforma: 375, corban: 750, vendedor: 225 }, corban: "Carlos Almeida — BH", status: "liquidado" },
  { id: "trx003", data: "2025-04-29 17:30", ccbId: "CCB-2025-087", cliente: "Pedro Lima", valor: 12_000, tipo: "parcela",
    split: { fundo: 11_352, plataforma: 180, corban: 360, vendedor: 108 }, corban: "Ricardo Mendes — SP", status: "liquidado" },
  { id: "trx004", data: "2025-04-29 15:10", ccbId: "CCB-2025-086", cliente: "Ana Ferreira", valor: 30_000, tipo: "liberacao",
    split: { fundo: 28_380, plataforma: 450, corban: 900, vendedor: 270 }, corban: "Paulo Rodrigues — Campinas", status: "liquidado" },
  { id: "trx005", data: "2025-04-29 11:00", ccbId: "CCB-2025-085", cliente: "Lúcia Ramos", valor: 8_500, tipo: "parcela",
    split: { fundo: 8_041, plataforma: 127.50, corban: 255, vendedor: 76.5 }, corban: "Juliana Costa — Niterói", status: "liquidado" },
  { id: "trx006", data: "2025-04-28 14:20", ccbId: "CCB-2025-084", cliente: "Renato Castro", valor: 22_000, tipo: "liberacao",
    split: { fundo: 20_812, plataforma: 330, corban: 660, vendedor: 198 }, corban: "Ana Paula — SP-Centro", status: "liquidado" },
];

export const mockSaldoHistorico = [
  { mes: "Nov/24", entrada: 320_000, saida: 290_000, saldo: 42_000 },
  { mes: "Dez/24", entrada: 410_000, saida: 375_000, saldo: 77_000 },
  { mes: "Jan/25", entrada: 380_000, saida: 348_000, saldo: 109_000 },
  { mes: "Fev/25", entrada: 445_000, saida: 398_000, saldo: 156_000 },
  { mes: "Mar/25", entrada: 520_000, saida: 462_000, saldo: 214_000 },
  { mes: "Abr/25", entrada: 618_000, saida: 543_000, saldo: 289_000 },
];

// ─────────────────────────────────────────────────────────────
// CCB — Cédula de Crédito Bancário + Formalização Digital
// ─────────────────────────────────────────────────────────────
export const mockCCBs = [
  {
    id: "CCB-2025-089", propostaId: "VBT-2025-089",
    cliente: "José Pereira da Silva", cpf: "012.345.678-90",
    produto: "Consignado INSS", convenio: "INSS",
    valor: 18_000, parcelas: 84, taxa: 1.80, parcela: 394.20,
    totalPagar: 33_112.80,
    emissao: "2025-04-30", vencimento1: "2025-06-01",
    status: "averbado",           // rascunho | pendente_assinatura | assinado | averbado | cancelado
    assinaturaStatus: "biometria_ok",
    dataAssinatura: "2025-04-30 09:05",
    averbacaoData: "2025-04-30 09:12",
    liberacaoData: "2025-04-30 09:15",
    pixDestino: "012.345.678-90",
    scd: "QI Tech",
    matricula: "987.654.321-2",
    orgao: "INSS",
    margemUsada: 394.20,
    corban: "Ana Paula Santos", digitador: "Ana Paula Santos",
    documentos: ["RG", "CPF", "Comprovante de renda", "Extrato INSS"],
    biometria: true, assinaturaEletronica: true,
  },
  {
    id: "CCB-2025-088", propostaId: "VBT-2025-088",
    cliente: "Maria Aparecida Souza", cpf: "098.765.432-10",
    produto: "Consignado INSS", convenio: "INSS",
    valor: 25_000, parcelas: 96, taxa: 1.75, parcela: 521.30,
    totalPagar: 50_044.80,
    emissao: "2025-04-30", vencimento1: "2025-06-01",
    status: "averbado",
    assinaturaStatus: "biometria_ok",
    dataAssinatura: "2025-04-30 08:40",
    averbacaoData: "2025-04-30 08:43",
    liberacaoData: "2025-04-30 08:45",
    pixDestino: "098.765.432-10",
    scd: "QI Tech",
    matricula: "123.456.789-1",
    orgao: "INSS",
    margemUsada: 521.30,
    corban: "Carlos Almeida", digitador: "Carlos Almeida",
    documentos: ["RG", "CPF", "Comprovante de renda"],
    biometria: true, assinaturaEletronica: true,
  },
  {
    id: "CCB-2025-090", propostaId: "VBT-2025-090",
    cliente: "Roberto Nascimento", cpf: "045.678.901-23",
    produto: "FGTS Antecipação", convenio: "FGTS",
    valor: 9_800, parcelas: 12, taxa: 1.55, parcela: 900.40,
    totalPagar: 10_804.80,
    emissao: "2025-04-30", vencimento1: "2025-05-15",
    status: "pendente_assinatura",
    assinaturaStatus: "aguardando_biometria",
    dataAssinatura: null,
    averbacaoData: null,
    liberacaoData: null,
    pixDestino: "045.678.901-23",
    scd: "QI Tech",
    matricula: null,
    orgao: "CAIXA",
    margemUsada: null,
    corban: "Paulo Rodrigues", digitador: "Paulo Rodrigues",
    documentos: ["RG", "CPF", "Extrato FGTS"],
    biometria: false, assinaturaEletronica: false,
  },
  {
    id: "CCB-2025-091", propostaId: "VBT-2025-091",
    cliente: "Claudia Ferreira Lima", cpf: "067.890.123-45",
    produto: "Consignado SIAPE", convenio: "SIAPE",
    valor: 35_000, parcelas: 84, taxa: 1.66, parcela: 745.80,
    totalPagar: 62_647.20,
    emissao: "2025-04-29", vencimento1: "2025-06-01",
    status: "assinado",
    assinaturaStatus: "biometria_ok",
    dataAssinatura: "2025-04-29 16:10",
    averbacaoData: null,
    liberacaoData: null,
    pixDestino: "067.890.123-45",
    scd: "QI Tech",
    matricula: "SIAPE-456789",
    orgao: "SIAPE",
    margemUsada: 745.80,
    corban: "Ricardo Mendes", digitador: "Fernanda Lima",
    documentos: ["Funcional", "CPF", "Contra-cheque"],
    biometria: true, assinaturaEletronica: true,
  },
  {
    id: "CCB-2025-092", propostaId: "VBT-2025-092",
    cliente: "Antônio Barros Santos", cpf: "089.012.345-67",
    produto: "Consignado INSS", convenio: "INSS",
    valor: 15_000, parcelas: 60, taxa: 1.80, parcela: 380.60,
    totalPagar: 22_836.00,
    emissao: "2025-04-30", vencimento1: "2025-06-01",
    status: "rascunho",
    assinaturaStatus: "nao_iniciado",
    dataAssinatura: null, averbacaoData: null, liberacaoData: null,
    pixDestino: null,
    scd: "QI Tech",
    matricula: "654.321.987-3",
    orgao: "INSS",
    margemUsada: 380.60,
    corban: "Ana Paula Santos", digitador: "Ana Paula Santos",
    documentos: [],
    biometria: false, assinaturaEletronica: false,
  },
];

export const mockConvenios = [
  { id: "conv001", nome: "INSS / Dataprev", sigla: "INSS", status: "online", latencia: 142, margensConsultadas: 1847, averbacoes: 234, taxaBase: 1.80, prazoMax: 84, limiteIdade: 80, api: "Dataprev API v4" },
  { id: "conv002", nome: "SIAPE (Servidores Federais)", sigla: "SIAPE", status: "online", latencia: 210, margensConsultadas: 412, averbacoes: 58, taxaBase: 1.66, prazoMax: 96, limiteIdade: 75, api: "SIAPE API v3" },
  { id: "conv003", nome: "CAIXA (FGTS)", sigla: "FGTS", status: "online", latencia: 188, margensConsultadas: 603, averbacoes: 89, taxaBase: 1.55, prazoMax: 12, limiteIdade: 70, api: "CAIXA API v2" },
  { id: "conv004", nome: "Gov. Estado SP", sigla: "EST-SP", status: "parcial", latencia: 540, margensConsultadas: 98, averbacoes: 12, taxaBase: 2.00, prazoMax: 72, limiteIdade: 70, api: "SEP-SP API v1" },
  { id: "conv005", nome: "Prefeitura SP", sigla: "PMSP", status: "manutencao", latencia: null, margensConsultadas: 0, averbacoes: 0, taxaBase: 1.90, prazoMax: 72, limiteIdade: 70, api: "PMSP API v1" },
];

// ─────────────────────────────────────────────────────────────
// FIDC — Fundo de Investimento em Direitos Creditórios
// ─────────────────────────────────────────────────────────────
export const mockFIDC = {
  nome: "VerbaTech FIDC Consignado I",
  cnpj: "45.678.901/0001-23",
  administrador: "BRL Trust DTVM",
  gestor: "VerbaTech Gestora",
  custodiante: "BTG Pactual",
  auditor: "KPMG",
  rating: "AA- (Fitch)",
  tipo: "Aberto — Subordinado/Sênior",
  patrimonio: 12_400_000,
  carteira: 9_840_000,        // direitos creditórios ativos
  disponivel: 2_560_000,      // para novos contratos
  cotasSenior: 8_000_000,
  cotasSubordinadas: 4_400_000,
  cotaSeniorValor: 1_082.40,  // R$/cota (correção IPCA+8%)
  cotaSubValor: 1_241.80,
  inadimplencia: 1.42,        // %
  spreadMedio: 12.8,          // % a.a. acima do custo de capital
  tir: 18.4,                  // % a.a. TIR do fundo
  inicioFundo: "2023-06-01",
  dataReferencia: "2025-04-30",
  investidores: 14,
  statusCVM: "Registrado CVM — ICVM 356",
};

export const mockFIDCEvolucao = [
  { mes: "Nov/24", pl: 8_200_000, carteira: 6_100_000, inadimplencia: 1.62 },
  { mes: "Dez/24", pl: 9_100_000, carteira: 6_900_000, inadimplencia: 1.58 },
  { mes: "Jan/25", pl: 9_800_000, carteira: 7_400_000, inadimplencia: 1.51 },
  { mes: "Fev/25", pl: 10_600_000, carteira: 8_100_000, inadimplencia: 1.48 },
  { mes: "Mar/25", pl: 11_500_000, carteira: 8_900_000, inadimplencia: 1.45 },
  { mes: "Abr/25", pl: 12_400_000, carteira: 9_840_000, inadimplencia: 1.42 },
];

export const mockFIDCCedentes = [
  { id: "ced001", nome: "VerbaTech Master SP", contratos: 148, saldo: 4_320_000, inadimplencia: 1.1, status: "ativo" },
  { id: "ced002", nome: "Corban Ana Paula — RJ", contratos: 62, saldo: 1_820_000, inadimplencia: 1.4, status: "ativo" },
  { id: "ced003", nome: "Corban Carlos — BH", contratos: 38, saldo: 1_140_000, inadimplencia: 2.1, status: "ativo" },
  { id: "ced004", nome: "Corban Paulo — Campinas", contratos: 31, saldo: 920_000, inadimplencia: 1.8, status: "ativo" },
  { id: "ced005", nome: "Corban Juliana — Niterói", contratos: 24, saldo: 720_000, inadimplencia: 0.9, status: "ativo" },
  { id: "ced006", nome: "Corban Marcos — Duque", contratos: 9, saldo: 270_000, inadimplencia: 4.2, status: "suspenso" },
];

export const mockFIDCEventos = [
  { id: "ev001", data: "2025-04-30", tipo: "cessao", descricao: "Cessão de 12 CCBs — Corban SP", valor: 186_000, status: "processado" },
  { id: "ev002", data: "2025-04-29", tipo: "liquidacao", descricao: "Liquidação 34 parcelas INSS", valor: 48_200, status: "processado" },
  { id: "ev003", data: "2025-04-28", tipo: "aporte", descricao: "Aporte cota subordinada — VerbaTech", valor: 500_000, status: "processado" },
  { id: "ev004", data: "2025-04-28", tipo: "resgate", descricao: "Resgate parcial cota sênior — Investidor BTG", valor: 200_000, status: "processado" },
  { id: "ev005", data: "2025-04-27", tipo: "cessao", descricao: "Cessão de 8 CCBs — Corban RJ", valor: 112_000, status: "processado" },
  { id: "ev006", data: "2025-04-30", tipo: "cessao", descricao: "Cessão de 6 CCBs — Corban Campinas (pendente)", valor: 78_000, status: "pendente" },
];

// ─────────────────────────────────────────────────────────────
// REGRAS GLOBAIS DE PRODUTO (Admin define por Corban)
// ─────────────────────────────────────────────────────────────
export const mockRegrasProduto = [
  {
    id: "rg001", corbanId: "c001", corbanNome: "Ricardo Mendes — Matriz",
    produtos: ["consignadoINSS", "consignadoSIAPE", "fgts", "rmc", "rcc", "pessoal"],
    taxaMaxINSS: 1.80, taxaMaxSIAPE: 1.66, taxaMaxFGTS: 1.55,
    prazoMaxINSS: 84, prazoMaxFGTS: 12,
    splitCorban: 3.0, splitVendedor: 0.8,
    limiteOperacao: 50_000, limiteCarteira: 500_000,
    ativo: true, nivel: "Diamante",
  },
  {
    id: "rg002", corbanId: "c002", corbanNome: "Ana Paula — RJ",
    produtos: ["consignadoINSS", "fgts", "rmc"],
    taxaMaxINSS: 1.80, taxaMaxSIAPE: null, taxaMaxFGTS: 1.55,
    prazoMaxINSS: 84, prazoMaxFGTS: 12,
    splitCorban: 2.5, splitVendedor: 0.6,
    limiteOperacao: 30_000, limiteCarteira: 200_000,
    ativo: true, nivel: "Ouro",
  },
  {
    id: "rg003", corbanId: "c003", corbanNome: "Carlos Almeida — BH",
    produtos: ["consignadoINSS", "fgts"],
    taxaMaxINSS: 1.80, taxaMaxSIAPE: null, taxaMaxFGTS: 1.55,
    prazoMaxINSS: 72, prazoMaxFGTS: 12,
    splitCorban: 2.5, splitVendedor: 0.6,
    limiteOperacao: 25_000, limiteCarteira: 150_000,
    ativo: true, nivel: "Prata",
  },
  {
    id: "rg004", corbanId: "c007", corbanNome: "Paulo Rodrigues — Campinas",
    produtos: ["consignadoINSS", "fgts"],
    taxaMaxINSS: 1.80, taxaMaxSIAPE: null, taxaMaxFGTS: 1.55,
    prazoMaxINSS: 60, prazoMaxFGTS: 12,
    splitCorban: 2.0, splitVendedor: 0.5,
    limiteOperacao: 20_000, limiteCarteira: 100_000,
    ativo: true, nivel: "Prata",
  },
  {
    id: "rg005", corbanId: "c004", corbanNome: "Juliana Costa — Niterói",
    produtos: ["consignadoINSS"],
    taxaMaxINSS: 1.80, taxaMaxSIAPE: null, taxaMaxFGTS: null,
    prazoMaxINSS: 48, prazoMaxFGTS: null,
    splitCorban: 2.0, splitVendedor: 0.5,
    limiteOperacao: 15_000, limiteCarteira: 80_000,
    ativo: true, nivel: "Bronze",
  },
  {
    id: "rg006", corbanId: "c005", corbanNome: "Marcos Oliveira — Duque",
    produtos: [],
    taxaMaxINSS: 1.80, taxaMaxSIAPE: null, taxaMaxFGTS: null,
    prazoMaxINSS: 48, prazoMaxFGTS: null,
    splitCorban: 2.0, splitVendedor: 0.5,
    limiteOperacao: 10_000, limiteCarteira: 50_000,
    ativo: false, nivel: "Bronze",
  },
];
