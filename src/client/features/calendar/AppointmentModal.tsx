
import React, { useState } from 'react';
import { X, Calendar, User, Clock, MapPin, Repeat, Video, Check } from 'lucide-react';
import Button from '../../components/ui/Button';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    patient: '',
    date: '',
    time: '',
    type: 'Terapia Individual',
    location: 'Online',
    isRecurring: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="bg-[#1B2A4E] p-6 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold">Novo Agendamento</h3>
          <button onClick={onClose} className="hover:text-[#70C528] transition-colors"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Paciente</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B2A4E]/20 outline-none bg-white"
                onChange={e => setFormData({...formData, patient: e.target.value})}
              >
                <option value="">Selecione o paciente...</option>
                <option value="1">Ana Beatriz Souza</option>
                <option value="2">Carlos Eduardo Lima</option>
                <option value="3">Fernanda Oliveira</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Data</label>
              <div className="relative">
                <input 
                  required
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B2A4E]/20 outline-none"
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Horário</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="time"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B2A4E]/20 outline-none"
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
             <label className="text-sm font-semibold text-gray-600">Tipo de Atendimento</label>
             <div className="flex gap-2">
                <button
                   type="button"
                   onClick={() => setFormData({...formData, location: 'Online'})}
                   className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 ${formData.location === 'Online' ? 'bg-[#1B2A4E] text-white border-[#1B2A4E]' : 'bg-white text-gray-600 border-gray-200'}`}
                >
                   <Video className="w-4 h-4" /> Online
                </button>
                <button
                   type="button"
                   onClick={() => setFormData({...formData, location: 'Presencial'})}
                   className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 ${formData.location === 'Presencial' ? 'bg-[#1B2A4E] text-white border-[#1B2A4E]' : 'bg-white text-gray-600 border-gray-200'}`}
                >
                   <MapPin className="w-4 h-4" /> Presencial
                </button>
             </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer" onClick={() => setFormData({...formData, isRecurring: !formData.isRecurring})}>
             <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.isRecurring ? 'bg-[#70C528] border-[#70C528]' : 'bg-white border-gray-300'}`}>
                {formData.isRecurring && <Check className="text-white w-3 h-3" />}
             </div>
             <div className="flex-1">
                <p className="text-sm font-bold text-[#1B2A4E] flex items-center gap-2">
                   <Repeat size={14} /> Repetir semanalmente
                </p>
                <p className="text-xs text-gray-500">Agendar automaticamente nas próximas semanas</p>
             </div>
          </div>

          <div className="pt-4 flex gap-3">
             <Button type="button" variant="outline" fullWidth onClick={onClose}>Cancelar</Button>
             <Button type="submit" fullWidth>Confirmar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
