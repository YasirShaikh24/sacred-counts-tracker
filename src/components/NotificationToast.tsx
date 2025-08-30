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
        return 'bg-primary/10 border-primary/20 text-primary';
      case 'error':
        return 'bg-destructive/10 border-destructive/20 text-destructive';
      default:
        return 'bg-accent/50 border-accent text-accent-foreground';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm
            shadow-lg animate-in slide-in-from-right-full duration-300
            ${getStyles(notification.type)}
          `}
        >
          {getIcon(notification.type)}
          <span className="text-sm font-medium flex-1">{notification.message}</span>
          <button
            onClick={() => onRemove(notification.id)}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};