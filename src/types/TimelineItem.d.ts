import { TIMELINE_TYPES } from '@/utils/constValues';

export type TimelineItem = {
  id: string;
  userName: string;
  profileIcon: string;
  title: string;
  comment: string;
  imagePath1: string;
  imagePath2: string;
  imagePath3: string;
  timelineImagePath1: string;
  timelineImagePath2: string;
  timelineImagePath3: string;
  type: TIMELINE_TYPES;
  goodCount: string;
  tokenSummary: string;
  isGood: boolean;
  commentCount: number;
  createdAt: string;
  memberId: string;
};
