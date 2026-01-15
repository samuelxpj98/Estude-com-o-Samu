
import React, { useState } from 'react';
import { UserProfile, UserStats } from '../types.ts';
import { SharedHeader, getRank } from './TopicsScreen.tsx';

interface LevelSelectScreenProps {
  onSelectLevel: (level: number, limit: number) => void;
  profile: UserProfile;
  userStats: UserStats;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
}

const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ onSelectLevel, profile, userStats, onToggleTheme, isDarkMode }) => {
  const [limit, setLimit] = useState<number>(10);
  const rank = getRank(userStats.cardsLifetime);
  
  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-page-transition">
      <SharedHeader rank={rank} profile={profile} streak={userStats.streak} onToggleTheme={onToggleTheme} isDarkMode={isDarkMode} />

      <div className="px-6 pt-8 pb-32 overflow-y-auto no-scrollbar">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Desafio por Nível</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium leading-relaxed">
          Escolha um nível de dificuldade para receber perguntas aleatórias.
        </p>

        <div className="bg-white dark:bg-surface-dark rounded-[40px] p-8 border border-gray-100 dark:border-white/5 mb-10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-5">Quantidade por sessão</p>
          <div className="flex gap-4">
            {[5, 10, 15].map(q => (
              <button
                key={q}
                onClick={() => setLimit(q)}
                className={`flex-1 h-14 rounded-[20px] font-black uppercase tracking-tighter transition-all active:scale-95 ${limit === q ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}
              >
                {q} cards
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-10">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(lvl => (
            <button
              key={lvl}
              onClick={() => onSelectLevel(lvl, limit)}
              className="group relative flex flex-col items-center justify-center p-8 rounded-[32px] bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 hover:border-primary transition-all active:scale-95 shadow-sm overflow-hidden"
            >
              <div className={`absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-20 transition-opacity ${rank.color}`}>
                 <span className="material-symbols-outlined text-5xl">stairs</span>
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">NÍVEL</p>
              {/* O número agora usa a cor da patente (rank.color) */}
              <span className={`text-5xl font-black transition-transform group-hover:scale-110 duration-500 ${rank.color}`}>
                {lvl}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelSelectScreen;
