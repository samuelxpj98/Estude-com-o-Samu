
import React, { useState } from 'react';
import { Topic, UserProfile } from '../types.ts';

interface TopicsScreenProps {
  topics: Topic[];
  onSelectStudy: (topicId: string, level: number | null, limit: number) => void;
  streak: number;
  profile: UserProfile;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
  onOpenAI: () => void;
}

const TopicsScreen: React.FC<TopicsScreenProps> = ({ topics, onSelectStudy, streak, profile, onToggleTheme, isDarkMode, onOpenAI }) => {
  const [search, setSearch] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    '1 - Doutrinas Teológicas': true,
    '2 - Ética Pastoral e Casuística': false,
    '3 - Origem e História dos Batistas': false,
  });

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
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="size-10 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg"
            style={{ backgroundColor: profile.avatarColor }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Seminarista</p>
            <h2 className="text-base font-black tracking-tighter uppercase leading-none">{profile.name.split(' ')[0]}</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Alternador de Tema */}
          <button 
            onClick={onToggleTheme}
            className="size-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 active:scale-90 transition-all"
            title="Mudar Tema"
          >
            <span className="material-symbols-outlined text-[20px] fill-1">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Foguinho/Streak */}
          <div className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
            <span className="material-symbols-outlined text-orange-500 text-[18px] fill-1">local_fire_department</span>
            <span className="text-sm font-black text-orange-600 dark:text-orange-400">{streak}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 pb-32">
        <h1 className="text-4xl font-black leading-[0.85] tracking-tighter uppercase mb-6">
          O que vamos<br/>estudar <span className="text-primary">hoje?</span>
        </h1>
        
        <div className="mb-8 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">search</span>
          <input 
            className="w-full h-14 rounded-[20px] bg-white dark:bg-surface-dark border-none ring-1 ring-gray-100 dark:ring-white/5 shadow-sm focus:ring-2 focus:ring-primary pl-12 pr-4 text-sm font-medium transition-all" 
            placeholder="Buscar tópico ou categoria..." 
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
              <div key={cat} className="overflow-hidden rounded-[32px] bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-white/5 transition-all">
                <button 
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center justify-between p-5 bg-gray-50/50 dark:bg-white/5"
                >
                  <h3 className="text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-[0.2em]">{cat}</h3>
                  <span className={`material-symbols-outlined text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                
                {isExpanded && (
                  <div className="p-3 space-y-1">
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

      {/* Modal de Seleção de Intensidade */}
      {selectedTopicId && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-12" onClick={() => setSelectedTopicId(null)}>
          <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-[40px] p-8 shadow-2xl animate-page-transition" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-black tracking-tighter uppercase">Intensidade</h3>
               <button onClick={() => setSelectedTopicId(null)} className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                 <span className="material-symbols-outlined text-sm">close</span>
               </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">Quantos cartões deseja revisar?</p>
            <div className="grid grid-cols-3 gap-4">
              {[5, 10, 15].map(limit => (
                <button
                  key={limit}
                  onClick={() => selectedTopicId && onSelectStudy(selectedTopicId, null, limit)}
                  className="h-20 rounded-[24px] bg-primary hover:bg-blue-600 text-white font-black text-2xl shadow-xl shadow-primary/25 transition-all active:scale-90"
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
  const percentage = topic.total > 0 ? Math.round((topic.stats.correct / topic.total) * 100) : 0;
  const colors: Record<string, string> = { 
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20', 
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', 
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20' 
  };

  return (
    <button onClick={onSelect} className="w-full flex items-center justify-between p-4 rounded-[20px] hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-[0.98]">
      <div className="flex items-center gap-4">
        <div className={`size-12 rounded-[16px] flex items-center justify-center border ${colors[topic.color] || colors.blue}`}>
          <span className="material-symbols-outlined text-xl">{topic.icon}</span>
        </div>
        <div className="text-left">
          <p className="font-black text-sm uppercase tracking-tighter leading-tight">{topic.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{topic.total} cartões</span>
            <div className="size-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <span className="text-[10px] text-primary font-black uppercase tracking-widest">{percentage}% DOMINADO</span>
          </div>
        </div>
      </div>
      <span className="material-symbols-outlined text-gray-300">arrow_forward_ios</span>
    </button>
  );
};

export default TopicsScreen;
