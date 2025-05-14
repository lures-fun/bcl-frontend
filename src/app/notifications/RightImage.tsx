import { Image } from '@chakra-ui/react';
import { Notification } from '@/types/Notification';
import { NOTIFICATION_TYPE } from '@/utils/constValues';

type Props = {
  notification: Notification;
};

const RightImage = ({ notification }: Props) => {
  return (
    <>
      {(notification.notificationType === NOTIFICATION_TYPE.LIKE ||
        notification.notificationType === NOTIFICATION_TYPE.RECEIVE_COMMENT) && (
        <Image src={notification.image} alt="" borderRadius="md" boxSize="40px" ml={3} />
      )}
    </>
  );
};

export default RightImage;
