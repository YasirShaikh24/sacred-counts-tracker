import React from 'react';
import { usePrayer } from '@/contexts/PrayerContext';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
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
      default:
        return <Info className="w-5 h-5 text-white" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };

  const getProgressBarColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'warning':
        return 'bg-yellow-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
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
          @keyframes shrinkProgress {
            from { width: 100%; }
            to { width: 0%; }
          }
          
          .progress-bar {
            animation: shrinkProgress 4s linear forwards;
          }
          
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
            border
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
            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-black/20 text-white"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Auto-dismiss progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b-lg overflow-hidden">
            <div 
              className={`h-full progress-bar ${getProgressBarColor(notification.type)}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;