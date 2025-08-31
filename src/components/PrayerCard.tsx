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
    <div className="prayer-card islamic-pattern group relative cursor-pointer" onClick={handleCardClick}>
      {/* Always visible admin buttons when in admin mode */}
      {isAdmin && (
        <div className="admin-action absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={handleEdit}
            className="p-2 rounded-full bg-green-600/90 hover:bg-green-600 transition-all duration-200 shadow-lg backdrop-blur-sm"
            title="Edit Card"
          >
            <Edit3 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-full bg-orange-500/90 hover:bg-orange-500 transition-all duration-200 shadow-lg backdrop-blur-sm"
            title="Reset Progress"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full bg-red-600/90 hover:bg-red-600 transition-all duration-200 shadow-lg backdrop-blur-sm"
            title="Delete Card"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2 pr-12">{card.name}</h3>
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

      {/* Admin mode indicator */}
      {isAdmin && (
        <div className="absolute bottom-3 left-3 text-xs text-green-400 font-medium opacity-75">
          Admin Mode
        </div>
      )}
    </div>
  );
};