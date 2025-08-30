import React from 'react';
import { usePrayer } from '@/contexts/PrayerContext';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotificationContainer = () => {
  const { notifications, removeNotification } = usePrayer();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-white" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-white" />;
      case 'removed':
        return <Trash2 className="w-5 h-5 text-white" />;
      case 'added':
        return <Plus className="w-5 h-5 text-white" />;
      default:
        return <Info className="w-5 h-5 text-white" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-black/80 border-2 border-green-500';
      case 'warning':
        return 'bg-black/80 border-2 border-yellow-500';
      case 'error':
        return 'bg-black/80 border-2 border-red-500';
      case 'removed':
        return 'bg-black/80 border-2 border-red-500';
      case 'added':
        return 'bg-black/80 border-2 border-yellow-500';
      default:
        return 'bg-black/80 border-2 border-blue-500';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none"
      style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999 }}
    >
      <style>
        {`
          @keyframes slideInRight {
            from { 
              transform: translateX(100%); 
              opacity: 0; 
            }
            to { 
              transform: translateX(0); 
              opacity: 1; 
            }
          }
          
          .slide-in {
            animation: slideInRight 0.3s ease-out;
          }
        `}
      </style>
      
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${getNotificationStyle(notification.type)}
            rounded-lg shadow-lg 
            p-4 pr-12
            slide-in
            relative
            pointer-events-auto
            min-w-[300px]
            max-w-[400px]
          `}
          style={{ 
            position: 'relative',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex items-start gap-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                {notification.message}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeNotification(notification.id)}
            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;