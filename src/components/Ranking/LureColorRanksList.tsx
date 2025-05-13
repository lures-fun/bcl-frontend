import { Flex, Img, Text } from '@chakra-ui/react';
import { LURETYPES, displayLureNames } from '@/utils/constValues';
import { useTranslation } from 'react-i18next';

type RankList = {
  image: string;
  type: string;
  color: string;
  biggestCount?: number;
  fishingCount: number;
};

const LureColorRanksList = ({ image, type, color, biggestCount, fishingCount }: RankList) => {
  const { t } = useTranslation();
  const getLureName = () => {
    try {
      if (type === LURETYPES.W3_CRANKBAIT) return 'W3 クランクベイト'; // TODO: ここだけ名前が独自的な仕様だった
      return displayLureNames(type, color);
    } catch (e) {
      return undefined;
    }
  };
  const getColorName = () => {
    switch (type) {
      case LURETYPES.W3_CRANKBAIT:
        return `#${color}`;
      case LURETYPES.DRAFTWAKER:
        return `#${color}`;
      default:
        return undefined;
    }
  };

  return (
    <Flex flexDirection={'column'} alignItems="center" fontSize="9px">
      <Img
        src={image}
        boxSize={{
          base: '110px',
          sm: '100px',
          md: '110px',
          lg: '150px',
        }}
        borderRadius="10px"
      />
      {getLureName() && <Text>{getLureName()}</Text>}
      {getColorName() && <Text>{getColorName()}</Text>}
      <Text fontSize="xl" fontWeight="bold" color={biggestCount === fishingCount ? 'red' : 'null'}>
        {fishingCount}
        <span style={{ fontSize: '12px' }}>{t('匹')}</span>
      </Text>
    </Flex>
  );
};

export default LureColorRanksList;
