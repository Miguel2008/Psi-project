
import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, FileText, LogOut, 
  Search, Plus, MoreHorizontal, Clock, CheckCircle, 
  AlertCircle, ChevronRight, Brain, DollarSign, TrendingUp, CreditCard,
  Trash2, Edit2, Settings, Phone, Mail, Check, X, FileCheck2, Printer, Download, Award, Activity, Receipt,
  Bell, Video, MapPin, Filter, User
} from 'lucide-react';
import Button from '../../components/ui/Button';
import TransactionModal from '../financial/TransactionModal';
import AppointmentModal from '../calendar/AppointmentModal';
import ReminderModal from '../calendar/ReminderModal';
import SessionListModal from '../calendar/SessionListModal';
import { clinicApi } from '../../../bff/api';
import { Patient, Session, FinancialSummary, Transaction, AppointmentRequest, DocumentTemplate, PatientDocument, DashboardOverview } from '../../../shared/types';

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

  // Calendar State
  const [dailySchedule, setDailySchedule] = useState<Session[]>([]);
  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([]);
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'my' | 'shared'>('my');

  // Documents State
  const [docTemplates, setDocTemplates] = useState<DocumentTemplate[]>([]);
  const [generatedDocs, setGeneratedDocs] = useState<PatientDocument[]>([]);

  // Overview State
  const [overviewData, setOverviewData] = useState<DashboardOverview | null>(null);
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const pts = await clinicApi.getPatients();
      setPatients(pts);
      if (pts.length > 0) {
        setSelectedPatient(pts[0].id);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadSessions = async () => {
      if (selectedPatient) {
        const sess = await clinicApi.getPatientSessions(selectedPatient);
        setSessions(sess);
      }
    };
    loadSessions();
  }, [selectedPatient]);

  useEffect(() => {
    if (activeTab === 'financial') {
      loadFinancialData();
    } else if (activeTab === 'calendar') {
      loadCalendarData();
    } else if (activeTab === 'docs') {
      loadDocsData();
    } else if (activeTab === 'dashboard') {
      loadOverviewData();
    }
  }, [activeTab]);

  const loadFinancialData = async () => {
    const summary = await clinicApi.getFinancialSummary();
    const txs = await clinicApi.getTransactions();
    setFinancialSummary(summary);
    setTransactions(txs);
  };

  const loadCalendarData = async () => {
    const schedule = await clinicApi.getDailySchedule();
    setDailySchedule(schedule);
    const reqs = await clinicApi.getAppointmentRequests();
    setAppointmentRequests(reqs);
  }

  const loadDocsData = async () => {
    const templates = await clinicApi.getDocumentTemplates();
    const docs = await clinicApi.getGeneratedDocuments();
    setDocTemplates(templates);
    setGeneratedDocs(docs);
  }

  const loadOverviewData = async () => {
    const data = await clinicApi.getDashboardOverview();
    setOverviewData(data);
  }

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

  const handleUpdateAppointmentStatus = async (id: number, status: 'Aprovada' | 'Recusada') => {
    await clinicApi.updateAppointmentRequestStatus(id, status);
    await loadCalendarData();
  }

  const openEditModal = (tx: Transaction) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTx(null);
    setIsTxModalOpen(true);
  };

  const getDocIcon = (iconName: string, size = 24) => {
    switch (iconName) {
      case 'receipt': return <Receipt size={size} />;
      case 'activity': return <Activity size={size} />;
      case 'award': return <Award size={size} />;
      default: return <FileText size={size} />;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Filter Schedule based on View
  const filteredSchedule = calendarView === 'shared' 
    ? dailySchedule 
    : dailySchedule.filter(s => s.professionalId === 1 || !s.professionalId); // Mock ID 1 is current user

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-['Poppins']">
      
      <aside className="w-64 bg-[#1B2A4E] text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 flex items-center gap-2 border-b border-white/10">
          <Brain className="text-[#70C528]" size={28} />
          <span className="text-xl font-bold">MindCare <span className="text-[#70C528] text-xs align-top">SYS</span></span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-[#70C528] text-white shadow-lg shadow-[#70C528]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <Clock size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('patients')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'patients' ? 'bg-[#70C528] text-white shadow-lg shadow-[#70C528]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <Users size={20} /> Pacientes
          </button>
          <button onClick={() => setActiveTab('calendar')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'calendar' ? 'bg-[#70C528] text-white shadow-lg shadow-[#70C528]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <Calendar size={20} /> Agenda
          </button>
          <button onClick={() => setActiveTab('financial')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'financial' ? 'bg-[#70C528] text-white shadow-lg shadow-[#70C528]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <DollarSign size={20} /> Financeiro
          </button>
          <button onClick={() => setActiveTab('docs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'docs' ? 'bg-[#70C528] text-white shadow-lg shadow-[#70C528]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <FileText size={20} /> Documentos
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} /> Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden flex flex-col relative">
        <header className="bg-white h-20 border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-2xl font-bold text-[#1B2A4E]">
            {activeTab === 'patients' ? 'Prontuário Eletrônico' : 
             activeTab === 'financial' ? 'Gestão Financeira' : 
             activeTab === 'calendar' ? 'Agenda Inteligente' : 
             activeTab === 'docs' ? 'Emissão de Documentos' : 'Visão Geral'}
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <AlertCircle size={24} className="text-gray-400 hover:text-[#70C528] cursor-pointer transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=100&auto=format&fit=crop" alt="Dra. Regiane O. C. Faria" className="w-10 h-10 rounded-full object-cover border-2 border-[#70C528]" />
              <div className="text-sm">
                <p className="font-bold text-[#1B2A4E]">Dra. Regiane O. C. Faria</p>
                <p className="text-gray-500 text-xs">Psicóloga Clínica</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          
          {activeTab === 'dashboard' && overviewData && (
             <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-bold text-[#1B2A4E]">Olá, Dra. Regiane 👋</h1>
                    <p className="text-gray-500 capitalize">{currentDate}</p>
                  </div>
                  <Button onClick={() => setActiveTab('patients')} className="shadow-md">
                     <Plus size={18} className="mr-2 inline" /> Novo Atendimento
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-pointer" onClick={() => setIsSessionListOpen(true)}>
                     <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Sessões Hoje</p>
                        <h3 className="text-3xl font-bold text-[#1B2A4E]">{overviewData.sessionsToday}</h3>
                     </div>
                     <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Video size={28} />
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                     <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Pacientes Ativos</p>
                        <h3 className="text-3xl font-bold text-[#1B2A4E]">{overviewData.totalPatients}</h3>
                     </div>
                     <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-[#70C528]">
                        <Users size={28} />
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveTab('financial')}>
                     <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">A Receber</p>
                        <h3 className="text-3xl font-bold text-orange-500">R$ {overviewData.financialPending.toFixed(2).replace('.', ',')}</h3>
                     </div>
                     <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                        <Clock size={28} />
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   {/* Próximos Atendimentos */}
                   <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-[#1B2A4E] text-lg">Próximos Atendimentos</h3>
                         <Button variant="outline" className="text-xs px-3 py-1 h-auto" onClick={() => setActiveTab('calendar')}>Ver Agenda</Button>
                      </div>
                      <div className="space-y-4 flex-1">
                        {overviewData.nextSessions.map((session, i) => (
                           <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                              <div className="bg-blue-50 text-blue-600 font-bold p-3 rounded-lg text-center min-w-[70px]">
                                 {session.time}
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-bold text-[#1B2A4E]">{session.patientName}</h4>
                                 <p className="text-xs text-gray-500">{session.type}</p>
                              </div>
                              <Button className="w-8 h-8 rounded-full p-0 flex items-center justify-center shadow-none"><ChevronRight size={16}/></Button>
                           </div>
                        ))}
                        {overviewData.nextSessions.length === 0 && <p className="text-gray-400 text-center py-4">Nenhum atendimento próximo.</p>}
                      </div>
                   </div>

                   {/* Pendências */}
                   <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
                      <h3 className="font-bold text-[#1B2A4E] text-lg mb-4">Atenção Necessária</h3>
                      <div className="space-y-3 flex-1">
                         {overviewData.pendingRequestsCount > 0 && (
                            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3 items-start cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => setActiveTab('calendar')}>
                               <AlertCircle className="text-orange-500 mt-1" size={18} />
                               <div>
                                  <p className="font-bold text-orange-700 text-sm">{overviewData.pendingRequestsCount} Solicitações de Agenda</p>
                                  <p className="text-xs text-orange-600/80">Novos pacientes aguardando confirmação.</p>
                               </div>
                            </div>
                         )}
                         {overviewData.financialPending > 0 && (
                            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3 items-start cursor-pointer hover:bg-red-100 transition-colors" onClick={() => setActiveTab('financial')}>
                               <DollarSign className="text-red-500 mt-1" size={18} />
                               <div>
                                  <p className="font-bold text-red-700 text-sm">R$ {overviewData.financialPending} em Pendências</p>
                                  <p className="text-xs text-red-600/80">Pagamentos de sessões em aberto.</p>
                               </div>
                            </div>
                         )}
                         {overviewData.pendingRequestsCount === 0 && overviewData.financialPending === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-4">
                               <CheckCircle size={48} className="text-green-100 mb-2" />
                               <p>Tudo em dia! Nenhuma pendência urgente.</p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                   <h3 className="font-bold text-[#1B2A4E] text-lg mb-4">Acesso Rápido</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" onClick={() => setActiveTab('calendar')} className="justify-center">Ver Agenda Completa</Button>
                      <Button variant="outline" onClick={() => setActiveTab('financial')} className="justify-center">Ver Financeiro</Button>
                      <Button variant="outline" onClick={() => setActiveTab('patients')} className="justify-center">Lista de Pacientes</Button>
                      <Button variant="outline" onClick={() => setActiveTab('docs')} className="justify-center">Emitir Documento</Button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'calendar' && (
             <div className="flex gap-6 h-full animate-[fadeIn_0.3s_ease-out]">
                {/* Timeline Visual (Left/Main) */}
                <div className="w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                   
                   {/* Calendar Header with Filters */}
                   <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#1B2A4E] text-lg">Agenda Diária</h3>
                          <div className="flex bg-gray-100 rounded-lg p-1 ml-4">
                             <button 
                                onClick={() => setCalendarView('my')}
                                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${calendarView === 'my' ? 'bg-white text-[#1B2A4E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                             >
                               Minha Agenda
                             </button>
                             <button 
                                onClick={() => setCalendarView('shared')}
                                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${calendarView === 'shared' ? 'bg-white text-[#1B2A4E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                             >
                               Agenda Compartilhada
                             </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 capitalize">{currentDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button className="py-2 px-4 text-sm" onClick={() => setIsApptModalOpen(true)}>
                           <Plus size={16} className="mr-2" /> Agendar
                        </Button>
                      </div>
                   </div>

                   {/* Legend */}
                   <div className="bg-gray-50 px-6 py-2 border-b border-gray-100 flex gap-4 text-[10px] text-gray-500 font-medium overflow-x-auto">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Confirmado</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Pagamento Pendente</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400"></div> Cancelado</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Outro Profissional</div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border-2 border-purple-400"></div> Cor do Cliente</div>
                   </div>

                   {/* Timeline Slots */}
                   <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
                      {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => {
                         // Find appointment for this time slot
                         const appt = filteredSchedule.find(s => s.time === time);
                         const isOtherPro = appt && appt.professionalId !== 1;
                         
                         // Determine visual style based on status
                         let cardClass = "border-l-4 border-gray-300 bg-white";
                         let statusBadge = null;

                         if (appt) {
                            if (appt.status === 'canceled') {
                               cardClass = "border-l-4 border-red-400 bg-red-50 opacity-75";
                            } else if (isOtherPro) {
                               cardClass = "border-l-4 border-blue-400 bg-blue-50";
                            } else if (appt.paymentStatus === 'pending') {
                               cardClass = "border-l-4 border-yellow-400 bg-yellow-50";
                            } else {
                               cardClass = "border-l-4 border-green-500 bg-white shadow-sm";
                            }
                         }

                         // Custom Client Color Override
                         const customStyle = appt?.clientColor ? { borderLeftColor: appt.clientColor } : {};

                         return (
                           <div key={time} className="flex gap-4 mb-4 min-h-[80px]">
                              <span className="text-sm font-bold text-gray-400 w-12 pt-2">{time}</span>
                              
                              <div className="flex-1">
                                 {appt ? (
                                    <div 
                                      className={`h-full rounded-r-xl border border-gray-100 p-3 flex justify-between items-start transition-all hover:shadow-md ${cardClass}`}
                                      style={customStyle}
                                    >
                                       <div>
                                          <div className="flex items-center gap-2">
                                             <h4 className="font-bold text-[#1B2A4E]">{appt.patientName}</h4>
                                             {/* Client Color Dot */}
                                             {appt.clientColor && <div className="w-2 h-2 rounded-full" style={{backgroundColor: appt.clientColor}} title="Cor Personalizada do Cliente"></div>}
                                             {isOtherPro && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-2">{appt.professionalName}</span>}
                                          </div>
                                          
                                          <div className="flex items-center gap-3 mt-1">
                                             <span className="text-xs text-gray-500 bg-white/50 px-1.5 rounded">{appt.type}</span>
                                             <span className="flex items-center gap-1 text-xs text-gray-500">
                                                {appt.location === 'Online' ? <Video size={12}/> : <MapPin size={12}/>}
                                                {appt.location}
                                             </span>
                                          </div>
                                       </div>

                                       <div className="flex flex-col items-end gap-1">
                                          {appt.status !== 'canceled' && (
                                             <div className="flex gap-1" title={appt.paymentStatus === 'paid' ? "Pagamento Confirmado" : "Pagamento Pendente"}>
                                                {appt.paymentStatus === 'paid' ? 
                                                   <DollarSign size={14} className="text-green-600" /> : 
                                                   <DollarSign size={14} className="text-yellow-500" />
                                                }
                                             </div>
                                          )}
                                          {appt.status === 'canceled' && <span className="text-xs font-bold text-red-500 uppercase">Cancelado</span>}
                                       </div>
                                    </div>
                                 ) : (
                                    <div className="h-full rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex items-center justify-center hover:bg-white hover:border-[#70C528] group transition-colors cursor-pointer" onClick={() => setIsApptModalOpen(true)}>
                                       <span className="text-xs text-gray-400 group-hover:text-[#70C528] flex items-center gap-1">
                                          <Plus size={14}/> Disponível
                                       </span>
                                    </div>
                                 )}
                              </div>
                           </div>
                         );
                      })}
                   </div>
                </div>

                {/* Right Sidebar (Automations & Requests) */}
                <div className="w-1/3 flex flex-col gap-6">
                   {/* Automation Panel */}
                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-[#1B2A4E]">Automação</h3>
                         <button onClick={() => setIsReminderModalOpen(true)} className="text-xs text-[#70C528] font-bold hover:underline">Configurar</button>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                               <div className="bg-[#25D366] text-white p-2 rounded-lg"><Phone size={16}/></div>
                               <div>
                                  <p className="text-sm font-bold text-[#1B2A4E]">WhatsApp</p>
                                  <p className="text-xs text-gray-500">Lembretes 24h antes</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xs font-bold text-green-600">Ativo</p>
                               <p className="text-[10px] text-gray-400">98% entregue</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                               <div className="bg-blue-500 text-white p-2 rounded-lg"><Mail size={16}/></div>
                               <div>
                                  <p className="text-sm font-bold text-[#1B2A4E]">E-mail</p>
                                  <p className="text-xs text-gray-500">Confirmação imediata</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xs font-bold text-green-600">Ativo</p>
                               <p className="text-[10px] text-gray-400">100% entregue</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Appointment Requests List */}
                   <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                         <h3 className="font-bold text-[#1B2A4E] text-sm">Solicitações Online</h3>
                         <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{appointmentRequests.filter(r => r.status === 'Em espera').length} Novas</span>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                         {appointmentRequests.filter(r => r.status === 'Em espera').map(req => (
                            <div key={req.id} className="p-3 border border-gray-100 rounded-xl bg-white shadow-sm">
                               <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-[#1B2A4E] text-sm">{req.clientName}</h4>
                                  <span className="text-[10px] text-gray-400">{req.dateRequested}</span>
                               </div>
                               <p className="text-xs text-gray-600 mb-3">Deseja: {req.timeRequested} com {req.professional.split(' ')[1]}</p>
                               <div className="flex gap-2">
                                  <button onClick={() => handleUpdateAppointmentStatus(req.id, 'Aprovada')} className="flex-1 bg-green-50 text-green-700 text-xs py-1.5 rounded-lg font-medium hover:bg-green-100">Aprovar</button>
                                  <button onClick={() => handleUpdateAppointmentStatus(req.id, 'Recusada')} className="flex-1 bg-red-50 text-red-700 text-xs py-1.5 rounded-lg font-medium hover:bg-red-100">Recusar</button>
                               </div>
                            </div>
                         ))}
                         {appointmentRequests.filter(r => r.status === 'Em espera').length === 0 && (
                            <p className="text-center text-xs text-gray-400 mt-4">Nenhuma solicitação pendente.</p>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'patients' && (
             <div className="flex gap-8 h-full">
               <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  {/* ... Patient List ... */}
                  <div className="p-6 border-b border-gray-100">
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input type="text" placeholder="Buscar paciente..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-[#70C528]/20 text-sm" />
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                     {patients.map(patient => (
                        <div key={patient.id} onClick={() => setSelectedPatient(patient.id)} className={`p-4 flex items-center gap-4 cursor-pointer transition-colors border-b border-gray-50 hover:bg-gray-50 ${selectedPatient === patient.id ? 'bg-[#70C528]/5 border-l-4 border-l-[#70C528]' : 'border-l-4 border-l-transparent'}`}>
                           <img src={patient.image} alt={patient.name} className="w-12 h-12 rounded-full object-cover" />
                           <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-[#1B2A4E] truncate">{patient.name}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${patient.status === 'Em Acompanhamento' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{patient.status}</span>
                           </div>
                           <ChevronRight size={16} className="text-gray-300" />
                        </div>
                     ))}
                  </div>
               </div>
               <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                  {/* ... Patient Details ... */}
                  {selectedPatient ? (
                     <>
                        <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                           <div className="flex gap-6">
                              <img src={patients.find(p => p.id === selectedPatient)?.image} className="w-24 h-24 rounded-2xl object-cover shadow-md" alt="Patient" />
                              <div>
                                 <h2 className="text-2xl font-bold text-[#1B2A4E]">{patients.find(p => p.id === selectedPatient)?.name}</h2>
                                 {/* Custom Color Badge */}
                                 {patients.find(p => p.id === selectedPatient)?.customColor && (
                                    <span className="text-[10px] px-2 py-0.5 rounded text-white ml-2 align-middle" style={{backgroundColor: patients.find(p => p.id === selectedPatient)?.customColor}}>Cor Agenda</span>
                                 )}
                                 <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Clock size={14}/> Última sessão: {patients.find(p => p.id === selectedPatient)?.lastSession}</span>
                                    <span className="flex items-center gap-1"><FileText size={14}/> Prontuário Nº: {patients.find(p => p.id === selectedPatient)?.prontuario}</span>
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
                              <Button className="py-2 px-4 text-sm flex items-center gap-2"><Plus size={16} /> Nova Evolução</Button>
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
                  ) : <div className="flex-1 flex items-center justify-center text-gray-400">Selecione um paciente</div>}
               </div>
             </div>
          )}

          {activeTab === 'financial' && financialSummary && (
             <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
               <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#1B2A4E]">Visão Geral Financeira</h3>
                  <Button onClick={openCreateModal} className="shadow-md text-sm"><Plus size={16} className="mr-2 inline" /> Novo Lançamento</Button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                       <p className="text-gray-500 text-sm mb-1">Receita Confirmada</p>
                       <h3 className="text-2xl font-bold text-[#1B2A4E]">R$ {financialSummary.revenue.toFixed(2).replace('.', ',')}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                       <TrendingUp size={24} />
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                       <p className="text-gray-500 text-sm mb-1">A Receber</p>
                       <h3 className="text-2xl font-bold text-orange-500">R$ {financialSummary.pending.toFixed(2).replace('.', ',')}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                       <Clock size={24} />
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                       <p className="text-gray-500 text-sm mb-1">Despesas</p>
                       <h3 className="text-2xl font-bold text-red-500">- R$ {financialSummary.expenses.toFixed(2).replace('.', ',')}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                       <CreditCard size={24} />
                    </div>
                 </div>
               </div>
               
               <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                  <h3 className="font-bold text-[#1B2A4E] mb-6">Lançamentos Recentes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-sm">
                          <th className="pb-3 pl-2">Descrição</th>
                          <th className="pb-3">Data</th>
                          <th className="pb-3">Categoria</th>
                          <th className="pb-3">Valor</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right pr-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {transactions.map(t => (
                          <tr key={t.id} className="hover:bg-gray-50 group">
                            <td className="py-4 pl-2 font-medium text-[#1B2A4E]">{t.description}</td>
                            <td className="py-4 text-sm text-gray-500">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                            <td className="py-4 text-sm"><span className="bg-gray-100 px-2 py-1 rounded text-gray-600 text-xs">{t.category}</span></td>
                            <td className={`py-4 font-bold text-sm ${t.type === 'expense' ? 'text-red-500' : 'text-green-600'}`}>
                               {t.type === 'expense' ? '-' : '+'} R$ {t.amount.toFixed(2).replace('.', ',')}
                            </td>
                            <td className="py-4">
                               <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                  {t.status === 'paid' ? 'Pago' : 'Pendente'}
                               </span>
                            </td>
                            <td className="py-4 text-right pr-2">
                               <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => openEditModal(t)} className="p-1 text-gray-400 hover:text-blue-500"><Edit2 size={16}/></button>
                                  <button onClick={() => handleDeleteTransaction(t.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
             </div>
          )}

          {activeTab === 'docs' && (
             <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                <h3 className="font-bold text-[#1B2A4E] text-lg">Biblioteca de Modelos</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   {docTemplates.map(template => (
                      <div key={template.id} className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group ${getColorClass(template.color)} bg-opacity-10 border-opacity-50`}>
                         <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${getColorClass(template.color)}`}>
                            {getDocIcon(template.iconName)}
                         </div>
                         <h4 className="font-bold text-[#1B2A4E] mb-2 group-hover:text-[#70C528] transition-colors">{template.title}</h4>
                         <p className="text-xs text-gray-500">{template.description}</p>
                      </div>
                   ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                   <div className="p-6 border-b border-gray-100">
                      <h3 className="font-bold text-[#1B2A4E]">Documentos Emitidos</h3>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                               <th className="px-6 py-4 font-semibold">Documento</th>
                               <th className="px-6 py-4 font-semibold">Paciente</th>
                               <th className="px-6 py-4 font-semibold">Data</th>
                               <th className="px-6 py-4 font-semibold">Status</th>
                               <th className="px-6 py-4 text-right font-semibold">Ações</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50">
                            {generatedDocs.map(doc => (
                               <tr key={doc.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded text-gray-500"><FileText size={16}/></div>
                                        <span className="font-medium text-[#1B2A4E] text-sm">{doc.title}</span>
                                     </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">{doc.patientName}</td>
                                  <td className="px-6 py-4 text-sm text-gray-500">{doc.date}</td>
                                  <td className="px-6 py-4">
                                     <span className={`text-xs px-2 py-1 rounded-full border ${doc.status === 'signed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                        {doc.status === 'signed' ? 'Assinado Digitalmente' : 'Rascunho'}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-500" title="Imprimir"><Printer size={16}/></button>
                                        <button className="p-2 hover:bg-[#70C528]/10 rounded-lg text-[#70C528]" title="Baixar PDF"><Download size={16}/></button>
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
          )}
          
          <AppointmentModal isOpen={isApptModalOpen} onClose={() => setIsApptModalOpen(false)} onSave={() => { setIsApptModalOpen(false); loadCalendarData(); }} />
          <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} onSave={() => setIsReminderModalOpen(false)} />
          <TransactionModal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} onSave={editingTx ? handleUpdateTransaction : handleCreateTransaction} initialData={editingTx} isLoading={isLoading} />
          <SessionListModal isOpen={isSessionListOpen} onClose={() => setIsSessionListOpen(false)} sessions={overviewData?.todaySchedule || []} />
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
