'use client';

import { Flex, Box } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../lib/axiosInstance';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { useCustomToast } from '@/hooks/useCustomToast';
import LureForm, { LureFormFields } from './LureForm';
import { pathsCreator } from '@/utils/constValues';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type LureFormType = {
  lureType: string;
  serialCode: string;
  image?: string;
  purchasedAt?: string;
};

const LureCreate = () => {
  const { showErrorToast } = useCustomToast();
  const formProps = useForm<LureFormType>();
  const { userData } = useFetchUserData();
  const router = useRouter();
  const { t } = useTranslation();

  const onSubmit = useCallback(
    async (data: LureFormFields) => {
      try {
        if (userData?.isGuest) {
          showErrorToast(t('エラーです'), t('ただいまメンテナンス中です'));
          return;
        }
        await axiosInstance.post(`/lures`, {
          lureType: data.lureType,
          image: data.image,
          serialCode: data.serialCode,
        });
        router.push(pathsCreator.tackleBox(userData?.userName));
      } catch (e: any) {
        console.log(e.response);
        showErrorToast(t('失敗しました'), t('ルアー登録に失敗しました。'));
      }
    },
    [showErrorToast, userData?.userName, router, t, userData?.isGuest]
  );

  return (
    <Box bg="black">
      <HeaderMenu />
      <Flex
        minHeight="100vh"
        maxW="750px"
        mx="auto"
        flexDirection="column"
        px={{ base: '4', md: '12' }}
      >
        <LureForm mode="create" onSubmit={onSubmit} {...formProps} />
      </Flex>
      <Footer />
    </Box>
  );
};

export default LureCreate;
