
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const heroImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBiIfo6ZD956reMJZU5R6v7E5b8pgrWTLyUVDyEZfMFuYtxRXx6iAsWYOVbczIW07g4UynGl6VzyKewgq8bmtsoGIzSYgwnLpc6-x6t7RFWBTsmahxYDsWBS0RdeDJLi_A9j2ze_bQ3OHsSVqLuiiSjihNCDo4BDVG4cetugJ0qj380ZLZ9cv9ROfhl7b_8cLeylhON8Qckeg2vBFcyNlI1FsNIK5rGETOiA_KtB6q46eAaTqz7ZrQdG9FABHPkPUYPv813OeD4cg";

  return (
    <div className="flex flex-col h-full justify-between px-8 pb-10 pt-4 bg-background-dark overflow-hidden relative">
      {/* Background Decorativo - Mesh Gradient */}
      <div className="absolute top-[-10%] left-[-20%] size-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-20%] size-[400px] bg-emerald-500/5 rounded-full blur-[100px]"></div>

      <div className="flex flex-col items-center justify-center z-10">
        {/* Container da Imagem Hero com Fusão (Blending) */}
        <div className="relative w-full aspect-video max-h-[240px] overflow-hidden group">
          <div 
            className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-transform duration-1000 group-hover:scale-105" 
            style={{ backgroundImage: `url("${heroImage}")` }}
          />
          
          {/* Overlays de Fusão para Mesclar com o Fundo */}
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark/40 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-background-dark"></div>

          {/* Texto Sobreposto na Imagem (Apenas o principal) */}
          <div className="absolute bottom-4 left-0 right-0 text-center space-y-1">
            <h2 className="text-white text-xl font-black leading-tight tracking-tighter uppercase drop-shadow-lg">
              Excelência <span className="text-primary">no Concílio</span>
            </h2>
          </div>
        </div>

        {/* Ícones Teológicos Flutuantes */}
        <div className="flex gap-4 mt-2 z-20">
           <div className="size-10 rounded-2xl bg-surface-dark/50 backdrop-blur-md border border-white/5 flex items-center justify-center text-primary shadow-2xl animate-bounce [animation-duration:3s]">
              <span className="material-symbols-outlined text-lg fill-1">menu_book</span>
           </div>
           <div className="size-10 rounded-2xl bg-surface-dark/50 backdrop-blur-md border border-white/5 flex items-center justify-center text-emerald-400 shadow-2xl animate-bounce [animation-duration:4s] [animation-delay:0.5s]">
              <span className="material-symbols-outlined text-lg fill-1">history_edu</span>
           </div>
           <div className="size-10 rounded-2xl bg-surface-dark/50 backdrop-blur-md border border-white/5 flex items-center justify-center text-amber-400 shadow-2xl animate-bounce [animation-duration:5s] [animation-delay:1s]">
              <span className="material-symbols-outlined text-lg fill-1">auto_awesome</span>
           </div>
        </div>
      </div>

      {/* Seção de Texto Principal */}
      <div className="flex flex-col gap-0 text-center mt-2 z-10">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em] mb-1">Prepare seu Ministério</p>
        <h1 className="text-white tracking-tighter text-[4.2rem] font-black uppercase leading-[0.75] mb-4 relative">
          ESTUDE COM<br/>
          <span className="text-primary text-[3.6rem] relative">
            SAMU
            <div className="absolute -right-2 top-0 size-2 bg-emerald-400 rounded-full animate-ping"></div>
          </span>
        </h1>
        <p className="text-slate-400 text-sm font-medium leading-relaxed px-4 italic opacity-80">
          "Aprovado por Deus como obreiro que não tem de que se envergonhar."
        </p>
      </div>

      {/* Ações e Rodapé com Créditos */}
      <div className="flex flex-col gap-4 mt-6 z-10">
        <button 
          onClick={onStart}
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-[28px] h-18 px-6 bg-primary hover:bg-blue-600 transition-all text-white shadow-[0_15px_40px_rgba(19,91,236,0.2)] active:scale-95 border-t border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div className="flex items-center gap-3">
            <span className="text-xl font-black uppercase tracking-tighter">Iniciar Jornada</span>
            <div className="size-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
               <span className="material-symbols-outlined text-xl fill-1">door_open</span>
            </div>
          </div>
        </button>
        
        <div className="flex flex-col items-center opacity-30 mt-2">
          <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.5em]">
            Criado por Samuel Duarte
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
