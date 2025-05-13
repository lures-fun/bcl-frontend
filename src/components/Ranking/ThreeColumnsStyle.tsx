import { SimpleGrid, Text } from '@chakra-ui/react';
import { BigFish, FishingCount } from '@/types/Ranking';
import { RANKING_TABS } from '@/utils/constValues';
import { RankingItem } from './RankingItem';
import { useTranslation } from 'react-i18next';

type Props = {
  tab: number;
  bigFish?: BigFish[];
  fishCount?: FishingCount[];
};

export const ThreeColumnsStyle = ({ tab, bigFish, fishCount }: Props) => {
  const { t } = useTranslation();

  return (
    <SimpleGrid>
      <SimpleGrid columns={3} fontSize={'12px'} textAlign={'center'}>
        <Text>{t('順位')}</Text>
        <Text>{t('ユーザー')}</Text>
        <Text>{tab === RANKING_TABS.bigFish ? t('サイズ') : t('釣果数')}</Text>
      </SimpleGrid>
      {tab === RANKING_TABS.bigFish &&
        bigFish?.map((item, index) => (
          <RankingItem
            key={index}
            ranking={item.ranking}
            tab={tab}
            userName={item.userName}
            profileIcon={item.profileIcon}
            fishSize={item.size}
          />
        ))}
      {tab === RANKING_TABS.fishingCount &&
        fishCount?.map((item, index) => (
          <RankingItem
            key={index}
            ranking={item.ranking}
            tab={tab}
            userName={item.userName}
            profileIcon={item.profileIcon}
            fishCount={item.fishingCount}
          />
        ))}
    </SimpleGrid>
  );
};
