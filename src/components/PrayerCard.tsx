import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrayerCard as PrayerCardType } from '@/types/prayer';
import { usePrayer } from '@/contexts/PrayerContext';
import { Trash2, Edit3, RotateCcw } from 'lucide-react';

interface PrayerCardProps {
  card: PrayerCardType;
}

export const PrayerCard = ({ card }: PrayerCardProps) => {
  const navigate = useNavigate();
  const { isAdmin, deleteCard, resetCard } = usePrayer();

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isAdmin && (e.target as HTMLElement).closest('.admin-action')) {
      return; // Don't navigate if clicking admin buttons
    }
    navigate(`/card/${card.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${card.name}"?`)) {
      deleteCard(card.id);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Reset progress for "${card.name}"?`)) {
      resetCard(card.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit/${card.id}`);
  };

  return (
    <div className="prayer-card islamic-pattern group" onClick={handleCardClick}>
      {isAdmin && (
        <div className="admin-action absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-full bg-orange-500/10 hover:bg-orange-500/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-orange-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full bg-destructive/10 hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">{card.name}</h3>
          <div className="text-sm text-muted-foreground">
            Target: {formatNumber(card.targetCount)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
            <span className="text-sm font-bold text-primary">{card.progress}%</span>
          </div>
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${card.progress}%` }}
            />
          </div>
        </div>

        <div className="counter text-center">
          {formatNumber(card.currentCount)}
        </div>
      </div>
    </div>
  );
};