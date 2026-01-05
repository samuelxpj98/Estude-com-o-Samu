
import React, { useState, useEffect, useCallback } from 'react';
import { Screen, UserStats, Topic, Flashcard, UserProfile } from './types.ts';
import { TOPICS, MOCK_CARDS, SHEET_URL, fetchSheetData, auth, saveUserDataCloud, getUserDataCloud } from './constants.ts';
import { onAuthStateChanged } from 'firebase/auth';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import AuthScreen from './components/AuthScreen.tsx';
import TopicsScreen from './components/TopicsScreen.tsx';
import StudySession from './components/StudySession.tsx';
import StatsScreen from './components/StatsScreen.tsx';
import LevelSelectScreen from './components/LevelSelectScreen.tsx';
import ProfileScreen from './components/ProfileScreen.tsx';
import NavBar from './components/NavBar.tsx';
import SamuAI from './components/SamuAI.tsx';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Welcome);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [cardLimit, setCardLimit] = useState<number>(10);
  const [topics, setTopics] = useState<Topic[]>(TOPICS);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(MOCK_CARDS);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'guest', name: 'Estudante', church: 'Igreja Batista', role: 'user', avatarColor: '#135bec', isProfileComplete: false
  });

  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0, 
    lastLoginDate: new Date().toISOString().split('T')[0], 
    lastAccessTimestamp: 0,
    cardsToday: 0, 
    cardsLifetime: 0
  });

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  const syncFlashcards = useCallback(async () => {
    const sheetCards = await fetchSheetData(SHEET_URL);
    if (sheetCards && sheetCards.length > 0) {
      setFlashcards(sheetCards);
      localStorage.setItem('samu_cards_synced', JSON.stringify(sheetCards));
      
      setTopics(prev => prev.map(topic => ({
        ...topic,
        total: sheetCards.filter(c => c.topicId === topic.id).length
      })));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const initCards = async () => {
      const saved = localStorage.getItem('samu_cards_synced');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFlashcards(parsed);
        setTopics(prev => prev.map(topic => ({
          ...topic,
          total: parsed.filter((c: any) => c.topicId === topic.id).length
        })));
        syncFlashcards();
      } else {
        await syncFlashcards();
      }
    };
    initCards();
  }, [syncFlashcards]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setIsLoading(true);
        const cloudData = await getUserDataCloud(u.uid);
        
        let currentStats = userStats;

        if (cloudData) {
          if (cloudData.profile) setUserProfile(cloudData.profile);
          if (cloudData.stats) currentStats = cloudData.stats;
          if (cloudData.topics) {
            setTopics(prev => prev.map(t => {
              const cloudTopic = cloudData.topics.find((ct: any) => ct.id === t.id);
              return cloudTopic ? { ...t, stats: cloudTopic.stats } : t;
            }));
          }
        }

        // Lógica de Streak: +1 após 30 minutos do último acesso
        const now = Date.now();
        const thirtyMinutesInMs = 30 * 60 * 1000;
        
        if (now - currentStats.lastAccessTimestamp > thirtyMinutesInMs) {
          const updatedStats = {
            ...currentStats,
            streak: currentStats.streak + 1,
            lastAccessTimestamp: now,
            lastLoginDate: new Date().toISOString().split('T')[0]
          };
          setUserStats(updatedStats);
        } else {
          setUserStats(currentStats);
        }

        setIsDataReady(true);
        if (currentScreen === Screen.Welcome || currentScreen === Screen.Auth) {
          setCurrentScreen(Screen.Topics);
        }
      } else {
        setIsDataReady(false);
        setUser(null);
        if (currentScreen !== Screen.Welcome) setCurrentScreen(Screen.Welcome);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && isDataReady) {
      const timer = setTimeout(async () => {
        await saveUserDataCloud(user.uid, {
          profile: userProfile,
          stats: userStats,
          topics: topics,
          updatedAt: new Date().toISOString()
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [userProfile, userStats, topics, user, isDataReady]);

  const handleCardReviewed = (cardId: string, topicId: string, status: 'wrong' | 'review' | 'correct') => {
    setUserStats(prev => ({
      ...prev,
      cardsToday: prev.cardsToday + 1,
      cardsLifetime: prev.cardsLifetime + 1
    }));
    
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const newStats = { ...t.stats };
        newStats[status] = (newStats[status as keyof typeof newStats] || 0) + 1;
        return { ...t, stats: newStats };
      }
      return t;
    }));
  };

  const handleAuthSuccess = (newProfile?: UserProfile) => {
    if (newProfile) setUserProfile(newProfile);
    setIsDataReady(true);
    setCurrentScreen(Screen.Topics);
  };

  const navigateToStudy = (topicId: string | null, level: number | null, limit: number) => {
    setSelectedTopicId(topicId); setSelectedLevel(level); setCardLimit(limit);
    setCurrentScreen(Screen.Study);
  };

  const renderScreen = () => {
    if (isLoading && currentScreen !== Screen.Welcome) {
       return <div className="h-full flex items-center justify-center bg-background-light dark:bg-background-dark"><span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span></div>;
    }

    switch (currentScreen) {
      case Screen.Welcome:
        return <WelcomeScreen onStart={() => user ? setCurrentScreen(Screen.Topics) : setCurrentScreen(Screen.Auth)} />;
      case Screen.Auth:
        return <AuthScreen onSuccess={handleAuthSuccess} onBack={() => setCurrentScreen(Screen.Welcome)} />;
      case Screen.Topics:
        return <TopicsScreen topics={topics} onSelectStudy={navigateToStudy} streak={userStats.streak} profile={userProfile} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} onOpenAI={() => setCurrentScreen(Screen.AI)} />;
      case Screen.LevelSelect:
        return <LevelSelectScreen onSelectLevel={(lvl, limit) => navigateToStudy(null, lvl, limit)} />;
      case Screen.Study:
        return <StudySession topicId={selectedTopicId} level={selectedLevel} limit={cardLimit} allCards={flashcards} onClose={() => setCurrentScreen(Screen.Topics)} onCardReviewed={handleCardReviewed} />;
      case Screen.Stats:
        return <StatsScreen topics={topics} userStats={userStats} />;
      case Screen.Profile:
        return <ProfileScreen profile={userProfile} setProfile={setUserProfile} onSync={syncFlashcards} totalRevisions={userStats.cardsLifetime} onToggleTheme={toggleTheme} />;
      case Screen.AI:
        return <SamuAI onClose={() => setCurrentScreen(Screen.Topics)} />;
      default:
        return <WelcomeScreen onStart={() => setCurrentScreen(Screen.Auth)} />;
    }
  };

  const showNav = [Screen.Topics, Screen.Stats, Screen.LevelSelect, Screen.Profile].includes(currentScreen);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl relative overflow-hidden font-display antialiased text-slate-900 dark:text-white">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderScreen()}
      </div>
      {showNav && <NavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />}
    </div>
  );
};

export default App;
