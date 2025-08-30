import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PrayerCard as PrayerCardType } from '@/types/prayer';
import { usePrayer } from '@/contexts/PrayerContext';
import { Trash2, Edit3, RotateCcw } from 'lucide-react';
import { CircularProgress } from './CircularProgress';

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
        <div className="admin-action absolute top-2 right-2 flex gap-1 opacity-100 transition-opacity z-10">
          <button
            onClick={handleEdit}
            className="p-2 rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors shadow-md"
          >
            <Edit3 className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 transition-colors shadow-md"
          >
            <RotateCcw className="w-4 h-4 text-orange-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-destructive/20 hover:bg-destructive/30 transition-colors shadow-md"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-base md:text-lg font-bold text-foreground mb-2 line-clamp-2">{card.name}</h3>
          <div className="text-xs text-muted-foreground">
            Target: {formatNumber(card.targetCount)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <CircularProgress 
            progress={card.progress}
            size={60}
            strokeWidth={6}
            currentCount={card.currentCount}
            targetCount={card.targetCount}
          />
          <div className="text-right flex-1 ml-3">
            <div className="counter text-lg md:text-xl font-bold text-primary">
              {formatNumber(card.currentCount)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatNumber(card.targetCount - card.currentCount)} left
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};