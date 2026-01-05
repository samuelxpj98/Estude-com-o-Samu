
import React from 'react';
import { Screen } from '../types.ts';

interface NavBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentScreen, onNavigate }) => {
  return (
    <div className="fixed bottom-0 w-full max-w-md bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-lg border-t border-gray-200 dark:border-white/5 z-40 pb-6 pt-3 px-4 flex justify-between items-center shadow-2xl">
      <NavItem 
        label="Estudo" 
        icon="school" 
        active={currentScreen === Screen.Topics || currentScreen === Screen.Study}
        onClick={() => onNavigate(Screen.Topics)}
      />
      <NavItem 
        label="Níveis" 
        icon="leaderboard" 
        active={currentScreen === Screen.LevelSelect}
        onClick={() => onNavigate(Screen.LevelSelect)}
      />
      <NavItem 
        label="Progresso" 
        icon="bar_chart_4_bars" 
        active={currentScreen === Screen.Stats}
        onClick={() => onNavigate(Screen.Stats)}
      />
      <NavItem 
        label="Perfil" 
        icon="person" 
        active={currentScreen === Screen.Profile}
        onClick={() => onNavigate(Screen.Profile)}
      />
    </div>
  );
};

const NavItem: React.FC<{ label: string, icon: string, active: boolean, onClick: () => void }> = ({ label, icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 flex-1 transition-all duration-300 active:scale-90 ${active ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
  >
    <span className={`material-symbols-outlined transition-all text-[24px] ${active ? 'fill-1 scale-110' : ''}`}>{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default NavBar;
