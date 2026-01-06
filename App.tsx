
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Screen, UserStats, Topic, Flashcard, UserProfile, SRSData } from './types.ts';
import { TOPICS, MOCK_CARDS, SHEET_URL, fetchSheetData, auth, saveUserDataCloud, getUserDataCloud } from './constants.ts';
import { onAuthStateChanged } from 'firebase/auth';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import AuthScreen from './components/AuthScreen.tsx';
import TopicsScreen from './components/TopicsScreen.tsx';
import StudySession from './components/StudySession.tsx';
import StatsScreen from './components/StatsScreen.tsx';
import LevelSelectScreen from './components/LevelSelectScreen.tsx';
import ProfileScreen from './components/ProfileScreen.tsx';
import RankingScreen from './components/RankingScreen.tsx';
import NavBar from './components/NavBar.tsx';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Welcome);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [cardLimit, setCardLimit] = useState<number>(10);
  const [isConcilioMode, setIsConcilioMode] = useState(false);
  const [topics, setTopics] = useState<Topic[]>(TOPICS);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(MOCK_CARDS);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const currentFlashcards = useRef<Flashcard[]>([]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'guest', name: 'Estudante', church: 'Igreja Batista', role: 'user', avatarColor: '#135bec', isProfileComplete: false
  });

  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0, 
    lastLoginDate: new Date().toISOString().split('T')[0], 
    lastAccessTimestamp: Date.now(),
    cardsToday: 0, 
    cardsLifetime: 0,
    cardStates: {}
  });

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  const refreshTopicCounts = useCallback((cards: Flashcard[]) => {
    setTopics(prev => prev.map(topic => ({
      ...topic,
      total: cards.filter(c => c.topicId === topic.id).length
    })));
  }, []);

  const syncFlashcards = useCallback(async () => {
    const sheetCards = await fetchSheetData(SHEET_URL);
    if (sheetCards && sheetCards.length > 0) {
      setFlashcards(sheetCards);
      currentFlashcards.current = sheetCards;
      localStorage.setItem('samu_cards_synced', JSON.stringify(sheetCards));
      refreshTopicCounts(sheetCards);
      return true;
    }
    return false;
  }, [refreshTopicCounts]);

  // Função robusta de persistência que garante tipos numéricos (crucial para o Ranking)
  const persistUserData = useCallback(async (uid: string, profile: UserProfile, stats: UserStats, topicsList: Topic[]) => {
    const today = new Date().toISOString().split('T')[0];
    const cleanStats = {
      ...stats,
      streak: Number(stats.streak) || 1,
      cardsLifetime: Number(stats.cardsLifetime) || 0,
      cardsToday: Number(stats.cardsToday) || 0,
      lastLoginDate: stats.lastLoginDate || today,
      lastAccessTimestamp: Date.now()
    };

    const cleanProfile = { 
      ...profile, 
      id: uid, 
      name: profile.name || 'Seminarista' 
    };

    const dataToSave = {
      profile: cleanProfile,
      stats: cleanStats,
      topics: topicsList.map(t => ({ id: t.id, stats: t.stats })),
      updatedAt: new Date().toISOString()
    };

    await saveUserDataCloud(uid, dataToSave);
    return { cleanProfile, cleanStats };
  }, []);

  useEffect(() => {
    const initCards = async () => {
      const saved = localStorage.getItem('samu_cards_synced');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFlashcards(parsed);
        currentFlashcards.current = parsed;
        refreshTopicCounts(parsed);
      }
      await syncFlashcards();
    };
    initCards();
  }, [syncFlashcards, refreshTopicCounts]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const cloudData = await getUserDataCloud(u.uid);
        
        let statsFromCloud = cloudData?.stats || { 
          streak: 1, 
          lastLoginDate: new Date().toISOString().split('T')[0], 
          lastAccessTimestamp: Date.now(),
          cardsToday: 0, 
          cardsLifetime: 0,
          cardStates: {} 
        };
        
        // Correção de tipos
        statsFromCloud.cardsLifetime = Number(statsFromCloud.cardsLifetime) || 0;
        statsFromCloud.streak = Number(statsFromCloud.streak) || 1;

        let profileFromCloud = cloudData?.profile || { 
          id: u.uid, 
          name: u.displayName || 'Seminarista', 
          church: 'Igreja Batista', 
          role: 'user', 
          avatarColor: '#135bec', 
          isProfileComplete: false 
        };
        
        profileFromCloud.id = u.uid; 

        // Lógica de Ofensiva (Foguinho)
        const todayStr = new Date().toISOString().split('T')[0];
        const lastDateStr = statsFromCloud.lastLoginDate;

        if (lastDateStr !== todayStr) {
           const yesterday = new Date();
           yesterday.setDate(yesterday.getDate() - 1);
           const yesterdayStr = yesterday.toISOString().split('T')[0];

           if (lastDateStr === yesterdayStr) {
             statsFromCloud.streak += 1;
           } else {
             statsFromCloud.streak = 1;
           }
           statsFromCloud.lastLoginDate = todayStr;
        }

        const mergedTopics = TOPICS.map(t => {
          const cloudTopic = cloudData?.topics?.find((ct: any) => ct.id === t.id);
          return {
            ...t,
            total: currentFlashcards.current.filter(c => c.topicId === t.id).length,
            stats: cloudTopic?.stats || t.stats
          };
        });

        setUserStats(statsFromCloud);
        setUserProfile(profileFromCloud);
        setTopics(mergedTopics);
        
        // Garante que o documento no Firestore seja atualizado para o Ranking
        await persistUserData(u.uid, profileFromCloud, statsFromCloud, mergedTopics);
        setIsDataReady(true);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [persistUserData]);

  const handleCardReviewed = (cardId: string, topicId: string, status: 'wrong' | 'review' | 'correct') => {
    setUserStats(prev => {
      const newState = { ...prev.cardStates };
      const current = newState[cardId] || { interval: 0, ease: 2.5, repetitions: 0, nextReview: new Date().toISOString() };
      
      let nextInterval = 1;
      let nextEase = current.ease;
      let nextReps = current.repetitions;

      if (status === 'correct') {
        nextReps += 1;
        if (nextReps === 1) nextInterval = 1;
        else if (nextReps === 2) nextInterval = 4;
        else nextInterval = Math.round(current.interval * current.ease);
        nextEase = Math.max(1.3, current.ease + 0.1);
      } else if (status === 'review') {
        nextInterval = 1; 
        nextEase = Math.max(1.3, current.ease - 0.15);
        nextReps = 0;
      } else {
        nextInterval = 0; 
        nextEase = Math.max(1.3, current.ease - 0.2);
        nextReps = 0;
      }

      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

      newState[cardId] = {
        interval: nextInterval,
        ease: nextEase,
        repetitions: nextReps,
        nextReview: nextReviewDate.toISOString()
      };

      return {
        ...prev,
        cardsToday: prev.cardsToday + 1,
        cardsLifetime: prev.cardsLifetime + 1,
        cardStates: newState,
        lastAccessTimestamp: Date.now()
      };
    });
    
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const newStats = { ...t.stats };
        newStats[status] = (newStats[status as keyof typeof newStats] || 0) + 1;
        return { ...t, stats: newStats };
      }
      return t;
    }));
  };

  const handleStart = () => {
    if (user) {
      setCurrentScreen(Screen.Topics);
    } else {
      setCurrentScreen(Screen.Auth);
    }
  };

  const renderScreen = () => {
    // Spinner apenas se não estiver na tela de boas-vindas
    if (isLoading && currentScreen !== Screen.Welcome) {
       return <div className="h-full flex items-center justify-center bg-background-light dark:bg-background-dark"><span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span></div>;
    }

    switch (currentScreen) {
      case Screen.Welcome: return <WelcomeScreen onStart={handleStart} />;
      case Screen.Auth: return <AuthScreen onSuccess={(p) => { if(p) setUserProfile(p); setCurrentScreen(Screen.Topics); }} onBack={() => setCurrentScreen(Screen.Welcome)} />;
      case Screen.Topics: return <TopicsScreen topics={topics} onSelectStudy={navigateToStudy} streak={userStats.streak} profile={userProfile} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} stats={userStats} />;
      case Screen.LevelSelect: return <LevelSelectScreen onSelectLevel={(lvl, limit) => navigateToStudy(null, lvl, limit)} profile={userProfile} userStats={userStats} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />;
      case Screen.Study: return <StudySession topicId={selectedTopicId} level={selectedLevel} limit={cardLimit} allCards={flashcards} onClose={() => setCurrentScreen(Screen.Topics)} onCardReviewed={handleCardReviewed} isConcilio={isConcilioMode} cardStates={userStats.cardStates} />;
      case Screen.Stats: return <StatsScreen topics={topics} userStats={userStats} profile={userProfile} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />;
      case Screen.Profile: return <ProfileScreen profile={userProfile} setProfile={setUserProfile} onSync={syncFlashcards} userStats={userStats} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} onRepair={() => user && persistUserData(user.uid, userProfile, userStats, topics)} />;
      case Screen.Ranking: return <RankingScreen profile={userProfile} stats={userStats} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />;
      default: return <WelcomeScreen onStart={handleStart} />;
    }
  };

  const navigateToStudy = (topicId: string | null, level: number | null, limit: number, isConcilio: boolean = false) => {
    setSelectedTopicId(topicId); 
    setSelectedLevel(level); 
    setCardLimit(limit);
    setIsConcilioMode(isConcilio);
    setCurrentScreen(Screen.Study);
  };

  const showNav = [Screen.Topics, Screen.Stats, Screen.LevelSelect, Screen.Profile, Screen.Ranking].includes(currentScreen);

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark flex flex-col items-center">
      <div className="flex flex-col h-screen w-full max-w-md bg-background-light dark:bg-background-dark relative overflow-hidden font-display antialiased text-slate-900 dark:text-white shadow-[0_0_50px_rgba(0,0,0,0.1)]">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {renderScreen()}
        </div>
        {showNav && <NavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />}
      </div>
    </div>
  );
};

export default App;
