
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col h-full justify-between px-8 py-12 bg-white dark:bg-neutral-950 relative">
      
      {/* Área Superior - Título Minimalista */}
      <div className="mt-10 space-y-6">
        <div className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center mb-6">
           <span className="material-symbols-outlined text-3xl">local_library</span>
        </div>

        <div className="space-y-2">
          <p className="text-gray-500 dark:text-neutral-400 text-sm font-medium tracking-wide">Bem-vindo ao Seminário</p>
          <h1 className="text-slate-900 dark:text-white text-5xl font-bold tracking-tight leading-tight">
            Estude com <br/>
            <span className="text-primary">Samu.</span>
          </h1>
        </div>
        
        <p className="text-gray-600 dark:text-neutral-400 text-base leading-relaxed max-w-xs font-normal">
          A ferramenta essencial para estudantes de teologia dominarem a doutrina, história e ética cristã.
        </p>
      </div>

      {/* Ilustração Abstrata / Elemento Visual Limpo */}
      <div className="flex-1 flex items-center justify-center opacity-80 grayscale-[50%]">
         <div className="relative size-64">
             <div className="absolute inset-0 border border-gray-200 dark:border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
             <div className="absolute inset-4 border border-dashed border-gray-300 dark:border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                 <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-neutral-700">school</span>
             </div>
         </div>
      </div>

      {/* Rodapé - Botão Clean */}
      <div className="space-y-6">
        <button 
          onClick={onStart}
          className="group w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold text-lg flex items-center justify-between px-8 hover:opacity-90 transition-all active:scale-[0.98]"
        >
          <span>Iniciar Estudos</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
        
        <p className="text-center text-xs text-gray-400 font-medium">
          Versão 1.0 • Concílio Batista
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
