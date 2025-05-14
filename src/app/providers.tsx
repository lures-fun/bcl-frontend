'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/styles/theme';
import { ProfileProvider } from '@/hooks/useFetchUserData';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <ProfileProvider>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </ProfileProvider>
    </ChakraProvider>
  );
}
