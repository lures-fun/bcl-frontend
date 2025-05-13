import { Box, Text } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Assortment } from './Assortment';

type Props = {
  followerCount: number;
  trophyCount: number;
  biggestFish: number;
  fishingCount: number;
  followeeCount: number;
  tokenBalance: string;
  goToFollowerPage: () => void;
  goToFolloweePage: () => void;
};

export const AssortmentList = ({
  followerCount,
  trophyCount,
  biggestFish,
  fishingCount,
  followeeCount,
  tokenBalance,
  goToFollowerPage,
  goToFolloweePage,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Box w="90%" h="97px" border="2px solid #48B7CB" borderRadius="10px" position="relative">
      <Box
        sx={{
          background:
            'transparent linear-gradient(180deg, #4AAFEA 0%, #48B8C7 100%) 0% 0% no-repeat padding-box',
        }}
        position="absolute"
        borderTopRadius="10px"
        borderBottomRadius="5px"
        h="51%"
        w="calc(100% + 2px)"
        top="-1px"
        left="-1px"
      >
        <Flex
          alignItems="center"
          justifyContent={{ base: 'space-between', md: 'space-around' }}
          mt="2px"
        >
          <Flex
            alignItems="center"
            flexDirection="column"
            gap={{ base: 1, sm: 0.9 }}
            ml={3}
            mt={{ base: -3, sm: 0 }}
          >
            <Assortment title={t('釣果NFT')} element={fishingCount} />
            <Assortment
              title={t('フォロワー')}
              element={followerCount}
              onClick={goToFollowerPage}
            />
          </Flex>
          <Flex
            alignItems="center"
            flexDirection="column"
            gap={{ base: 1, sm: 0.9 }}
            mt={{ base: -3, sm: 0 }}
          >
            <Box height="35px" width="1px" bg="gray.600" mb={2}></Box>
            <Box height="35px" width="1px" bg="gray.600"></Box>
          </Flex>
          <Flex
            alignItems="center"
            flexDirection="column"
            gap={{ base: 1, sm: 0.9 }}
            mt={{ base: -3, sm: 0 }}
          >
            <Assortment title={t('タイトルNFT')} element={trophyCount} />
            <Assortment
              title={t('フォロー中')}
              element={followeeCount}
              onClick={goToFolloweePage}
            />
          </Flex>
          <Flex alignItems="center" flexDirection="column" gap={{ base: 4, sm: 0.9 }}>
            <Box height="35px" width="1px" bg="gray.600" mb={2}></Box>
            <Box height="35px" width="1px" bg="gray.600"></Box>
          </Flex>
          <Flex
            alignItems="center"
            flexDirection="column"
            gap={{ base: 1, sm: 0.9 }}
            mr={2}
            mt={{ base: -3, sm: 0 }}
          >
            <Assortment
              title="Big fish"
              element={
                <Box color="white" fontWeight="bold" fontSize="sm" flexGrow="1" mr={2}>
                  <Text as="span" fontSize="1.2rem" textAlign="center">
                    {biggestFish || 0}
                  </Text>
                  {/* {'cm'} */}
                </Box>
              }
            />
            <Assortment title="BBT" element={tokenBalance} />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
