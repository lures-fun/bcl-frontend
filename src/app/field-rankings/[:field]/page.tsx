'use client';

import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { RankingList } from '@/components/Ranking/RankingList';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchMasterData } from '@/hooks/useFetchMasterData';
import axiosInstance from '@/lib/axiosInstance';
import { FieldMaster } from '@/types/Master';
import { BigFish, FishingCount } from '@/types/Ranking';
import { TOPRANKING_TYPES } from '@/utils/constValues';

const FieldRanking = () => {
  const initialized = useRef(false);
  const param = useParams();
  const field = param[':field'];

  const { showErrorToast } = useCustomToast();
  const { masterData: fieldMaster } = useFetchMasterData<FieldMaster>('fields');
  const [property, setProperty] = useState<string>();
  const [fishingTotalCount, setFishingTotalCount] = useState<number>();
  const [rankBigFish, setRankBigFish] = useState<BigFish[]>();
  const [rankFishingCount, setRankFishingCount] = useState<FishingCount[]>();
  useEffect(() => {
    if (!initialized.current && field && fieldMaster) {
      initialized.current = true;
      const fieldId = field;
      axiosInstance
        .get(`/ranking/fields/${fieldId}`)
        .then((response) => {
          if (fieldMaster) {
            const field = fieldMaster?.find((item) => item.id === response.data.field);
            setProperty(field?.name);
          }
          setFishingTotalCount(response.data.summary.fishingTotalCount);
          setRankBigFish(response.data.bigFish);
          setRankFishingCount(response.data.fishingCount);
        })
        .catch((error) => showErrorToast('Failed to fetch data', error.message));
    }
  }, [fieldMaster, field, showErrorToast]);

  return (
    <Box bg={'black'} color={'white'}>
      <HeaderMenu />
      <Flex minHeight={'100vh'}>
        {property && fishingTotalCount && rankBigFish && rankFishingCount && (
          <RankingList
            type={TOPRANKING_TYPES.field}
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

export default FieldRanking;
