
import React, { useState } from 'react';
import { UserProfile, UserStats } from '../types.ts';
import { auth } from '../constants.ts';
import { RANKS, getRank, SharedHeader } from './TopicsScreen.tsx';

interface ProfileScreenProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  onSync: () => Promise<boolean>;
  userStats: UserStats;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
  onRepair?: () => Promise<any>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, setProfile, onSync, userStats, onToggleTheme, isDarkMode, onRepair }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const avatarColors = ['#135bec', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

  const totalRevisions = userStats.cardsLifetime;
  const currentRank = getRank(totalRevisions);
  const nextRank = RANKS.find(r => r.threshold > currentRank.threshold);
  
  const progressToNext = nextRank 
    ? Math.min(100, Math.round(((totalRevisions - currentRank.threshold) / (nextRank.threshold - currentRank.threshold)) * 100))
    : 100;

  const remaining = nextRank ? nextRank.threshold - totalRevisions : 0;

  const handleLogout = async () => {
    if (confirm("Deseja realmente sair da sua conta?")) {
      try {
        await auth.signOut();
      } catch (e) {
        window.location.reload();
      }
    }
  };

  const handleRepair = async () => {
    if (!onRepair) return;
    setRepairing(true);
    try {
      await onRepair();
      alert("Sincronização forçada com sucesso! Você deve aparecer no ranking em instantes.");
    } catch (e) {
      alert("Erro ao sincronizar. Verifique sua conexão.");
    } finally {
      setRepairing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-page-transition">
      <SharedHeader rank={currentRank} profile={profile} streak={userStats.streak} onToggleTheme={onToggleTheme} isDarkMode={isDarkMode} />

      <div className="px-6 space-y-8 pb-32 overflow-y-auto no-scrollbar pt-8">
        
        {/* Card de Carreira Teológica Premium */}
        <section className="bg-white dark:bg-surface-dark rounded-[50px] p-8 border border-gray-100 dark:border-white/5 shadow-2xl space-y-8 relative overflow-hidden group">
          <div className={`absolute top-0 right-0 size-64 bg-gradient-to-br ${currentRank.color} opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl`}></div>
          <div className="absolute -bottom-10 -left-10 size-40 bg-primary/5 rounded-full blur-2xl"></div>

          <div className="flex justify-between items-start z-10 relative">
             <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Jornada Ministerial</p>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Carreira Teológica</h3>
             </div>
             <div className="text-right flex flex-col items-end">
                <div className={`size-16 rounded-3xl bg-gradient-to-br ${currentRank.color} flex items-center justify-center text-white shadow-xl mb-2 ring-4 ring-white dark:ring-surface-dark`}>
                   <span className="material-symbols-outlined text-3xl fill-1">{currentRank.icon}</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Patente Atual</span>
             </div>
          </div>

          <div className="flex justify-between items-center px-4 py-8 z-10 relative">
             {RANKS.map((r, idx) => {
               const isAchieved = totalRevisions >= r.threshold;
               const isCurrent = currentRank.name === r.name;
               return (
                 <div key={idx} className="flex flex-col items-center gap-3 relative group/rank">
                    {idx < RANKS.length - 1 && (
                      <div className={`absolute top-7 left-[60%] w-[120%] h-1 -z-10 rounded-full ${totalRevisions >= RANKS[idx+1].threshold ? `bg-gradient-to-r ${r.color}` : 'bg-gray-100 dark:bg-white/5'}`}></div>
                    )}
                    <div className={`size-14 rounded-[22px] flex items-center justify-center transition-all duration-700 ${isAchieved ? `bg-gradient-to-br ${r.color} text-white shadow-2xl scale-110 ring-4 ring-white dark:ring-surface-dark` : 'bg-gray-100 dark:bg-background-dark text-gray-300 dark:text-gray-700 opacity-50'}`}>
                      <span className="material-symbols-outlined text-[28px] fill-1">{r.icon}</span>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-tighter text-center max-w-[60px] ${isCurrent ? 'text-primary' : 'text-gray-400'}`}>
                      {r.name.split(' ')[0]}
                    </span>
                    {isCurrent && (
                      <div className="absolute -top-3 flex flex-col items-center">
                         <div className="size-2 bg-primary rounded-full animate-ping mb-1"></div>
                         <div className="bg-primary text-white text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">VOCÊ</div>
                      </div>
                    )}
                 </div>
               )
             })}
          </div>

          {nextRank ? (
            <div className="space-y-5 z-10 relative bg-gray-50 dark:bg-white/5 p-6 rounded-[36px] border border-gray-100 dark:border-white/5 shadow-inner">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Próxima Consagração</p>
                  <p className={`text-xl font-black uppercase tracking-tighter bg-gradient-to-br ${nextRank.color} bg-clip-text text-transparent`}>{nextRank.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary">{progressToNext}%</span>
                </div>
              </div>
              
              <div className="h-6 w-full bg-white dark:bg-background-dark rounded-full overflow-hidden p-1.5 shadow-xl ring-1 ring-gray-100 dark:ring-white/5">
                 <div className={`h-full bg-gradient-to-r ${currentRank.color} rounded-full transition-all duration-1000 relative`} style={{ width: `${progressToNext}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                 </div>
              </div>

              <div className="flex items-center justify-center gap-3 py-1">
                 <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg font-bold">trending_up</span>
                 </div>
                 <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                  Faltam apenas <span className="text-primary font-black text-sm">{remaining}</span> cards para subir
                </p>
              </div>
            </div>
          ) : (
             <div className="p-8 rounded-[40px] bg-gradient-to-br from-orange-500 via-red-600 to-red-800 text-center z-10 relative shadow-2xl">
                <div className="size-20 rounded-full bg-white/20 mx-auto flex items-center justify-center text-white shadow-xl mb-5 backdrop-blur-md ring-4 ring-white/30">
                  <span className="material-symbols-outlined text-4xl fill-1">workspace_premium</span>
                </div>
                <h4 className="text-2xl font-black uppercase text-white tracking-tighter leading-none mb-2">Mestre Supremo</h4>
                <p className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Autoridade Máxima em Teologia Sistemática</p>
             </div>
          )}
        </section>

        {/* Reparo Manual */}
        <section className="bg-primary/5 rounded-[32px] p-6 border border-primary/20 flex flex-col gap-4">
           <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                 <span className={`material-symbols-outlined ${repairing ? 'animate-spin' : ''}`}>sync_problem</span>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-tighter">Ranking e Ofensiva</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Não aparece no ranking? Clique abaixo.</p>
              </div>
           </div>
           <button 
             onClick={handleRepair}
             disabled={repairing}
             className="w-full h-12 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
           >
             {repairing ? 'Processando...' : 'Corrigir Ranking e Ofensiva'}
           </button>
        </section>

        {/* Edição de Perfil */}
        <div className="bg-white dark:bg-surface-dark rounded-[40px] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm transition-all">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="w-full p-8 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-gray-50 dark:bg-background-dark flex items-center justify-center text-gray-400">
                <span className="material-symbols-outlined">badge</span>
              </div>
              <div className="text-left">
                <span className="text-base font-black uppercase tracking-tighter block">Identidade Ministerial</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gerenciar dados e aparência</span>
              </div>
            </div>
            <span className={`material-symbols-outlined text-gray-300 transition-transform duration-300 ${isEditing ? 'rotate-180 text-primary' : ''}`}>expand_more</span>
          </button>
          
          {isEditing && (
            <div className="p-8 pt-0 space-y-6 animate-page-transition">
              <div className="h-px bg-gray-100 dark:bg-white/5 mb-8"></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-[0.2em]">Nome Completo</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-gray-100 dark:bg-background-dark border-none ring-1 ring-gray-100 dark:ring-white/5 rounded-[22px] px-5 py-5 text-base font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-[0.2em]">Sua Congregação</label>
                <input 
                  type="text" 
                  value={profile.church}
                  onChange={(e) => setProfile({ ...profile, church: e.target.value })}
                  className="w-full bg-gray-100 dark:bg-background-dark border-none ring-1 ring-gray-100 dark:ring-white/5 rounded-[22px] px-5 py-5 text-base font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Nome da Igreja"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-[0.2em]">Cor da Identidade Visual</label>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {avatarColors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setProfile({ ...profile, avatarColor: color })}
                      className={`size-14 rounded-2xl shrink-0 border-4 transition-all ${profile.avatarColor === color ? 'border-primary scale-110 shadow-2xl' : 'border-transparent opacity-40 hover:opacity-100'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <section className="space-y-4">
          <SettingsItem 
            icon={isDarkMode ? "light_mode" : "dark_mode"} 
            label="Visual do Aplicativo" 
            detail={isDarkMode ? "Modo Escuro" : "Modo Claro"} 
            onClick={onToggleTheme || (() => {})}
          />
          <SettingsItem 
            icon="sync" 
            label="Sincronizar Planilha" 
            detail="Verificar novos cards" 
            onClick={() => onSync()}
          />
        </section>

        <div className="flex flex-col gap-6 pt-4 pb-12">
          <button 
            onClick={handleLogout}
            className="w-full h-18 rounded-[30px] bg-red-600/10 text-red-600 border-2 border-red-600/20 font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-red-600 hover:text-white"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Encerrar Sessão do Seminarista
          </button>
          
          <div className="text-center opacity-30">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">
              Criado por Samuel Duarte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsItem: React.FC<{ icon: string, label: string, detail?: string, onClick: () => void, className?: string }> = ({ icon, label, detail, onClick, className }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 bg-white dark:bg-surface-dark rounded-[32px] border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all active:scale-[0.98] shadow-sm"
  >
    <div className="flex items-center gap-4">
      <div className={`size-12 rounded-2xl bg-gray-50 dark:bg-background-dark flex items-center justify-center text-gray-400 ${className}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-base font-black uppercase tracking-tighter">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      {detail && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{detail}</span>}
      <span className="material-symbols-outlined text-gray-300">chevron_right</span>
    </div>
  </button>
);

export default ProfileScreen;
