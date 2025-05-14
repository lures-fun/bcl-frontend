'use client';

import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import defaultImage from '@/assets/preview.png';
import { useParams } from 'next/navigation';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { TextWithSquare } from '@/components/uiParts/Text/TextWithSquare';
import axiosInstance from '@/lib/axiosInstance';
import { Trophy } from '@/types/Trophy';
import { formatDate } from '@/utils/dateUtil';
import { FISHTYPES, LURETYPES } from '@/utils/constValues';
import { useFetchMasterData } from '@/hooks/useFetchMasterData';
import { LineMaster, ReelMaster, RodMaster } from '@/types/Master';
import { Footer } from '@/components/uiParts/Footer/Footer';

const TrophyDetail = () => {
  const [trophy, setTrophy] = useState<Trophy>();

  const params = useParams();
  const trophyId = params.trophyId as string;

  const { masterData: reelMaster } = useFetchMasterData<ReelMaster>('reels');
  const { masterData: lineMaster } = useFetchMasterData<LineMaster>('lines');
  const { masterData: rodMaster } = useFetchMasterData<RodMaster>('rods');

  useEffect(() => {
    const fetchTrophy = async () => {
      try {
        const response = await axiosInstance.get<Trophy>(`/trophies/${trophyId}`);
        setTrophy(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrophy();
  }, [trophyId]);

  return (
    <Box bg="black">
      <HeaderMenu />
      <Flex minHeight="100vh" flexDirection="column" textColor="white" py="5" px="3" gap="5">
        {trophy ? (
          <>
            <Image
              src={trophy.imagePath}
              objectFit="cover"
              mx="auto"
              rounded="40px"
              maxH="50vh"
              onError={(e) => {
                e.currentTarget.src = defaultImage.src;
              }}
            />
            <Box>
              <TextWithSquare>タイトル</TextWithSquare>
              <Text lineHeight={'8'}>{trophy.title}</Text>
              <TextWithSquare>コメント</TextWithSquare>
              {trophy.caughtAt && (
                <Text lineHeight={'8'}>日時 : {formatDate(trophy.caughtAt)}</Text>
              )}
              {trophy.freeTextLure ? (
                <Text lineHeight={'8'}>ルアー : {trophy.freeTextLure}</Text>
              ) : (
                trophy.lureType &&
                trophy.color && (
                  <Text lineHeight={'8'}>
                    ルアー :{' '}
                    {(trophy.lureType === LURETYPES.W3_CRANKBAIT && 'W3 CRANKBAIT') ||
                      (trophy.lureType === LURETYPES.DRAFTWAKER && 'DRAFT WAKER') ||
                      (trophy.lureType === LURETYPES.HYOUSOU_BAKA_ICHIDAI && '表層バカ一代') ||
                      (trophy.lureType === LURETYPES.RANKAKU_80 && '乱獲80') ||
                      (trophy.lureType === LURETYPES.BALAM_300_YUKI && 'BALAM300 幽鬼') ||
                      (trophy.lureType === LURETYPES.BALAM_200 && 'BALAM200') ||
                      (trophy.lureType === LURETYPES.VARIANT_255_YUKI && 'VARIANT255 幽鬼') ||
                      (trophy.lureType === LURETYPES.TAPPEI_BNSP && 'TAPPEI BNSP') ||
                      (trophy.lureType === LURETYPES.LC_MTO15 && 'LC MTO1.5')}{' '}
                    #{trophy.color}
                  </Text>
                )
              )}
              {trophy.rod && (
                <Text lineHeight={'8'}>
                  ロッド : {rodMaster && rodMaster.find((r) => r.id === trophy.rod)?.name}
                </Text>
              )}
              {trophy.reel && (
                <Text lineHeight={'8'}>
                  リール : {reelMaster && reelMaster.find((r) => r.id === trophy.reel)?.name}
                </Text>
              )}
              {trophy.line && (
                <Text lineHeight={'8'}>
                  ライン : {lineMaster && lineMaster.find((l) => l.id === trophy.line)?.name}
                </Text>
              )}
              {trophy.fishType && (
                <Text lineHeight={'8'}>
                  釣果 : {FISHTYPES.find((f) => f.id === trophy.fishType)?.display}
                  <Text as="span" pl="5">
                    {trophy.size}cm
                  </Text>
                </Text>
              )}
            </Box>
            <Box>
              <Text whiteSpace="pre-line" lineHeight={'8'}>
                {trophy.content}
              </Text>
            </Box>
          </>
        ) : (
          <Text color="white" as="h3" textAlign="center">
            タイトルが見つかりませんでした
          </Text>
        )}
      </Flex>
      <Footer />
    </Box>
  );
};

export default TrophyDetail;
