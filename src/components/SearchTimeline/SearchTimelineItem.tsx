'use client';

import { SEARCH_TYPES, pathsCreator } from '@/utils/constValues';
import TimeLineThumbnail from '@/components/uiParts/Image/TimeLineThumbnail';
import { useRouter } from 'next/navigation';

type Props = {
  id: string;
  image: string;
  userName: string;
  type: string;
};

const SearchTimelineItem = ({ id, image, userName, type }: Props) => {
  const router = useRouter();
  const goDetail = () => {
    if (type === SEARCH_TYPES.fishing_results) {
      router.push(pathsCreator.fishingResultDetail(userName, id));
    } else if (type === SEARCH_TYPES.dao_talks) {
      router.push(pathsCreator.snsDetail(userName, id));
    }
  };
  return <TimeLineThumbnail imagePreview={image} handleClick={() => goDetail()} />;
};

export default SearchTimelineItem;
