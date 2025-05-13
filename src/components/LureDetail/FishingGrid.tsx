import { Heading, Link, SimpleGrid } from '@chakra-ui/react';
import defaultImage from '@/assets/preview.png';
import { pathsCreator } from '@/utils/constValues';
import ThumbnailImage from '../uiParts/Image/ThumbnailImage';
import { useTranslation } from 'react-i18next';

type Props = {
  fishingList?: {
    id: string;
    title: string;
    imagePathForNft: string;
    userName: string;
  }[];
  isTitleHidden?: boolean;
};
export const FishingGrid = ({ fishingList, isTitleHidden = false }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      {!isTitleHidden && (
        <Heading as="h5" size="sm" color="white" pl={3}>
          {t('釣果NFT')}
        </Heading>
      )}
      <SimpleGrid columns={{ base: 3, sm: 3, md: 5 }}>
        {fishingList &&
          fishingList.map((fishing) => (
            <Link
              href={pathsCreator.fishingResultDetail(fishing.userName, fishing.id)}
              key={fishing.id}
            >
              {fishing.imagePathForNft !== null && (
                <ThumbnailImage
                  imagePreview={fishing.imagePathForNft}
                  handleError={(e) => (e.currentTarget.src = defaultImage.src)}
                />
              )}
            </Link>
          ))}
      </SimpleGrid>
    </>
  );
};
