'use client';

import { SimpleGrid } from '@chakra-ui/react';
import SearchTimelineItem from '@/components/SearchTimeline/SearchTimelineItem';

type Props = {
  searchTimelines: {
    id: string;
    imagePath: string;
    userName: string;
  }[];
  type: string;
};

export const SearchTimelineList = ({ searchTimelines, type }: Props) => {
  return (
    <SimpleGrid columns={{ base: 3, md: 5 }}>
      {searchTimelines.map((timeline) => (
        <SearchTimelineItem
          key={timeline.id}
          type={type}
          id={timeline.id}
          userName={timeline.userName}
          image={timeline.imagePath}
        />
      ))}
    </SimpleGrid>
  );
};
