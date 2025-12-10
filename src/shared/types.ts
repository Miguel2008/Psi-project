
import React from 'react';

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
}

export interface StatItem {
  id: number;
  label: string;
  value: number;
  suffix: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Patient {
  id: number;
  name: string;
  status: 'Em Acompanhamento' | 'Aguardando Retorno' | 'Novo Paciente';
  lastSession: string;
  image: string;
  condition?: string;
  therapyType?: string;
  prontuario?: string;
  customColor?: string; // Cor personalizada para identificação na agenda
}

export interface Session {
  id: number;
  patientId: number;
  patientName?: string; // Opcional para facilitar display na agenda
  professionalId?: number; // Para agenda compartilhada
  professionalName?: string;
  date: string;
  time: string;
  type: string;
  notes: string;
  location?: 'Online' | 'Presencial';
  status?: 'confirmed' | 'canceled' | 'completed' | 'rescheduled';
  isRecurring?: boolean;
  reminderStatus?: 'sent' | 'pending' | 'failed';
  paymentStatus?: 'paid' | 'pending' | 'none'; // Status financeiro da sessão
  clientColor?: string; // Cor herdada do cliente
}

export interface Transaction {
  id: number;
  description: string;
  patientName?: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'paid' | 'pending';
  category: string;
}

export interface FinancialSummary {
  revenue: number;
  pending: number;
  expenses: number;
  recentTransactions: Transaction[];
}

export interface AppointmentRequest {
  id: number;
  requestedAt: string;
  professional: string;
  clientName: string;
  phone: string;
  email: string;
  origin: string;
  status: 'Aprovada' | 'Recusada' | 'Em espera';
  dateRequested: string;
  timeRequested: string;
  selected?: boolean;
}

export interface DocumentTemplate {
  id: number;
  title: string;
  description: string;
  iconName: 'file-text' | 'receipt' | 'activity' | 'award';
  color: string;
}

export interface PatientDocument {
  id: number;
  title: string;
  patientName: string;
  type: string;
  date: string;
  status: 'signed' | 'draft';
}

export interface DashboardOverview {
  totalPatients: number;
  sessionsToday: number;
  financialPending: number;
  nextSessions: { time: string; patientName: string; type: string }[];
  pendingRequestsCount: number;
  todaySchedule?: { id: number; time: string; patientName: string; type: string; status: string }[];
}
