import { t } from 'i18next';
import { Notification as NotiType } from '@/types/Notification';
import { NOTIFICATION_TYPE } from '@/utils/constValues';

export const filterNotifications = (notifications: NotiType[]) => {
  const now = new Date();

  const filteredNotifications: {
    today: NotiType[];
    yesterday: NotiType[];
    last_7_days: NotiType[];
    other: NotiType[];
  } = {
    today: [],
    yesterday: [],
    last_7_days: [],
    other: [],
  };

  notifications.forEach((notification) => {
    const createdAt = new Date(notification.createdAt);

    // Add default custom message to the notification
    const notificationWithMessage = {
      ...notification,
      customMessage: getCustomMessage(notification.notificationType),
      date: createdAt.toDateString(),
    };
    // Check if the notification is from today
    if (createdAt.toDateString() === now.toDateString()) {
      filteredNotifications.today.push(notificationWithMessage);

      // Check if the notification is from yesterday
    } else if (
      createdAt.toDateString() === new Date(new Date().setDate(now.getDate() - 1)).toDateString()
    ) {
      filteredNotifications.yesterday.push(notificationWithMessage);

      // Check if the notification is within the last 7 days, but not today or yesterday
    } else if (
      createdAt >= new Date(new Date().setDate(now.getDate() - 7)) &&
      createdAt < new Date(new Date().setDate(now.getDate() - 1))
    ) {
      filteredNotifications.last_7_days.push(notificationWithMessage);
    } else {
      filteredNotifications.other.push(notificationWithMessage);
    }
  });

  return filteredNotifications;
};

const getCustomMessage = (notificationType: NOTIFICATION_TYPE) => {
  switch (Number(notificationType)) {
    case NOTIFICATION_TYPE.RECEIVE_COMMENT:
      return t('がコメントしました。');

    case NOTIFICATION_TYPE.RECEIVE_BBT:
      return t('BBTの受け取りが完了しました。');

    case NOTIFICATION_TYPE.REGISTER_LURE:
      return t('ルアーの登録が完了しました。');

    case NOTIFICATION_TYPE.APPROVE_FISHING_RESULT:
      return t('釣果申請が完了しました。');

    case NOTIFICATION_TYPE.RECEIVE_TROPHY:
      return t('タイトルを付与しました。');

    case NOTIFICATION_TYPE.FOLLOWED:
      return t('があなたをフォローしました。');

    case NOTIFICATION_TYPE.LIKE:
      return t('があなたの投稿に「いいね！」しました。');
    default:
      return '';
  }
};
