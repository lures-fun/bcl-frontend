import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Notification } from '@/types/Notification';

export const useFetchNotification = () => {
  const [NotiData, setNotiData] = useState<Notification[]>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [NotiCount, setNotiCount] = useState<number>(0);

  const fetchNotiData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<{ notification: Notification[] }>('/notifications');

      const { notification } = response.data;

      // Unread notification count

      setNotiData(notification);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchNotiCount = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/notifications/unread/count');
      const count = response.data.count;
      setNotiCount(count);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (NotiData) return;
    fetchNotiData();
    fetchNotiCount();
  }, [fetchNotiData, NotiData, fetchNotiCount, NotiCount]);
  return {
    NotiData,
    NotiCount,
    error,
    isLoading,
    refetch: fetchNotiData,
    refetchCount: fetchNotiCount,
    setNotiCount,
  };
};
