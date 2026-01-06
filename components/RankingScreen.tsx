
import React, { useEffect, useState } from 'react';
import { UserProfile, UserStats } from '../types.ts';
import { db } from '../constants.ts';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { SharedHeader, getRank } from './TopicsScreen.tsx';

interface RankingUser {
  profile: UserProfile;
  stats: UserStats;
}

const RankingScreen: React.FC<{ profile: UserProfile, stats: UserStats, onToggleTheme: () => void, isDarkMode: boolean }> = ({ profile, stats, onToggleTheme, isDarkMode }) => {
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const currentRank = getRank(stats.cardsLifetime);

  useEffect(() => {
    // Consulta em tempo real (Online)
    const q = query(
      collection(db, "users"), 
      orderBy("stats.cardsLifetime", "desc"), 
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRankings: RankingUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const docId = doc.id;
        
        // Verificação super resiliente para garantir que o usuário apareça
        if (data.profile || data.name || data.stats) {
          const userProf = data.profile || { 
            id: docId, 
            name: data.name || 'Seminarista', 
            avatarColor: '#135bec', 
            church: data.church || 'Igreja Batista' 
          };
          
          // Se o perfil no banco não tiver ID, usamos o ID do documento
          if (!userProf.id) userProf.id = docId;

          fetchedRankings.push({
            profile: userProf,
            stats: data.stats || { cardsLifetime: data.cardsLifetime || 0, streak: data.streak || 0 }
          });
        }
      });
      setRankings(fetchedRankings);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao escutar ranking:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-page-transition">
      <SharedHeader rank={currentRank} profile={profile} streak={stats.streak} onToggleTheme={onToggleTheme} isDarkMode={isDarkMode} />

      <div className="px-6 pt-8 pb-32 overflow-y-auto no-scrollbar">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Mural de Honra</h1>
            <p className="text-gray-500 text-sm font-medium">Os seminaristas mais dedicados da convenção.</p>
          </div>
          
          {/* Indicador Live Online */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
             <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
             <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Live</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-primary">sync</span>
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Convocando Concílio...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rankings.length === 0 && (
               <div className="text-center py-20 opacity-20">
                  <span className="material-symbols-outlined text-6xl mb-4">groups_3</span>
                  <p className="text-sm font-black uppercase tracking-widest">Ninguém no ranking ainda</p>
               </div>
            )}
            
            {rankings.map((user, index) => {
              const userRank = getRank(user.stats.cardsLifetime);
              const isTop3 = index < 3;
              const medals = ['🥇', '🥈', '🥉'];
              
              // Comparação robusta de identidade
              const isMe = user.profile.id === profile.id;

              return (
                <div 
                  key={user.profile.id || index} 
                  className={`relative p-5 rounded-[32px] border transition-all duration-500 ${isMe ? 'bg-primary/10 border-primary shadow-xl scale-[1.02] z-10' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/5 shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div 
                        className="size-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
                        style={{ backgroundColor: user.profile.avatarColor || '#135bec' }}
                      >
                        {(user.profile.name || 'S').charAt(0).toUpperCase()}
                      </div>
                      {isTop3 && (
                        <div className="absolute -top-2 -left-2 text-2xl drop-shadow-md animate-bounce [animation-duration:3s]">
                          {medals[index]}
                        </div>
                      )}
                      
                      <div className="absolute -bottom-1 -right-1 size-6 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                         <span className="text-[10px] font-black text-gray-500">{index + 1}</span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className={`font-black uppercase tracking-tighter truncate text-sm ${isMe ? 'text-primary' : ''}`}>
                          {user.profile.name}
                        </h3>
                        {isMe && <span className="text-[8px] bg-primary text-white px-1.5 py-0.5 rounded-full font-black">VOCÊ</span>}
                      </div>
                      
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[10px] text-gray-400 font-bold truncate uppercase">{user.profile.church || 'Igreja Batista'}</p>
                        <div className="flex items-center gap-2">
                           <span className={`material-symbols-outlined text-[12px] fill-1 bg-gradient-to-br ${userRank.color} bg-clip-text text-transparent`}>{userRank.icon}</span>
                           <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{userRank.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-xl font-black leading-none ${isTop3 ? 'text-primary' : ''}`}>{user.stats.cardsLifetime}</p>
                      <p className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Cards</p>
                      
                      {user.profile.phone && !isMe && (
                        <a 
                          href={`https://wa.me/55${user.profile.phone.replace(/\D/g,'')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="mt-2 size-8 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all inline-flex shadow-sm active:scale-90"
                        >
                          <span className="material-symbols-outlined text-sm">chat</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingScreen;
