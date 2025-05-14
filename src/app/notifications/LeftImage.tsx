import { Box, Image } from '@chakra-ui/react';
import { Notification } from '@/types/Notification';
import { NOTIFICATION_TYPE } from '@/utils/constValues';
import defaultImage from '@/assets/noti_bbt_token_default_image.png';

type Props = {
  notification: Notification;
};
const LeftImage = ({ notification }: Props) => {
  return (
    <Box>
      {notification.notificationType === NOTIFICATION_TYPE.RECEIVE_BBT ? (
        notification.fromMemberId ? (
          //  use to user BBT type
          <Image
            src={notification.fromMemberProfileIcon}
            alt="Default Profile"
            borderRadius="full"
            boxSize="40px"
            mr={3}
          />
        ) : (
          // from system BBT type
          <Image
            src={defaultImage.src}
            alt="Default Profile"
            borderRadius="full"
            boxSize="40px"
            mr={3}
          />
        )
      ) : (
        // other types
        <Image
          src={
            notification.notificationType === NOTIFICATION_TYPE.LIKE ||
            notification.notificationType === NOTIFICATION_TYPE.RECEIVE_COMMENT ||
            notification.notificationType === NOTIFICATION_TYPE.FOLLOWED
              ? notification?.fromMemberProfileIcon
              : notification?.image
          }
          alt="User Profile"
          borderRadius="full"
          boxSize="40px"
          mr={3}
        />
      )}
    </Box>
  );
};

export default LeftImage;
