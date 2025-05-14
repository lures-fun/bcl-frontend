'use client';

import { AddIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { TimelineList } from '@/components/Timeline/TimelineList';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import axiosInstance from '@/lib/axiosInstance';
import { TimelineItem } from '@/types/TimelineItem';
import { paths, pathsCreator } from '@/utils/constValues';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { debounce } from '@/utils/optimizeUtil';
import {
  getTimelineSession,
  removeTimelineSession,
  setTimelineSession,
} from '@/utils/sessionStorageUtil';

const Following = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [timelineFollowerItems, setTimelineFollowerItems] = useState<TimelineItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchedPage, setLastFetchedPage] = useState(0);
  const [rehydratedScroll, setRehydratedScroll] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const fetchTimeline = useCallback(
    async (page: number) => {
      if (page > totalPages) return;
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/timelines/follower`, {
          params: { page, limit: 10 },
        });
        const timelines = response.data;

        if (response.status === 200) {
          setTimelineFollowerItems((prev) => {
            const dataArray = Array.isArray(timelines) ? timelines : timelines.data;

            const newItems = dataArray.filter(
              (item: TimelineItem) => !prev.some((prevItem) => prevItem.id === item.id)
            );
            return [...prev, ...newItems];
          });
          setLastFetchedPage(page);
          removeTimelineSession();
        }

        setTotalPages(timelines?.meta?.totalPages);
      } catch (error) {
        console.info(error);
      } finally {
        setIsLoading(false);
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
  // restore saved scroll position only when data fully loaded.
  useEffect(() => {
    if (rehydratedScroll !== null && !isLoading && timelineFollowerItems.length > 0) {
      const timeoutId = setTimeout(() => {
        setIsLoading(true);
        window.scrollTo({ top: rehydratedScroll, behavior: 'auto' });
        setRehydratedScroll(null);
        setContainerHeight(null);
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [rehydratedScroll, isLoading, lastFetchedPage, currentPage, timelineFollowerItems.length]);

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
    if (window.innerHeight + scrollTop >= document.body.offsetHeight - 100 && !isLoading) {
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  }, [currentPage, isLoading, totalPages]);

  useEffect(() => {
    const debouncedScroll = debounce(handleScroll, 300);
    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [handleScroll]);

  return (
    <Box
      minHeight={containerHeight ? `${containerHeight}px` : 'auto'}
      bg="black"
      backgroundAttachment="fixed"
      backgroundSize="cover"
      backgroundPosition="center"
      bgRepeat="no-repeat"
    >
      <HeaderMenu />
      <Flex minHeight="100vh" flexDirection="column" color="white" py="2">
        <Flex justifyContent="space-between" alignItems="center" pe="3" pb="3">
          <Button
            colorScheme="transparent"
            onClick={() => router.push(pathsCreator.timeline())}
            ps="0"
            leftIcon={<ChevronLeftIcon fontSize="2xl" />}
          >
            {t('フォロー中')}
          </Button>
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
        <Flex flexDirection="column" color="white">
          {timelineFollowerItems?.length > 0 && (
            <TimelineList timelineItems={timelineFollowerItems} onTimelineClick={onTimelineClick} />
          )}
        </Flex>
      </Flex>
      <Footer />
    </Box>
  );
};
export default Following;
