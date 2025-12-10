
import React from 'react';
import { X, Clock, User, Video, MapPin, CheckCircle } from 'lucide-react';

interface SessionItem {
  id: number;
  time: string;
  patientName: string;
  type: string;
  status: string;
}

interface SessionListModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionItem[];
}

const SessionListModal: React.FC<SessionListModalProps> = ({ isOpen, onClose, sessions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="bg-[#1B2A4E] p-6 flex justify-between items-center text-white">
           <div>
              <h3 className="text-xl font-bold">Agenda de Hoje</h3>
              <p className="text-blue-200 text-sm">Resumo dos atendimentos</p>
           </div>
          <button onClick={onClose} className="hover:text-[#70C528] transition-colors"><X size={24}/></button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 bg-gray-50">
           {sessions.map((session) => (
              <div key={session.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                 <div className="bg-[#1B2A4E] text-white p-3 rounded-lg flex flex-col items-center justify-center min-w-[60px]">
                    <span className="font-bold text-lg">{session.time}</span>
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-[#1B2A4E]">{session.patientName}</h4>
                    <p className="text-xs text-gray-500 mb-2">{session.type}</p>
                    <div className="flex gap-2">
                       <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle size={10} /> Confirmado
                       </span>
                       <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          {session.type.includes('Online') ? <Video size={10}/> : <MapPin size={10}/>} {session.type.includes('Online') ? 'Online' : 'Presencial'}
                       </span>
                    </div>
                 </div>
              </div>
           ))}
           {sessions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                 <p>Nenhuma sessão agendada para hoje.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SessionListModal;
