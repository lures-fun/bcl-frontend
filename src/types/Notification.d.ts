import { NOTIFICATION_STATUS, NOTIFICATION_TYPE, TIMELINE_TYPES } from '@/utils/constValues';

export type Notification = {
  id: string;
  parentId: string;
  commentType: TIMELINE_TYPES;
  goodType: GOOD_TYPES;
  relatedPostId: string;
  notificationType: NOTIFICATION_TYPE;
  toMemberId: string; // id
  toMemberName: string;
  fromMemberId: string; // id
  fromMemberName: string;
  fromMemberProfileIcon: string;
  comment: string;
  image: string; //  (post right image)||(trophy/title/lure left image),
  status?: NOTIFICATION_STATUS;
  tokenQuantity: number;
  lastReadAt: boolean;
  updatedAt: string;
  createdAt: string;
  customMessage: string;
};
