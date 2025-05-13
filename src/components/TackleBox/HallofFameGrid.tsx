'use client';

import { Flex, SimpleGrid, Image, Text, Box } from '@chakra-ui/react';
import { HallOfFame } from '@/types/Lure.hof';
import { LURE_COLOR, LURETYPES, pathsCreator } from '@/utils/constValues';
import previewImage from '@/assets/preview.png';
import hallOfFameBackground from '@/assets/BG0.png';
import { useRouter } from 'next/navigation';

type Props = {
  item: HallOfFame[];
};

const HallOfFameGrid = ({ item }: Props) => {
  const router = useRouter();
  const filteredTackleBox = item.filter((item, i, self) => {
    return i === self.findIndex((o) => o.lureType === item.lureType && o.color === item.color);
  });
  return (
    <Box
      overflow={'auto'}
      py={item.length > 0 ? 5 : 10}
      px={3}
      bgImage={hallOfFameBackground.src}
      bgSize={'cover'}
      backgroundRepeat={'no-repeat'}
      color={'black'}
      rounded={'lg'}
      width={'100%'}
      height={'100vh'}
    >
      <SimpleGrid columnGap={3} rowGap={5} columns={{ base: 3, md: 5, lg: 7 }}>
        {filteredTackleBox.map((lure, index) => (
          <Flex
            key={index}
            color={'white'}
            gap={2}
            alignItems={'center'}
            flexDirection={'column'}
            onClick={() => lure.id && router.push(pathsCreator.lureDetail(lure.id))}
            fontSize={'9px'}
          >
            <Image
              src={lure.imagePathForNft ? lure.imagePathForNft : previewImage.src}
              objectFit={'cover'}
              width={{ base: '80px', sm: '100px', md: '120px', lg: '150px' }}
              height={{ base: '80px', sm: '100px', md: '120px', lg: '150px' }}
              rounded={'lg'}
            />
            {(lure.lureType === LURETYPES.W3_CRANKBAIT ||
              lure.lureType === LURETYPES.DRAFTWAKER) && (
              <Flex alignItems={'center'} flexDirection={'column'}>
                <Text>
                  {lure.lureType === LURETYPES.W3_CRANKBAIT ? 'W3 CRANKBAIT' : 'DRAFT WAKER'}
                </Text>
                <Text>#{lure.color}</Text>
              </Flex>
            )}

            {lure?.lureType === LURETYPES.LC_MTO15 &&
              lure?.color === LURE_COLOR.LC_MTO15.MS_MOEBI_SHAD &&
              `LC MTO1.5（MSモエビシャッド）`}
            {lure?.lureType === LURETYPES.LC_MTO15 &&
              lure?.color === LURE_COLOR.LC_MTO15.MS_KOHAKU_SHAD &&
              `LC MTO1.5（MSコハクシャッド）`}
            {lure?.lureType === LURETYPES.VOLBEAT70F &&
              lure?.color === LURE_COLOR.VOLBEAT70F.MOEBI_CLAW &&
              `VOLBEAT70F（モエビクロー）`}
            {lure?.lureType === LURETYPES.VOLBEAT70S &&
              lure?.color === LURE_COLOR.VOLBEAT70S.APPLE_RED_CLAW &&
              `VOLBEAT70S（アップルレッドクロー）`}
            {lure?.lureType === LURETYPES.DOT_SIX &&
              lure?.color === LURE_COLOR.DOT_SIX.KOHAKU_CLAW &&
              `Dot SIX（コハククロー）`}
            {lure?.lureType === LURETYPES.DOT_SIX &&
              lure?.color === LURE_COLOR.DOT_SIX.SAKURA_SHAD &&
              `Dot SIX（サクラシャッド）`}
            {lure?.lureType === LURETYPES.BOXER && `Boxer（ビーバーレイクシャッド）`}
            {lure?.lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
              lure?.color === LURE_COLOR.SUPER_JORDAN_68.BCL_SAKURA &&
              `Super Jordan 68（BCL SAKURA）`}
            {lure?.lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
              lure?.color === LURE_COLOR.SUPER_JORDAN_68.BCL_KIZAKURA &&
              `Super Jordan 68（BCL KIZAKURA）`}
            {lure?.lureType === LURETYPES.N_SHAD && `N-Shad`}
            {lure?.lureType === LURETYPES.TAPPEI_BNSP && `TAPPEI BNSP`}
            {lure?.lureType === LURETYPES.SCREW_WAKATARO && `スクリューワカ太郎 TOTAL`}
            {lure?.lureType === LURETYPES.RANKAKU_80 && `乱獲80`}
            {lure?.lureType === LURETYPES.HYOUSOU_BAKA_ICHIDAI && `表層バカ一代Z`}
            {lure?.lureType === LURETYPES.BALAM_300_YUKI && `BALAM300 幽鬼`}
            {lure?.lureType === LURETYPES.VARIANT_255_YUKI && `VARIANT255`}
            {lure?.lureType === LURETYPES.COIKE &&
              lure?.color === LURE_COLOR.COIKE.SMOKER_BG_F &&
              `Coike13mm（#288 スモーカーBG-F）`}
            {lure?.lureType === LURETYPES.COIKE &&
              lure?.color === LURE_COLOR.COIKE.CLEAR_ORANGE_PGG_F &&
              `Coike13mm（#289 クリアーオレンジPGG-F）`}
            {lure?.lureType === LURETYPES.COIKE &&
              lure?.color === LURE_COLOR.COIKE.SPG &&
              `Coike13mm（#290 SPG）`}
            {lure?.lureType === LURETYPES.COIKE &&
              lure?.color === LURE_COLOR.COIKE.EDGE_SHRIMP &&
              `Coike13mm（#291 エッジシュリンプ）`}
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default HallOfFameGrid;
