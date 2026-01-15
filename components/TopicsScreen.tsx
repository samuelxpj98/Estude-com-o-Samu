
import React, { useState } from 'react';
import { Topic, UserProfile, UserStats } from '../types.ts';

interface TopicsScreenProps {
  topics: Topic[];
  onSelectStudy: (topicId: string | null, level: number | null, limit: number, isConcilio: boolean) => void;
  streak: number;
  profile: UserProfile;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
  stats: UserStats;
}

// Definição expandida para facilitar o uso das cores
export const RANKS = [
  { 
    name: 'Aspirante', 
    threshold: 0, 
    next: 100, 
    color: 'text-amber-500', 
    icon: 'auto_awesome',
    styles: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-100 dark:border-amber-900/50',
      text: 'text-amber-600 dark:text-amber-400',
      fill: 'bg-amber-500'
    }
  },
  { 
    name: 'Seminarista', 
    threshold: 100, 
    next: 500, 
    color: 'text-blue-500', 
    icon: 'school',
    styles: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-100 dark:border-blue-900/50',
      text: 'text-blue-600 dark:text-blue-400',
      fill: 'bg-blue-500'
    }
  },
  { 
    name: 'Bacharel', 
    threshold: 500, 
    next: 2000, 
    color: 'text-emerald-500', 
    icon: 'history_edu',
    styles: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-100 dark:border-emerald-900/50',
      text: 'text-emerald-600 dark:text-emerald-400',
      fill: 'bg-emerald-500'
    }
  },
  { 
    name: 'Mestre', 
    threshold: 2000, 
    next: Infinity, 
    color: 'text-red-500', 
    icon: 'workspace_premium',
    styles: {
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-100 dark:border-red-900/50',
      text: 'text-red-600 dark:text-red-400',
      fill: 'bg-red-500'
    }
  }
];

export const getRank = (lifetime: number) => {
  return [...RANKS].reverse().find(r => lifetime >= r.threshold) || RANKS[0];
};

export const SharedHeader: React.FC<{ rank: any, profile: UserProfile, streak: number, onToggleTheme?: () => void, isDarkMode?: boolean }> = ({ rank, profile, streak, onToggleTheme, isDarkMode }) => (
  <div className={`pt-8 pb-4 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl border-b transition-colors duration-500 ${rank.styles.bg} ${rank.styles.border}`}>
    <div className="flex items-center gap-4">
      <div 
        className="size-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm ring-2 ring-white dark:ring-white/10"
        style={{ backgroundColor: profile.avatarColor }}
      >
        {profile.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <div className={`flex items-center gap-1 ${rank.styles.text}`}>
           <span className="material-symbols-outlined text-[14px]">{rank.icon}</span>
           <p className="text-xs font-black uppercase tracking-wide">{rank.name}</p>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
          {profile.name}
        </h2>
      </div>
    </div>
    
    <div className="flex items-center gap-2">
      <button 
        onClick={onToggleTheme}
        className="size-10 flex items-center justify-center rounded-full bg-white/50 dark:bg-black/20 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 transition-all backdrop-blur-sm"
      >
        <span className="material-symbols-outlined text-[20px]">
          {isDarkMode ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/40 border border-black/5 dark:border-white/10 shadow-sm backdrop-blur-sm">
        <span className="material-symbols-outlined text-[18px] fill-1 text-orange-500">local_fire_department</span>
        <span className="text-sm font-black text-slate-700 dark:text-slate-200">{streak}</span>
      </div>
    </div>
  </div>
);

const TopicsScreen: React.FC<TopicsScreenProps> = ({ topics, onSelectStudy, streak, profile, onToggleTheme, isDarkMode, stats }) => {
  const [search, setSearch] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    '1 - Doutrinas Teológicas': true,
    '2 - Ética Pastoral e Casuística': false,
    '3 - Origem e História dos Batistas': false,
  });

  const rank = getRank(stats.cardsLifetime);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredTopics = topics.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories: string[] = Array.from(new Set(topics.map(t => t.category))).sort() as string[];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-950">
      <div className="flex-1 animate-page-transition overflow-y-auto no-scrollbar">
        <SharedHeader rank={rank} profile={profile} streak={streak} onToggleTheme={onToggleTheme} isDarkMode={isDarkMode} />

        <div className="px-6 pt-6 pb-32">
          {/* Header da Seção */}
          <div className="flex items-end justify-between mb-8">
            <div>
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                 Estudos
               </h1>
               <p className="text-gray-500 text-sm mt-1">Selecione um tópico para iniciar.</p>
            </div>
            
            <button 
              onClick={() => onSelectStudy(null, null, 10, true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-lg active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-lg fill-1">gavel</span>
              <span className="text-xs font-bold uppercase tracking-wide">Concílio</span>
            </button>
          </div>
          
          <div className="mb-8 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
            <input 
              className="w-full h-12 rounded-xl bg-gray-50 dark:bg-neutral-900 border-none ring-1 ring-gray-200 dark:ring-white/10 focus:ring-2 focus:ring-primary pl-12 pr-4 text-sm transition-all" 
              placeholder="Pesquisar..." 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            {categories.map(cat => {
              const catTopics = filteredTopics.filter(t => t.category === cat);
              const isExpanded = expandedCategories[cat] || search.length > 0;
              if (catTopics.length === 0) return null;

              return (
                <div key={cat} className="space-y-3">
                  <button 
                    onClick={() => toggleCategory(cat)}
                    className="w-full flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5"
                  >
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{cat}</h3>
                    <span className={`material-symbols-outlined text-gray-400 text-lg transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}>expand_more</span>
                  </button>
                  
                  {isExpanded && (
                    <div className="grid grid-cols-1 gap-3">
                      {catTopics.map(topic => (
                        <TopicCard key={topic.id} topic={topic} onSelect={() => setSelectedTopicId(topic.id)} rankColor={rank.styles.text} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Minimal Modal */}
      {selectedTopicId && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedTopicId(null)}>
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl p-6 animate-page-transition shadow-xl ring-1 ring-black/5" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quantidade de Cartões</h3>
               <button onClick={() => setSelectedTopicId(null)} className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10">
                 <span className="material-symbols-outlined text-sm">close</span>
               </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 15].map(limit => (
                <button
                  key={limit}
                  onClick={() => selectedTopicId && onSelectStudy(selectedTopicId, null, limit, false)}
                  className={`h-16 rounded-2xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/5 transition-all font-bold text-xl flex flex-col items-center justify-center gap-1 group hover:${rank.styles.bg} hover:${rank.styles.text} hover:border-current`}
                >
                  <span>{limit}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TopicCard: React.FC<{ topic: Topic, onSelect: () => void, rankColor?: string }> = ({ topic, onSelect, rankColor }) => {
  const totalCards = topic.total || 0;
  
  return (
    <button onClick={onSelect} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-800 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all group text-left shadow-sm hover:shadow-md">
      <div className={`size-10 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center border border-gray-100 dark:border-white/5 transition-colors group-hover:${rankColor || 'text-primary'}`}>
        <span className={`material-symbols-outlined text-xl text-gray-400 group-hover:text-inherit`}>{topic.icon}</span>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-slate-900 dark:text-white mb-0.5">{topic.name}</p>
        <p className="text-xs text-gray-500">{totalCards} cartões disponíveis</p>
      </div>
      <span className="material-symbols-outlined text-gray-300 text-lg group-hover:translate-x-1 transition-transform">chevron_right</span>
    </button>
  );
};

export default TopicsScreen;
