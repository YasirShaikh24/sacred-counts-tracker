import React, { useState } from 'react';
import { usePrayer } from '@/contexts/PrayerContext';
import { X, Shield, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal = ({ isOpen, onClose }: AdminModalProps) => {
  const { isAdmin, loginAdmin, logoutAdmin } = usePrayer();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = () => {
    if (loginAdmin(pin)) {
      setPin('');
      setError('');
      onClose();
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAdmin) {
      handleLogin();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <ShieldCheck className="w-6 h-6 text-primary" />
            ) : (
              <Shield className="w-6 h-6 text-muted-foreground" />
            )}
            <h2 className="text-xl font-bold">
              {isAdmin ? 'Admin Mode Active' : 'Admin Login'}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {isAdmin ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              You can now add, edit, or delete prayer cards. Click on cards to see admin options.
            </p>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Logout Admin
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enter Admin PIN</label>
              <Input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter PIN (default: 1234)"
                className="w-full"
                autoFocus
              />
              {error && (
                <p className="text-destructive text-sm mt-2">{error}</p>
              )}
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={!pin}>
              Login as Admin
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};