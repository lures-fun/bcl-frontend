import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import { LURETYPES } from '@/utils/constValues';
import { useTranslation } from 'react-i18next';

type Props = {
  fishingResultNftCount: number;
  titleNftCount: number;
  bigFishSize?: number;
  lureType?: LURETYPES;
};

export const TotalSummury = ({
  fishingResultNftCount,
  titleNftCount,
  bigFishSize,
  lureType,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Flex flexDirection="row" justifyContent="space-around" color="white" py="4" px="12">
      <Box>
        <Box color="brand.bclBlue" fontWeight="bold" fontSize="2xl" textAlign="center">
          {lureType === LURETYPES.MOSAIC_LURE ? '?' : fishingResultNftCount}
        </Box>
        <Box fontSize="xs">{t('釣果NFT')}</Box>
      </Box>
      <Divider orientation="vertical" height="auto" />
      <Box>
        <Box color="brand.bclBlue" fontWeight="bold" fontSize="2xl" textAlign="center">
          {lureType === LURETYPES.MOSAIC_LURE ? '?' : titleNftCount}
        </Box>
        <Box fontSize="xs">{t('タイトルNFT')}</Box>
      </Box>
      <Divider orientation="vertical" height="auto" />
      <Flex direction="column">
        <Box color="brand.bclBlue" fontWeight="bold" flexGrow="1">
          <Text as="span" fontSize="2xl" textAlign="center">
            {lureType === LURETYPES.MOSAIC_LURE ? <Text>?</Text> : bigFishSize || 0}
          </Text>
          {lureType === LURETYPES.MOSAIC_LURE ? null : 'cm'}
        </Box>
        <Box fontSize="xs" bottom={0}>
          Big Fish
        </Box>
      </Flex>
    </Flex>
  );
};
