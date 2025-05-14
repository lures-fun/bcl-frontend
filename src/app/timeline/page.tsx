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
import { TimelineList } from '@/components/Timeline/TimelineList';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import axiosInstance from '@/lib/axiosInstance';
import { TimelineItem } from '@/types/TimelineItem';
import { paths, pathsCreator } from '@/utils/constValues';
import people from '@/assets/icon/タイムライン切り替えアイコン.svg';
import { ShopSlide } from '@/components/Home/ShopSlide';
import { NewsSlide } from '@/components/Home/NewsSlide';
import { EventSlide } from '@/components/Home/EventSlide';
import { MenuGrid } from '@/components/Home/MenuGrid';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { REDIRECT_URL_COOKIE_KEY } from '@/utils/cookieUtil';
import { usePathname, useRouter } from 'next/navigation';
import { debounce } from '@/utils/optimizeUtil';
import {
  getTimelineSession,
  removeTimelineSession,
  setTimelineSession,
} from '@/utils/sessionStorageUtil';

const Timelines = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [existsUnread, setExistsUnread] = useState<boolean>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  // state to track page fully loaded or not.
  const [lastFetchedPage, setLastFetchedPage] = useState(0);
  const { t } = useTranslation();
  Cookies.remove(REDIRECT_URL_COOKIE_KEY, { path: '/lures/purchase' });

  const router = useRouter();
  const pathname = usePathname();
  const home = pathname === '/home';

  // state to hold the saved scroll position for restore scroll.
  const [rehydratedScroll, setRehydratedScroll] = useState<number | null>(null);
  useEffect(() => {
    const fetchExistUnread = async () => {
      const response = await axiosInstance.get(`/timelines/exists-unread`);
      if (response.status === 200) {
        setExistsUnread(response.data);
      }
    };
    fetchExistUnread();
  }, []);

  const fetchTimeline = useCallback(
    async (page: number) => {
      if (page > totalPages) return;
      setIsLoading(true);
      const sessionData = getTimelineSession();

      if (sessionData) {
        // for redirected scrolling

        try {
          const limit = sessionData.timelinePage * 10;

          const response = await axiosInstance.get(`/timelines`, {
            params: { page: 1, limit: limit },
          });
          const timelines = response.data;
          if (response.status === 200) {
            setTimelineItems(timelines.data);
            setLastFetchedPage(page);
            setHasNextPage(timelines.meta.hasNextPage);

            removeTimelineSession();
          }
          setTotalPages(timelines?.meta?.totalPages);
        } catch (error) {
          console.info(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // for normal scrolling

        try {
          const response = await axiosInstance.get(`/timelines`, {
            params: { page, limit: 10 },
          });
          const timelines = response.data;
          if (response.status === 200) {
            setTimelineItems((prev) => {
              const newItems = timelines?.data?.filter(
                (item: TimelineItem) => !prev.some((prevItem) => prevItem.id === item.id)
              );
              return [...prev, ...newItems];
            });
            setLastFetchedPage(page);
            setHasNextPage(timelines.meta.hasNextPage);
          }
          setTotalPages(timelines?.meta?.totalPages);
        } catch (error) {
          console.info(error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [totalPages]
  );

  // Fetch timeline whenever currentPage changes.
  useEffect(() => {
    fetchTimeline(currentPage);
  }, [fetchTimeline, currentPage]);

  // Rehydrate saved state on mount
  useEffect(() => {
    try {
      const sessionData = getTimelineSession();
      if (sessionData) {
        setCurrentPage(sessionData.timelinePage);
        setRehydratedScroll(sessionData.timelineScroll);
        setContainerHeight(sessionData.maximumScrollHeight);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // restore saved scroll position only when data fully loaded.
  useEffect(() => {
    if (rehydratedScroll !== null && !isLoading && timelineItems.length > 0) {
      const timeoutId = setTimeout(() => {
        setIsLoading(true);
        window.scrollTo({ top: rehydratedScroll, behavior: 'auto' });
        setRehydratedScroll(null);
        setContainerHeight(null);
        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [rehydratedScroll, isLoading, lastFetchedPage, currentPage, timelineItems.length]);

  const onTimelineClick = useCallback(() => {
    const fullHeight = document.body.scrollHeight;

    setTimelineSession({
      timelinePage: currentPage,
      timelineScroll: window.scrollY,
      maximumScrollHeight: fullHeight,
    });
  }, [currentPage]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    if (
      window.innerHeight + scrollTop >= document.body.offsetHeight - 100 &&
      !isLoading &&
      hasNextPage
    ) {
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  }, [currentPage, hasNextPage, isLoading, totalPages]);

  useEffect(() => {
    const debouncedScroll = debounce(handleScroll, 300);
    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [handleScroll]);

  return (
    <Box
      minHeight={containerHeight ? `${containerHeight}px` : 'auto'}
      _before={{
        content: `''`,
        position: 'fixed',
        zIndex: -1,
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
      <Flex minHeight="100vh" flexDirection="column" color="white" p={home ? 5 : 0} py="3">
        {!home ? (
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
                      <Image src={people.src} objectFit="contain" alt="people_icon" />
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
              {timelineItems.length > 0 && (
                <TimelineList timelineItems={timelineItems} onTimelineClick={onTimelineClick} />
              )}
            </Flex>
          </>
        ) : (
          <>
            <ShopSlide />
            <EventSlide />
            <NewsSlide />
            <MenuGrid />
          </>
        )}
      </Flex>
      <Footer />
    </Box>
  );
};

export default Timelines;
