
import React from 'react';
import { X, Calendar, Download } from 'lucide-react';

interface CalendarData {
  title: string;
  description: string;
  location: string;
  startTime: Date; // Data do agendamento
  endTime: Date;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  calendarData?: CalendarData; // Dados opcionais para integração de agenda
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, calendarData }) => {
  if (!isOpen) return null;

  // Formata data para o padrão do Google Calendar (YYYYMMDDThhmmssZ)
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  // Gera Link do Google Calendar
  const handleAddToGoogle = () => {
    if (!calendarData) return;
    
    const { title, description, location, startTime, endTime } = calendarData;
    const start = formatGoogleDate(startTime);
    const end = formatGoogleDate(endTime);
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    
    window.open(url, '_blank');
  };

  // Gera e Baixa arquivo .ics (iCalendar)
  const handleDownloadIcal = () => {
    if (!calendarData) return;
    
    const { title, description, location, startTime, endTime } = calendarData;
    
    // Formata data para o padrão iCal
    const formatICalDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MindCare Saude//Agendamento//PT',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@mindcare.com`,
      `DTSTAMP:${formatICalDate(new Date())}`,
      `DTSTART:${formatICalDate(startTime)}`,
      `DTEND:${formatICalDate(endTime)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'consulta-mindcare.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-[fadeIn_0.3s_ease-out]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          {/* Animated Checkmark SVG */}
          <div className="checkmark-wrapper mb-6">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-[#1B2A4E] mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          {/* Seção de Calendário (Só aparece se calendarData for fornecido) */}
          {calendarData && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm font-bold text-[#1B2A4E] mb-3">Não esqueça sua consulta!</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleAddToGoogle}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-[#70C528] hover:text-[#70C528] transition-all group shadow-sm"
                >
                  <Calendar size={20} className="mb-1 text-gray-500 group-hover:text-[#70C528]" />
                  <span className="text-xs font-medium">Google Agenda</span>
                </button>
                <button 
                  onClick={handleDownloadIcal}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-[#1B2A4E] hover:text-[#1B2A4E] transition-all group shadow-sm"
                >
                  <Download size={20} className="mb-1 text-gray-500 group-hover:text-[#1B2A4E]" />
                  <span className="text-xs font-medium">Baixar iCal</span>
                </button>
              </div>
            </div>
          )}

          <button 
            onClick={onClose}
            className="bg-[#70C528] text-white px-6 py-2 rounded-full hover:bg-[#5da621] transition-colors w-full"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
