'use client';

import {
  Box,
  Button,
  Divider,
  Flex,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { BigFish, FishingCount } from '@/types/Ranking';
import {
  COLLABORATION_MAKER,
  LURETYPES,
  RANKING_TABS,
  TOPRANKING_TYPES,
  displayLureNames,
  pathsCreator,
} from '@/utils/constValues';
import { FiveColumnsStyle } from './FiveColumnsStyle';
import { ThreeColumnsStyle } from './ThreeColumnsStyle';
import { useTranslation } from 'react-i18next';

type Props = {
  type: string;
  property: string;
  fishingTotalCount: number;
  bigFish: BigFish[];
  fishingCount: FishingCount[];
};

export const RankingList = ({
  type,
  property,
  fishingTotalCount,
  bigFish,
  fishingCount,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { t } = useTranslation();

  // tab の初期値をクエリパラメータに基づいて設定
  const [tab, setTab] = useState<number>(
    tabParam === '1' ? RANKING_TABS.fishingCount : RANKING_TABS.bigFish
  );
  const isCollaboration = (collaboration: COLLABORATION_MAKER) => {
    if (collaboration === COLLABORATION_MAKER.SATO_GYOKYO) {
      return property === LURETYPES.HYOUSOU_BAKA_ICHIDAI || property === LURETYPES.RANKAKU_80;
    } else if (collaboration === COLLABORATION_MAKER.SATAN_SHIMADA_SALON) {
      return property === LURETYPES.BALAM_300_YUKI || property === LURETYPES.VARIANT_255_YUKI;
    } else if (collaboration === COLLABORATION_MAKER.LC_MTO15) {
      return property === LURETYPES.LC_MTO15;
    } else if (collaboration === COLLABORATION_MAKER.HMKL) {
      return property === LURETYPES.HMKL_SUPER_JORDAN_68;
    } else if (collaboration === COLLABORATION_MAKER.N_SHAD) {
      return property === LURETYPES.N_SHAD;
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
      return displayLureNames(property);
    } catch (e) {
      return undefined;
    }
  };
  return (
    <Box width={'full'}>
      <SimpleGrid columns={2} py={5}>
        <Flex alignItems={'center'} flexDirection={'column'}>
          {type === TOPRANKING_TYPES.lure &&
            (isCollaboration(COLLABORATION_MAKER.SATO_GYOKYO) ||
            isCollaboration(COLLABORATION_MAKER.SATAN_SHIMADA_SALON) ||
            isCollaboration(COLLABORATION_MAKER.HMKL) ? (
              <Text>{t('コラボメーカー')}</Text>
            ) : (
              <Text>{t('ルアー名')}</Text>
            ))}
          {type === TOPRANKING_TYPES.lure && getLureName() && (
            <Text
              fontSize={isCollaboration(COLLABORATION_MAKER.SATAN_SHIMADA_SALON) ? 'md' : 'xl'}
              ps={isCollaboration(COLLABORATION_MAKER.SATAN_SHIMADA_SALON) ? '5px' : '0px'}
              fontWeight={'bold'}
            >
              {getLureName()}
            </Text>
          )}
          {type === TOPRANKING_TYPES.field && <Text>{t('フィールド')}</Text>}
          {type === TOPRANKING_TYPES.field && (
            <Text fontSize={'xl'} fontWeight={'bold'}>
              {property}
            </Text>
          )}
        </Flex>
        <Flex alignItems={'center'} flexDirection={'column'}>
          {type === TOPRANKING_TYPES.lure ? (
            <Button
              color={'white'}
              bg="brand.bclBlue"
              textAlign={'center'}
              size={'xs'}
              rounded={'md'}
              onClick={() => {
                if (bigFish.length > 0) {
                  const url = `${pathsCreator.lureColorRankings()}?lureTypes=${property}`;
                  router.push(url);
                }
              }}
            >
              {t('全体釣果数')}
            </Button>
          ) : (
            <Text>{t('全体釣果数')}</Text>
          )}
          <Text fontSize={'xl'} fontWeight={'bold'}>
            {fishingTotalCount} <span style={{ fontSize: '15px' }}>{t('匹')}</span>
          </Text>
        </Flex>
      </SimpleGrid>
      <Tabs defaultIndex={tab} isFitted onChange={(index) => setTab(index)}>
        <TabList borderColor={'transparent'}>
          <Tab>{t('Big Fish')}</Tab>
          <Tab>{t('釣果数')}</Tab>
        </TabList>
        <Divider py={'0.5px'} />
        <TabPanels>
          <TabPanel>
            {type === TOPRANKING_TYPES.lure ? (
              <FiveColumnsStyle bigFish={bigFish} />
            ) : (
              <ThreeColumnsStyle tab={tab} bigFish={bigFish} />
            )}
          </TabPanel>
          <TabPanel>
            <ThreeColumnsStyle tab={tab} fishCount={fishingCount} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
