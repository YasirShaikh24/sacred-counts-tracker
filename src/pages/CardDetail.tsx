import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrayer } from '@/contexts/PrayerContext';
import { ArrowLeft, Plus, RotateCcw } from 'lucide-react';
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

        {/* Main Card - New Layout */}
        <div className="prayer-card mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Left Side - Circle Progress */}
            <div className="flex-shrink-0">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="transparent"
                    opacity="0.3"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - progressPercentage / 100)}`}
                    className="transition-all duration-700 ease-out"
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.4))'
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(155, 85%, 25%)" />
                      <stop offset="100%" stopColor="hsl(155, 70%, 35%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold text-primary mb-1">{card.progress}%</div>
                  <div className="text-xs text-muted-foreground">Progress</div>
                </div>
              </div>
            </div>

            {/* Right Side - Count and Stats */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className={`counter text-4xl md:text-5xl ${isAnimating ? 'updating' : ''} text-primary font-bold`}>
                {formatNumber(card.currentCount)}
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="text-lg font-bold text-primary">
                    {formatNumber(card.targetCount)}
                  </div>
                  <div className="text-xs text-muted-foreground">Target</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="text-lg font-bold text-orange-600">
                    {formatNumber(remaining)}
                  </div>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Enhanced Input Section with ADD/REMOVE */}
        <div className="prayer-card mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Update Count</h3>
          
          {/* Full Width Input */}
          <div className="mb-4">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter count..."
              className="w-full text-lg py-3 px-4 text-center text-xl font-semibold rounded-xl"
              min="1"
            />
          </div>
          
          {/* Add/Remove Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleAddProgress} 
              disabled={!amount || parseInt(amount) <= 0}
              className="py-3 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 transition-all hover:scale-105"
            >
              ADD COUNT
            </Button>
            <Button 
              onClick={() => {
                const numAmount = parseInt(amount);
                if (numAmount && numAmount > 0) {
                  updateCardProgress(card.id, -numAmount);
                  setAmount('');
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 600);
                }
              }}
              disabled={!amount || parseInt(amount) <= 0}
              className="py-3 text-base font-bold rounded-xl bg-destructive hover:bg-destructive/90 transition-all hover:scale-105"
            >
              REMOVE COUNT
            </Button>
          </div>
        </div>

        {/* Enhanced Quick Add Buttons */}
        <div className="prayer-card mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Quick Add</h3>
          
          {/* Row 1: Small increments */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[1, 10, 50].map((num) => (
              <Button
                key={num}
                variant="secondary"
                onClick={() => {
                  updateCardProgress(card.id, num);
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 600);
                }}
                className="py-2 text-sm font-bold hover:scale-105 transition-transform rounded-xl"
              >
                +{num}
              </Button>
            ))}
          </div>
          
          {/* Row 2: Medium increments */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[100, 500, 1000].map((num) => (
              <Button
                key={num}
                variant="secondary"
                onClick={() => {
                  updateCardProgress(card.id, num);
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 600);
                }}
                className="py-2 text-sm font-bold hover:scale-105 transition-transform rounded-xl"
              >
                +{formatNumber(num)}
              </Button>
            ))}
          </div>
          
          {/* Row 3: Large increments */}
          <div className="grid grid-cols-2 gap-2">
            {[5000, 10000].map((num) => (
              <Button
                key={num}
                variant="secondary"
                onClick={() => {
                  updateCardProgress(card.id, num);
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 600);
                }}
                className="py-2 text-sm font-bold hover:scale-105 transition-transform rounded-xl"
              >
                +{formatNumber(num)}
              </Button>
            ))}
          </div>
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