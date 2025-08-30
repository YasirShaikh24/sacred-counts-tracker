import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrayer } from '@/contexts/PrayerContext';
import { ArrowLeft, Plus, Minus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CardDetail = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { cards, updateCardProgress, resetCard, isAdmin } = usePrayer();
  const [amount, setAmount] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const card = cards.find(c => c.id === cardId);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Card not found</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  const handleAddProgress = () => {
    const numAmount = parseInt(amount);
    if (numAmount && numAmount > 0) {
      updateCardProgress(card.id, numAmount);
      setAmount('');
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const handleRemoveProgress = () => {
    const numAmount = parseInt(amount);
    if (numAmount && numAmount > 0) {
      // Don't let current count go below 0
      const newCount = Math.max(card.currentCount - numAmount, 0);
      const actualRemoval = card.currentCount - newCount;
      updateCardProgress(card.id, -actualRemoval);
      setAmount('');
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const handleReset = () => {
    if (window.confirm(`Reset all progress for "${card.name}"?`)) {
      resetCard(card.id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddProgress();
    }
  };

  const progressPercentage = Math.min((card.currentCount / card.targetCount) * 100, 100);
  const remaining = Math.max(card.targetCount - card.currentCount, 0);

  return (
    <div className="min-h-screen islamic-pattern">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold">{card.name}</h1>
        </div>

        {/* Main Card */}
        <div className="prayer-card mb-8">
          <div className="text-center space-y-6">
            {/* Progress Circle */}
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                  className="transition-all duration-700 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(155, 85%, 25%)" />
                    <stop offset="100%" stopColor="hsl(155, 70%, 35%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`counter text-4xl ${isAnimating ? 'updating' : ''}`}>
                  {formatNumber(card.currentCount)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {card.progress}% Complete
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-muted/50">
                <div className="text-2xl font-bold text-primary">
                  {formatNumber(card.targetCount)}
                </div>
                <div className="text-sm text-muted-foreground">Target</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50">
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(remaining)}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Progress Section */}
        <div className="prayer-card mb-6">
          <h3 className="text-xl font-semibold mb-4">Add Your Contribution</h3>
          <div className="space-y-4">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter count"
              className="w-full text-lg py-4"
              min="1"
            />
            <div className="flex gap-3">
              <Button 
                onClick={handleAddProgress} 
                disabled={!amount || parseInt(amount) <= 0}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Count
              </Button>
              <Button 
                onClick={handleRemoveProgress} 
                disabled={!amount || parseInt(amount) <= 0}
                variant="outline"
                className="flex-1"
              >
                <Minus className="w-4 h-4 mr-2" />
                Remove Count
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            🌟 Your contribution counts towards the group goal
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="prayer-card mb-6">
          <h3 className="text-lg font-semibold mb-4">Quick Add</h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[1, 5, 10, 50].map((num) => (
              <Button
                key={num}
                variant={isAdmin ? "default" : "outline"}
                onClick={() => {
                  updateCardProgress(card.id, num);
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 600);
                }}
                className="aspect-square text-lg font-bold hover:scale-105 transition-transform"
              >
                +{num}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 10, 50, 100, 250, 500, 1000].map((num) => (
              <Button
                key={num}
                variant={isAdmin ? "default" : "outline"}
                onClick={() => {
                  updateCardProgress(card.id, num);
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 600);
                }}
                className="aspect-square text-lg font-bold hover:scale-105 transition-transform"
              >
                +{num}
              </Button>
            ))}
          </div>
          {isAdmin && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              🔓 Admin mode - Quick updates enabled
            </p>
          )}
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Progress
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/edit/${card.id}`)}
              className="flex-1"
            >
              Edit Card
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetail;