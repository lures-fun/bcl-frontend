import { Box, Button, Divider, SimpleGrid, Text } from '@chakra-ui/react';
import { BigFish, FishingCount } from '@/types/Ranking';
import { LURETYPES, RANKING_TABS, RANKING_TYPES, pathsCreator } from '@/utils/constValues';
import { TopRankItem } from './TopRanksItem';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Props = {
  brandName: string;
  lureTypes: LURETYPES[];
  bigFish: BigFish[];
  fishingCount: FishingCount[];
};
export const LureTopRank = ({ brandName, lureTypes, bigFish, fishingCount }: Props) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const buttonWidth = i18n.language === 'en' ? '90px' : '85px';

  return (
    <Box>
      <Text fontSize={'md'}>{brandName}</Text>
      <Divider />
      <Box py={3}>
        <Button
          color={'white'}
          bg="brand.bclBlue"
          width={buttonWidth}
          textAlign={'center'}
          size={'xs'}
          rounded={'md'}
          onClick={() => {
            if (bigFish.length > 0) {
              const url = `${pathsCreator.lureRankings()}?lureTypes=${lureTypes}&tab=${RANKING_TABS.bigFish}`;
              router.push(url);
            }
          }}
        >
          {t('Big Fish')}
        </Button>
        <SimpleGrid columns={3}>
          {bigFish.map((item, index) => (
            <TopRankItem
              key={index}
              ranking={item.ranking}
              type={RANKING_TYPES.bigFish}
              userName={item.userName}
              profileIcon={item.profileIcon}
              fishSize={item.size}
            />
          ))}
        </SimpleGrid>
      </Box>
      <Box py={3}>
        <Button
          color={'white'}
          bg="brand.bclBlue"
          width={buttonWidth}
          textAlign={'center'}
          size={'xs'}
          rounded={'md'}
          onClick={() => {
            if (fishingCount.length > 0) {
              const url = `${pathsCreator.lureRankings()}?lureTypes=${lureTypes}&tab=${RANKING_TABS.fishingCount}`;
              router.push(url);
            }
          }}
        >
          {t('釣果数')}
        </Button>
        <SimpleGrid columns={3}>
          {fishingCount.map((item, index) => (
            <TopRankItem
              key={index}
              ranking={item.ranking}
              type={RANKING_TYPES.fishingCount}
              userName={item.userName}
              profileIcon={item.profileIcon}
              fishingCount={item.fishingCount}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};
