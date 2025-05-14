'use client';

import { Box, Divider, Flex, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Notification } from '@/types/Notification';
import { GOOD_TYPES, NOTIFICATION_TYPE, pathsCreator, TIMELINE_TYPES } from '@/utils/constValues';
import { useRouter } from 'next/navigation';
import LeftImage from './LeftImage';
import MidContent from './MidContent';
import RightImage from './RightImage';

type Props = {
  NotiData: Notification[];
  heading: string;
};

const NotificationData = ({ NotiData, heading }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleClick = async (notification: Notification): Promise<void> => {
    switch (notification.notificationType) {
      case NOTIFICATION_TYPE.RECEIVE_COMMENT:
        if (notification.commentType === TIMELINE_TYPES.fishingResults) {
          router.push(
            pathsCreator.fishingResultDetail(notification.toMemberName, notification.relatedPostId)
          );
        } else {
          router.push(
            pathsCreator.snsDetail(notification.toMemberName, notification.relatedPostId)
          );
        }
        break;
      case NOTIFICATION_TYPE.RECEIVE_BBT:
        router.push(pathsCreator.gallery(notification.toMemberName));
        break;
      case NOTIFICATION_TYPE.REGISTER_LURE:
        router.push(pathsCreator.lureDetail(notification.parentId));
        break;
      case NOTIFICATION_TYPE.APPROVE_FISHING_RESULT:
        router.push(
          pathsCreator.fishingResultDetail(notification.toMemberName, notification.parentId)
        );
        break;
      case NOTIFICATION_TYPE.RECEIVE_TROPHY:
        router.push(pathsCreator.trophies(notification.parentId));
        break;
      case NOTIFICATION_TYPE.FOLLOWED:
        router.push(pathsCreator.followPage(notification.toMemberName));
        break;
      case NOTIFICATION_TYPE.LIKE:
        if (notification.goodType === GOOD_TYPES.fishingResults) {
          router.push(
            pathsCreator.fishingResultDetail(notification.toMemberName, notification.relatedPostId)
          );
        } else {
          router.push(
            pathsCreator.snsDetail(notification.toMemberName, notification.relatedPostId)
          );
        }
        break;
      default:
        console.error('Unhandled notification type');
    }
  };

  return (
    <Box mt={5}>
      <Heading m={3} size={'sm'}>
        {t(heading)}
      </Heading>
      <Divider mt={3} mb={6} />

      {NotiData.map((notification) => (
        <Flex
          align="center"
          justify={'space-between'}
          my={2}
          p={2}
          bg="black"
          color="white"
          key={notification.id}
          onClick={() => {
            handleClick(notification);
          }}
        >
          {/* Left Profile Image */}
          <LeftImage notification={notification} />

          {/* Notification Text */}
          <MidContent notification={notification} />

          {/* Right Side Image */}
          <RightImage notification={notification} />
        </Flex>
      ))}
    </Box>
  );
};

export default NotificationData;
