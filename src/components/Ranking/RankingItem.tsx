import { SimpleGrid, Image, Text, Flex, Avatar } from '@chakra-ui/react';
import { RANKING_TABS, pathsCreator } from '@/utils/constValues';
import { TROPHIES } from '@/utils/constValues';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Props = {
  tab: number;
  userName: string;
  profileIcon: string;
  fishCount?: number;
  ranking: number;
  fishSize?: number;
};

export const RankingItem = ({
  tab,
  userName,
  ranking,
  profileIcon,
  fishCount,
  fishSize,
}: Props) => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <SimpleGrid columns={3} py={4} fontSize={'12px'} fontWeight={'bold'} textAlign={'center'}>
      {ranking === 1 || ranking === 2 || ranking === 3 ? (
        <Image
          alt="trophy"
          src={TROPHIES[ranking - 1].icon}
          width={'50px'}
          mx={'auto'}
          my={'auto'}
        />
      ) : (
        <Text>
          {ranking}
          {t('位')}
        </Text>
      )}
      {ranking === 1 || ranking === 2 || ranking === 3 ? (
        <Flex
          alignItems={'center'}
          flexDirection={'column'}
          onClick={() => router.push(pathsCreator.gallery(userName))}
        >
          <Avatar size={'md'} src={profileIcon} />
          <Text fontWeight={'normal'}>@{userName}</Text>
        </Flex>
      ) : (
        <Text fontWeight={'normal'} onClick={() => router.push(pathsCreator.gallery(userName))}>
          @{userName}
        </Text>
      )}
      <Text my={'auto'}>
        {tab === RANKING_TABS.bigFish && `${fishSize}cm`}
        {tab === RANKING_TABS.fishingCount && `${fishCount}${t('匹')}`}
      </Text>
    </SimpleGrid>
  );
};
