'use client';

import { Box, Divider, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import _ from 'lodash';
import { Suspense, useEffect, useMemo, useState } from 'react';
import LureColorRanksList from '@/components/Ranking/LureColorRanksList';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useCustomToast } from '@/hooks/useCustomToast';
import axiosInstance from '@/lib/axiosInstance';
import { COLLABORATION_MAKER, LURETYPES, displayLureNames, paths } from '@/utils/constValues';
import { useRouter, useSearchParams } from 'next/navigation';
import PageLoading from '@/components/uiParts/Loading/PageLoading';
import { useTranslation } from 'react-i18next';

type lureColor = {
  color: string;
  fishingCount: number;
  imagePathForNft: string;
  lureType: string;
};

const LureColorRankingContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showErrorToast } = useCustomToast();

  const lureTypes = useMemo(() => {
    const lureTypeParam = searchParams.get('lureTypes');
    console.log(lureTypeParam);
    return lureTypeParam ? lureTypeParam.split(',') : [];
  }, [searchParams]);

  const [lures, setLures] = useState<lureColor[]>();
  const [fishingTotalCount, setFishingTotalCount] = useState<number>();
  const { t } = useTranslation();

  useEffect(() => {
    if (lureTypes?.length === 0) {
      router.push(paths.rankings);
      return;
    }
    axiosInstance
      .post(`/ranking/collaboration/lure-color`, { lureTypes: lureTypes })
      .then((response) => {
        setLures(response?.data?.lure);
        setFishingTotalCount(response?.data?.summary?.fishingTotalCount);
      })
      .catch((error) => showErrorToast('Failed to fetch data', error.message));
  }, [lureTypes, showErrorToast, router]);

  const arr: number[] = [];
  lures?.map((lure) => {
    return arr.push(lure.fishingCount);
  });
  const biggestCount = _.max(arr);

  const isCollaboration = (collaboration: COLLABORATION_MAKER) => {
    if (collaboration === COLLABORATION_MAKER.SATO_GYOKYO) {
      return (
        lureTypes.includes(LURETYPES.HYOUSOU_BAKA_ICHIDAI) ||
        lureTypes.includes(LURETYPES.RANKAKU_80)
      );
    } else if (collaboration === COLLABORATION_MAKER.SATAN_SHIMADA_SALON) {
      return (
        lureTypes.includes(LURETYPES.BALAM_300_YUKI) ||
        lureTypes.includes(LURETYPES.BALAM_200) ||
        lureTypes.includes(LURETYPES.VARIANT_255_YUKI)
      );
    } else if (collaboration === COLLABORATION_MAKER.LC_MTO15) {
      return lureTypes.includes(LURETYPES.LC_MTO15);
    } else if (collaboration === COLLABORATION_MAKER.HMKL) {
      return lureTypes.includes(LURETYPES.HMKL_SUPER_JORDAN_68);
    } else if (collaboration === COLLABORATION_MAKER.N_SHAD) {
      return lureTypes.includes(LURETYPES.N_SHAD);
    } else {
      return undefined;
    }
  };

  const getLureName = () => {
    if (isCollaboration(COLLABORATION_MAKER.SATO_GYOKYO)) {
      return 'BCL×さとう漁協';
    } else if (isCollaboration(COLLABORATION_MAKER.SATAN_SHIMADA_SALON)) {
      return 'BCL×サタン島田サロン';
    } else if (isCollaboration(COLLABORATION_MAKER.LC_MTO15)) {
      return 'BCL×Lucky Craft';
    } else if (isCollaboration(COLLABORATION_MAKER.HMKL)) {
      return 'BCL×HMKL';
    } else if (isCollaboration(COLLABORATION_MAKER.N_SHAD)) {
      return 'Royal Blue';
    }
    try {
      // カラーごとに表示を分けたい場合は、lureColorをdisplayLureNamesの第二引数に追加する。
      // 現状では、カラーごとに分けているLuckyCraftのルアーは上記のisCollaborationで判定している。
      return displayLureNames(lureTypes[0]);
    } catch (e) {
      return undefined;
    }
  };

  return (
    <Box bg="black">
      <HeaderMenu />
      <Flex minHeight={'100vh'} flexDirection={'column'} p={3}>
        <Flex py={3} gap={1} justifyContent={'space-around'} color={'white'} alignItems={'center'}>
          <Flex flexDirection={'column'} alignItems={'center'}>
            {isCollaboration(COLLABORATION_MAKER.SATO_GYOKYO) ||
            isCollaboration(COLLABORATION_MAKER.SATAN_SHIMADA_SALON) ||
            isCollaboration(COLLABORATION_MAKER.HMKL) ? (
              <Text fontSize="sm">{t('コラボメーカー')}</Text>
            ) : (
              <Text fontSize="sm">{t('ルアー名')}</Text>
            )}
            {getLureName() && (
              <Text
                fontSize={isCollaboration(COLLABORATION_MAKER.SATAN_SHIMADA_SALON) ? 'lg' : 'xl'}
                fontWeight="bold"
              >
                {getLureName()}
              </Text>
            )}
          </Flex>
          <Flex flexDirection={'column'} alignItems={'center'}>
            <Text fontSize="sm">{t('全体釣果数')}</Text>
            <Text fontSize="xl" fontWeight={'bold'}>
              {fishingTotalCount} <span style={{ fontSize: '15px' }}>{t('匹')}</span>
            </Text>
          </Flex>
        </Flex>
        <Divider />

        <Grid
          minHeight={['80vh', '80vh', '70vh', '70vh', '70vh']}
          templateColumns={{
            base: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(5, 1fr)',
            lg: 'repeat(6, 1fr)',
            xl: 'repeat(8, 1fr)',
          }}
          gap={1}
          p={2}
          bg={'white'}
          borderRadius="10px"
          mt={5}
        >
          {lures &&
            lures.map((lure, index) => (
              <GridItem key={index} w="100%" h="175" p={1}>
                <LureColorRanksList
                  image={lure.imagePathForNft}
                  type={lure.lureType}
                  color={lure.color}
                  biggestCount={biggestCount}
                  fishingCount={lure.fishingCount}
                />
              </GridItem>
            ))}
        </Grid>
      </Flex>

      <Footer />
    </Box>
  );
};

// useSearchParamsを使う場合は、Suspenseで囲まないとエラーが発生する
const LureColorRanking = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <LureColorRankingContent />
    </Suspense>
  );
};

export default LureColorRanking;
