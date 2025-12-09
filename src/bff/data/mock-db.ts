
import { Doctor, Patient, StatItem, Session, Transaction, FinancialSummary } from '../../shared/types';

// --- DATA ---
const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dr. Miguel Silva', specialty: 'Psicologia Clínica', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop' },
  { id: 2, name: 'Dra. Ana Costa', specialty: 'Neuropsicologia', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop' },
  { id: 3, name: 'Dr. Roberto Dias', specialty: 'Terapia Familiar', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop' },
  { id: 4, name: 'Dra. Julia Lima', specialty: 'Psicologia Infantil', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&auto=format&fit=crop' },
];

const STATS: StatItem[] = [
  { id: 1, label: 'Pacientes Atendidos', value: 10000, suffix: '+' },
  { id: 2, label: 'Anos de Experiência', value: 15, suffix: '+' },
  { id: 3, label: 'Especialistas', value: 25, suffix: '' },
  { id: 4, label: 'Unidades', value: 3, suffix: '' },
];

const PATIENTS: Patient[] = [
  { id: 1, name: 'Ana Beatriz Souza', status: 'Em Acompanhamento', lastSession: '14/03/2024', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop', condition: 'Ansiedade', therapyType: 'TCC', prontuario: '2024-1' },
  { id: 2, name: 'Carlos Eduardo Lima', status: 'Aguardando Retorno', lastSession: '10/03/2024', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop', condition: 'Depressão Leve', therapyType: 'Psicanálise', prontuario: '2024-2' },
  { id: 3, name: 'Fernanda Oliveira', status: 'Novo Paciente', lastSession: '-', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop', condition: 'Avaliação', therapyType: 'N/A', prontuario: '2024-3' },
];

const SESSIONS: Session[] = [
  { id: 1, patientId: 1, date: '14/03/2024', time: '14:00', type: 'Terapia Cognitivo-Comportamental', notes: 'Paciente relatou melhora na ansiedade social após aplicar técnicas de respiração.' },
  { id: 2, patientId: 1, date: '07/03/2024', time: '14:00', type: 'Terapia Cognitivo-Comportamental', notes: 'Trabalhamos questões de autoestima e ambiente de trabalho. Paciente se sente pressionada.' },
  { id: 3, patientId: 1, date: '28/02/2024', time: '14:00', type: 'Anamnese', notes: 'Primeira sessão. Coleta de histórico familiar e queixa principal.' },
];

// Estado mutável para as transações financeiras (In-Memory Database)
let TRANSACTIONS: Transaction[] = [
  { id: 1, description: 'Consulta - Ana Beatriz', patientName: 'Ana Beatriz Souza', date: '2024-03-14', amount: 250, type: 'income', status: 'paid', category: 'Consulta' },
  { id: 2, description: 'Consulta - Carlos Eduardo', patientName: 'Carlos Eduardo Lima', date: '2024-03-14', amount: 250, type: 'income', status: 'paid', category: 'Consulta' },
  { id: 3, description: 'Consulta - Fernanda O.', patientName: 'Fernanda Oliveira', date: '2024-03-13', amount: 250, type: 'income', status: 'pending', category: 'Avaliação' },
  { id: 4, description: 'Aluguel Sala 01', date: '2024-03-10', amount: 1500, type: 'expense', status: 'paid', category: 'Infraestrutura' },
  { id: 5, description: 'Consulta - Roberto Dias', date: '2024-03-09', amount: 250, type: 'income', status: 'paid', category: 'Consulta' },
  { id: 6, description: 'Material de Escritório', date: '2024-03-05', amount: 235.50, type: 'expense', status: 'paid', category: 'Materiais' },
  { id: 7, description: 'Internet Banda Larga', date: '2024-03-05', amount: 120, type: 'expense', status: 'pending', category: 'Infraestrutura' },
];

export const mockDb = {
  getDoctors: () => DOCTORS,
  getStats: () => STATS,
  getPatients: () => PATIENTS,
  getPatientSessions: (patientId: number) => SESSIONS.filter(s => s.patientId === patientId),
  
  // Financeiro CRUD
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
    const revenue = TRANSACTIONS
      .filter(t => t.type === 'income' && t.status === 'paid')
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    const pending = TRANSACTIONS
      .filter(t => t.type === 'income' && t.status === 'pending')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expenses = TRANSACTIONS
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      revenue,
      pending,
      expenses,
      recentTransactions: TRANSACTIONS.slice(0, 10)
    };
  }
};
