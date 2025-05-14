'use client';

import { Box } from '@chakra-ui/layout';
import { Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useFetchMasterData } from '@/hooks/useFetchMasterData';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { Lure } from '@/types/Lure';
import { FieldMaster } from '@/types/Master';
import { APPLY_TYPE, POST_STATUS } from '@/utils/constValues';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { RikuoApplicationForm } from './RikuoApplicationForm';
import { FormProvider, useForm } from 'react-hook-form';
import { useCustomToast } from '@/hooks/useCustomToast';

const RikuoFishingResultApplication = () => {
  const router = useRouter();
  const { userData } = useFetchUserData();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const { t } = useTranslation();
  const [tackleBox, setTackleBox] = useState<Lure[]>();
  const { masterData: fieldMaster } = useFetchMasterData<FieldMaster>('fields');
  // フォームのメソッドを親コンポーネントで作成。
  const rikuoApplyForm = useForm();
  const searchParams = new URLSearchParams(window.location.search);
  const fishingResultId = searchParams.get('fishingResultId');

  const saveDraft = async () => {
    try {
      if (userData?.isGuest) {
        showErrorToast(t('エラーです'), t('ただいまメンテナンス中です'));
        return;
      }

      const formData = rikuoApplyForm.getValues();
      if (!formData || Object.keys(formData).length === 0) {
        showErrorToast(t('保存するデータがありません'), t('フォームに情報を入力してください'));
        return;
      }
      const endpoint = `/fishing-results/upsert`;
      const response = await axiosInstance.post(endpoint, {
        id: fishingResultId,
        caughtYearAt: formData.caughtYearAt,
        caughtMonthAt: formData.caughtMonthAt,
        caughtDayAt: formData.caughtDayAt,
        field: formData.field,
        size: formData.size,
        lureId: formData.lureId,
        freeTextLure: formData.freeTextLure,
        freeTextRod: formData.freeTextRod,
        freeTextReel: formData.freeTextReel,
        freeTextLine: formData.freeTextLine,
        title: formData.title,
        comment: formData.comment,
        imageForApply: formData.imageUrlForApply,
        applyType: APPLY_TYPE.RIKUO,
        postStatus: POST_STATUS.DRAFT,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      if (response.status === 200) {
        showSuccessToast(t('下書きを保存しました'), t('後で編集できます'));
        router.back();
      }
    } catch (e: any) {
      console.log(e.response);
      if (e.response.status === 400) {
        showErrorToast(t('下書きの保存に失敗しました'), t('下書きを保存できるのは3件までです'));
        return;
      } else {
        showErrorToast(t('下書きの保存に失敗しました'), t('もう一度お試しください'));
      }
    }
  };

  const resetForm = () => {
    rikuoApplyForm.reset();
    router.back();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userData || !userData.userName) return;

      try {
        const response = await axiosInstance.get(`/tackle-box/${userData?.userName}`);
        const lureArray: any[] = [];
        const crankbaits = response.data.crankbaits.filter(
          (item: any) => item.reviewStatus === 'APPROVE' && !item.isLost
        );
        crankbaits.map((item: any) => lureArray.push(item));
        const draftWakers = response.data.draftWakers.filter(
          (item: any) => item.reviewStatus === 'APPROVE' && !item.isLost
        );
        draftWakers.map((item: any) => lureArray.push(item));
        const otherLures = response.data.otherLures.filter(
          (item: any) => item.reviewStatus === 'APPROVE' && !item.isLost
        );
        otherLures.map((item: any) => lureArray.push(item));
        setTackleBox(lureArray);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userData]);

  return (
    <Box bg="black">
      <HeaderMenu resetForm={resetForm} saveDraft={saveDraft} />
      <Flex flexDirection="column" justifyContent="center" color="white" alignItems="center" my={5}>
        <Text fontWeight="bold" fontSize="md">
          {t('陸王オープン釣果申請')}
        </Text>
      </Flex>
      <FormProvider {...rikuoApplyForm}>
        <RikuoApplicationForm
          {...(fishingResultId ? { fishingResultId } : {})}
          tackleBox={tackleBox}
          fieldMaster={fieldMaster}
        />
      </FormProvider>
      <Footer />
    </Box>
  );
};

export default RikuoFishingResultApplication;
