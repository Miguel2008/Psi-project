
import { mockDb } from './data/mock-db';
import { Doctor, Patient, StatItem, Session, FinancialSummary, Transaction } from '../shared/types';

// Simulando delay de rede para parecer uma aplicação real
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const clinicApi = {
  getDoctors: async (): Promise<Doctor[]> => {
    await delay(300);
    return mockDb.getDoctors();
  },

  getStats: async (): Promise<StatItem[]> => {
    await delay(200);
    return mockDb.getStats();
  },

  getPatients: async (): Promise<Patient[]> => {
    await delay(400);
    return mockDb.getPatients();
  },

  getPatientSessions: async (patientId: number): Promise<Session[]> => {
    await delay(300);
    return mockDb.getPatientSessions(patientId);
  },

  // --- FINANCEIRO CRUD ---
  
  getFinancialSummary: async (): Promise<FinancialSummary> => {
    await delay(400);
    return mockDb.getFinancialSummary();
  },

  getTransactions: async (): Promise<Transaction[]> => {
    await delay(300);
    return mockDb.getTransactions();
  },

  createTransaction: async (data: Omit<Transaction, 'id'>): Promise<Transaction> => {
    await delay(500);
    return mockDb.addTransaction(data);
  },

  updateTransaction: async (id: number, data: Partial<Transaction>): Promise<Transaction | undefined> => {
    await delay(400);
    return mockDb.updateTransaction(id, data);
  },

  deleteTransaction: async (id: number): Promise<boolean> => {
    await delay(400);
    return mockDb.deleteTransaction(id);
  }
};
