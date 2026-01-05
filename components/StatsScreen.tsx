
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis } from 'recharts';
import { ACTIVITY_DATA } from '../constants.ts';
import { UserStats, Topic } from '../types.ts';

interface StatsScreenProps {
  topics: Topic[];
  userStats: UserStats;
}

const StatsScreen: React.FC<StatsScreenProps> = ({ topics, userStats }) => {
  const chartData = ACTIVITY_DATA.map(d => d.isToday ? { ...d, cards: userStats.cardsToday } : d);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-gray-200 dark:border-white/5">
        <h2 className="text-xl font-bold leading-tight tracking-tight">Progresso Teológico</h2>
        <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
          <span className="material-symbols-outlined text-orange-500 text-[18px] fill-1">local_fire_department</span>
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{userStats.streak} acessos</span>
        </div>
      </div>

      <div className="p-4 pt-6 space-y-8 pb-32 overflow-y-auto no-scrollbar">
        {/* Resumo Geral */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest mb-2 leading-none">Revisões Hoje</p>
            <p className="text-3xl font-black leading-none">{userStats.cardsToday}</p>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest mb-2 leading-none">Total Geral</p>
            <p className="text-3xl font-black leading-none">{userStats.cardsLifetime.toLocaleString('pt-BR')}</p>
          </div>
        </div>

        {/* Atividade Semanal */}
        <div className="p-6 rounded-3xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400">Atividade Semanal</h3>
          </div>
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  dy={5}
                />
                <Bar dataKey="cards" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isToday ? '#135bec' : '#135bec22'} 
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
            
            {/* Legenda das Cores */}
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Erro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Revisar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Domínio</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {topics.map(topic => (
              <TopicMasteryCard key={topic.id} topic={topic} />
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

const TopicMasteryCard: React.FC<{ topic: Topic }> = ({ topic }) => {
  const { wrong, review, correct } = topic.stats;
  const totalIniciado = wrong + review + correct;
  const totalApp = topic.total || 1; 
  
  const pWrong = (wrong / totalApp) * 100;
  const pReview = (review / totalApp) * 100;
  const pCorrect = (correct / totalApp) * 100;

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center">
             <span className="material-symbols-outlined text-[16px] opacity-70">{topic.icon}</span>
          </div>
          <div className="max-w-[180px]">
            <h4 className="text-xs font-black uppercase leading-none truncate mb-1">{topic.name}</h4>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{totalIniciado} revisões feitas</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-primary uppercase">{Math.min(100, Math.round((correct/totalApp)*100))}%</span>
        </div>
      </div>
      
      <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden flex">
        <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${Math.min(100, pWrong)}%` }}></div>
        <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${Math.min(100, pReview)}%` }}></div>
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, pCorrect)}%` }}></div>
      </div>
    </div>
  );
};

export default StatsScreen;
