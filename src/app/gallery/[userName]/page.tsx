'use client';

import {
  Avatar,
  Box,
  Divider,
  Flex,
  Img,
  Link,
  LinkBox,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import digital_closet from '@/assets/digital_closet.png';
import digital_tacklebox from '@/assets/digital_tacklebox.png';
import hall_of_fame_tacklebox from '@/assets/hall_of_fame_tacklebox.png';
import market_place from '@/assets/market_place.png';
import { AssortmentList } from '@/components/Gallery/AssortmentList';
import { ProfileDetail } from '@/components/Gallery/ProfileDetail';
import { FishingGrid } from '@/components/LureDetail/FishingGrid';
import { TitleCarousal } from '@/components/LureDetail/TitleCarousal';
import { SnsGrid } from '@/components/Sns/SnsGrid';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { Gallery } from '@/types/Gallery';
import { pathsCreator } from '@/utils/constValues';
import { useParams, useRouter } from 'next/navigation';
import { fetchTokenBalance } from '@/utils/tokenUtils';

const GalleryPage = () => {
  const [gallery, setGallery] = useState<Gallery>();
  const [posts, setPost] = useState<Sns[]>();
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const { userData } = useFetchUserData();
  const router = useRouter();
  const params = useParams();
  const userName = params.userName as string;
  const { showErrorToast } = useCustomToast();
  const userNameParam = userName || userData?.userName;
  const { t } = useTranslation();

  useEffect(() => {
    if (!userNameParam) return;
    window.history.pushState(null, '', `/gallery/${userNameParam}`);
    const fetchGallery = async () => {
      let walletAddress;
      try {
        const response = await axiosInstance.get<Gallery>(`/gallery/${userNameParam}`);
        setGallery(response.data);
        walletAddress = response.data.walletAddress;
      } catch (error: any) {
        console.log(error);
        if (error && error.response.status && error.response.status === 404) {
          router.back();
          showErrorToast(
            t('ユーザーネームが存在しません。'),
            `「${userNameParam}」` + t('に要求されたギャラリーが存在しません。')
          );
          return;
        }
      }
      try {
        const postResponse = await axiosInstance.get<Sns[]>(`/post/list/${userNameParam}`);
        setPost(postResponse.data);
      } catch (error: any) {
        console.log(error);
        return;
      }
      let tokenBalance = '0';
      if (walletAddress) {
        try {
          tokenBalance = await fetchTokenBalance(walletAddress);
        } catch (e: any) {
          console.log('#### onGetTokenBalanceErr ####', e);
        }
      }
      setTokenBalance(tokenBalance);
    };

    fetchGallery();
  }, [router, showErrorToast, userNameParam, t]);

  return (
    <Box bg="black">
      <HeaderMenu />
      <Flex minHeight="100vh" flexDirection="column" textColor="white">
        {gallery && (
          <>
            <Flex mt={10}>
              <Flex
                width={{ base: '33%', md: '25%' }}
                flexFlow="column"
                justifyContent="center"
                alignItems="center"
              >
                <Avatar
                  src={gallery.profile.profileIcon}
                  rounded="full"
                  border="3px"
                  width={{ base: '62px', sm: '84px', md: '90px' }}
                  height={{ base: '62px', sm: '84px', md: '90px' }}
                  name={userName}
                  alignSelf="center"
                  ml={-2}
                />
                <Flex flexFlow="column" justifyContent="center" alignItems="center" mt={2}>
                  <Text fontSize={'sm'} ml={-2}>
                    {gallery.profile.firstName} {gallery.profile.lastName}
                  </Text>
                  <Text fontSize={'xs'} ml={-2}>
                    @{gallery.profile.userName}
                  </Text>
                </Flex>
              </Flex>
              <Flex width={{ base: '64%', md: '75%' }} justifyContent="end" mr={1} mt={-2}>
                <AssortmentList
                  followerCount={gallery.followerCount}
                  trophyCount={gallery.trophies.length}
                  biggestFish={gallery.biggestFish}
                  fishingCount={gallery.fishingResults.length}
                  followeeCount={gallery.followeeCount}
                  tokenBalance={tokenBalance}
                  // eslint error対応
                  goToFollowerPage={() => {
                    if (userNameParam) {
                      router.push(pathsCreator.followPage(userNameParam));
                    }
                  }}
                  goToFolloweePage={() => {
                    if (userNameParam) {
                      router.push(pathsCreator.followeePage(userNameParam));
                    }
                  }}
                />
              </Flex>
            </Flex>
            <Flex px={{ base: 1, sm: 2, lg: 8 }} pt={2} justifyContent={'space-between'}>
              <Flex
                width={{ base: '33%', md: '25%' }}
                pb={3}
                flexDirection="column"
                textColor="white"
              ></Flex>
              <Flex
                gap={4}
                width={{ base: '67%', md: '75%' }}
                justifyContent={'space-between'}
                alignItems={'end'}
              ></Flex>
            </Flex>
            <ProfileDetail
              profile={gallery.profile}
              isFollowed={gallery.isFollowed}
              isBlocked={gallery.isBlocked}
              isMyProfile={gallery.profile.userName === userData?.userName}
              memberId={gallery.profile.id}
            />

            <Box boxShadow="base" minWidth="100%" mt={2}>
              <Flex flexDirection="row" justifyContent={{ base: 'center', md: 'space-around' }}>
                <Link href={pathsCreator.tackleBox(userName)} mt="1rem" w="23%">
                  <LinkBox alignContent="center">
                    <Box
                      width="100%"
                      height="auto"
                      rounded="xl"
                      overflow="hidden"
                      borderStyle="solid"
                      boxShadow="base"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <Box
                        width={{
                          base: '91px',
                          sm: '100px',
                        }}
                        height={{
                          base: '91px',
                          sm: '100px',
                        }}
                        rounded="xl"
                        borderStyle="solid"
                        boxShadow="base"
                      >
                        <Img
                          src={digital_tacklebox.src}
                          width={{
                            base: '91px',
                            sm: '100px',
                          }}
                          height={{
                            base: '91px',
                            sm: '100px',
                          }}
                          rounded="xl"
                        />
                      </Box>
                      <Text fontSize="0.7rem" textAlign="center" minH="2rem">
                        {t('デジタル')}
                        <br />
                        {t('タックルボックス')}
                      </Text>
                    </Box>
                  </LinkBox>
                </Link>

                <Link href={pathsCreator.goodsBox(gallery.profile.userName)} mt="1rem" w="23%">
                  <LinkBox alignContent="center">
                    <Box
                      width="100%"
                      height="auto"
                      rounded="xl"
                      overflow="hidden"
                      borderStyle="solid"
                      boxShadow="base"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <Box
                        width={{
                          base: '91px',
                          sm: '100px',
                        }}
                        height={{
                          base: '91px',
                          sm: '100px',
                        }}
                        rounded="xl"
                        borderStyle="solid"
                        boxShadow="base"
                      >
                        <Img
                          src={digital_closet.src}
                          width={{
                            base: '91px',
                            sm: '100px',
                          }}
                          height={{
                            base: '91px',
                            sm: '100px',
                          }}
                          rounded="xl"
                        />
                      </Box>
                      <Text fontSize="0.7rem" textAlign="center" minH="2rem">
                        {t('デジタル')}
                        <br />
                        {t('クローゼット')}
                      </Text>
                    </Box>
                  </LinkBox>
                </Link>

                <Link href={pathsCreator.hallOfFame(gallery.profile.userName)} mt="1rem" w="23%">
                  <LinkBox alignContent="center">
                    <Box
                      width="100%"
                      height="auto"
                      overflow="hidden"
                      borderStyle="solid"
                      boxShadow="base"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <Box
                        width={{
                          base: '91px',
                          sm: '100px',
                        }}
                        height={{
                          base: '91px',
                          sm: '100px',
                        }}
                        rounded="xl"
                        borderStyle="solid"
                        boxShadow="base"
                      >
                        <Img
                          src={hall_of_fame_tacklebox.src}
                          width={{
                            base: '91px',
                            sm: '100px',
                          }}
                          height={{
                            base: '91px',
                            sm: '100px',
                          }}
                          rounded="xl"
                        />
                      </Box>
                      <Text fontSize="0.7rem" textAlign="center" minH="2rem">
                        {t('殿堂入り')}
                        <br />
                        {t('タックルボックス')}
                      </Text>
                    </Box>
                  </LinkBox>
                </Link>

                <Link mt="1.7rem" mx="0.2rem" w="21%">
                  <LinkBox alignContent="center">
                    <Box
                      width="100%"
                      height="auto"
                      overflow="hidden"
                      borderStyle="solid"
                      boxShadow="base"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <Box
                        width={{
                          base: '70px',
                          sm: '79px',
                        }}
                        height={{
                          base: '70px',
                          sm: '79px',
                        }}
                        rounded="xl"
                        borderStyle="solid"
                        boxShadow="base"
                      >
                        <Img
                          src={market_place.src}
                          width={{
                            base: '70px',
                            sm: '79px',
                          }}
                          height={{
                            base: '70px',
                            sm: '79px',
                          }}
                          rounded="xl"
                        />
                      </Box>
                      <Text mt="0.5rem" fontSize="0.7rem" textAlign="center" minH="2rem">
                        {t('マーケット')}
                        <br />
                        {t('プレイス')}
                      </Text>
                    </Box>
                  </LinkBox>
                </Link>
              </Flex>
            </Box>

            <TitleCarousal
              titleList={gallery.trophies.map((t) => ({
                trophyId: t.trophyId,
                trophyTitle: t.trophyTitle,
                trophyImage: t.trophyImagePath,
              }))}
            />
            <Tabs py="3">
              <TabList justifyContent="space-evenly" borderColor="black">
                <Tab
                  flexGrow="1"
                  _selected={{
                    color: 'transparent',
                    background: 'linear-gradient(180deg, #A43BF5 0%, #702FA5 100%)',
                    WebkitBackgroundClip: 'text',
                    borderBottom: '1px solid #A43BF5',
                  }}
                >
                  {t('釣果NFT')}
                </Tab>
                <Tab
                  flexGrow="1"
                  _selected={{
                    color: 'transparent',
                    background: 'linear-gradient(180deg, #A43BF5 0%, #702FA5 100%)',
                    WebkitBackgroundClip: 'text',
                    borderBottom: '1px solid #A43BF5',
                  }}
                >
                  {t('釣りトーク')}
                </Tab>
              </TabList>
              <Divider py="0.5px" />
              <TabPanels>
                <TabPanel px="0" py="0">
                  <FishingGrid
                    isTitleHidden={true}
                    fishingList={gallery.fishingResults.map((f) => ({
                      userName: gallery.profile.userName,
                      ...f,
                    }))}
                  />
                </TabPanel>
                <TabPanel px="0" py="0">
                  <SnsGrid
                    isTitleHidden={true}
                    snsPosts={
                      posts &&
                      posts.map((f) => ({
                        userName: gallery.profile.userName,
                        image: f.imagePath1,
                        ...f,
                      }))
                    }
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
      </Flex>
      <Footer />
    </Box>
  );
};

export default GalleryPage;
