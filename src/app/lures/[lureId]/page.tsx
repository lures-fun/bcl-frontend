'use client';

import { Flex, Box, Text } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/lib/axiosInstance';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { useCustomToast } from '@/hooks/useCustomToast';
import { Lure } from '@/types/Lure';
import LureForm from '../LureForm';
import { paths, pathsCreator } from '@/utils/constValues';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type LureFormType = {
  lureType: string;
  serialCode: string;
  image?: string;
  purchasedAt?: string;
};

const LureEdit = () => {
  const { showErrorToast } = useCustomToast();
  const { userData } = useFetchUserData();
  const router = useRouter();
  const { lureId } = useParams<{ lureId: string }>();
  const { t } = useTranslation();

  const formProps = useForm<LureFormType>({
    defaultValues: async () => {
      try {
        const { data } = await axiosInstance.get<Lure>(`/lures/${lureId}`);
        if (data.reviewStatus !== 'REJECT') {
          showErrorToast(t('再申請はできません。'), t('拒否されたルアーのみ再適用できます。'));
          router.push(pathsCreator.tackleBox());
        }
        return {
          lureType: data.lureType,
          serialCode: data.serialCode,
          image: data.imagePathForApply,
        };
      } catch (error) {
        showErrorToast(t('ルアーは存在しません。'), t('ルアーは存在しません。'));
        router.push(pathsCreator.tackleBox());
      }
      return {
        lureType: '',
        serialCode: '',
      };
    },
  });

  useEffect(() => {
    if (userData && !userData.userName) {
      router.push(paths.myPage);
      showErrorToast(
        <Text whiteSpace="pre-line">
          {t('ユーザーネームは必ず入力してください\nユーザーネームは英数字で入力してください')},
        </Text>,
        t('ルアーを確認するにはユーザーネームが必須です。')
      );
    }
  }, [router, showErrorToast, userData, t]);

  useEffect(() => {}, [lureId, router, showErrorToast]);

  const onSubmit = useCallback(
    async (data: LureFormType) => {
      try {
        if (!formProps.formState.dirtyFields.image) {
          delete data.image;
        }
        await axiosInstance.patch(`/lures/${lureId}`, {
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
    [formProps.formState.dirtyFields.image, lureId, router, showErrorToast, userData?.userName, t]
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
        <LureForm mode="edit" onSubmit={onSubmit} {...formProps} />
      </Flex>
      <Footer />
    </Box>
  );
};

export default LureEdit;
