import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QuranShareef } from '@/types/quran';
import { supabase } from '@/integrations/supabase/client';

interface QuranContextType {
  siparas: QuranShareef[];
  loading: boolean;
  assignPersonToSipara: (siparaNumber: number, personName: string) => Promise<void>;
  markSiparaCompleted: (siparaNumber: number) => Promise<void>;
  addNotification: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const QuranContext = createContext<QuranContextType | undefined>(undefined);

export const QuranProvider = ({ children }: { children: ReactNode }) => {
  const [siparas, setSiparas] = useState<QuranShareef[]>([]);
  const [loading, setLoading] = useState(true);

  // Load siparas from Supabase on mount
  useEffect(() => {
    loadSiparas();
  }, []);

  const loadSiparas = async () => {
    try {
      const { data, error } = await supabase
        .from('quran_shareef')
        .select('*')
        .order('sipara_number', { ascending: true });

      if (error) throw error;

      if (data) {
        setSiparas(data);
      }
    } catch (error) {
      console.error('Error loading siparas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    // You can integrate this with your existing notification system
    console.log(`${type}: ${message}`);
  };

  const assignPersonToSipara = async (siparaNumber: number, personName: string) => {
    try {
      const { error } = await supabase
        .from('quran_shareef')
        .update({
          assigned_person_name: personName,
          assigned_by: 'admin', // You can integrate with actual user system
        })
        .eq('sipara_number', siparaNumber);

      if (error) throw error;

      // Update local state
      setSiparas(prev => prev.map(sipara => 
        sipara.sipara_number === siparaNumber 
          ? { ...sipara, assigned_person_name: personName, assigned_by: 'admin' }
          : sipara
      ));

      addNotification(`Sipara ${siparaNumber} assigned to ${personName}`, 'success');
    } catch (error) {
      console.error('Error assigning person to sipara:', error);
      addNotification('Failed to assign person to sipara', 'error');
    }
  };

  const markSiparaCompleted = async (siparaNumber: number) => {
    try {
      const sipara = siparas.find(s => s.sipara_number === siparaNumber);
      const newCompletedState = !sipara?.is_completed;

      const { error } = await supabase
        .from('quran_shareef')
        .update({
          is_completed: newCompletedState,
          completed_date: newCompletedState ? new Date().toISOString() : null,
        })
        .eq('sipara_number', siparaNumber);

      if (error) throw error;

      // Update local state
      setSiparas(prev => prev.map(sipara => 
        sipara.sipara_number === siparaNumber 
          ? { 
              ...sipara, 
              is_completed: newCompletedState,
              completed_date: newCompletedState ? new Date().toISOString() : null
            }
          : sipara
      ));

      const statusText = newCompletedState ? 'completed' : 'marked as incomplete';
      addNotification(`Sipara ${siparaNumber} ${statusText}`, 'success');
    } catch (error) {
      console.error('Error updating sipara completion:', error);
      addNotification('Failed to update sipara status', 'error');
    }
  };

  return (
    <QuranContext.Provider value={{
      siparas,
      loading,
      assignPersonToSipara,
      markSiparaCompleted,
      addNotification,
    }}>
      {children}
    </QuranContext.Provider>
  );
};

export const useQuran = () => {
  const context = useContext(QuranContext);
  if (!context) {
    throw new Error('useQuran must be used within a QuranProvider');
  }
  return context;
};