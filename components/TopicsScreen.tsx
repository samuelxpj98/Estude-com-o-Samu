
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

export const RANKS = [
  { name: 'Aspirante', threshold: 0, next: 100, color: 'from-amber-400 to-amber-600', icon: 'auto_awesome', bg: 'bg-amber-500/10', border: 'border-amber-500/20', headerBg: 'bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600' },
  { name: 'Seminarista', threshold: 100, next: 500, color: 'from-blue-500 to-blue-700', icon: 'school', bg: 'bg-blue-500/10', border: 'border-blue-500/20', headerBg: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800' },
  { name: 'Bacharel', threshold: 500, next: 2000, color: 'from-emerald-500 to-teal-700', icon: 'history_edu', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', headerBg: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800' },
  { name: 'Mestre em Teologia', threshold: 2000, next: Infinity, color: 'from-orange-500 to-red-600', icon: 'workspace_premium', bg: 'bg-orange-500/10', border: 'border-orange-500/20', headerBg: 'bg-gradient-to-br from-orange-600 via-red-600 to-red-800' }
];

export const getRank = (lifetime: number) => {
  return [...RANKS].reverse().find(r => lifetime >= r.threshold) || RANKS[0];
};

export const SharedHeader: React.FC<{ rank: any, profile: UserProfile, streak: number, onToggleTheme?: () => void, isDarkMode?: boolean }> = ({ rank, profile, streak, onToggleTheme, isDarkMode }) => (
  <div className={`sticky top-0 z-20 ${rank.headerBg} px-6 py-7 flex items-center justify-between shadow-2xl shadow-black/20 rounded-b-[40px]`}>
    <div className="flex items-center gap-4">
      <div 
        className="size-14 rounded-[22px] flex items-center justify-center text-white text-2xl font-black shadow-2xl ring-4 ring-white/20 transform -rotate-3"
        style={{ backgroundColor: profile.avatarColor }}
      >
        {profile.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex flex-col">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/20 border border-white/20 mb-1.5 backdrop-blur-md">
           <span className="material-symbols-outlined text-[14px] fill-1 text-white">{rank.icon}</span>
           <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">{rank.name}</span>
        </div>
        <h2 className="text-xl font-black tracking-tighter uppercase leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {profile.name}
        </h2>
      </div>
    </div>
    
    <div className="flex items-center gap-2">
      <button 
        onClick={onToggleTheme}
        className="size-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white active:scale-90 transition-all backdrop-blur-md hover:bg-white/20"
      >
        <span className="material-symbols-outlined text-[24px] fill-1">
          {isDarkMode ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      <div className="flex items-center gap-2 bg-white/20 px-4 py-2.5 rounded-full border border-white/30 backdrop-blur-md shadow-inner">
        <span className="material-symbols-outlined text-white text-[22px] fill-1 animate-pulse">local_fire_department</span>
        <span className="text-base font-black text-white">{streak}</span>
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
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-page-transition">
      <SharedHeader rank={rank} profile={profile} streak={streak} onToggleTheme={onToggleTheme} isDarkMode={isDarkMode} />

      <div className="px-6 pt-10 pb-32">
        <div className="flex items-end justify-between mb-8">
          <h1 className="text-4xl font-black leading-[0.85] tracking-tighter uppercase">
            O que vamos<br/>estudar <span className="text-primary">hoje?</span>
          </h1>
          <button 
            onClick={() => onSelectStudy(null, null, 10, true)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="size-20 rounded-[28px] bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/30 group-active:scale-90 transition-all animate-pulse relative overflow-hidden border-4 border-white dark:border-white/5">
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
               <span className="material-symbols-outlined text-4xl fill-1 z-10">gavel</span>
            </div>
            <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Modo Concílio</span>
          </button>
        </div>
        
        <div className="mb-8 relative group">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full h-16 rounded-[28px] bg-white dark:bg-surface-dark border-none ring-1 ring-gray-100 dark:ring-white/5 shadow-xl shadow-black/5 focus:ring-2 focus:ring-primary pl-14 pr-6 text-base font-medium transition-all" 
            placeholder="Buscar tópico teológico..." 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {categories.map(cat => {
            const catTopics = filteredTopics.filter(t => t.category === cat);
            const isExpanded = expandedCategories[cat] || search.length > 0;
            if (catTopics.length === 0) return null;

            return (
              <div key={cat} className="overflow-hidden rounded-[36px] bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 transition-all">
                <button 
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center justify-between p-6 bg-gray-50/50 dark:bg-white/5"
                >
                  <h3 className="text-slate-900 dark:text-white font-black text-[11px] uppercase tracking-[0.2em]">{cat}</h3>
                  <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}>expand_more</span>
                </button>
                
                {isExpanded && (
                  <div className="p-4 space-y-1">
                    {catTopics.map(topic => (
                      <TopicCard key={topic.id} topic={topic} onSelect={() => setSelectedTopicId(topic.id)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedTopicId && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-md px-4 pb-12" onClick={() => setSelectedTopicId(null)}>
          <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-[50px] p-10 shadow-2xl animate-page-transition border-t-8 border-primary" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-3xl font-black tracking-tighter uppercase">Intensidade</h3>
               <button onClick={() => setSelectedTopicId(null)} className="size-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 active:scale-90">
                 <span className="material-symbols-outlined text-lg">close</span>
               </button>
            </div>
            <p className="text-base text-gray-500 dark:text-gray-400 mb-10 font-medium leading-relaxed">Quantos cartões deseja revisar nesta sessão?</p>
            <div className="grid grid-cols-3 gap-5">
              {[5, 10, 15].map(limit => (
                <button
                  key={limit}
                  onClick={() => selectedTopicId && onSelectStudy(selectedTopicId, null, limit, false)}
                  className="h-24 rounded-[32px] bg-primary hover:bg-blue-600 text-white font-black text-3xl shadow-2xl shadow-primary/30 transition-all active:scale-90 flex items-center justify-center"
                >
                  {limit}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TopicCard: React.FC<{ topic: Topic, onSelect: () => void }> = ({ topic, onSelect }) => {
  const totalCards = topic.total || 0;
  const percentage = totalCards > 0 ? Math.round((topic.stats.correct / totalCards) * 100) : 0;
  
  const colors: Record<string, string> = { 
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20', 
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', 
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20' 
  };

  return (
    <button onClick={onSelect} className="w-full flex items-center justify-between p-5 rounded-[28px] hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-[0.98] group">
      <div className="flex items-center gap-5">
        <div className={`size-14 rounded-[20px] flex items-center justify-center border-2 shadow-sm transition-transform group-hover:scale-110 ${colors[topic.color] || colors.blue}`}>
          <span className="material-symbols-outlined text-2xl">{topic.icon}</span>
        </div>
        <div className="text-left">
          <p className="font-black text-base uppercase tracking-tighter leading-tight mb-1 group-hover:text-primary transition-colors">{topic.name}</p>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{totalCards} cartões</span>
            <div className="size-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <span className="text-[10px] text-primary font-black uppercase tracking-widest">{percentage}% DOMINADO</span>
          </div>
        </div>
      </div>
      <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">arrow_forward_ios</span>
    </button>
  );
};

export default TopicsScreen;
