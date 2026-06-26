import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Send, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrayer } from '@/contexts/PrayerContext';

const DigitalTasbeeh = () => {
  const navigate = useNavigate();
  const { cards, updateCardProgress, loading } = usePrayer();

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [localCount, setLocalCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  const selectedCard = cards.find(c => c.id === selectedCardId) ?? null;
  const remaining = selectedCard ? Math.max(selectedCard.targetCount - selectedCard.currentCount, 0) : null;
  const progress = selectedCard
    ? Math.min(((selectedCard.currentCount + localCount) / selectedCard.targetCount) * 100, 100)
    : 0;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const formatNumber = (n: number) => n.toLocaleString('en-US');

  const handleTap = () => {
    if (!selectedCard) return;
    if (localCount >= remaining!) return;

    if (navigator.vibrate) navigator.vibrate(25);

    setLocalCount(prev => prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 120);
  };

  const handleSubmit = async () => {
    if (!selectedCard || localCount === 0) return;
    await updateCardProgress(selectedCard.id, localCount);
    setSubmitted(true);
    setLocalCount(0);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const handleReset = () => {
    setLocalCount(0);
    setSubmitted(false);
  };

  const handleSelectCard = (id: string) => {
    setSelectedCardId(id);
    setLocalCount(0);
    setSubmitted(false);
    setShowSelector(false);
  };

  const isComplete = selectedCard
    ? selectedCard.currentCount + localCount >= selectedCard.targetCount
    : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Digital Tasbeeh</h1>
            <p className="text-xs text-muted-foreground">Tap to count — Submit to share</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-5 gap-5 max-w-md mx-auto w-full">

        {/* Card Selector */}
        <div className="w-full">
          <p className="text-xs text-muted-foreground mb-2 text-center uppercase tracking-wide">Select Prayer / Dhikr</p>
          <button
            onClick={() => setShowSelector(prev => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl text-left hover:border-green-700 transition-colors"
          >
            <span className={selectedCard ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              {selectedCard ? selectedCard.name : 'Tap to choose...'}
            </span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showSelector ? 'rotate-180' : ''}`} />
          </button>

          {showSelector && (
            <div className="mt-1 w-full bg-card border border-border rounded-xl overflow-hidden shadow-lg z-20">
              {cards.map(card => {
                const rem = Math.max(card.targetCount - card.currentCount, 0);
                const pct = Math.min(Math.round((card.currentCount / card.targetCount) * 100), 100);
                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectCard(card.id)}
                    className={`w-full px-4 py-3 text-left border-b border-border last:border-0 hover:bg-green-900/30 transition-colors ${
                      selectedCardId === card.id ? 'bg-green-900/40' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{card.name}</span>
                      <span className="text-xs text-green-400">{pct}%</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatNumber(card.currentCount)} / {formatNumber(card.targetCount)}
                      </span>
                      <span className="text-xs text-orange-400">{formatNumber(rem)} left</span>
                    </div>
                    {/* Mini progress bar */}
                    <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-600 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Card Info Banner */}
        {selectedCard && (
          <div className="w-full grid grid-cols-3 gap-2 text-center">
            <div className="bg-card border border-border rounded-xl py-3 px-2">
              <div className="text-lg font-bold text-primary">{formatNumber(selectedCard.currentCount)}</div>
              <div className="text-xs text-muted-foreground">Done</div>
            </div>
            <div className="bg-card border border-border rounded-xl py-3 px-2">
              <div className="text-lg font-bold text-orange-400">{formatNumber(remaining!)}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="bg-card border border-border rounded-xl py-3 px-2">
              <div className="text-lg font-bold text-foreground">{formatNumber(selectedCard.targetCount)}</div>
              <div className="text-xs text-muted-foreground">Target</div>
            </div>
          </div>
        )}

        {/* Tap Button with Progress Ring */}
        <div className="relative flex items-center justify-center my-2">
          <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="hsl(var(--muted))" strokeWidth="5" fill="transparent" />
            <circle
              cx="50" cy="50" r="45"
              stroke={isComplete ? '#16a34a' : 'hsl(155, 85%, 30%)'}
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={selectedCard ? strokeDashoffset : circumference}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          <button
            onClick={handleTap}
            disabled={!selectedCard || isComplete}
            className={`absolute inset-0 m-auto w-44 h-44 rounded-full flex flex-col items-center justify-center select-none transition-all duration-100
              ${!selectedCard
                ? 'bg-muted border-4 border-border cursor-not-allowed opacity-50'
                : isComplete
                  ? 'bg-green-700 border-4 border-green-500 cursor-default'
                  : isAnimating
                    ? 'bg-green-900 border-4 border-green-600 scale-95 shadow-lg shadow-green-900/50'
                    : 'bg-green-950 border-4 border-green-700 hover:bg-green-900 active:scale-95'
              }`}
          >
            {!selectedCard ? (
              <span className="text-muted-foreground text-sm text-center px-4">Select a dhikr first</span>
            ) : isComplete ? (
              <>
                <span className="text-4xl mb-1">✓</span>
                <span className="text-white font-bold">Complete!</span>
              </>
            ) : (
              <>
                <span className={`text-5xl font-bold text-white transition-transform duration-100 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
                  {formatNumber(localCount)}
                </span>
                <span className="text-green-300 text-xs mt-1">this session</span>
                <span className="text-green-400 text-xs mt-0.5 tracking-widest">TAP</span>
              </>
            )}
          </button>
        </div>

        {/* Session remaining */}
        {selectedCard && !isComplete && (
          <p className="text-sm text-muted-foreground text-center -mt-2">
            {formatNumber(Math.max((remaining ?? 0) - localCount, 0))} more to go for{' '}
            <span className="text-foreground font-medium">{selectedCard.name}</span>
          </p>
        )}

        {/* Submit Success */}
        {submitted && (
          <div className="w-full p-3 bg-green-900/50 border border-green-700 rounded-xl text-center">
            <p className="text-green-300 font-semibold">ماشاءاللہ! Submitted ✓</p>
            <p className="text-green-400 text-xs mt-0.5">Added to {selectedCard?.name}</p>
          </div>
        )}

        {/* Completion banner */}
        {isComplete && selectedCard && (
          <div className="w-full p-4 bg-green-900/50 border border-green-700 rounded-xl text-center">
            <p className="text-green-300 font-bold text-lg">🌟 Target Reached!</p>
            <p className="text-green-400 text-sm mt-1">{selectedCard.name} is complete</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={localCount === 0}
            className="flex-1 border-border"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedCard || localCount === 0}
            className="flex-1 bg-green-700 hover:bg-green-600 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit ({formatNumber(localCount)})
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center pb-4">
          Tap to count locally → Submit to add to the group tracker
        </p>
      </div>
    </div>
  );
};

export default DigitalTasbeeh;
