
import React, { useState, useEffect, useRef } from 'react';
import { Flashcard, SRSData } from '../types.ts';

interface StudySessionProps {
  topicId: string | null;
  level: number | null;
  limit: number;
  allCards: Flashcard[];
  onClose: () => void;
  onCardReviewed: (cardId: string, topicId: string, status: 'wrong' | 'review' | 'correct') => void;
  isConcilio?: boolean;
  cardStates: Record<string, SRSData>;
}

const StudySession: React.FC<StudySessionProps> = ({ topicId, level, limit, allCards, onClose, onCardReviewed, isConcilio = false, cardStates }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const [timer, setTimer] = useState(30);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    let filtered = allCards;
    if (topicId) filtered = filtered.filter(c => c.topicId === topicId);
    if (level) filtered = filtered.filter(c => c.level === level);

    const sorted = [...filtered].sort((a, b) => {
      const stateA = cardStates[a.id];
      const stateB = cardStates[b.id];
      const dateA = stateA ? new Date(stateA.nextReview).getTime() : 0;
      const dateB = stateB ? new Date(stateB.nextReview).getTime() : 0;
      return dateA - dateB;
    });

    const limited = sorted.slice(0, limit);
    const shuffled = [...limited].sort(() => Math.random() - 0.5);
    setSessionCards(shuffled);
  }, [topicId, level, limit, allCards, cardStates]);

  useEffect(() => {
    if (isConcilio && !isFlipped && sessionCards.length > 0) {
      setTimer(30);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsFlipped(true); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, isFlipped, isConcilio, sessionCards.length]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAction = (status: 'wrong' | 'review' | 'correct') => {
    // Feedback Tátil
    if (navigator.vibrate) {
      if (status === 'correct') navigator.vibrate(50);
      else if (status === 'wrong') navigator.vibrate([100, 50, 100]);
      else navigator.vibrate(40);
    }

    onCardReviewed(currentCard.id, currentCard.topicId, status);
    setIsFlipped(false);
    clearInterval(timerRef.current);
    window.speechSynthesis.cancel();
    
    if (currentIndex + 1 >= sessionCards.length) {
      setTimeout(onClose, 300);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentCard = sessionCards[currentIndex];
  
  if (sessionCards.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-background-light dark:bg-background-dark">
       <div className="size-20 rounded-[24px] bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-gray-300">inventory_2</span>
       </div>
       <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Sem cartões</h2>
       <p className="text-gray-500 dark:text-gray-400 text-sm mb-10 font-medium leading-relaxed">Não há cartões para revisar no momento.</p>
       <button onClick={onClose} className="w-full max-w-xs h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-tighter active:scale-95 shadow-lg shadow-primary/25">Voltar</button>
    </div>
  );

  const progress = Math.round(((currentIndex + 1) / sessionCards.length) * 100);

  return (
    <div className={`flex flex-col h-full animate-page-transition ${isConcilio ? 'bg-slate-950 text-white' : 'bg-background-light dark:bg-background-dark'}`}>
      <header className="flex items-center justify-between p-6 shrink-0">
        <button onClick={onClose} className="size-10 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 shadow-sm active:scale-90 text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        
        <div className="flex flex-col items-center">
          {isConcilio && (
            <div className={`text-2xl font-black mb-1 ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
              00:{timer < 10 ? `0${timer}` : timer}
            </div>
          )}
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{currentIndex + 1} / {sessionCards.length}</p>
        </div>

        <button 
          onClick={() => speak(isFlipped ? currentCard.answer : currentCard.question)}
          className={`size-10 flex items-center justify-center rounded-full transition-all active:scale-90 ${isSpeaking ? 'bg-primary text-white' : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 text-slate-900 dark:text-white'}`}
        >
           <span className={`material-symbols-outlined text-xl ${isSpeaking ? 'fill-1' : ''}`}>volume_up</span>
        </button>
      </header>

      <div className="px-6">
        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <main className="flex-1 flex flex-col p-6 items-center justify-center overflow-y-auto no-scrollbar">
        <div 
          className={`w-full h-full max-h-[460px] rounded-[48px] shadow-2xl overflow-hidden border-2 flex flex-col transition-all cursor-pointer transform ${isFlipped ? 'rotate-y-180' : ''} ${
            isConcilio 
            ? 'bg-slate-900 border-white/10' 
            : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/10'
          }`}
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          <div className="flex-1 p-10 flex flex-col items-center justify-center text-center">
            {!isFlipped ? (
              <div className="animate-page-transition flex flex-col items-center">
                <div className="bg-primary/10 text-primary px-5 py-1.5 rounded-full mb-8 border border-primary/20">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">{currentCard.category}</p>
                </div>
                <h2 className="text-3xl font-black leading-tight tracking-tighter uppercase">{currentCard.question}</h2>
                <div className="mt-12 text-gray-300 dark:text-gray-600 animate-bounce">
                   <span className="material-symbols-outlined text-4xl">touch_app</span>
                   <p className="text-[10px] font-black uppercase tracking-widest mt-3">Toque para revelar</p>
                </div>
              </div>
            ) : (
              <div className="animate-page-transition w-full text-left flex flex-col h-full justify-center">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-0.5 flex-1 bg-primary/20"></div>
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] px-3">Resposta Oficial</p>
                   <div className="h-0.5 flex-1 bg-primary/20"></div>
                </div>
                <h2 className={`text-xl font-bold leading-relaxed mb-8 ${isConcilio ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>{currentCard.answer}</h2>
                
                {currentCard.details && (
                  <div className={`p-6 rounded-3xl border-2 ${isConcilio ? 'bg-black/20 border-white/5' : 'bg-gray-50 dark:bg-background-dark/30 border-gray-100 dark:border-white/5'}`}>
                    <p className={`text-xs font-medium italic leading-relaxed ${isConcilio ? 'text-gray-400' : 'text-slate-500 dark:text-slate-400'}`}>
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
          <button onClick={() => setIsFlipped(true)} className="w-full h-18 bg-primary hover:bg-blue-600 text-white font-black text-xl uppercase tracking-tighter rounded-[28px] shadow-2xl shadow-primary/30 active:scale-95 transition-all">
            Revelar Resposta
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => handleAction('wrong')} className={`flex flex-col items-center justify-center h-28 rounded-[36px] border-2 active:scale-90 transition-all shadow-sm group ${isConcilio ? 'bg-slate-900 border-white/5' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/5'}`}>
              <span className="material-symbols-outlined text-red-500 text-4xl group-hover:scale-110 transition-transform">cancel</span>
              <span className="text-red-500 text-[10px] font-black uppercase tracking-tighter mt-3">Errei</span>
            </button>
            <button onClick={() => handleAction('review')} className={`flex flex-col items-center justify-center h-28 rounded-[36px] border-2 active:scale-90 transition-all shadow-sm group ${isConcilio ? 'bg-slate-900 border-white/5' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-white/5'}`}>
              <span className="material-symbols-outlined text-orange-500 text-4xl group-hover:scale-110 transition-transform">replay_circle_filled</span>
              <span className="text-orange-500 text-[10px] font-black uppercase tracking-tighter mt-3">Revisar</span>
            </button>
            <button onClick={() => handleAction('correct')} className="flex flex-col items-center justify-center h-28 rounded-[36px] bg-primary text-white active:scale-90 transition-all shadow-2xl shadow-primary/30">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
              <span className="text-white text-[10px] font-black uppercase tracking-tighter mt-3">Dominei</span>
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default StudySession;
