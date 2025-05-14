'use client';

import { useEffect } from 'react';
import { useCustomToast } from '@/hooks/useCustomToast';
import { paths } from '@/utils/constValues';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import ApiLoading from '@/components/uiParts/Loading/ApiLoading';
import { Text } from '@chakra-ui/react';

// タックルボックスを開こうとした際に、userNameが登録されていない場合のpage
const TackleBoxToMyPage = () => {
  const router = useRouter();
  const { showErrorToast } = useCustomToast();
  const { t } = useTranslation();

  useEffect(() => {
    router.push(paths.myPage);
    showErrorToast(
      <Text whiteSpace="pre-line">
        {t('ユーザーネームは必ず入力してください\nユーザーネームは英数字で入力してください')},
      </Text>,
      t('タックルボックスを確認するにはユーザーネームが必須です'),
      5000
    );
  }, [router, showErrorToast, t]);

  return (
    <>
      <ApiLoading />
    </>
  );
};

export default TackleBoxToMyPage;
