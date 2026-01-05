
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const heroImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBiIfo6ZD956reMJZU5R6v7E5b8pgrWTLyUVDyEZfMFuYtxRXx6iAsWYOVbczIW07g4UynGl6VzyKewgq8bmtsoGIzSYgwnLpc6-x6t7RFWBTsmahxYDsWBS0RdeDJLi_A9j2ze_bQ3OHsSVqLuiiSjihNCDo4BDVG4cetugJ0qj380ZLZ9cv9ROfhl7b_8cLeylhON8Qckeg2vBFcyNlI1FsNIK5rGETOiA_KtB6q46eAaTqz7ZrQdG9FABHPkPUYPv813OeD4cg";

  return (
    <div className="flex flex-col h-full justify-between px-6 pb-12 pt-6 bg-background-light dark:bg-background-dark overflow-hidden relative">
      <div className="flex flex-col items-center justify-center py-4 z-10">
        <div className="relative w-full aspect-square overflow-hidden rounded-[48px] bg-slate-200 dark:bg-slate-800 shadow-2xl border-4 border-white dark:border-white/5 group transform -rotate-1">
          <div 
            className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-transform duration-1000 group-hover:scale-105" 
            style={{ backgroundImage: `url("${heroImage}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/20 to-transparent"></div>
          
          <div className="absolute top-6 left-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-1 flex items-center gap-2">
               <span className="material-symbols-outlined text-white text-[14px] fill-1">verified</span>
               <span className="text-white text-[9px] font-black uppercase tracking-[0.2em]">Oficial v1.0</span>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-primary font-black text-[12px] uppercase tracking-[0.4em] mb-2 drop-shadow-sm">Acelerador Teológico</p>
            <h2 className="text-white text-3xl font-black leading-tight tracking-tighter uppercase">
              Preparação <br/>para o Concílio
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-center mt-4 z-10">
        <div className="flex flex-col items-center">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.5em] mb-3">Seminarista,</p>
          <h1 className="text-slate-900 dark:text-white tracking-tighter text-6xl font-black uppercase leading-[0.75] mb-6">
            Estude com <br/>o <span className="text-primary bg-clip-text text-transparent bg-gradient-to-br from-primary via-blue-500 to-emerald-400">Samu</span>
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed px-10">
          Domine a Teologia Sistemática e a História Batista com repetição espaçada.
        </p>
      </div>

      <div className="flex flex-col gap-6 pt-4 z-10">
        <button 
          onClick={onStart}
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[32px] h-20 px-8 bg-primary hover:bg-blue-600 transition-all text-white shadow-2xl shadow-primary/40 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="text-xl font-black uppercase tracking-tighter">Iniciar Jornada</span>
          <span className="material-symbols-outlined ml-3 text-2xl group-hover:translate-x-1 transition-transform">school</span>
        </button>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">
            Desenvolvido por Samuel Duarte
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
