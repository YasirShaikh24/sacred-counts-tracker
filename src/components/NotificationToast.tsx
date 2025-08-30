import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface NotificationToastProps {
  notifications: ToastNotification[];
  onRemove: (id: string) => void;
}

export const NotificationToast = ({ notifications, onRemove }: NotificationToastProps) => {
  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, notification.duration || 3000);

      return () => clearTimeout(timer);
    });
  }, [notifications, onRemove]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-primary text-primary-foreground border-primary/30';
      case 'error':
        return 'bg-destructive text-destructive-foreground border-destructive/30';
      default:
        return 'bg-card text-card-foreground border-border';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-md
            shadow-2xl animate-in slide-in-from-right-full duration-300
            ${getStyles(notification.type)}
          `}
          style={{
            background: notification.type === 'success' ? 'hsl(155 85% 25% / 0.95)' : 
                       notification.type === 'error' ? 'hsl(0 84% 60% / 0.95)' : 
                       'hsl(0 0% 0% / 0.9)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {getIcon(notification.type)}
          <span className="text-sm font-medium flex-1 text-white">{notification.message}</span>
          <button
            onClick={() => onRemove(notification.id)}
            className="opacity-70 hover:opacity-100 transition-opacity text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};