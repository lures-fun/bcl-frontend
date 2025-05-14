'use client';

import { Box, Flex, Heading, Img, Link, LinkBox, SimpleGrid, Text } from '@chakra-ui/react';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import defaultLure from '@/assets/unregister_lure.svg';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { Tacklebox } from '@/types/TackleBox';
import { LURETYPES, lureColorNames } from '@/utils/constValues';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

const TackleBoxList = () => {
  const DEFAULT_MAX_COLOR_CODE = 10;
  const { userData } = useFetchUserData();
  const [tackleBox, setTackleBox] = useState<Tacklebox>();
  const { t } = useTranslation();
  const useParam = useParams();
  const userName = useParam.userName;
  const lureType = useParam.lureType as string;

  const name = userName || userData?.userName;

  useEffect(() => {
    const fetchData = () => {
      axiosInstance
        .get(`/tackle-box/${name}`)
        .then((response) => {
          if (!response) {
            throw new Error('');
          } else {
            const originalTackle = {
              crankbaits: response.data?.crankbaits,
              draftWakers: response.data?.draftWakers,
              otherLures: response.data?.otherLures,
            };

            setTackleBox(originalTackle);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    fetchData();
  }, [lureType, name]);

  const maxColorCode = DEFAULT_MAX_COLOR_CODE;
  const fixedLures = useMemo(() => {
    return new Array(maxColorCode)
      .fill({
        id: '',
        lureType: lureType,
        serialCode: '',
        imagePath: '',
        reviewStatus: '',
      })
      .map((v, k) => {
        return {
          ...v,
          lureColor: _.padStart(`${k + 1}`, 2, '0'),
        };
      });
  }, [lureType, maxColorCode]);

  const orderedItem = useMemo(() => {
    let filteredItems: any[] = [];
    if (lureType === LURETYPES.W3_CRANKBAIT) {
      filteredItems = _.orderBy(tackleBox?.crankbaits || [], ['lureColor', 'isLost']).filter(
        (item) => item.reviewStatus !== 'HIDDEN'
      );
    } else if (lureType === LURETYPES.DRAFTWAKER) {
      filteredItems = _.orderBy(tackleBox?.draftWakers || [], ['lureColor', 'isLost']).filter(
        (item) => item.reviewStatus !== 'HIDDEN'
      );
    }

    return filteredItems;
  }, [lureType, tackleBox?.crankbaits, tackleBox?.draftWakers]);

  const mergedLures = useMemo(() => {
    return fixedLures.map(
      (fl) => orderedItem.find((item) => item.lureColor === fl.lureColor) || fl
    );
  }, [fixedLures, orderedItem]);

  return (
    <>
      <Box bg="black">
        <HeaderMenu />
        <Flex minHeight="100vh" flexDirection="column" px="2" pt="8">
          <Heading width="100%" as="h5" size="sm" color="white" textAlign="center" mb="7">
            {t('デジタルタックルボックス')}
          </Heading>
          {(lureType?.includes('W3_CRANKBAIT') || lureType?.includes('DRAFT_WAKER')) && (
            <>
              <Text color="white" fontWeight="bold" pl="8px">
              {lureType.replace(/_/g, ' ')}
              </Text>
              <SimpleGrid
                minChildWidth="105px"
                mt="1rem"
                columns={[3, 4, 5, 6, 7, 8]}
                px={[8, 12, 5]}
                py={mergedLures?.length === 0 ? '50px' : '14px'}
                bgColor={'white'}
                rounded="2xl"
                columnGap={[5, 10, 15]}
                rowGap="12px"
              >
                {_.orderBy(mergedLures, 'lureColor').map((item, i) => (
                  <Link
                    href={
                      item.id
                        ? item.reviewStatus === 'APPROVE'
                          ? `/lures/${item.id}/detail`
                          : `/lures/${item.id}`
                        : item.lureType.includes(LURETYPES.W3_CRANKBAIT)
                          ? 'https://blockchainlures.myshopify.com/collections/w3'
                          : 'https://blockchainlures.myshopify.com/collections/draft-waker'
                    }
                    style={
                      item.id
                        ? item.reviewStatus === 'APPROVE' || item.reviewStatus === 'REJECT'
                          ? { pointerEvents: 'auto' }
                          : { pointerEvents: 'none' }
                        : { pointerEvents: 'auto' }
                    }
                    key={i}
                    width="105px"
                    isExternal={!item.id}
                  >
                    <LinkBox alignContent="center">
                      <Box
                        position="relative"
                        width="105px"
                        height="105px"
                        rounded="xl"
                        overflow="hidden"
                        borderStyle="solid"
                      >
                        <Img
                          src={
                            item.imagePath && item.reviewStatus === 'APPROVE'
                              ? item.imagePath
                              : defaultLure.src
                          }
                        />
                        {item.reviewStatus === 'APPLY' ? (
                          <Flex
                            position="absolute"
                            top={0}
                            bottom={0}
                            left={0}
                            right={0}
                            display="flex"
                            flexGrow={1}
                            alignItems="center"
                            justifyContent="center"
                            fontWeight="bold"
                          >
                            {t('申請中')}
                          </Flex>
                        ) : item.reviewStatus === 'REJECT' ? (
                          <Box
                            position="absolute"
                            top={0}
                            bottom={0}
                            left={0}
                            right={0}
                            display="flex"
                            flexGrow={1}
                            alignItems="center"
                            justifyContent="center"
                            fontWeight="bold"
                            color="blue"
                            textDecoration="underline"
                          >
                            <Box
                              bgColor="whiteAlpha.700"
                              borderRadius="md"
                              paddingX="1"
                              paddingY="0"
                            >
                              {t('要再申請')}
                            </Box>
                          </Box>
                        ) : item.isLost ? (
                          <Box
                            position="absolute"
                            top={0}
                            bottom={0}
                            left={0}
                            right={0}
                            display="flex"
                            flexGrow={1}
                            alignItems="center"
                            justifyContent="center"
                            fontWeight="bold"
                            color="red"
                          >
                            <Box
                              bgColor="blackAlpha.500"
                              borderRadius="md"
                              textAlign="center"
                              verticalAlign="middle"
                              position="absolute"
                              paddingTop="45%"
                              paddingX="1"
                              width="100%"
                              height="100%"
                            >
                              LOST
                            </Box>
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Box>
                      {(item.lureType === LURETYPES.W3_CRANKBAIT ||
                        item.lureType === LURETYPES.DRAFTWAKER) && (
                        <Box py="3px" textAlign="center" color="black" fontSize="3xs">
                          <Text>#{item.lureColor}</Text>
                          <Text>
                            {(item.lureType === LURETYPES.W3_CRANKBAIT &&
                              lureColorNames.W3_CRANKBAIT[item.lureColor - 1]) ||
                              (item.lureType === LURETYPES.DRAFTWAKER &&
                                lureColorNames.DRAFTWAKER[item.lureColor - 1]) ||
                              ''}
                          </Text>
                        </Box>
                      )}
                    </LinkBox>
                  </Link>
                ))}
              </SimpleGrid>
            </>
          )}
        </Flex>
        <Footer />
      </Box>
    </>
  );
};

export default TackleBoxList;
