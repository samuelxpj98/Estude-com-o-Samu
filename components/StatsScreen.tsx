
import React, { useMemo } from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis } from 'recharts';
import { UserStats, Topic, UserProfile } from '../types.ts';
import { SharedHeader, getRank } from './TopicsScreen.tsx';

interface StatsScreenProps {
  topics: Topic[];
  userStats: UserStats;
  profile: UserProfile;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
}

const StatsScreen: React.FC<StatsScreenProps> = ({ topics, userStats, profile, onToggleTheme, isDarkMode }) => {
  const rank = getRank(userStats.cardsLifetime);
  
  // Gera os dados da última semana dinamicamente
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      
      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase();
      const dayLabel = dayName.length > 1 ? dayName.charAt(0) : dayName;

      data.push({
        day: dayLabel,
        cards: userStats.activityLog?.[key] || 0,
        isToday: i === 0
      });
    }
    return data;
  }, [userStats.activityLog]);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-page-transition">
      <SharedHeader rank={rank} profile={profile} streak={userStats.streak} onToggleTheme={onToggleTheme} isDarkMode={isDarkMode} />

      <div className="p-4 pt-8 space-y-8 pb-32 overflow-y-auto no-scrollbar">
        <div className="px-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">Seu Desempenho</h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium tracking-wide">Acompanhe sua evolução na jornada teológica.</p>
        </div>

        {/* Resumo Geral */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-[32px] bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm">
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-2 leading-none">Revisões Hoje</p>
            <p className={`text-4xl font-black leading-none ${rank.styles.text}`}>{userStats.cardsToday}</p>
          </div>
          <div className="p-5 rounded-[32px] bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm">
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-2 leading-none">Total Geral</p>
            <p className={`text-4xl font-black leading-none ${rank.styles.text}`}>{userStats.cardsLifetime.toLocaleString('pt-BR')}</p>
          </div>
        </div>

        {/* Atividade Semanal */}
        <div className="p-6 rounded-[40px] bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Atividade Semanal</h3>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${rank.styles.bg} ${rank.styles.text}`}>Últimos 7 dias</span>
          </div>
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dy={5}
                />
                <Bar dataKey="cards" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      className={entry.isToday ? `${rank.styles.text} opacity-100` : 'fill-gray-200 dark:fill-white/10'} 
                      fill={entry.isToday ? 'currentColor' : undefined}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domínio por Tópico */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 px-1">
            <h3 className="text-lg font-black uppercase tracking-tighter">Domínio Teológico</h3>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 bg-gray-50 dark:bg-white/5 p-4 rounded-[24px] border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Errei</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></div>
                <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Revisar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${rank.styles.fill} shadow-sm`}></div>
                <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Domínio</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {topics.map(topic => (
              <TopicMasteryCard key={topic.id} topic={topic} rankFill={rank.styles.fill} />
            ))}
          </div>
        </div>
        
        <div className="py-10 text-center opacity-40">
           <p className="text-xs font-serif italic italic leading-relaxed">
             "Procura apresentar-te a Deus aprovado..."<br/>
             <span className="font-bold uppercase tracking-widest text-[9px]">2 Timóteo 2:15</span>
           </p>
        </div>
      </div>
    </div>
  );
};

const TopicMasteryCard: React.FC<{ topic: Topic, rankFill: string }> = ({ topic, rankFill }) => {
  const { wrong, review, correct } = topic.stats;
  const totalNoBanco = topic.total || 0; 
  
  const masteryPercentage = totalNoBanco > 0 ? Math.min(100, Math.round((correct / totalNoBanco) * 100)) : 0;
  
  const pWrong = totalNoBanco > 0 ? (wrong / totalNoBanco) * 100 : 0;
  const pReview = totalNoBanco > 0 ? (review / totalNoBanco) * 100 : 0;
  const pCorrect = totalNoBanco > 0 ? (correct / totalNoBanco) * 100 : 0;

  return (
    <div className="p-5 rounded-[32px] bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/5">
             <span className="material-symbols-outlined text-xl opacity-70">{topic.icon}</span>
          </div>
          <div className="max-w-[180px]">
            <h4 className="text-[11px] font-black uppercase leading-tight truncate mb-1">{topic.name}</h4>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{totalNoBanco} cartões</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-[10px] font-black uppercase opacity-80`}>{masteryPercentage}%</span>
        </div>
      </div>
      
      <div className="w-full h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden flex shadow-inner border border-gray-200 dark:border-white/5">
        <div className="h-full bg-red-500 transition-all duration-700" style={{ width: `${Math.min(100, pWrong)}%` }}></div>
        <div className="h-full bg-orange-500 transition-all duration-700" style={{ width: `${Math.min(100, pReview)}%` }}></div>
        <div className={`h-full ${rankFill} transition-all duration-700`} style={{ width: `${Math.min(100, pCorrect)}%` }}></div>
      </div>
    </div>
  );
};

export default StatsScreen;
