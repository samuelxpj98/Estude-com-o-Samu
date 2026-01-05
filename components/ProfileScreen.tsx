
import React, { useState } from 'react';
import { UserProfile } from '../types.ts';
import { auth } from '../constants.ts';

interface ProfileScreenProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  onSync: () => Promise<boolean>;
  totalRevisions: number;
  onToggleTheme?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, setProfile, onSync, totalRevisions, onToggleTheme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const avatarColors = ['#135bec', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

  const handleToggle = () => {
    if (onToggleTheme) {
      onToggleTheme();
      setIsDarkMode(!isDarkMode);
    }
  };

  const handleLogout = async () => {
    if (confirm("Deseja realmente sair da sua conta?")) {
      try {
        await auth.signOut();
      } catch (e) {
        console.error("Erro ao deslogar", e);
        window.location.reload();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-page-transition">
      <header className="p-8 pb-4 flex flex-col items-center gap-4">
        <div 
          className="size-24 rounded-[32px] flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white dark:border-surface-dark transition-all transform hover:rotate-3"
          style={{ backgroundColor: profile.avatarColor }}
        >
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase leading-tight">{profile.name}</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{profile.church}</p>
        </div>
      </header>

      <div className="px-6 space-y-4 pb-32 overflow-y-auto no-scrollbar">
        
        {/* Seção de Edição Minimizada */}
        <div className="bg-white dark:bg-surface-dark rounded-[24px] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm transition-all">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-400">edit_square</span>
              <span className="text-sm font-bold uppercase tracking-tighter">Dados do Seminarista</span>
            </div>
            <span className={`material-symbols-outlined text-gray-300 transition-transform ${isEditing ? 'rotate-180' : ''}`}>expand_more</span>
          </button>
          
          {isEditing && (
            <div className="p-5 pt-0 space-y-6 animate-page-transition">
              <div className="h-px bg-gray-100 dark:bg-white/5 mb-6"></div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Nome de Exibição</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-background-dark border-none ring-1 ring-gray-100 dark:ring-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Igreja</label>
                <input 
                  type="text" 
                  value={profile.church}
                  onChange={(e) => setProfile({ ...profile, church: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-background-dark border-none ring-1 ring-gray-100 dark:ring-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Nome da Igreja"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Telefone</label>
                <input 
                  type="tel" 
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-background-dark border-none ring-1 ring-gray-100 dark:ring-white/5 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Seu telefone"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Cor da Identidade</label>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {avatarColors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setProfile({ ...profile, avatarColor: color })}
                      className={`size-10 rounded-full shrink-0 border-4 transition-all ${profile.avatarColor === color ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-50'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <SettingsItem 
              icon={document.documentElement.classList.contains('dark') ? "light_mode" : "dark_mode"} 
              label="Modo de Visualização" 
              detail={document.documentElement.classList.contains('dark') ? "Escuro" : "Claro"} 
              onClick={handleToggle}
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={handleLogout}
            className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-primary/30"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Encerrar Sessão
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsItem: React.FC<{ icon: string, label: string, detail?: string, onClick: () => void, className?: string }> = ({ icon, label, detail, onClick, className }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all active:scale-[0.98]"
  >
    <div className="flex items-center gap-3">
      <div className={`size-10 rounded-xl bg-gray-50 dark:bg-background-dark flex items-center justify-center text-gray-400 ${className}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-sm font-bold">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {detail && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{detail}</span>}
      <span className="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
    </div>
  </button>
);

export default ProfileScreen;
