
import React, { useState } from 'react';

interface LevelSelectScreenProps {
  onSelectLevel: (level: number, limit: number) => void;
}

const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ onSelectLevel }) => {
  const [limit, setLimit] = useState<number>(10);
  
  return (
    <div className="flex flex-col h-full px-4 pt-8 pb-32">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Desafio por Nível</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        Escolha um nível de dificuldade para receber perguntas aleatórias de todas as áreas teológicas.
      </p>

      <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 border border-gray-200 dark:border-white/5 mb-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Quantidade por sessão</p>
        <div className="flex gap-3">
          {[5, 10, 15].map(q => (
            <button
              key={q}
              onClick={() => setLimit(q)}
              className={`flex-1 h-12 rounded-xl font-bold transition-all ${limit === q ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 dark:bg-white/5'}`}
            >
              {q} cartões
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1 no-scrollbar pb-10">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(lvl => (
          <button
            key={lvl}
            onClick={() => onSelectLevel(lvl, limit)}
            className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 hover:border-primary transition-all active:scale-95 shadow-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
               <span className="material-symbols-outlined text-4xl">stairs</span>
            </div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">NÍVEL</p>
            <span className="text-4xl font-black text-slate-800 dark:text-white">{lvl}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelectScreen;
