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
