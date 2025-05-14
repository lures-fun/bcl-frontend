'use client';

import { Flex, Text } from '@chakra-ui/react';
import { SearchTimelineList } from '@/components/SearchTimeline/SearchTimelineList';
import { SearchUserList } from '@/components/SearchUser/SearchList';
import { SEARCH_TYPES } from '@/utils/constValues';

type Props = {
  type: string;
  data: any[];
};
const SearchData = ({ type, data }: Props) => {
  return (
    <Flex flexDirection="column" textColor="white">
      {data.length === 0 && (
        <Text textAlign={'center'} py={5}>
          No data here!
        </Text>
      )}
      {type === SEARCH_TYPES.users && <SearchUserList searchUsers={data} />}
      {(type === SEARCH_TYPES.fishing_results || type === SEARCH_TYPES.dao_talks) && (
        <SearchTimelineList type={type} searchTimelines={data} />
      )}
    </Flex>
  );
};

export default SearchData;
