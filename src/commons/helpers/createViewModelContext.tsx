import { createContext } from 'react';
import type { ReactNode } from 'react';

export const createViewModelContext = <D, T>(useViewModelCore: (dependency: D) => T) => {
  const Context = createContext<ReturnType<typeof useViewModelCore> | null>(null);

  const Provider = ({ children, ...props }: { children: ReactNode } & D) => {
    const viewModel = useViewModelCore(props as unknown as D);
    return <Context.Provider value={viewModel}>{children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
  };
};
