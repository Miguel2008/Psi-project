
import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { 
  Menu, X, Clock, Users, Brain, Activity, 
  MapPin, Phone, Mail, Instagram, Facebook, Linkedin, 
  ChevronRight, ChevronDown, Star, LogIn, FileText, BookOpen,
  ShieldCheck, FileCheck, DollarSign
} from 'lucide-react';
import Button from './src/client/components/ui/Button';
import WhatsAppBtn from './src/client/components/ui/WhatsAppBtn';
import Modal from './src/client/components/ui/Modal';
import LoginModal from './components/LoginModal'; 
import PaymentModal from './components/PaymentModal'; 
import Dashboard from './src/client/features/dashboard/Dashboard'; 
import { Doctor, StatItem } from './src/shared/types';
import { clinicApi } from './src/bff/api';

// --- Main Component ---
const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<StatItem[]>([]);
  
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardInitialTab, setDashboardInitialTab] = useState('patients');
  
  // Animation State for Contact Section
  const [isContactVisible, setIsContactVisible] = useState(false);
  const contactCardRef = useRef<HTMLDivElement>(null);

  // Load Initial Data from BFF
  useEffect(() => {
    const initData = async () => {
      const stats = await clinicApi.getStats();
      setAnimatedStats(stats.map(s => ({ ...s, currentValue: 0 })));
    };
    initData();
  }, []);

  // Simple animation for stats
  useEffect(() => {
    if (animatedStats.length === 0) return;
    
    const interval = setInterval(() => {
      setAnimatedStats(prev => prev.map((stat) => {
        const target = stat.value;
        const step = Math.ceil(target / 100);
        if ((stat as any).currentValue < target) {
          return { ...stat, currentValue: Math.min((stat as any).currentValue + step, target) };
        }
        return stat;
      }));
    }, 20);
    return () => clearInterval(interval);
  }, [animatedStats.length > 0]); 

  // Intersection Observer for Contact Card Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsContactVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.1 }
    );

    if (contactCardRef.current) {
      observer.observe(contactCardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // Mock de envio sem erro para demonstração
      setTimeout(() => {
          setShowPaymentModal(true);
          (e.target as HTMLFormElement).reset();
          setIsSubmitting(false);
      }, 1000);
      
    } catch (error) {
      console.error("Erro no envio:", error);
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowModal(true); 
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDashboardInitialTab('patients'); 
  };

  const openFinancialDemo = () => {
    setDashboardInitialTab('financial');
    setShowLoginModal(true);
  };

  // --- CALENDAR MOCK DATA ---
  // Cria uma data para "amanhã às 14:00" para teste
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);
  
  const endTime = new Date(tomorrow);
  endTime.setHours(14, 50, 0, 0); // 50 min session

  const calendarData = {
    title: "Sessão de Terapia - MindCare Saúde",
    description: "Sessão de terapia online via plataforma segura. Acesse o link enviado por e-mail 10 minutos antes.",
    location: "Online (Google Meet / Zoom)",
    startTime: tomorrow,
    endTime: endTime
  };

  // --- RENDER DASHBOARD IF LOGGED IN ---
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} initialTab={dashboardInitialTab} />;
  }

  // --- RENDER LANDING PAGE IF NOT LOGGED IN ---
  return (
    <div className="min-h-screen bg-white text-[#1B2A4E] overflow-x-hidden font-['Poppins']">
      
      {/* --- HEADER --- */}
      <header className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleScrollTo('hero')}>
            <Brain className="text-[#70C528]" size={32} />
            <h1 className="text-2xl font-bold tracking-tight text-[#1B2A4E]">MindCare <span className="text-[#70C528]">Saúde</span></h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <button onClick={() => handleScrollTo('hero')} className="hover:text-[#70C528] transition-colors">Início</button>
            <button onClick={() => handleScrollTo('sobre')} className="hover:text-[#70C528] transition-colors">Sobre</button>
            <button onClick={() => handleScrollTo('funcionalidades')} className="hover:text-[#70C528] transition-colors">Funcionalidades</button>
            
            {/* Conteúdos Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-[#70C528] transition-colors py-4">
                Conteúdos <ChevronDown size={16} />
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-[550px]">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 grid grid-cols-2 gap-4">
                  <a href="#" className="block p-4 rounded-xl border border-gray-100 hover:border-[#70C528] hover:shadow-md transition-all group/item text-left bg-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain size={20} className="text-[#1B2A4E] group-hover/item:text-[#70C528] transition-colors" />
                      <span className="font-bold text-[#1B2A4E]">Blog</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Descubra nosso blog com dicas exclusivas e artigos aprofundados.
                    </p>
                  </a>
                  <a href="#" className="block p-4 rounded-xl border border-gray-100 hover:border-[#70C528] hover:shadow-md transition-all group/item text-left bg-white">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen size={20} className="text-[#1B2A4E] group-hover/item:text-[#70C528] transition-colors" />
                      <span className="font-bold text-[#1B2A4E]">Conteúdos</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Navegue por uma vasta gama de conteúdos e enriqueça seus conhecimentos.
                    </p>
                  </a>
                </div>
              </div>
            </div>

            <button onClick={() => handleScrollTo('especialistas')} className="hover:text-[#70C528] transition-colors">Especialistas</button>
            <button onClick={() => handleScrollTo('contato')} className="hover:text-[#70C528] transition-colors">Contato</button>
            
            <button 
              onClick={() => { setDashboardInitialTab('patients'); setShowLoginModal(true); }} 
              className="flex items-center gap-2 text-[#1B2A4E] hover:text-[#70C528] transition-colors font-semibold"
            >
              <LogIn size={18} /> Entrar
            </button>

            <Button onClick={() => handleScrollTo('contato')} variant="primary" className="text-sm px-6 py-2">
              Agendar Consulta
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-[#1B2A4E]" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-6 shadow-lg animate-[fadeIn_0.2s_ease-out] max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-4 text-center">
              <button onClick={() => handleScrollTo('hero')} className="py-2 hover:text-[#70C528]">Início</button>
              <button onClick={() => handleScrollTo('sobre')} className="py-2 hover:text-[#70C528]">Sobre</button>
              <button onClick={() => handleScrollTo('funcionalidades')} className="py-2 hover:text-[#70C528]">Funcionalidades</button>
              
              <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3">
                <p className="font-bold text-[#1B2A4E] text-center mb-2">Conteúdos</p>
                <a href="#" className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors">
                  <Brain size={18} className="text-[#70C528]"/>
                  <span className="text-sm font-medium">Blog MindCare</span>
                </a>
                <a href="#" className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors">
                  <BookOpen size={18} className="text-[#70C528]"/>
                  <span className="text-sm font-medium">Materiais Ricos</span>
                </a>
              </div>

              <button onClick={() => handleScrollTo('especialistas')} className="py-2 hover:text-[#70C528]">Especialistas</button>
              <button onClick={() => handleScrollTo('contato')} className="py-2 hover:text-[#70C528]">Contato</button>
              
              <button 
                onClick={() => { setDashboardInitialTab('patients'); setShowLoginModal(true); setIsMenuOpen(false); }} 
                className="py-2 flex items-center justify-center gap-2 text-[#1B2A4E] hover:text-[#70C528] font-semibold border-t border-gray-100 mt-2 pt-4"
              >
                <LogIn size={18} /> Área do Paciente (Entrar)
              </button>
              
              <Button onClick={() => handleScrollTo('contato')} fullWidth>Agendar</Button>
            </div>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-b from-[#F8F9FA] to-white relative overflow-hidden">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#70C528]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1B2A4E]/5 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm px-4 py-1.5 rounded-full animate-[fadeIn_0.5s_ease-out]">
                <span className="w-2 h-2 rounded-full bg-[#70C528] animate-ping"></span>
                <span className="text-sm font-semibold text-gray-600">Agenda aberta para novos pacientes</span>
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-bold leading-[1.1] animate-[slideInLeft_0.7s_ease-out]">
                Sua Mente Merece <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B2A4E] to-[#70C528]">Cuidado e Atenção</span>
              </h2>
              
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed animate-[fadeIn_0.9s_ease-out]">
                Encontre o equilíbrio emocional com nossa equipe de especialistas. Terapia humanizada, moderna e focada no seu bem-estar integral.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-[fadeInUp_1s_ease-out]">
                <Button onClick={() => handleScrollTo('contato')} className="shadow-xl shadow-[#70C528]/20">
                  Agendar Consulta Online
                </Button>
                <Button variant="outline" onClick={() => handleScrollTo('sobre')}>Saiba Mais</Button>
              </div>

              <div className="flex items-center gap-4 pt-4 animate-[fadeIn_1.4s_ease-out]">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  <p className="text-xs text-gray-500 font-medium">Mais de 500 avaliações 5 estrelas</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative animate-[fadeIn_1.2s_ease-out]">
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=800&auto=format&fit=crop" 
                  alt="Sessão de terapia acolhedora" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A4E]/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="font-bold text-xl">Dr. Miguel Silva</p>
                  <p className="text-sm opacity-90">Psicólogo Chefe - CRP 06/12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FLOATING CARDS --- */}
      <section id="sobre" className="relative -mt-20 z-20 px-6 mb-24">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Clock size={32} />, title: "Atendimento Flexível", desc: "Horários estendidos e plantão de acolhimento 24h para emergências." },
              { icon: <Brain size={32} />, title: "Abordagem Integrada", desc: "Unimos TCC, Psicanálise e Humanismo para um tratamento personalizado." },
              { icon: <Activity size={32} />, title: "Telemedicina Segura", desc: "Plataforma criptografada para suas sessões online com total sigilo." }
            ].map((card, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-[#70C528] group">
                <div className="text-[#70C528] mb-6 bg-[#F8F9FA] w-16 h-16 rounded-xl flex items-center justify-center group-hover:bg-[#70C528] group-hover:text-white transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1B2A4E]">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DOCTORS --- */}
      <section id="especialistas" className="py-24 bg-[#F8F9FA]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
             <div className="max-w-2xl">
              <span className="text-[#70C528] font-bold tracking-wider uppercase text-sm">Nosso Corpo Clínico</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 text-[#1B2A4E]">Conheça quem vai cuidar de você</h2>
              <p className="text-gray-600 mt-4">Profissionais selecionados rigorosamente, com especializações nas melhores universidades e vasta experiência clínica.</p>
             </div>
             <Button variant="outline" className="shrink-0">Ver Todos os Profissionais</Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((id) => (
               <div key={id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                 <div className="h-64 overflow-hidden relative">
                   <img src={`https://i.pravatar.cc/300?img=${id + 20}`} alt="Doctor" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </div>
                 <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-[#1B2A4E]">Dr. Especialista {id}</h3>
                    <p className="text-[#70C528] font-medium text-sm mt-1 mb-3">Psicologia Clínica</p>
                    <Button variant="outline" className="text-xs px-4 py-1 w-full border-gray-200 hover:border-[#70C528]">Ver Perfil</Button>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATISTICS --- */}
      <section className="bg-[#70C528] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {animatedStats.map((stat) => (
              <div key={stat.id} className="relative">
                <div className="text-5xl md:text-6xl font-bold mb-2 tracking-tight">
                  {(stat as any).currentValue}{stat.suffix}
                </div>
                <p className="text-white/90 font-medium text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ELECTRONIC RECORDS --- */}
      <section id="funcionalidades" className="py-24 bg-gradient-to-br from-white to-[#f0fdf4] overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="inline-block bg-[#E3F5D6] text-[#1B2A4E] font-bold px-4 py-1.5 rounded-full text-sm mb-6 animate-[fadeIn_0.5s_ease-out]">
                Resolução CFP 06/2019
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B2A4E] mb-6 leading-tight">
                Prontuário Eletrônico Inteligente para Psicólogos
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Tenha toda facilidade de controlar as anotações de suas sessões. Mantenha documentos completos na ficha do seu cliente com total segurança e conformidade legal.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-sm transition-all">
                  <div className="bg-[#70C528]/10 p-3 rounded-lg text-[#70C528] mt-1">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B2A4E] text-lg">Segurança de Dados</h4>
                    <p className="text-gray-500">Criptografia de ponta a ponta para proteger o sigilo absoluto de seus pacientes.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-sm transition-all">
                  <div className="bg-[#70C528]/10 p-3 rounded-lg text-[#70C528] mt-1">
                    <FileCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B2A4E] text-lg">Conformidade CFP</h4>
                    <p className="text-gray-500">Modelos de documentos e evolução padronizados com a legislação vigente (Resolução 06/2019).</p>
                  </div>
                </li>
              </ul>

              <div className="mt-8">
                 <Button onClick={() => setShowModal(true)}>Começar Teste Grátis</Button>
                 <p className="text-xs text-gray-400 mt-2 ml-2">Teste gratuito de 7 dias, sem compromisso.</p>
              </div>
            </div>

            <div className="lg:w-1/2 relative order-1 lg:order-2">
               <div className="absolute -inset-4 bg-gradient-to-tr from-[#70C528]/20 to-[#1B2A4E]/20 rounded-[2.5rem] blur-xl"></div>
               <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                 <img 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop" 
                    alt="Sistema de Prontuário" 
                    className="w-full h-auto object-cover"
                 />
                 <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-6 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1B2A4E] flex items-center justify-center text-white">
                         <Brain size={20} />
                      </div>
                      <div>
                        <p className="text-[#1B2A4E] font-bold text-sm">Gestão Integrada</p>
                        <p className="text-xs text-gray-500">Histórico, Evolução e Financeiro em um só lugar.</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINANCIAL CONTROL SECTION --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
               <div className="absolute -inset-4 bg-gradient-to-bl from-[#1B2A4E]/10 to-[#70C528]/10 rounded-[2.5rem] blur-xl"></div>
               <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-[#F8F9FA] bg-white p-6 md:p-8">
                 <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div>
                        <p className="text-sm text-gray-500">Receita Mensal</p>
                        <p className="text-2xl font-bold text-[#1B2A4E]">R$ 12.450,00</p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">+15%</div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-[#70C528]/20 flex items-center justify-center text-[#70C528]"><DollarSign size={16}/></div>
                             <div>
                                <p className="text-sm font-bold text-[#1B2A4E]">Consulta - Ana B.</p>
                                <p className="text-xs text-gray-500">14 Mar, 14:00</p>
                             </div>
                          </div>
                          <span className="font-bold text-[#70C528]">+ R$ 250,00</span>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-[#E3F5D6] text-[#1B2A4E] font-bold px-4 py-1.5 rounded-full text-sm mb-6">
                 <Star size={16} className="text-[#70C528] fill-current" />
                 <span>Gestão Financeira Integrada</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B2A4E] mb-6 leading-tight">
                Controle Financeiro Completo do seu Consultório
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Esqueça as planilhas complexas. Nossa ferramenta integra agenda e financeiro automaticamente.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-[#1B2A4E] p-2 rounded-lg text-white mt-1 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B2A4E] text-lg">Lançamento Automático</h4>
                    <p className="text-gray-500">Ao finalizar uma sessão na agenda, o valor já é lançado no seu fluxo de caixa.</p>
                  </div>
                </li>
              </ul>

              <div className="mt-8">
                 <Button onClick={openFinancialDemo} className="shadow-lg shadow-[#1B2A4E]/10">
                   Ver Painel Financeiro
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="container mx-auto px-6 max-w-4xl">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-[#1B2A4E]">Dúvidas Frequentes</h2>
           </div>
           <div className="space-y-4">
              {[
                {q: "Aceitam convênios médicos?", a: "Sim, trabalhamos com os principais convênios e também oferecemos sistema de reembolso."},
                {q: "Como funciona a terapia online?", a: "As sessões são realizadas por videochamada em nossa plataforma segura, garantindo o mesmo acolhimento do presencial."},
              ].map((faq, i) => (
                <details key={i} className="bg-white rounded-xl p-6 shadow-sm cursor-pointer group">
                  <summary className="font-bold text-[#1B2A4E] list-none flex justify-between items-center">
                    {faq.q}
                    <span className="text-[#70C528] transform group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-gray-600 animate-[fadeIn_0.3s_ease-out]">{faq.a}</p>
                </details>
              ))}
           </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section id="contato" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div 
            ref={contactCardRef}
            className={`bg-[#F8F9FA] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row transform transition-all duration-1000 ease-out ${
              isContactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="lg:w-5/12 bg-[#1B2A4E] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
               <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-6">Entre em Contato</h3>
                <p className="text-gray-300 mb-10 leading-relaxed">
                  Pronto para transformar sua vida? Preencha o formulário e nossa equipe entrará em contato.
                </p>
               </div>
            </div>

            <div className="lg:w-7/12 p-6 md:p-12 bg-white">
              <h3 className="text-2xl font-bold text-[#1B2A4E] mb-6 md:mb-8">Agende sua Consulta</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 block">Nome Completo</label>
                    <input required type="text" name="name" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#70C528] focus:ring-2 focus:ring-[#70C528]/20 outline-none transition-all text-base" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 block">Telefone</label>
                    <input required type="tel" name="phone" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#70C528] focus:ring-2 focus:ring-[#70C528]/20 outline-none transition-all text-base" />
                  </div>
                </div>
                <Button type="submit" fullWidth disabled={isSubmitting} className="mt-4 py-4 text-base font-bold shadow-lg shadow-[#70C528]/20 active:scale-95 touch-manipulation">
                  {isSubmitting ? 'Processando...' : 'Ir para Pagamento'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1B2A4E] text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
            <p className="text-gray-400 text-sm">© 2024 Todos os direitos reservados.</p>
        </div>
      </footer>

      <WhatsAppBtn />
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Agendamento Confirmado!" 
        message="Seu pagamento foi processado com sucesso."
        calendarData={calendarData}
      />
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess}
      />
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default App;
