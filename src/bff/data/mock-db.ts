
import { Doctor, Patient, StatItem, Session, Transaction, FinancialSummary, AppointmentRequest, DocumentTemplate, PatientDocument, DashboardOverview } from '../../shared/types';

// --- DATA ---
const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dra. Regiane O. C. Faria', specialty: 'Psicologia Clínica', image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'Dra. Ana Costa', specialty: 'Neuropsicologia', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&auto=format&fit=crop' },
  { id: 3, name: 'Dr. Roberto Dias', specialty: 'Terapia Familiar', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop' },
  { id: 4, name: 'Dr. Marcos Silva', specialty: 'Psicologia Infantil', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop' },
];

const STATS: StatItem[] = [
  { id: 1, label: 'Pacientes Atendidos', value: 10000, suffix: '+' },
  { id: 2, label: 'Anos de Experiência', value: 15, suffix: '+' },
  { id: 3, label: 'Especialistas', value: 25, suffix: '' },
  { id: 4, label: 'Unidades', value: 3, suffix: '' },
];

const PATIENTS: Patient[] = [
  { id: 1, name: 'Ana Beatriz Souza', status: 'Em Acompanhamento', lastSession: '14/03/2024', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop', condition: 'Ansiedade', therapyType: 'TCC', prontuario: '2024-1', customColor: '#FF6B6B' }, // Vermelho suave
  { id: 2, name: 'Carlos Eduardo Lima', status: 'Aguardando Retorno', lastSession: '10/03/2024', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop', condition: 'Depressão Leve', therapyType: 'Psicanálise', prontuario: '2024-2', customColor: '#4ECDC4' }, // Turquesa
  { id: 3, name: 'Fernanda Oliveira', status: 'Novo Paciente', lastSession: '-', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop', condition: 'Avaliação', therapyType: 'N/A', prontuario: '2024-3', customColor: '#FFE66D' }, // Amarelo
];

const SESSIONS: Session[] = [
  // Sessões Passadas
  { id: 1, patientId: 1, patientName: 'Ana Beatriz Souza', professionalId: 1, professionalName: 'Dra. Regiane', date: '14/03/2024', time: '14:00', type: 'Terapia Cognitivo-Comportamental', notes: 'Paciente relatou melhora...', location: 'Online', status: 'completed', paymentStatus: 'paid', clientColor: '#FF6B6B' },
  { id: 2, patientId: 1, patientName: 'Ana Beatriz Souza', professionalId: 1, professionalName: 'Dra. Regiane', date: '07/03/2024', time: '14:00', type: 'Terapia Cognitivo-Comportamental', notes: 'Trabalhamos questões...', location: 'Online', status: 'completed', paymentStatus: 'paid', clientColor: '#FF6B6B' },
  
  // Agenda Hoje (Simulada para display na Timeline)
  { id: 10, patientId: 1, patientName: 'Ana Beatriz Souza', professionalId: 1, professionalName: 'Dra. Regiane', date: new Date().toLocaleDateString('pt-BR'), time: '09:00', type: 'TCC - Online', notes: '', location: 'Online', status: 'confirmed', isRecurring: true, reminderStatus: 'sent', paymentStatus: 'paid', clientColor: '#FF6B6B' },
  { id: 11, patientId: 2, patientName: 'Carlos Eduardo Lima', professionalId: 1, professionalName: 'Dra. Regiane', date: new Date().toLocaleDateString('pt-BR'), time: '10:00', type: 'Psicanálise', notes: '', location: 'Presencial', status: 'confirmed', reminderStatus: 'sent', paymentStatus: 'pending', clientColor: '#4ECDC4' },
  { id: 12, patientId: 3, patientName: 'Fernanda Oliveira', professionalId: 1, professionalName: 'Dra. Regiane', date: new Date().toLocaleDateString('pt-BR'), time: '14:00', type: 'Avaliação', notes: '', location: 'Online', status: 'confirmed', reminderStatus: 'pending', paymentStatus: 'paid', clientColor: '#FFE66D' },
  
  // Sessão de outro profissional (Agenda Compartilhada)
  { id: 13, patientId: 4, patientName: 'Roberto Alves', professionalId: 2, professionalName: 'Dra. Ana Costa', date: new Date().toLocaleDateString('pt-BR'), time: '11:00', type: 'Neuropsicologia', notes: '', location: 'Presencial', status: 'confirmed', paymentStatus: 'paid', clientColor: '#A8D5BA' },
  
  // Sessão Cancelada
  { id: 14, patientId: 5, patientName: 'Julia Silva', professionalId: 1, professionalName: 'Dra. Regiane', date: new Date().toLocaleDateString('pt-BR'), time: '16:00', type: 'Retorno', notes: '', location: 'Online', status: 'canceled', paymentStatus: 'none', clientColor: '#D4A5A5' },
];

let APPOINTMENT_REQUESTS: AppointmentRequest[] = [
  { id: 1, requestedAt: '11:00', professional: 'Dra. Regiane O. C. Faria', clientName: 'Juliana Souza Fer...', phone: '(31) 99891-3345', email: 'clara@email.com', origin: 'App do Paciente', status: 'Recusada', dateRequested: '22/10/2023', timeRequested: '11:30' },
  { id: 2, selected: true, requestedAt: '12:00', professional: 'Dra. Ana Costa', clientName: 'Gustavo Lima Mo...', phone: '(31) 99224-1178', email: 'gustavo@email.com', origin: 'Agendamento Online', status: 'Recusada', dateRequested: '19/10/2023', timeRequested: '11:30' },
  { id: 3, requestedAt: '13:00', professional: 'Dr. Roberto Dias', clientName: 'Isabela Silva Me...', phone: '(31) 98823-3321', email: 'isa@email.com', origin: 'Agendamento Online', status: 'Em espera', dateRequested: '17/10/2023', timeRequested: '11:30' },
  { id: 4, requestedAt: '13:30', professional: 'Dra. Regiane O. C. Faria', clientName: 'João da Silva P...', phone: '(31) 99912-1123', email: 'joao@email.com', origin: 'Agendamento Online', status: 'Em espera', dateRequested: '15/10/2023', timeRequested: '14:00' },
];

let TRANSACTIONS: Transaction[] = [
  { id: 1, description: 'Consulta - Ana Beatriz', patientName: 'Ana Beatriz Souza', date: '2024-03-14', amount: 250, type: 'income', status: 'paid', category: 'Consulta' },
  { id: 2, description: 'Consulta - Carlos Eduardo', patientName: 'Carlos Eduardo Lima', date: '2024-03-14', amount: 250, type: 'income', status: 'paid', category: 'Consulta' },
  { id: 3, description: 'Consulta - Fernanda O.', patientName: 'Fernanda Oliveira', date: '2024-03-13', amount: 250, type: 'income', status: 'pending', category: 'Avaliação' },
  { id: 4, description: 'Aluguel Sala 01', date: '2024-03-10', amount: 1500, type: 'expense', status: 'paid', category: 'Infraestrutura' },
  { id: 5, description: 'Consulta - Roberto Dias', date: '2024-03-09', amount: 250, type: 'income', status: 'paid', category: 'Consulta' },
  { id: 6, description: 'Material de Escritório', date: '2024-03-05', amount: 235.50, type: 'expense', status: 'paid', category: 'Materiais' },
  { id: 7, description: 'Internet Banda Larga', date: '2024-03-05', amount: 120, type: 'expense', status: 'pending', category: 'Infraestrutura' },
];

const DOC_TEMPLATES: DocumentTemplate[] = [
  { id: 1, title: 'Recibo de Pagamento', description: 'Geração automática para IR', iconName: 'receipt', color: 'green' },
  { id: 2, title: 'Atestado Psicológico', description: 'Modelo padrão CFP 06/2019', iconName: 'activity', color: 'blue' },
  { id: 3, title: 'Laudo / Relatório', description: 'Parecer técnico detalhado', iconName: 'file-text', color: 'purple' },
  { id: 4, title: 'Contrato Terapêutico', description: 'Termos e acordos da sessão', iconName: 'award', color: 'orange' },
];

const GENERATED_DOCS: PatientDocument[] = [
  { id: 1, title: 'Recibo #4902 - Março', patientName: 'Ana Beatriz Souza', type: 'Recibo', date: '14/03/2024', status: 'signed' },
  { id: 2, title: 'Atestado de Comparecimento', patientName: 'Carlos Eduardo Lima', type: 'Atestado', date: '10/03/2024', status: 'signed' },
  { id: 3, title: 'Relatório de Evolução', patientName: 'Fernanda Oliveira', type: 'Relatório', date: '05/03/2024', status: 'draft' },
];


export const mockDb = {
  getDoctors: () => DOCTORS,
  getStats: () => STATS,
  getPatients: () => PATIENTS,
  getPatientSessions: (patientId: number) => SESSIONS.filter(s => s.patientId === patientId),
  getTransactions: () => [...TRANSACTIONS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  addTransaction: (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Math.floor(Math.random() * 100000) };
    TRANSACTIONS = [newTransaction, ...TRANSACTIONS];
    return newTransaction;
  },
  updateTransaction: (id: number, updates: Partial<Transaction>) => {
    TRANSACTIONS = TRANSACTIONS.map(t => t.id === id ? { ...t, ...updates } : t);
    return TRANSACTIONS.find(t => t.id === id);
  },
  deleteTransaction: (id: number) => {
    TRANSACTIONS = TRANSACTIONS.filter(t => t.id !== id);
    return true;
  },
  getFinancialSummary: (): FinancialSummary => {
    const revenue = TRANSACTIONS.filter(t => t.type === 'income' && t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pending = TRANSACTIONS.filter(t => t.type === 'income' && t.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
    const expenses = TRANSACTIONS.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return { revenue, pending, expenses, recentTransactions: TRANSACTIONS.slice(0, 10) };
  },
  getAppointmentRequests: () => APPOINTMENT_REQUESTS,
  updateAppointmentRequestStatus: (id: number, status: 'Aprovada' | 'Recusada') => {
    APPOINTMENT_REQUESTS = APPOINTMENT_REQUESTS.map(req => req.id === id ? { ...req, status } : req);
    return APPOINTMENT_REQUESTS.find(req => req.id === id);
  },
  getDocumentTemplates: () => DOC_TEMPLATES,
  getGeneratedDocuments: () => GENERATED_DOCS,
  
  // Retorna a agenda do dia com mais detalhes
  getDailySchedule: () => {
    // Filtra apenas sessões que simulamos ser "de hoje" (IDs >= 10)
    return SESSIONS.filter(s => s.id >= 10).sort((a, b) => a.time.localeCompare(b.time));
  },
  
  getDashboardOverview: (): DashboardOverview => {
    const pendingRequests = APPOINTMENT_REQUESTS.filter(r => r.status === 'Em espera').length;
    const pendingFinance = TRANSACTIONS.filter(t => t.type === 'income' && t.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
    const todaySessions = SESSIONS.filter(s => s.id >= 10 && s.id < 13); // Apenas as da Dra. Regiane

    const nextSessions = todaySessions.slice(0, 3).map(s => ({
      time: s.time,
      patientName: s.patientName || 'Paciente',
      type: s.type
    }));

    return {
      totalPatients: PATIENTS.length,
      sessionsToday: todaySessions.length,
      financialPending: pendingFinance,
      nextSessions,
      pendingRequestsCount: pendingRequests,
      todaySchedule: todaySessions.map(s => ({
        id: s.id, time: s.time, patientName: s.patientName || '', type: s.type, status: s.status || 'confirmed'
      }))
    };
  }
};
