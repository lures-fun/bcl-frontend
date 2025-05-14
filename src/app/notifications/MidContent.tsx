import { Box, Text } from '@chakra-ui/react';
import { t } from 'i18next';
import { Notification } from '@/types/Notification';
import { NOTIFICATION_TYPE } from '@/utils/constValues';

type Props = {
  notification: Notification;
};
const MidContent = ({ notification }: Props) => {
  return (
    <Box textAlign={'left'} noOfLines={2} flex={1}>
      {notification.notificationType === NOTIFICATION_TYPE.RECEIVE_BBT ? (
        notification.fromMemberId ? (
          //  use to user BBT type
          <>
            <Text fontWeight="bold" mr={1} fontSize={'sm'} as={'span'}>
              {notification?.fromMemberName ?? ''}
            </Text>
            <Text fontSize={'sm'} as={'span'}>
              {t('からBBTを受けた') ?? ''}
              {notification.tokenQuantity}
            </Text>
          </>
        ) : (
          // from system BBT type
          <Text fontSize={'sm'} as={'span'}>
            {notification.tokenQuantity} {notification?.customMessage ?? ''}
          </Text>
        )
      ) : (
        // other types
        <Text fontSize={'sm'} as={'span'}>
          {notification.fromMemberName && (
            <Text fontWeight="bold" fontSize={'sm'} as={'span'}>
              {notification?.fromMemberName ?? ''}
            </Text>
          )}
          {` ${notification.customMessage ?? ''}${
            notification.comment ? `:「${notification.comment}」。` : ''
          }`}
        </Text>
      )}
    </Box>
  );
};

export default MidContent;
