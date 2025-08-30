import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PrayerCard, AppData } from '@/types/prayer';
import { supabase } from '@/integrations/supabase/client';

interface PrayerContextType {
  cards: PrayerCard[];
  isAdmin: boolean;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const { data, error } = await supabase
        .from('prayer_cards')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Convert Supabase data to our format
        const formattedCards: PrayerCard[] = data.map(card => ({
          id: card.id,
          name: card.name,
          currentCount: card.current_count,
          targetCount: card.target_count,
          progress: calculateProgress(card.current_count, card.target_count),
        }));
        setCards(formattedCards);
      } else {
        // No cards exist, insert default cards
        await insertDefaultCards();
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      // Fallback to localStorage for backward compatibility
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
    } finally {
      setLoading(false);
    }
  };

  const insertDefaultCards = async () => {
    try {
      const cardsToInsert = defaultCards.map(card => ({
        name: card.name,
        current_count: card.currentCount,
        target_count: card.targetCount,
      }));

      const { data, error } = await supabase
        .from('prayer_cards')
        .insert(cardsToInsert)
        .select();

      if (error) throw error;

      if (data) {
        const formattedCards: PrayerCard[] = data.map(card => ({
          id: card.id,
          name: card.name,
          currentCount: card.current_count,
          targetCount: card.target_count,
          progress: calculateProgress(card.current_count, card.target_count),
        }));
        setCards(formattedCards);
      }
    } catch (error) {
      console.error('Error inserting default cards:', error);
      setCards(defaultCards);
    }
  };

  const calculateProgress = (current: number, target: number): number => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const updateCardProgress = async (cardId: string, amount: number) => {
    try {
      const card = cards.find(c => c.id === cardId);
      if (!card) return;

      const newCount = card.currentCount + amount;

      const { error } = await supabase
        .from('prayer_cards')
        .update({ current_count: newCount })
        .eq('id', cardId);

      if (error) throw error;

      // Update local state
      setCards(prev => prev.map(card => {
        if (card.id === cardId) {
          return {
            ...card,
            currentCount: newCount,
            progress: calculateProgress(newCount, card.targetCount),
          };
        }
        return card;
      }));
    } catch (error) {
      console.error('Error updating card progress:', error);
    }
  };

  const addCard = async (name: string, targetCount: number) => {
    try {
      const { data, error } = await supabase
        .from('prayer_cards')
        .insert({
          name,
          current_count: 0,
          target_count: targetCount,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newCard: PrayerCard = {
          id: data.id,
          name: data.name,
          currentCount: data.current_count,
          targetCount: data.target_count,
          progress: 0,
        };
        setCards(prev => [...prev, newCard]);
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('prayer_cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      setCards(prev => prev.filter(card => card.id !== cardId));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const editCard = async (cardId: string, name: string, targetCount: number) => {
    try {
      const { error } = await supabase
        .from('prayer_cards')
        .update({
          name,
          target_count: targetCount,
        })
        .eq('id', cardId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error editing card:', error);
    }
  };

  const resetCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('prayer_cards')
        .update({ current_count: 0 })
        .eq('id', cardId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error resetting card:', error);
    }
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
      loading,
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