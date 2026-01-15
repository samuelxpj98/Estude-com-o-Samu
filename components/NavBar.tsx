
import React from 'react';
import { Screen } from '../types.ts';

interface NavBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentScreen, onNavigate }) => {
  return (
    <div className="sticky bottom-0 w-full bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 z-40 pb-5 pt-3 px-2 flex justify-between items-end shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <NavItem 
        icon="school" 
        label="Estudos"
        active={currentScreen === Screen.Topics || currentScreen === Screen.Study}
        onClick={() => onNavigate(Screen.Topics)}
      />
      <NavItem 
        icon="military_tech" 
        label="Ranking"
        active={currentScreen === Screen.Ranking}
        onClick={() => onNavigate(Screen.Ranking)}
      />
      <NavItem 
        icon="leaderboard" 
        label="Níveis"
        active={currentScreen === Screen.LevelSelect}
        onClick={() => onNavigate(Screen.LevelSelect)}
      />
      <NavItem 
        icon="bar_chart" 
        label="Stats"
        active={currentScreen === Screen.Stats}
        onClick={() => onNavigate(Screen.Stats)}
      />
      <NavItem 
        icon="person" 
        label="Perfil"
        active={currentScreen === Screen.Profile}
        onClick={() => onNavigate(Screen.Profile)}
      />
    </div>
  );
};

const NavItem: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 rounded-2xl transition-all duration-300 active:scale-95 group`}
  >
    <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-gray-400 dark:text-neutral-500 group-hover:text-gray-600 dark:group-hover:text-neutral-300'}`}>
      <span className={`material-symbols-outlined text-[24px] ${active ? 'fill-1' : ''}`}>{icon}</span>
    </div>
    <span className={`text-[9px] font-bold uppercase tracking-wide transition-colors ${active ? 'text-primary' : 'text-gray-400 dark:text-neutral-600'}`}>
      {label}
    </span>
  </button>
);

export default NavBar;
