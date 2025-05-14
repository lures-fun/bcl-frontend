'use client';

import { useEffect, useState } from 'react';
import { Providers } from './providers';

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <Providers>{children}</Providers>;
}
