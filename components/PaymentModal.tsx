
import React, { useState } from 'react';
import { X, CreditCard, QrCode, Check, Loader2, Copy, ShieldCheck } from 'lucide-react';
import Button from '../src/client/components/ui/Button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [method, setMethod] = useState<'card' | 'pix'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simula processamento do gateway de pagamento
    setTimeout(() => {
      setIsLoading(false);
      onPaymentSuccess();
    }, 2500);
  };

  const copyPix = () => {
    navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865405250.005802BR5913MindCare Saude6008Sao Paulo62070503***6304E2CA");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[scaleIn_0.3s_ease-out] relative">
        
        {/* Close Button (Top Right) */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white/80 hover:text-white z-10 transition-colors"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="bg-[#1B2A4E] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#70C528] rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <h3 className="text-2xl font-bold relative z-10">Finalizar Agendamento</h3>
          <p className="text-blue-100 text-sm relative z-10 mt-1">Realize o pagamento para confirmar seu horário.</p>
        </div>

        <div className="p-6 md:p-8 bg-gray-50/50">
          
          {/* Order Summary */}
          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
             <div>
                <p className="font-bold text-[#1B2A4E]">Sessão de Terapia Online</p>
                <p className="text-xs text-gray-500">Duração: 50 minutos</p>
             </div>
             <div className="text-right">
                <p className="text-xs text-gray-400 line-through">R$ 350,00</p>
                <p className="text-xl font-bold text-[#70C528]">R$ 250,00</p>
             </div>
          </div>

          {/* Payment Tabs */}
          <div className="flex gap-3 mb-6">
            <button 
              onClick={() => setMethod('card')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 ${method === 'card' ? 'border-[#70C528] bg-white text-[#1B2A4E] shadow-md ring-1 ring-[#70C528]' : 'border-gray-200 bg-gray-50 text-gray-400 hover:bg-white hover:border-gray-300'}`}
            >
              <CreditCard size={18} />
              <span className="font-semibold text-sm">Cartão</span>
            </button>
            <button 
              onClick={() => setMethod('pix')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 ${method === 'pix' ? 'border-[#70C528] bg-white text-[#1B2A4E] shadow-md ring-1 ring-[#70C528]' : 'border-gray-200 bg-gray-50 text-gray-400 hover:bg-white hover:border-gray-300'}`}
            >
              <QrCode size={18} />
              <span className="font-semibold text-sm">PIX</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            {method === 'card' ? (
              <form onSubmit={handlePay} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Número do Cartão</label>
                   <div className="relative">
                     <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                     <input 
                        required 
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#70C528] focus:ring-2 focus:ring-[#70C528]/20 outline-none transition-all font-mono text-gray-700" 
                     />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Validade</label>
                     <input required type="text" placeholder="MM/AA" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#70C528] focus:ring-2 focus:ring-[#70C528]/20 outline-none transition-all text-center font-mono text-gray-700" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CVV</label>
                     <input required type="text" placeholder="123" maxLength={3} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#70C528] focus:ring-2 focus:ring-[#70C528]/20 outline-none transition-all text-center font-mono text-gray-700" />
                  </div>
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nome no Cartão</label>
                   <input required type="text" placeholder="COMO ESTA NO CARTAO" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#70C528] focus:ring-2 focus:ring-[#70C528]/20 outline-none transition-all text-gray-700" />
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <Button type="submit" fullWidth disabled={isLoading} className="h-12">
                    {isLoading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Processando...</div> : 'Pagar R$ 250,00'}
                  </Button>
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="w-full py-3 rounded-full text-gray-500 font-semibold hover:bg-gray-100 hover:text-[#1B2A4E] transition-colors"
                    disabled={isLoading}
                  >
                    Cancelar Pagamento
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="border-2 border-dashed border-[#70C528] rounded-xl p-4 inline-block bg-white relative group">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865405250.005802BR5913MindCare%20Saude6008Sao%20Paulo62070503***6304E2CA" alt="QR Code PIX" className="mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <QrCode className="text-[#1B2A4E]" />
                     </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Escaneie o QR Code ou copie o código abaixo:</p>
                  <div className="flex gap-2">
                    <input readOnly value="00020126580014BR.GOV.BCB.PIX..." className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 font-mono" />
                    <button onClick={copyPix} className="bg-[#1B2A4E] text-white p-2 rounded-lg hover:bg-blue-900 transition-colors active:scale-95">
                       {copied ? <Check size={18} className="text-[#70C528]" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 mt-4">
                  <Button onClick={handlePay} fullWidth disabled={isLoading} className="h-12">
                     {isLoading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Verificando...</div> : 'Já fiz o pagamento'}
                  </Button>
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="w-full py-3 rounded-full text-gray-500 font-semibold hover:bg-gray-100 hover:text-[#1B2A4E] transition-colors"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
             <ShieldCheck size={14} className="text-[#70C528]" />
             <span>Ambiente seguro. Seus dados estão protegidos.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
