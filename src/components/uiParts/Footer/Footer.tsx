'use client';

import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import DAOTalk from '@/assets/DAOTalk.svg';
import fishing_result_posting_icon from '@/assets/fishing_result_posting_icon.svg';
import home from '@/assets/home.svg';
import gallery_icon from '@/assets/icon/gallery_icon.png';
import tacklebox from '@/assets/icon/tacklebox_icon.svg';
import post from '@/assets/post.svg';
import post_bg from '@/assets/post_bg.png';
import profile from '@/assets/profile.svg';
import { useUnreadNotification } from '@/hooks/useUnreadNotification';
import { paths, pathsCreator } from '@/utils/constValues';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { IconLink } from '@/components/uiParts/Footer/IconLink';
import { removeTimelineSession } from '@/utils/sessionStorageUtil';

export const Footer = () => {
  const { userData, refetch } = useFetchUserData();
  const { existUnread } = useUnreadNotification();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  useEffect(() => {
    // ログイン後にユーザーデータを再取得するためのロジック（ログイン後はuserDataが空のためrefetchが必要）
    if (!userData) {
      refetch();
    }
  }, [userData, refetch]);

  return (
    <Box
      bg="black"
      color="brand.bclBlue"
      position="sticky"
      bottom={0}
      borderTop="1px solid #707070"
      zIndex={10}
    >
      <Container
        as={Stack}
        maxW="8xl"
        direction={{ base: 'column', md: 'row' }}
        spacing={2}
        px={2}
        pb={1}
        justify={{ base: 'start', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Stack
          w={{ base: '100%', md: 'auto' }}
          direction="row"
          justifyContent="space-between"
          flexGrow="1"
        >
          <IconLink
            href={paths.home}
            icon={<Image boxSize="42px" objectFit="contain" src={home.src} alt="ホーム" />}
            text={t('ホーム')}
          />
          <IconLink
            href={pathsCreator.timeline()}
            icon={
              <Box position="relative" onClick={removeTimelineSession}>
                {existUnread && (
                  <Badge
                    position="absolute"
                    right="-3"
                    top="0"
                    fontSize="0.8em"
                    bgColor="red"
                    rounded="full"
                    variant="subtle"
                    padding="1.5"
                  ></Badge>
                )}
                <Flex
                  h="42px"
                  w="42px"
                  bg="black"
                  rounded="full"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    boxSize="30px"
                    objectFit="contain"
                    src={gallery_icon.src}
                    alt="timeline_icon"
                  />
                </Flex>
              </Box>
            }
            text={t(`タイムライン`)}
          />
          <Box position="relative" display="flex" justifyContent="center" alignItems="center">
            <Box
              as="button"
              onClick={onOpen}
              mt={{ base: '-14px', md: '-20px' }}
              display="flex"
              justifyContent="center"
              position="relative"
              borderRadius="50%"
              w="72px"
              h="72px"
            >
              <Image
                boxSize="34px"
                objectFit="contain"
                src={post.src}
                alt="ranking_icon"
                position="absolute"
                top="8px"
              />
              <Image src={post_bg.src} />
            </Box>
            <Text
              color="white"
              fontSize="10px"
              fontWeight="bold"
              position="absolute"
              bottom="1.2rem"
            >
              {t('投稿する')}
            </Text>
          </Box>
          <IconLink
            href={pathsCreator.tackleBox(userData?.userName)}
            icon={
              <Flex
                h="42px"
                w="42px"
                bg="black"
                rounded="full"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  boxSize="32px"
                  objectFit="contain"
                  src={tacklebox.src}
                  alt="tacklebox_icon"
                />
              </Flex>
            }
            text={t('タックルボックス')}
          />
          <IconLink
            href={pathsCreator.gallery(userData?.userName)}
            icon={
              <Flex
                h="42px"
                w="42px"
                bg="black"
                rounded="full"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  boxSize="34px"
                  objectFit="cover"
                  src={userData && userData.profileIcon ? userData.profileIcon : profile.src}
                  borderRadius="50%"
                  alt="プロフィール"
                />
              </Flex>
            }
            text={t('プロフィール')}
          />
        </Stack>
      </Container>
      {/* modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false}>
        <ModalOverlay />
        <ModalContent
          w={{ base: '90%', sm: '78%', md: '50%', lg: '40%' }}
          maxW="600px"
          h="auto"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bgColor="rgba(255, 255, 255, 0.9)"
          borderRadius="20px"
        >
          <ModalBody
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            py={12}
          >
            <Text mb={2} fontSize="0.8rem" fontWeight="bold">
              {t('公式ルアーで釣果を上げたらシェアしよう！')}
            </Text>
            <Link href={paths.fishingResultCreate} mb={4} borderRadius="20px">
              <Button
                bg="#3cc38a"
                py="1.4rem"
                borderRadius="20px"
                w={{ base: 'full', sm: '13rem', md: '15rem' }}
                maxW="300px"
              >
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Image src={fishing_result_posting_icon.src} alt="公式釣果投稿アイコン" mr={2} />
                  <Text color="white" mr={4}>
                    {t('公式釣果投稿')}
                  </Text>
                </Box>
              </Button>
            </Link>
            <Divider borderColor="gray.500" />
            <Text mt={6} mb={4} fontSize="0.8rem" fontWeight="bold">
              {t('バス釣りの話題で盛り上がろう!')}
              <br /> {t('公式ルアー以外での釣果投稿はこちら!')}
            </Text>
            <Link href={paths.snsPost}>
              <Button
                bg="#751ede"
                py="1.4rem"
                borderRadius="20px"
                w={{ base: 'full', sm: '13rem', md: '15rem' }}
                maxW="300px"
              >
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Box mr={2}>
                    <Image src={DAOTalk.src} alt="公式釣果投稿アイコン" />
                  </Box>
                  <Text color="white" mr={4}>
                    {t('バス釣りトーク')}
                  </Text>
                </Box>
              </Button>
            </Link>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
