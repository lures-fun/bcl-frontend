import { useContext } from 'react';
import type { Context } from 'react';

export const useViewModelContext = <T>(context: Context<T | null>): T => {
  const value = useContext(context);

  if (value === null) {
    throw new Error('Pass a value to the context.');
  }

  return value;
};
