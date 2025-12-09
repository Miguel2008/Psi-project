
import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, FileText, LogOut, 
  Search, Plus, MoreHorizontal, Clock, CheckCircle, 
  AlertCircle, ChevronRight, Brain, DollarSign, TrendingUp, CreditCard,
  Trash2, Edit2, Settings
} from 'lucide-react';
import Button from '../../components/ui/Button';
import TransactionModal from '../financial/TransactionModal';
import { clinicApi } from '../../../bff/api';
import { Patient, Session, FinancialSummary, Transaction } from '../../../shared/types';

interface DashboardProps {
  onLogout: () => void;
  initialTab?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, initialTab = 'patients' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(1);
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const pts = await clinicApi.getPatients();
      setPatients(pts);
      if (pts.length > 0) {
        const sess = await clinicApi.getPatientSessions(pts[0].id);
        setSessions(sess);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'financial') {
      loadFinancialData();
    }
  }, [activeTab]);

  const loadFinancialData = async () => {
    const summary = await clinicApi.getFinancialSummary();
    const txs = await clinicApi.getTransactions();
    setFinancialSummary(summary);
    setTransactions(txs);
  };

  const handleCreateTransaction = async (data: Omit<Transaction, 'id'>) => {
    setIsLoading(true);
    await clinicApi.createTransaction(data);
    await loadFinancialData();
    setIsLoading(false);
    setIsTxModalOpen(false);
  };

  const handleUpdateTransaction = async (data: Omit<Transaction, 'id'>) => {
    if (!editingTx) return;
    setIsLoading(true);
    await clinicApi.updateTransaction(editingTx.id, data);
    await loadFinancialData();
    setIsLoading(false);
    setIsTxModalOpen(false);
    setEditingTx(null);
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      await clinicApi.deleteTransaction(id);
      await loadFinancialData();
    }
  };

  const openEditModal = (tx: Transaction) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTx(null);
    setIsTxModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-['Poppins']">
      
      <aside className="w-64 bg-[#1B2A4E] text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 flex items-center gap-2 border-b border-white/10">
          <Brain className="text-[#70C528]" size={28} />
          <span className="text-xl font-bold">MindCare <span className="text-[#70C528] text-xs align-top">SYS</span></span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-[#70C528] text-white shadow-lg shadow-[#70C528]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Clock size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'patients' ? 'bg-[#70C528] text-white shadow-lg shadow-[#70C528]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Users size={20} /> Pacientes
          </button>
          <button 
             onClick={() => setActiveTab('calendar')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'calendar' ? 'bg-[#70C528] text-white shadow-lg shadow-[#70C528]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Calendar size={20} /> Agenda
          </button>
          <button 
             onClick={() => setActiveTab('financial')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'financial' ? 'bg-[#70C528] text-white shadow-lg shadow-[#70C528]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <DollarSign size={20} /> Financeiro
          </button>
          <button 
             onClick={() => setActiveTab('docs')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'docs' ? 'bg-[#70C528] text-white shadow-lg shadow-[#70C528]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <FileText size={20} /> Documentos
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} /> Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden flex flex-col relative">
        <header className="bg-white h-20 border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-2xl font-bold text-[#1B2A4E]">
            {activeTab === 'patients' ? 'Prontuário Eletrônico' : activeTab === 'financial' ? 'Gestão Financeira' : 'Dashboard'}
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <AlertCircle size={24} className="text-gray-400 hover:text-[#70C528] cursor-pointer transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=100&auto=format&fit=crop" 
                alt="Dr. Miguel" 
                className="w-10 h-10 rounded-full object-cover border-2 border-[#70C528]" 
              />
              <div className="text-sm">
                <p className="font-bold text-[#1B2A4E]">Dr. Miguel Silva</p>
                <p className="text-gray-500 text-xs">Psicólogo Clínico</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          
          {activeTab === 'patients' && (
            <div className="flex gap-8 h-full">
              <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar paciente..." 
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-[#70C528]/20 text-sm"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {patients.map(patient => (
                    <div 
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient.id)}
                      className={`p-4 flex items-center gap-4 cursor-pointer transition-colors border-b border-gray-50 hover:bg-gray-50 ${selectedPatient === patient.id ? 'bg-[#70C528]/5 border-l-4 border-l-[#70C528]' : 'border-l-4 border-l-transparent'}`}
                    >
                      <img src={patient.image} alt={patient.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1B2A4E] truncate">{patient.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${patient.status === 'Em Acompanhamento' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {patient.status}
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <Button fullWidth className="text-sm py-2 shadow-none">+ Novo Paciente</Button>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                {selectedPatient ? (
                  <>
                    <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                      <div className="flex gap-6">
                        <img 
                          src={patients.find(p => p.id === selectedPatient)?.image} 
                          className="w-24 h-24 rounded-2xl object-cover shadow-md"
                          alt="Patient"
                        />
                        <div>
                          <h2 className="text-2xl font-bold text-[#1B2A4E]">{patients.find(p => p.id === selectedPatient)?.name}</h2>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                             <span className="flex items-center gap-1"><Clock size={14}/> Última sessão: {patients.find(p => p.id === selectedPatient)?.lastSession}</span>
                             <span className="flex items-center gap-1"><FileText size={14}/> Prontuário Nº: {patients.find(p => p.id === selectedPatient)?.prontuario}</span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">{patients.find(p => p.id === selectedPatient)?.condition}</span>
                            <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">{patients.find(p => p.id === selectedPatient)?.therapyType}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="border-gray-200 text-sm py-2 px-4 hover:bg-white"><Settings size={16}/></Button>
                    </div>

                    <div className="flex border-b border-gray-100 px-8">
                       <button className="py-4 px-2 border-b-2 border-[#70C528] text-[#70C528] font-semibold text-sm mr-6">Evolução</button>
                       <button className="py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-gray-600 font-medium text-sm mr-6 transition-colors">Dados Pessoais</button>
                       <button className="py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors">Anexos</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 bg-[#FAFAFA]">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#1B2A4E]">Histórico de Sessões</h3>
                        <Button className="py-2 px-4 text-sm flex items-center gap-2">
                           <Plus size={16} /> Nova Evolução
                        </Button>
                      </div>

                      <div className="space-y-6 relative before:absolute before:left-[19px] before:top-4 before:bottom-0 before:w-[2px] before:bg-gray-200">
                        {sessions.map((session) => (
                          <div key={session.id} className="relative pl-12 group">
                             <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border-2 border-[#70C528] flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                                <CheckCircle size={20} className="text-[#70C528]" />
                             </div>
                             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between mb-2">
                                   <span className="font-bold text-[#1B2A4E] text-lg">{session.date} <span className="text-gray-400 text-sm font-normal ml-2">{session.time}</span></span>
                                   <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
                                </div>
                                <h4 className="text-sm font-semibold text-[#70C528] mb-2">{session.type}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{session.notes}</p>
                             </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    Selecione um paciente
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'financial' && financialSummary && (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                   <div>
                      <p className="text-gray-500 text-sm mb-1">Receita Mensal</p>
                      <h3 className="text-2xl font-bold text-[#1B2A4E]">
                        R$ {financialSummary.revenue.toFixed(2).replace('.', ',')}
                      </h3>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <TrendingUp size={24} />
                   </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                   <div>
                      <p className="text-gray-500 text-sm mb-1">A Receber (Pendente)</p>
                      <h3 className="text-2xl font-bold text-orange-500">
                        R$ {financialSummary.pending.toFixed(2).replace('.', ',')}
                      </h3>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Clock size={24} />
                   </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                   <div>
                      <p className="text-gray-500 text-sm mb-1">Despesas Operacionais</p>
                      <h3 className="text-2xl font-bold text-red-500">
                        - R$ {financialSummary.expenses.toFixed(2).replace('.', ',')}
                      </h3>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <CreditCard size={24} />
                   </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 h-auto">
                <div className="w-full md:w-2/3 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                   <h3 className="font-bold text-[#1B2A4E] mb-6">Fluxo de Caixa (Semestral)</h3>
                   <div className="flex-1 flex items-end justify-between gap-4 h-64">
                      {[
                        { m: 'Out', v: 60 }, { m: 'Nov', v: 75 }, { m: 'Dez', v: 50 }, 
                        { m: 'Jan', v: 80 }, { m: 'Fev', v: 90 }, { m: 'Mar', v: 100 }
                      ].map((bar, i) => (
                         <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                            <div className="relative w-full bg-gray-100 rounded-t-lg h-full overflow-hidden">
                               <div 
                                  className="absolute bottom-0 w-full bg-[#70C528] rounded-t-lg transition-all duration-1000 group-hover:bg-[#1B2A4E]" 
                                  style={{ height: `${bar.v}%` }}
                               ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-400">{bar.m}</span>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="w-full md:w-1/3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[500px]">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-[#1B2A4E]">Lançamentos</h3>
                      <button 
                        onClick={openCreateModal}
                        className="bg-[#1B2A4E] text-white p-2 rounded-lg hover:bg-[#70C528] transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                   </div>
                   
                   <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                      {transactions.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm mt-10">Nenhum lançamento encontrado.</p>
                      ) : (
                        transactions.map((t) => (
                          <div key={t.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 group">
                              <div className="flex-1 min-w-0 mr-4">
                                <p className="font-bold text-sm text-[#1B2A4E] truncate">{t.description}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-gray-400">{t.date.split('-').reverse().slice(0,2).join('/')}</p>
                                  <span className={`text-[10px] px-1.5 rounded-full ${t.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {t.status === 'paid' ? 'Pago' : 'Pendente'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-1">
                                <span className={`font-bold text-sm ${t.type === 'expense' ? 'text-red-500' : 'text-[#70C528]'}`}>
                                    {t.type === 'expense' ? '-' : '+'} R$ {t.amount.toFixed(2)}
                                </span>
                                
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => openEditModal(t)} className="text-gray-400 hover:text-blue-500">
                                    <Edit2 size={14} />
                                  </button>
                                  <button onClick={() => handleDeleteTransaction(t.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
              </div>

              <TransactionModal 
                isOpen={isTxModalOpen}
                onClose={() => setIsTxModalOpen(false)}
                onSave={editingTx ? handleUpdateTransaction : handleCreateTransaction}
                initialData={editingTx}
                isLoading={isLoading}
              />
            </div>
          )}

          {activeTab !== 'patients' && activeTab !== 'financial' && (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="bg-white p-8 rounded-full shadow-lg mb-6">
                   <Settings size={48} className="text-[#1B2A4E]" />
                </div>
                <h3 className="text-xl font-bold text-[#1B2A4E] mb-2">Módulo em Desenvolvimento</h3>
                <p>Esta funcionalidade estará disponível na próxima atualização do sistema.</p>
                <Button variant="outline" className="mt-6" onClick={() => setActiveTab('patients')}>
                   Voltar para Pacientes
                </Button>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
