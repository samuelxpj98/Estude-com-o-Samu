
import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types.ts';

interface StudySessionProps {
  topicId: string | null;
  level: number | null;
  limit: number;
  allCards: Flashcard[];
  onClose: () => void;
  onCardReviewed: (cardId: string, topicId: string, status: 'wrong' | 'review' | 'correct') => void;
}

const StudySession: React.FC<StudySessionProps> = ({ topicId, level, limit, allCards, onClose, onCardReviewed }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    let filtered = allCards;
    if (topicId) filtered = filtered.filter(c => c.topicId === topicId);
    if (level) filtered = filtered.filter(c => c.level === level);

    const sorted = [...filtered].sort((a, b) => {
      const priority: any = { 'wrong': 0, 'review': 1, 'unused': 2, undefined: 2, 'correct': 3 };
      return priority[a.status || 'unused'] - priority[b.status || 'unused'];
    });

    const limited = sorted.slice(0, limit);
    // Embaralhamento robusto (Fisher-Yates style)
    const shuffled = [...limited].sort(() => Math.random() - 0.5);
    setSessionCards(shuffled);
  }, [topicId, level, limit, allCards]);

  const currentCard = sessionCards[currentIndex];
  
  if (sessionCards.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-background-light dark:bg-background-dark">
       <div className="size-20 rounded-[24px] bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-gray-300">inventory_2</span>
       </div>
       <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Sem cartões</h2>
       <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 font-medium leading-relaxed">Não encontramos cartões que correspondam aos filtros selecionados.</p>
       <button onClick={onClose} className="w-full max-w-xs h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-tighter active:scale-95 shadow-lg shadow-primary/25">Voltar</button>
    </div>
  );

  const handleAction = (status: 'wrong' | 'review' | 'correct') => {
    onCardReviewed(currentCard.id, currentCard.topicId, status);
    setIsFlipped(false);
    
    if (currentIndex + 1 >= sessionCards.length) {
      setTimeout(onClose, 300);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const progress = Math.round(((currentIndex + 1) / sessionCards.length) * 100);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-page-transition">
      <header className="flex items-center justify-between p-6 shrink-0">
        <button onClick={onClose} className="size-10 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm active:scale-90">
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">{currentIndex + 1} / {sessionCards.length}</p>
          <div className="bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full flex items-center gap-1.5 border border-gray-200 dark:border-white/5">
             <span className="material-symbols-outlined text-[14px] text-orange-500 fill-1">bolt</span>
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Nível {currentCard.level}</span>
          </div>
        </div>
        <div className="size-10"></div>
      </header>

      <div className="px-6">
        <div className="w-full h-1 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <main className="flex-1 flex flex-col p-6 items-center justify-center overflow-y-auto no-scrollbar">
        <div 
          className="w-full h-full max-h-[440px] bg-white dark:bg-surface-dark rounded-[40px] shadow-xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col transition-all cursor-pointer"
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          <div className="flex-1 p-10 flex flex-col items-center justify-center text-center">
            {!isFlipped ? (
              <div className="animate-page-transition flex flex-col items-center">
                <div className="bg-primary/10 text-primary px-4 py-1 rounded-full mb-8 border border-primary/20">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em]">{currentCard.category}</p>
                </div>
                <h2 className="text-2xl font-black leading-tight tracking-tighter uppercase">{currentCard.question}</h2>
                <div className="mt-10 text-gray-300 dark:text-gray-600 animate-pulse">
                   <span className="material-symbols-outlined text-3xl">touch_app</span>
                   <p className="text-[9px] font-black uppercase tracking-widest mt-2">Toque para revelar</p>
                </div>
              </div>
            ) : (
              <div className="animate-page-transition w-full text-left flex flex-col h-full justify-center">
                <div className="flex items-center gap-2 mb-4">
                   <div className="h-px flex-1 bg-primary/20"></div>
                   <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] px-2">Resposta</p>
                   <div className="h-px flex-1 bg-primary/20"></div>
                </div>
                <h2 className="text-lg font-bold leading-relaxed text-slate-800 dark:text-slate-100 mb-6">{currentCard.answer}</h2>
                
                {currentCard.details && (
                  <div className="p-4 bg-gray-50 dark:bg-background-dark/30 rounded-2xl border border-gray-100 dark:border-white/5">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 italic leading-relaxed">
                      {currentCard.details}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="p-6 pb-12 w-full max-w-md mx-auto">
        {!isFlipped ? (
          <button onClick={() => setIsFlipped(true)} className="w-full h-16 bg-primary hover:bg-blue-600 text-white font-black text-lg uppercase tracking-tighter rounded-[24px] shadow-lg shadow-primary/20 active:scale-95 transition-all">
            Revelar Resposta
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => handleAction('wrong')} className="flex flex-col items-center justify-center h-24 rounded-[32px] bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 active:scale-90 transition-all shadow-sm group">
              <span className="material-symbols-outlined text-red-500 text-3xl group-hover:scale-110 transition-transform">cancel</span>
              <span className="text-red-500 text-[9px] font-black uppercase tracking-tighter mt-2">Errei</span>
            </button>
            <button onClick={() => handleAction('review')} className="flex flex-col items-center justify-center h-24 rounded-[32px] bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 active:scale-90 transition-all shadow-sm group">
              <span className="material-symbols-outlined text-orange-500 text-3xl group-hover:scale-110 transition-transform">replay_circle_filled</span>
              <span className="text-orange-500 text-[9px] font-black uppercase tracking-tighter mt-2">Revisar</span>
            </button>
            <button onClick={() => handleAction('correct')} className="flex flex-col items-center justify-center h-24 rounded-[32px] bg-primary text-white active:scale-90 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
              <span className="text-white text-[9px] font-black uppercase tracking-tighter mt-2">Acertei</span>
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default StudySession;
