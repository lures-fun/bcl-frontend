import { Box, Button, Divider, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TopRankItem } from './TopRanksItem';
import { BigFish, FishingCount } from '@/types/Ranking';
import { RANKING_TABS, RANKING_TYPES, pathsCreator } from '@/utils/constValues';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Props = {
  fields: any[];
};

export const FieldTopRanksList = ({ fields }: Props) => {
  const [fieldRanks, setFieldRanks] = useState<any[]>();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const buttonWidth = i18n.language === 'en' ? '90px' : '85px';

  useEffect(() => {
    fields.forEach((field) => {
      field.bigFish = field.bigFish.slice(0, 3);
      field.fishingCount = field.fishingCount.slice(0, 3);
    });
    const filteredFields = fields && fields.filter((field) => field.fieldName !== 'その他');
    setFieldRanks(filteredFields);
  }, [fields]);
  return (
    <Flex flexDirection={'column'} gap={6} fontSize={'xs'} fontWeight={'bold'}>
      {fieldRanks &&
        fieldRanks.map((field, index) => (
          <Box key={index}>
            <Text fontSize={'md'}>{field.fieldName}</Text>
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
                  if (field.bigFish.length > 0) {
                    const url = `${pathsCreator.fieldRankings(field.field)}?tab=${RANKING_TABS.bigFish}`;
                    router.push(url);
                  }
                }}
              >
                {t('Big Fish')}
              </Button>
              <SimpleGrid columns={3}>
                {field.bigFish?.map((item: BigFish, index: number) => (
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
                  if (field.bigFish.length > 0) {
                    const url = `${pathsCreator.fieldRankings(field.field)}?tab=${RANKING_TABS.fishingCount}`;
                    router.push(url);
                  }
                }}
              >
                {t('釣果数')}
              </Button>
              <SimpleGrid columns={3}>
                {field.fishingCount?.map((item: FishingCount, index: number) => (
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
        ))}
    </Flex>
  );
};
