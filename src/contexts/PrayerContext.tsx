import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PrayerCard, AppData } from '@/types/prayer';

interface PrayerContextType {
  cards: PrayerCard[];
  isAdmin: boolean;
  updateCardProgress: (cardId: string, amount: number) => void;
  addCard: (name: string, targetCount: number) => void;
  deleteCard: (cardId: string) => void;
  editCard: (cardId: string, name: string, targetCount: number) => void;
  resetCard: (cardId: string) => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

const STORAGE_KEY = 'islamic-prayer-tracker';
const DEFAULT_PIN = '2412';

const defaultCards: PrayerCard[] = [
  { id: '1', name: 'Yaseen', currentCount: 0, targetCount: 1000, progress: 0 },
  { id: '2', name: 'Surah Fateha', currentCount: 0, targetCount: 10000, progress: 0 },
  { id: '3', name: 'Aayate Kareema', currentCount: 0, targetCount: 5000, progress: 0 },
  { id: '4', name: 'Astagfirullah', currentCount: 0, targetCount: 100000, progress: 0 },
  { id: '5', name: 'Kalima', currentCount: 0, targetCount: 50000, progress: 0 },
  { id: '6', name: 'Aytul Kursi', currentCount: 0, targetCount: 2000, progress: 0 },
];

export const PrayerProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<PrayerCard[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: AppData = JSON.parse(stored);
        setCards(data.cards || defaultCards);
      } catch {
        setCards(defaultCards);
      }
    } else {
      setCards(defaultCards);
    }
  }, []);

  // Save to localStorage whenever cards change
  useEffect(() => {
    if (cards.length > 0) {
      const data: AppData = {
        cards,
        adminPin: DEFAULT_PIN,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [cards]);

  const calculateProgress = (current: number, target: number): number => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const updateCardProgress = (cardId: string, amount: number) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId) {
        const newCount = card.currentCount + amount;
        return {
          ...card,
          currentCount: newCount,
          progress: calculateProgress(newCount, card.targetCount),
        };
      }
      return card;
    }));
  };

  const addCard = (name: string, targetCount: number) => {
    const newCard: PrayerCard = {
      id: Date.now().toString(),
      name,
      currentCount: 0,
      targetCount,
      progress: 0,
    };
    setCards(prev => [...prev, newCard]);
  };

  const deleteCard = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  const editCard = (cardId: string, name: string, targetCount: number) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          name,
          targetCount,
          progress: calculateProgress(card.currentCount, targetCount),
        };
      }
      return card;
    }));
  };

  const resetCard = (cardId: string) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          currentCount: 0,
          progress: 0,
        };
      }
      return card;
    }));
  };

  const loginAdmin = (pin: string): boolean => {
    if (pin === DEFAULT_PIN) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  return (
    <PrayerContext.Provider value={{
      cards,
      isAdmin,
      updateCardProgress,
      addCard,
      deleteCard,
      editCard,
      resetCard,
      loginAdmin,
      logoutAdmin,
    }}>
      {children}
    </PrayerContext.Provider>
  );
};

export const usePrayer = () => {
  const context = useContext(PrayerContext);
  if (!context) {
    throw new Error('usePrayer must be used within a PrayerProvider');
  }
  return context;
};