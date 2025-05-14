'use client';

import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { SettingTransitionButton } from '@/components/MyPage/SettingTransitionButton';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { paths } from '@/utils/constValues';
import SettingForm from './SettingForm';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/components/uiParts/Dialog/ConfirmDialog';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useAuthenticate } from '@/hooks/useAuthenticate';
import axiosInstance from '@/lib/axiosInstance';
import { removeAuthToken } from '@/utils/cookieUtil';
// import { SettingEmailInput } from '@/components/MyPage/SettingEmailInput';

const MyPage = () => {
  const { userData } = useFetchUserData();
  const router = useRouter();
  const { t } = useTranslation();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { showErrorToast } = useCustomToast();
  const { logout } = useAuthenticate();

  const handleWithdrawal = async () => {
    try {
      await axiosInstance.patch('/users/withdrawal', {});
      logout();
      removeAuthToken();
      router.push(paths.login);
    } catch (error) {
      console.log(error);
      showErrorToast(t('退会エラー'), t('退会に失敗しました'));
    }
  };

  return (
    <>
      <Box bg="black">
        <HeaderMenu />
        <Flex minHeight="100vh" maxW="750px" mx="auto" flexDirection="column" px="3">
          <SettingForm userData={userData} />
          <SettingTransitionButton
            label={t('アングラー詳細')}
            onClick={() => router.push(paths.anglerDetail)}
            btnText={t('編集する')}
            divider={true}
          />
          <SettingTransitionButton
            label={t('退会')}
            onClick={onOpen}
            btnText={t('退会する')}
            divider={true}
          />
          <ConfirmDialog
            title={t('本当に退会しますか？')}
            body={t('退会した場合はアカウント情報は削除されます。')}
            onClose={onClose}
            isOpen={isOpen}
            handleClick={async () => {
              handleWithdrawal();
            }}
          />
          {/* Apple審査でメールアドレスの非表示を求められているためコメントアウト
          <SettingEmailInput
            type="email"
            disabled={true}
            label={t('メールアドレス')}
            placeholder="info@testmail.com"
            defaultValue={userData?.email}
          /> */}
        </Flex>
        <Footer />
      </Box>
    </>
  );
};

export default MyPage;
