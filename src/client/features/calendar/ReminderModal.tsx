
import React, { useState } from 'react';
import { X, Bell, Phone, Mail, MessageSquare } from 'lucide-react';
import Button from '../../components/ui/Button';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, onSave }) => {
  const [channels, setChannels] = useState({
    whatsapp: true,
    email: true,
    sms: false
  });
  const [timing, setTiming] = useState('24');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="bg-[#1B2A4E] p-6 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold flex items-center gap-2"><Bell size={20}/> Automação de Lembretes</h3>
          <button onClick={onClose} className="hover:text-[#70C528] transition-colors"><X size={24}/></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
             <p className="font-bold text-[#1B2A4E] text-sm">Canais de Envio</p>
             
             <div className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${channels.whatsapp ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`} onClick={() => setChannels({...channels, whatsapp: !channels.whatsapp})}>
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${channels.whatsapp ? 'bg-[#25D366] text-white' : 'bg-gray-200 text-gray-400'}`}><Phone size={20}/></div>
                   <div>
                      <p className="font-bold text-[#1B2A4E]">WhatsApp</p>
                      <p className="text-xs text-gray-500">Alta taxa de abertura</p>
                   </div>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${channels.whatsapp ? 'bg-[#70C528]' : 'bg-gray-300'}`}>
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${channels.whatsapp ? 'left-5' : 'left-1'}`}></div>
                </div>
             </div>

             <div className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${channels.email ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`} onClick={() => setChannels({...channels, email: !channels.email})}>
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${channels.email ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}><Mail size={20}/></div>
                   <div>
                      <p className="font-bold text-[#1B2A4E]">E-mail</p>
                      <p className="text-xs text-gray-500">Formalização do horário</p>
                   </div>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${channels.email ? 'bg-[#70C528]' : 'bg-gray-300'}`}>
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${channels.email ? 'left-5' : 'left-1'}`}></div>
                </div>
             </div>
          </div>

          <div className="space-y-3">
             <p className="font-bold text-[#1B2A4E] text-sm">Quando enviar?</p>
             <div className="flex gap-2">
                {['48', '24', '12', '2'].map((t) => (
                   <button 
                      key={t}
                      onClick={() => setTiming(t)}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${timing === t ? 'bg-[#1B2A4E] text-white border-[#1B2A4E]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                   >
                      {t}h antes
                   </button>
                ))}
             </div>
          </div>

          <Button fullWidth onClick={onSave}>Salvar Configurações</Button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
