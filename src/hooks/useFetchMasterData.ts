import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

type masterType = 'fields' | 'reels' | 'lines' | 'rods';

export const useFetchMasterData = <D>(type: masterType) => {
  const [masterData, setMasterData] = useState<D[]>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFieldData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<D[]>(`/master/${type}`);
      setMasterData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchFieldData();
  }, [fetchFieldData]);

  return { masterData, error, isLoading, refetch: fetchFieldData };
};
