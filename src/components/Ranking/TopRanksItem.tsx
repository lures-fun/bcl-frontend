import { Avatar, Flex, Image, Text } from '@chakra-ui/react';
import { RANKING_TYPES } from '@/utils/constValues';
import { TROPHIES } from '@/utils/constValues';
import { useTranslation } from 'react-i18next';

type Props = {
  type: string;
  userName: string;
  profileIcon: string;
  fishSize?: number;
  fishingCount?: number;
  ranking: number;
};

export const TopRankItem = ({
  type,
  userName,
  profileIcon,
  fishingCount,
  fishSize,
  ranking,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Flex py={2} flexDirection={'column'} alignItems={'center'} gap={2}>
      <Avatar src={profileIcon} size={{ base: 'lg', lg: 'xl' }} />
      <Flex alignItems={'center'} justifyContent={'center'} gap={2}>
        <Image objectFit={'cover'} boxSize={'40px'} src={TROPHIES[ranking - 1].icon} alt="trophy" />
        <Flex flexDirection={'column'} align={'center'}>
          <Text>@{userName}</Text>
          <Text fontSize={'sm'}>
            {type === RANKING_TYPES.bigFish ? `${fishSize}cm` : `${fishingCount}${t('匹')}`}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
