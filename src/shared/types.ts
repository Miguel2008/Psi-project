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
}

export interface Session {
  id: number;
  patientId: number;
  date: string;
  time: string;
  type: string;
  notes: string;
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