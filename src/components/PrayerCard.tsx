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
        <div className="admin-action absolute top-3 right-3 flex gap-2 opacity-100 transition-opacity z-10">
          <button
            onClick={handleEdit}
            className="p-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors shadow-md hover:shadow-lg"
          >
            <Edit3 className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 transition-colors shadow-md hover:shadow-lg"
          >
            <RotateCcw className="w-4 h-4 text-orange-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl bg-destructive/20 hover:bg-destructive/30 transition-colors shadow-md hover:shadow-lg"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-base md:text-lg font-bold text-foreground mb-2 line-clamp-2">{card.name}</h3>
          <div className="text-xs text-muted-foreground">
            Target: {formatNumber(card.targetCount)}
          </div>
        </div>

        {/* Horizontal Layout - Progress on left, numbers on right */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CircularProgress 
              progress={card.progress}
              size={60}
              strokeWidth={6}
              currentCount={card.currentCount}
              targetCount={card.targetCount}
            />
            <div className="text-xs text-muted-foreground">
              Progress
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {formatNumber(card.targetCount - card.currentCount)} left
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};