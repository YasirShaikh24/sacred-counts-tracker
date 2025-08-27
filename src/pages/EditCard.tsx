import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrayer } from '@/contexts/PrayerContext';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EditCard = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { cards, editCard, deleteCard } = usePrayer();
  const [name, setName] = useState('');
  const [targetCount, setTargetCount] = useState('');
  const [errors, setErrors] = useState<{ name?: string; target?: string }>({});

  const card = cards.find(c => c.id === cardId);

  useEffect(() => {
    if (card) {
      setName(card.name);
      setTargetCount(card.targetCount.toString());
    }
  }, [card]);

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

  const validateForm = () => {
    const newErrors: { name?: string; target?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Prayer name is required';
    }
    
    const target = parseInt(targetCount);
    if (!targetCount || target <= 0) {
      newErrors.target = 'Target count must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      editCard(card.id, name.trim(), parseInt(targetCount));
      navigate('/');
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${card.name}"? This action cannot be undone.`)) {
      deleteCard(card.id);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen islamic-pattern">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Prayer Card</h1>
        </div>

        {/* Current Stats */}
        <div className="prayer-card mb-6">
          <h3 className="text-lg font-semibold mb-4">Current Progress</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-xl bg-muted/50">
              <div className="text-xl font-bold text-primary">
                {card.currentCount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Current</div>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <div className="text-xl font-bold text-orange-600">
                {card.progress}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="prayer-card mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Prayer Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Surah Al-Fatiha"
                className="w-full"
                autoFocus
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Target Count
              </label>
              <Input
                type="number"
                value={targetCount}
                onChange={(e) => setTargetCount(e.target.value)}
                placeholder="e.g., 1000"
                className="w-full"
                min="1"
              />
              {errors.target && (
                <p className="text-destructive text-sm mt-1">{errors.target}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Current progress will be recalculated based on the new target
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Delete Section */}
        <div className="prayer-card border-destructive/20">
          <h3 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This action cannot be undone. All progress will be permanently lost.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Prayer Card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCard;