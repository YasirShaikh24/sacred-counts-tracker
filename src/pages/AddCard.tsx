import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrayer } from '@/contexts/PrayerContext';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AddCard = () => {
  const navigate = useNavigate();
  const { addCard } = usePrayer();
  const [name, setName] = useState('');
  const [targetCount, setTargetCount] = useState('');
  const [errors, setErrors] = useState<{ name?: string; target?: string }>({});

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
      addCard(name.trim(), parseInt(targetCount));
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
          <h1 className="text-3xl font-bold">Add New Prayer Card</h1>
        </div>

        {/* Form */}
        <div className="prayer-card">
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
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
          </form>
        </div>

        {/* Quick Presets */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Quick Presets</h3>
          <div className="space-y-2">
            {[
              { name: 'Surah Al-Mulk', target: 1000 },
              { name: 'Darood Sharif', target: 10000 },
              { name: 'La Hawla wa la Quwwata', target: 5000 },
              { name: 'Subhan Allah', target: 33000 },
            ].map((preset, index) => (
              <button
                key={index}
                onClick={() => {
                  setName(preset.name);
                  setTargetCount(preset.target.toString());
                }}
                className="w-full p-3 text-left rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-sm text-muted-foreground">Target: {preset.target.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCard;