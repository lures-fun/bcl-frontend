import { SimpleGrid, Text, Image, Flex, Avatar } from '@chakra-ui/react';
import { BigFish } from '@/types/Ranking';
import { LURETYPES, TROPHIES, displayLureNames, pathsCreator } from '@/utils/constValues';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Props = {
  bigFish: BigFish[];
};

export const FiveColumnsStyle = ({ bigFish }: Props) => {
  const router = useRouter();
  const { t } = useTranslation();

  const displayFieldName = (bigFish: BigFish) => {
    if (bigFish.lureType === LURETYPES.W3_CRANKBAIT || bigFish.lureType === LURETYPES.DRAFTWAKER) {
      return `#${bigFish.color}`;
    } else if (bigFish.lureType === LURETYPES.HMKL_SUPER_JORDAN_68) {
      return 'BCL SAKURA';
    } else {
      return displayLureNames(bigFish.lureType, bigFish.color);
    }
  };

  return (
    <SimpleGrid>
      <SimpleGrid columns={5} fontSize={'12px'} textAlign={'center'}>
        <Text>{t('順位')}</Text>
        <Text>{t('ユーザー')}</Text>
        <Text>{t('サイズ')}</Text>
        <Text>{t('フィールド')}</Text>
        <Text>{t('カラー')}</Text>
      </SimpleGrid>
      {bigFish.map((data, index) => (
        <SimpleGrid
          key={index}
          columns={5}
          py={4}
          fontSize={'12px'}
          fontWeight={'bold'}
          textAlign={'center'}
        >
          {data.ranking === 1 || data.ranking === 2 || data.ranking === 3 ? (
            <Image
              alt="trophy"
              src={TROPHIES[data.ranking - 1].icon}
              width={'50px'}
              mx={'auto'}
              my={'auto'}
            />
          ) : (
            <Text>
              {data.ranking}
              {t('位')}
            </Text>
          )}
          {data.ranking === 1 || data.ranking === 2 || data.ranking === 3 ? (
            <Flex
              alignItems={'center'}
              flexDirection={'column'}
              onClick={() => router.push(pathsCreator.gallery(data.userName))}
            >
              <Avatar size={'md'} src={data.profileIcon} />
              <Text fontWeight={'normal'}>@{data.userName}</Text>
            </Flex>
          ) : (
            <Text
              fontWeight={'normal'}
              onClick={() => router.push(pathsCreator.gallery(data.userName))}
            >
              @{data.userName}
            </Text>
          )}
          <Text my={'auto'}>{data.size}cm</Text>
          <Text my={'auto'}>{data.field}</Text>
          <Text my={'auto'}>{displayFieldName(data)}</Text>
        </SimpleGrid>
      ))}
    </SimpleGrid>
  );
};
