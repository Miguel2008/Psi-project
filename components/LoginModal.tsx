
import React, { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import Button from '../src/client/components/ui/Button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simula tempo de requisição ao servidor
    setTimeout(() => {
      setIsLoading(false);
      if (onLogin) {
        onLogin();
      }
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative scale-100 animate-[scaleIn_0.3s_ease-out]">
        
        {/* Close Button */}
        {!isLoading && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-[#1B2A4E] transition-colors"
          >
            <X size={24} />
          </button>
        )}

        <h2 className="text-2xl font-bold text-[#1B2A4E] mb-2 text-center">Acesso ao Sistema</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Entre com suas credenciais de profissional</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1B2A4E]">E-mail:</label>
            <input 
              type="email" 
              defaultValue="doutor@mindcare.com"
              required
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:border-[#70C528] focus:ring-2 focus:ring-[#70C528]/20 outline-none transition-all placeholder:text-gray-400 disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1B2A4E]">Senha:</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                defaultValue="123456"
                required
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:border-[#70C528] focus:ring-2 focus:ring-[#70C528]/20 outline-none transition-all placeholder:text-gray-400 pr-12 disabled:opacity-50"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B2A4E] transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a href="#" className="text-sm font-medium text-[#1B2A4E] hover:text-[#70C528] hover:underline transition-colors">
              Esqueceu a senha?
            </a>
          </div>

          {/* Submit Button */}
          <Button 
            variant="secondary" 
            fullWidth 
            className="py-3 text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Acessando...
              </>
            ) : (
              'Entrar no Prontuário'
            )}
          </Button>

          {/* Create Account */}
          <div className="text-center mt-6">
            <a href="#" className="text-sm font-medium text-[#1B2A4E] hover:text-[#70C528] underline transition-colors">
              Solicitar acesso para clínica
            </a>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginModal;
