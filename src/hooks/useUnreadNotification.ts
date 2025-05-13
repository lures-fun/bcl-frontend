import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

export const useUnreadNotification = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [existUnread, setExistUnread] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const responseFishingResult = await axiosInstance.get(`/timelines/exists-unread`);
        setExistUnread(responseFishingResult.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    })();
  }, []);

  return { existUnread, isLoading };
};
