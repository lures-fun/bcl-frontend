'use client';

import { Box } from '@chakra-ui/layout';
import { Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchMasterData } from '@/hooks/useFetchMasterData';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { Lure } from '@/types/Lure';
import { FieldMaster, LineMaster, ReelMaster, RodMaster } from '@/types/Master';
import { paths } from '@/utils/constValues';
import { ApplicationForm } from './ApplicationForm';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const FishingResultApplication = () => {
  const router = useRouter();
  const { userData } = useFetchUserData();
  const { showErrorToast } = useCustomToast();
  const { t } = useTranslation();
  const [hasShownError, setHasShownError] = useState<boolean>(false);

  const [tackleBox, setTackleBox] = useState<Lure[]>();
  const { masterData: fieldMaster } = useFetchMasterData<FieldMaster>('fields');
  const { masterData: reelMaster } = useFetchMasterData<ReelMaster>('reels');
  const { masterData: lineMaster } = useFetchMasterData<LineMaster>('lines');
  const { masterData: rodMaster } = useFetchMasterData<RodMaster>('rods');

  useEffect(() => {
    let isMounted = true;
    // トーストが複数表示されないようにするために、hasShownErrorで状態管理
    if (userData && !userData.userName && !hasShownError) {
      setHasShownError(true);
      if (isMounted) {
        router.push(paths.myPage);
        showErrorToast(
          <Text whiteSpace="pre-line">
            {t('ユーザーネームは必ず入力してください\nユーザーネームは英数字で入力してください')}
          </Text>,
          t('釣果申請するにはユーザーネームが必須です')
        );
      }
    }

    return () => {
      isMounted = false;
    };
  }, [userData, router, showErrorToast, t, hasShownError]);

  // タックルボックスデータ取得の useEffect
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
      <HeaderMenu />
      <Flex flexDirection="column" justifyContent="center" color="white" alignItems="center" my={5}>
        <Text fontWeight="bold" fontSize="md">
          {t('釣果申請')}
        </Text>
        <div style={{ paddingBottom: '1px', borderBottom: '1px solid white', opacity: 0.8 }}>
          <Text fontSize="xs">{t('※BCL公式ルアーでのみ申請が可能です。')}</Text>
        </div>
      </Flex>

      <ApplicationForm
        type="official"
        tackleBox={tackleBox}
        fieldMaster={fieldMaster}
        reelMaster={reelMaster}
        lineMaster={lineMaster}
        rodMaster={rodMaster}
      />
      <Footer />
    </Box>
  );
};

export default FishingResultApplication;
