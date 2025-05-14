'use client';

import {
  Box,
  Divider,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FieldTopRanksList } from '@/components/Ranking/FieldTopRanksList';
import { LureTopRankList } from '@/components/Ranking/LureTopRanksList';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchMasterData } from '@/hooks/useFetchMasterData';
import axiosInstance from '@/lib/axiosInstance';
import { FieldMaster } from '@/types/Master';
import { BigFish, FishingCount } from '@/types/Ranking';
import { COLLABORATION_MAKER, LURETYPES } from '@/utils/constValues';
import { useTranslation } from 'react-i18next';

const Ranking = () => {
  const initialized = useRef(false);
  const [bigFishRanks, setBigFishRanks] = useState<Map<COLLABORATION_MAKER, BigFish[]>>(new Map());
  const [fishingCountRanks, setFishingCountRanks] = useState<
    Map<COLLABORATION_MAKER, FishingCount[]>
  >(new Map());
  const [fieldRanks, setFieldRanks] = useState<any[]>();
  const { showErrorToast } = useCustomToast();
  const { masterData: fieldMaster } = useFetchMasterData<FieldMaster>('fields');
  const { t } = useTranslation();

  const fetchLureRanking = useCallback(
    async (maker: COLLABORATION_MAKER, lureTypes: LURETYPES[]) => {
      try {
        const response = await axiosInstance.post('/ranking/collaboration/lure-types', {
          lureTypes: lureTypes,
        });
        setBigFishRanks((prev) => new Map(prev.set(maker, response.data.bigFish.slice(0, 3))));
        setFishingCountRanks(
          (prev) => new Map(prev.set(maker, response.data.fishingCount.slice(0, 3)))
        );
      } catch (error: any) {
        showErrorToast('Failed to fetch data', error.message);
      }
    },
    [showErrorToast]
  );

  const fetchFieldRanking = useCallback(async () => {
    if (!fieldMaster) return;
    const fields: string[] = [];
    fieldMaster.forEach((field: FieldMaster) => fields.push(field.id));
    try {
      const response = await axiosInstance.post('/ranking/fields', { fields });
      response.data.fields.forEach((item: any) => {
        const filteredFields = fieldMaster.find((field) => field.id === item.field);
        item.fieldName = filteredFields?.name;
      });
      const compareFunction = (a: any, b: any) => {
        const is0006 = (item: any) => item.field === '0006';
        const hasFishingData = (item: any) => item.fishingCount.length > 0 || item.bigFish.length;
        if (is0006(a) && !is0006(b)) {
          return -1;
        } else if (!is0006(a) && is0006(b)) {
          return 1;
        } else if (hasFishingData(a) && !hasFishingData(b)) {
          return -1;
        } else if (!hasFishingData(a) && hasFishingData(b)) {
          return 1;
        } else {
          return a.field.localeCompare(b.field);
        }
      };
      setFieldRanks(response.data.fields.sort(compareFunction));
    } catch (error: any) {
      showErrorToast('Failed to fetch data', error.message);
    }
  }, [fieldMaster, showErrorToast]);

  useEffect(() => {
    if (!initialized.current && fieldMaster) {
      initialized.current = true;
      fetchFieldRanking();
      fetchLureRanking(COLLABORATION_MAKER.W3_CRANKBAIT, [LURETYPES.W3_CRANKBAIT]);
      fetchLureRanking(COLLABORATION_MAKER.DRAFTWAKER, [LURETYPES.DRAFTWAKER]);
      fetchLureRanking(COLLABORATION_MAKER.SATO_GYOKYO, [
        LURETYPES.HYOUSOU_BAKA_ICHIDAI,
        LURETYPES.RANKAKU_80,
      ]);
      fetchLureRanking(COLLABORATION_MAKER.TAPPEI_BNSP, [LURETYPES.TAPPEI_BNSP]);
      fetchLureRanking(COLLABORATION_MAKER.LC_MTO15, [LURETYPES.LC_MTO15]);
      fetchLureRanking(COLLABORATION_MAKER.SATAN_SHIMADA_SALON, [
        LURETYPES.BALAM_200,
        LURETYPES.BALAM_300_YUKI,
        LURETYPES.VARIANT_255_YUKI,
      ]);
      fetchLureRanking(COLLABORATION_MAKER.HMKL, [LURETYPES.HMKL_SUPER_JORDAN_68]);
      fetchLureRanking(COLLABORATION_MAKER.N_SHAD, [LURETYPES.N_SHAD]);
    }
  }, [fetchFieldRanking, fetchLureRanking, fieldMaster]);
  return (
    <Box bg={'black'} color={'white'}>
      <HeaderMenu />
      <Flex minHeight={'100vh'} flexDirection={'column'}>
        <Text py={3} fontWeight={'bold'} textAlign={'center'}>
          {t('ランキング')}
        </Text>
        <Tabs isFitted>
          <TabList borderColor={'black'}>
            <Tab>{t('ルアー')}</Tab>
            <Tab>{t('フィールド')}</Tab>
          </TabList>
          <Divider py="0.5px" />
          <TabPanels>
            <TabPanel>
              {bigFishRanks && fishingCountRanks && (
                <LureTopRankList bigFish={bigFishRanks} fishingCount={fishingCountRanks} />
              )}
            </TabPanel>
            <TabPanel>{fieldRanks && <FieldTopRanksList fields={fieldRanks} />}</TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <Footer />
    </Box>
  );
};

export default Ranking;
