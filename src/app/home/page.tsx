'use client';

import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TimelineList } from '@/components/Timeline/TimelineList';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import axiosInstance from '@/lib/axiosInstance';
import { TimelineItem } from '@/types/TimelineItem';
import { paths, pathsCreator } from '@/utils/constValues';
import people from '@/assets/icon/タイムライン切り替えアイコン.svg';
import { ShopSlide } from '@/components/Home/ShopSlide';
import { EventSlide } from '@/components/Home/EventSlide';
import { NewsSlide } from '@/components/Home/NewsSlide';
import { MenuGrid } from '@/components/Home/MenuGrid';
import { useTranslation } from 'react-i18next';

const Timelines = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [existsUnread, setExistsUnread] = useState<boolean>();
  const { t } = useTranslation();

  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/home';

  const fetchData = useCallback(async () => {
    try {
      await axiosInstance
        .get(`/timelines/exists-unread`)
        .then((response) => {
          if (response.status === 200) {
            setExistsUnread(response.data);
          }
        })
        .catch((error) => {
          throw new Error(error.message);
        });
      await axiosInstance
        .get(`/timelines`)
        .then((response) => {
          if (response.status === 200) {
            setTimelineItems(response.data);
          }
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    } catch (error: any) {
      Promise.reject(error.message);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box
      _before={{
        content: `''`,
        position: 'fixed',
        zIndex: -1,
        display: 'block',
        top: '0px',
        left: '0px',
        bottom: '0px',
        right: '0px',
        bg: 'black',
        bgSize: 'cover',
        bgRepeat: 'no-repeat',
        bgPosition: 'center top',
      }}
    >
      <HeaderMenu />
      <Flex minHeight="100vh" flexDirection="column" color="white" p={isHome ? 5 : 0} py="3">
        {!isHome ? (
          <>
            <Flex justifyContent="space-between" alignItems="center" px="3">
              <Popover>
                <PopoverTrigger>
                  <Button colorScheme="transparent" size="sm">
                    <span>{t('タイムライン')}</span>
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent w="150px" border="none" bg="transparent" marginTop={-3}>
                    <Button
                      size="sm"
                      onClick={() => router.push(pathsCreator.following())}
                      color="white"
                      style={{ backgroundColor: '#242426' }}
                    >
                      <span style={{ paddingRight: '40px' }}>{t('フォロー中')}</span>
                      <Image src={people} objectFit="contain" alt="people_icon" />
                      {existsUnread && (
                        <Badge
                          position="absolute"
                          right="-5"
                          top="0"
                          fontSize="0.8em"
                          bgColor="white"
                          rounded="full"
                          variant="subtle"
                          padding="1.5"
                        />
                      )}
                    </Button>
                  </PopoverContent>
                </Portal>
              </Popover>
              <Button
                size="xs"
                colorScheme="transparent"
                variant="outline"
                height={7}
                onClick={() => router.push(paths.fishingResultCreate)}
              >
                <AddIcon color="white" />
              </Button>
            </Flex>
            <Flex flexDirection="column" color="white" py="5" mt={4}>
              {timelineItems && timelineItems?.length > 0 && (
                <TimelineList timelineItems={timelineItems} />
              )}
            </Flex>
          </>
        ) : (
          <>
            <ShopSlide />
            <Flex flexDirection="row">
              <EventSlide />
              <NewsSlide />
            </Flex>
            <MenuGrid />
          </>
        )}
      </Flex>
      <Footer />
    </Box>
  );
};

export default Timelines;
