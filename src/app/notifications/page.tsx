'use client';

import { Box, Center, Container, Flex, Heading } from '@chakra-ui/react';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import NotificationData from './NotificationData';
import { useFetchNotification } from '@/hooks/useFetchNotification';
import { filterNotifications } from '@/services/Notifications/filterDataByData';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo } from 'react';
import axiosInstance from '@/lib/axiosInstance';

const Notification = () => {
  const { NotiData, isLoading } = useFetchNotification();
  const { t } = useTranslation();

  const final = useMemo(() => filterNotifications(NotiData ?? []), [NotiData]);

  // Check if data is empty
  const isEmpty = NotiData?.length === 0 || NotiData === undefined;

  // added to useCallback to avoid multiple request to server since it's not necessary
  const updateNotifications = useCallback(async () => {
    try {
      await axiosInstance.patch(`notifications/mark-as-read`);
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    updateNotifications();
  }, [updateNotifications]);

  return (
    <Box bg="black">
      <Flex direction="column" minH="100vh" color={'white'}>
        <HeaderMenu />

        <Container my={5} flex={1}>
          <Box>
            <Heading textAlign={'center'} size={'md'}>
              {t('お知らせ')}
            </Heading>

            {/* Show fallback message if all categories are empty */}
            {isEmpty && !isLoading ? (
              <Center mt={20}>
                <Box borderRadius="md" p={6} bg="whiteAlpha.200" textAlign="center" minW={'sm'}>
                  {t('お知らせはありません')}
                </Box>
              </Center>
            ) : (
              <>
                {/* Render notifications for today */}
                {final.today.length > 0 && (
                  <NotificationData NotiData={final.today} heading={t('今日')} />
                )}
                {/* Render notifications for yesterday */}
                {final.yesterday?.length > 0 && (
                  <NotificationData NotiData={final.yesterday} heading={t('昨日')} />
                )}
                {/* Render notifications for the last 7 days */}
                {final.last_7_days.length > 0 && (
                  <NotificationData NotiData={final.last_7_days} heading={t('過去7日間')} />
                )}
                {final.other.length > 0 && (
                  <NotificationData NotiData={final.other} heading={t('他の')} />
                )}
              </>
            )}
          </Box>
        </Container>

        <Footer />
      </Flex>
    </Box>
  );
};

export default Notification;
