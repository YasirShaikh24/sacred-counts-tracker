import { useState, useCallback } from 'react';
import { ToastNotification } from '@/components/NotificationToast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
    const id = Date.now().toString();
    const notification: ToastNotification = {
      id,
      message,
      type,
      duration,
    };

    setNotifications((prev) => [...prev, notification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};