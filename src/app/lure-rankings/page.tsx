'use client';

import { Box, Flex } from '@chakra-ui/react';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RankingList } from '@/components/Ranking/RankingList';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchMasterData } from '@/hooks/useFetchMasterData';
import axiosInstance from '@/lib/axiosInstance';
import { FieldMaster } from '@/types/Master';
import { BigFish, FishingCount } from '@/types/Ranking';
import { TOPRANKING_TYPES, paths } from '@/utils/constValues';
import PageLoading from '@/components/uiParts/Loading/PageLoading';

const LureRankingContent = () => {
  const initialized = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  // クエリパラメータから lureTypes を取得し、カンマ区切りで配列に変換する
  const lureTypes = useMemo(() => {
    const lureTypesParam = searchParams.get('lureTypes');
    return lureTypesParam ? lureTypesParam.split(',') : [];
  }, [searchParams]);

  const { showErrorToast } = useCustomToast();
  const { masterData: fieldMaster } = useFetchMasterData<FieldMaster>('fields');
  const [property, setProperty] = useState<string>();
  const [fishingTotalCount, setFishingTotalCount] = useState<number>();
  const [rankBigFish, setRankBigFish] = useState<BigFish[]>();
  const [rankFishingCount, setRankFishingCount] = useState<FishingCount[]>();

  useEffect(() => {
    if (lureTypes.length === 0) {
      router.push(paths.rankings);
      return;
    }
    if (!initialized.current && fieldMaster) {
      initialized.current = true;
      axiosInstance
        .post('/ranking/collaboration/lure-types', { lureTypes: lureTypes })
        .then((response) => {
          setProperty(response.data.lureType);
          setFishingTotalCount(response.data.summary.fishingTotalCount);
          if (fieldMaster) {
            response.data.bigFish.forEach((item: any) => {
              const filteredFields = fieldMaster.find((field) => field.id === item.field);
              item.field = filteredFields?.name;
            });
            setRankBigFish(response.data.bigFish);
          }
          setRankFishingCount(response.data.fishingCount);
        })
        .catch((error) => showErrorToast('Failed to fetch data', error.message));
    }
  }, [fieldMaster, router, lureTypes, showErrorToast]);

  return (
    <Box bg={'black'} color={'white'}>
      <HeaderMenu />
      <Flex minHeight={'100vh'}>
        {property && fishingTotalCount && rankBigFish && rankFishingCount && (
          <RankingList
            type={TOPRANKING_TYPES.lure}
            lureTypes={lureTypes}
            property={property}
            fishingTotalCount={fishingTotalCount}
            bigFish={rankBigFish}
            fishingCount={rankFishingCount}
          />
        )}
      </Flex>
      <Footer />
    </Box>
  );
};

// useSearchParamsを使う場合は、Suspenseで囲まないとエラーが発生する
const LureRanking = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <LureRankingContent />
    </Suspense>
  );
};

export default LureRanking;
