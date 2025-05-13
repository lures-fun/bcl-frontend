import { useToast, UseToastOptions } from '@chakra-ui/react';
import { ReactNode, useCallback } from 'react';

export const useCustomToast = () => {
  const toast = useToast();

  // titleの引数の型をReactNodeに設定している理由は、改行に対応させるため。
  // もし改行を入れたい場合は、下記のように呼び出し元から引数を渡す。
  //<Text whiteSpace="pre-line">
  //{t('一行目\n二行目')},
  //</Text>,

  const showSuccessToast = useCallback(
    (title: ReactNode, description: string, duration?: number) => {
      toast({
        title,
        description,
        status: 'success',
        duration: duration ?? 3000,
        isClosable: true,
        position: 'top',
      } as UseToastOptions);
    },
    [toast]
  );

  const showErrorToast = useCallback(
    (title: ReactNode, description: string, duration?: number) => {
      toast({
        title,
        description,
        status: 'error',
        duration: duration ?? 3000,
        isClosable: true,
        position: 'top',
      } as UseToastOptions);
    },
    [toast]
  );

  return { showSuccessToast, showErrorToast };
};
