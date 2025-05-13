import { List } from '@chakra-ui/react';
import { TimelineItem as TimelineItemType } from '@/types/TimelineItem';
import { TimelineItem } from '@/components/Timeline/TimelineItem';

type Props = {
  timelineItems: TimelineItemType[];
  onTimelineClick?: () => void;
};

export const TimelineList = ({ timelineItems, onTimelineClick }: Props) => {
  return (
    <List spacing="10">
      {timelineItems.map((item) => (
        <TimelineItem
          timelineType={item.type}
          key={item.id}
          id={item.id}
          isGood={item.isGood}
          goodCount={item.goodCount}
          profileImage={item.profileIcon}
          images={[item.timelineImagePath1, item.timelineImagePath2, item.timelineImagePath3]}
          title={item.title}
          description={item.comment}
          username={item.userName}
          comment={item.comment}
          commentCount={item.commentCount}
          createdAt={item.createdAt}
          memberId={item.memberId}
          onTimelineClick={onTimelineClick || (() => {})}
        ></TimelineItem>
      ))}
    </List>
  );
};
