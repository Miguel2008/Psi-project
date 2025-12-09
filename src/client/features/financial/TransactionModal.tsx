
import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Transaction } from '../../../shared/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Transaction, 'id'>) => void;
  initialData?: Transaction | null;
  isLoading?: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, initialData, isLoading }) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '',
    amount: 0,
    type: 'income',
    status: 'paid',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        description: '',
        amount: 0,
        type: 'income',
        status: 'paid',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Transaction, 'id'>);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="bg-[#1B2A4E] p-6 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold">
            {initialData ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h3>
          <button onClick={onClose} className="hover:text-[#70C528] transition-colors"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <button
               type="button"
               onClick={() => setFormData({...formData, type: 'income'})}
               className={`py-2 rounded-lg font-medium transition-all ${formData.type === 'income' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-500'}`}
             >
               Receita
             </button>
             <button
               type="button"
               onClick={() => setFormData({...formData, type: 'expense'})}
               className={`py-2 rounded-lg font-medium transition-all ${formData.type === 'expense' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-gray-100 text-gray-500'}`}
             >
               Despesa
             </button>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Descrição</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="text" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B2A4E]/20 outline-none"
                placeholder="Ex: Consulta Particular"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Valor (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="number" 
                  step="0.01"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B2A4E]/20 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Data</label>
              <div className="relative">
                <input 
                  required
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B2A4E]/20 outline-none"
                />
              </div>
            </div>
          </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Categoria</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B2A4E]/20 outline-none bg-white"
                >
                  <option value="">Selecione...</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Avaliação">Avaliação</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                  <option value="Materiais">Materiais</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

             <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as 'paid' | 'pending'})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1B2A4E]/20 outline-none bg-white"
              >
                <option value="paid">Pago / Recebido</option>
                <option value="pending">Pendente</option>
              </select>
            </div>
           </div>

           <div className="pt-4 flex gap-3">
             <Button type="button" variant="outline" fullWidth onClick={onClose} disabled={isLoading}>Cancelar</Button>
             <Button type="submit" fullWidth disabled={isLoading}>
               {isLoading ? 'Salvando...' : (initialData ? 'Atualizar' : 'Criar')}
             </Button>
           </div>

        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
