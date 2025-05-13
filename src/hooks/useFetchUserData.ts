import { useCallback, useEffect, useState } from 'react';
import { createViewModelContext } from '@/commons/helpers/createViewModelContext';
import axiosInstance from '@/lib/axiosInstance';
import { User } from '@/types/User';
import { useViewModelContext } from './useViewModelContext';

export const useFetchUserDataCore = () => {
  const [userData, setUserData] = useState<User>();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<User>('/users/profile');
      setUserData(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userData) return;
    fetchUserData();
  }, [fetchUserData, userData]);

  return { userData, error, isLoading, refetch: fetchUserData };
};

export const { Context: ProfileContext, Provider: ProfileProvider } =
  createViewModelContext(useFetchUserDataCore);

export const useFetchUserData = () => useViewModelContext(ProfileContext);
