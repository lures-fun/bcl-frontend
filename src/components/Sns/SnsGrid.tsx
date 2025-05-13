import { Heading, Link, SimpleGrid } from '@chakra-ui/react';
import defaultImage from '@/assets/preview.png';
import { pathsCreator } from '@/utils/constValues';
import ThumbnailImage from '@/components/uiParts/Image/ThumbnailImage';

type Props = {
  snsPosts?: {
    id: string;
    image: string;
    userName: string;
  }[];
  isTitleHidden?: boolean;
  titleColor?: string;
};
export const SnsGrid = ({ snsPosts, isTitleHidden = false, titleColor }: Props) => {
  return (
    <>
      {!isTitleHidden && (
        <Heading as="h5" size="sm" color={titleColor || 'white'}>
          釣果NFT
        </Heading>
      )}
      <SimpleGrid columns={{ base: 3, sm: 3, md: 5 }}>
        {snsPosts &&
          snsPosts.map((post) => (
            <Link href={`${pathsCreator.snsDetail(post.userName, post.id)}`} key={post.id}>
              {post.image !== null && (
                <ThumbnailImage
                  imagePreview={post.image}
                  handleError={(e) => (e.currentTarget.src = defaultImage.src)}
                />
              )}
            </Link>
          ))}
      </SimpleGrid>
    </>
  );
};
