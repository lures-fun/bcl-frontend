'use client';

import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  Tag,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import defaultImage from '@/assets/preview.png';
import { ApplyLegendaryDialog } from '@/components/Lure/ApplyLegendaryDialog';
import { LureLostDialog } from '@/components/Lure/LureLostDialog';
import { TotalSummury } from '@/components/LureDetail/TotalSummury';
import { TextWithSquare } from '@/components/uiParts/Text/TextWithSquare';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { LURE_COLOR, LURETYPES, paths, pathsCreator } from '@/utils/constValues';
import { FishingGrid } from '@/components/LureDetail/FishingGrid';
import { TitleCarousal } from '@/components/LureDetail/TitleCarousal';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import axiosInstance from '@/lib/axiosInstance';
import { Lure } from '@/types/Lure';
import { LureMintFishing } from '@/types/LureMintFishing';
import { LureMintTrophy } from '@/types/LureMintTrophy';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { REDIRECT_URL_COOKIE_KEY } from '@/utils/cookieUtil';

const LureDetail = () => {
  const { userData } = useFetchUserData();
  const { lureId } = useParams<{ lureId: string }>();
  const [lureDetail, setLureDetail] = useState<Lure>();
  const [fishingList, setFishingList] = useState<LureMintFishing>();
  const [titleList, setTitleList] = useState<LureMintTrophy>();
  const [fishingResultNftCount = 0, setFishingResultNftCount] = useState<number>();
  const [titleNftCount = 0, setTitleNftCount] = useState<number>();
  const [bigFishSize, setBigFishSize] = useState<number>();
  const [sameLureIds, setSameLureIds] = useState<string[]>();
  const [hasLures, setHasLures] = useState<boolean>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter(); // useRouterを使用

  const { showErrorToast } = useCustomToast();
  const { t } = useTranslation();
  Cookies.remove(REDIRECT_URL_COOKIE_KEY, { path: '/lures/purchase' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lureResponse = await axiosInstance.get<Lure>(`/lures/${lureId}`);
        setLureDetail(lureResponse.data);
        const fishingResponse = await axiosInstance.get<LureMintFishing>(
          `/lures/${lureId}/mint-fishing`
        );
        setFishingList(fishingResponse.data);
        const titleResponse = await axiosInstance.get<LureMintTrophy>(
          `/lures/${lureId}/mint-trophy`
        );
        setTitleList(titleResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [lureId]);

  useLayoutEffect(() => {
    const fetchData = async () => {
      if (lureDetail?.userName) {
        const sameLures = await axiosInstance.get<any>(
          `/lures/list/${lureDetail.userName}/${lureDetail.lureType}/${lureDetail.lureColor}`
        );
        setSameLureIds(sameLures.data.map((d: any) => d.id));
        setHasLures(!!sameLures.data.filter((d: any) => !d.isLost && !d.legendary).length);
        const fishingResultNftCountResponse = await axiosInstance.get<number>(
          `/lures/count-of/fishing-nft/${lureDetail.userName}/${lureDetail.lureType}/${lureDetail.lureColor}`
        );
        setFishingResultNftCount(fishingResultNftCountResponse.data);
        const titleNftCountResponse = await axiosInstance.get<number>(
          `/lures/count-of/title-nft/${lureDetail.userName}/${lureDetail.lureType}/${lureDetail.lureColor}`
        );
        setTitleNftCount(titleNftCountResponse.data);
        const bigFishSizeResponse = await axiosInstance.get<number>(
          `/lures/big-fish/${lureDetail.userName}/${lureDetail.lureType}/${lureDetail.lureColor}`
        );
        setBigFishSize(bigFishSizeResponse.data);
      }
    };
    fetchData();
  }, [lureDetail]);

  const nextLureId = useCallback((): string | undefined => {
    if (!sameLureIds || sameLureIds.length === 0) {
      return undefined;
    }

    const currentIndex = sameLureIds.findIndex((lureId: string) => lureId === lureDetail?.id);
    if (currentIndex + 1 === sameLureIds.length) {
      return undefined;
    }

    return sameLureIds[currentIndex + 1];
  }, [lureDetail?.id, sameLureIds]);

  const previousLureId = useCallback((): string | undefined => {
    if (!sameLureIds || sameLureIds.length === 0) {
      return undefined;
    }

    const currentIndex = sameLureIds.findIndex((lureId: string) => lureId === lureDetail?.id);
    if (currentIndex === 0) {
      return undefined;
    }

    return sameLureIds[currentIndex - 1];
  }, [lureDetail?.id, sameLureIds]);

  const handleOnClickArrow = useCallback(
    (lureId?: string) => {
      if (!lureId) {
        return;
      }

      router.push(pathsCreator.lureDetail(lureId));
    },
    [router]
  );

  const handleOnClickApplyLost = useCallback(async (lureId: string) => {
    try {
      await axiosInstance.patch(`/lures/lost/${lureId}`);
      const lureResponse = await axiosInstance.get<Lure>(`/lures/${lureId}`);
      setLureDetail(lureResponse.data);
    } catch (e) {
      console.error(e);
    } finally {
      window.location.reload();
    }
  }, []);

  const handleOnClickApplyLegendary = useCallback(
    (lureId: string) => {
      axiosInstance
        .patch(`/lures/hall-of-fame/${lureId}`)
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          showErrorToast('Failed to admit legendary lure!', error.message);
        });
    },
    [showErrorToast]
  );

  return (
    <>
      <Box bg="black">
        <HeaderMenu />
        <Flex color="white" fontSize="large" justifyContent="center" fontWeight="bold" pt="2">
          {lureDetail?.lureType === LURETYPES.W3_CRANKBAIT &&
            `W3 CRANKBAIT #${lureDetail.lureColor} TOTAL`}
          {lureDetail?.lureType === LURETYPES.DRAFTWAKER &&
            `DRAFT WAKER #${lureDetail.lureColor} TOTAL`}
          {lureDetail?.lureType === LURETYPES.LC_MTO15 &&
            lureDetail.lureColor === LURE_COLOR.LC_MTO15.MS_MOEBI_SHAD &&
            `LC MTO1.5（MSモエビシャッド） TOTAL`}
          {lureDetail?.lureType === LURETYPES.LC_MTO15 &&
            lureDetail.lureColor === LURE_COLOR.LC_MTO15.MS_KOHAKU_SHAD &&
            `LC MTO1.5（MSコハクシャッド） TOTAL`}
          {lureDetail?.lureType === LURETYPES.VOLBEAT70F &&
            lureDetail.lureColor === LURE_COLOR.VOLBEAT70F.MOEBI_CLAW &&
            `VOLBEAT70F（モエビクロー） TOTAL`}
          {lureDetail?.lureType === LURETYPES.VOLBEAT70S &&
            lureDetail.lureColor === LURE_COLOR.VOLBEAT70S.APPLE_RED_CLAW &&
            `VOLBEAT70S（アップルレッドクロー） TOTAL`}
          {lureDetail?.lureType === LURETYPES.DOT_SIX &&
            lureDetail.lureColor === LURE_COLOR.DOT_SIX.KOHAKU_CLAW &&
            `Dot SIX（コハククロー） TOTAL`}
          {lureDetail?.lureType === LURETYPES.DOT_SIX &&
            lureDetail.lureColor === LURE_COLOR.DOT_SIX.SAKURA_SHAD &&
            `Dot SIX（サクラシャッド） TOTAL`}
          {lureDetail?.lureType === LURETYPES.BOXER && `Boxer（ビーバーレイクシャッド） TOTAL`}
          {lureDetail?.lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
            lureDetail?.lureColor === LURE_COLOR.SUPER_JORDAN_68.BCL_SAKURA &&
            `Super Jordan 68（BCL SAKURA） TOTAL`}
          {lureDetail?.lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
            lureDetail?.lureColor === LURE_COLOR.SUPER_JORDAN_68.BCL_KIZAKURA &&
            `Super Jordan 68（BCL KIZAKURA） TOTAL`}
          {lureDetail?.lureType === LURETYPES.TAPPEI_BNSP && `TAPPEI BNSP TOTAL`}
          {lureDetail?.lureType === LURETYPES.SCREW_WAKATARO &&
            `スクリューワカ太郎 #${lureDetail.lureColor} TOTAL`}
          {lureDetail?.lureType === LURETYPES.BALAM_200 &&
            lureDetail?.lureColor === LURE_COLOR.BALAM_200.ONDORYA_CHART &&
            `BALAM200 (オンドリャーチャート) TOTAL`}
          {lureDetail?.lureType === LURETYPES.HYOUSOU_BAKA_ICHIDAI && `表層バカ一代Z TOTAL`}
          {lureDetail?.lureType === LURETYPES.RANKAKU_80 && `乱獲80 TOTAL`}
          {lureDetail?.lureType === LURETYPES.BALAM_300_YUKI && `BALAM300 幽鬼 TOTAL`}
          {lureDetail?.lureType === LURETYPES.VARIANT_255_YUKI && `VARIANT255 TOTAL`}
          {lureDetail?.lureType === LURETYPES.N_SHAD && `N-Shad TOTAL`}
          {/* 1行で表示しきれないルアーは改行する */}
          {lureDetail?.lureType === LURETYPES.COIKE &&
            lureDetail?.lureColor === LURE_COLOR.COIKE.SMOKER_BG_F && (
              <Box textAlign="center">
                <Text>Coike13mm</Text>
                <Text>（#288 スモーカーBG-F） TOTAL</Text>
              </Box>
            )}
          {lureDetail?.lureType === LURETYPES.COIKE &&
            lureDetail?.lureColor === LURE_COLOR.COIKE.CLEAR_ORANGE_PGG_F && (
              <Box textAlign="center">
                <Text>Coike13mm</Text>
                <Text>（#289 クリアーオレンジPGG-F） TOTAL</Text>
              </Box>
            )}
          {lureDetail?.lureType === LURETYPES.COIKE &&
            lureDetail?.lureColor === LURE_COLOR.COIKE.SPG &&
            `Coike13mm（#290 SPG） TOTAL`}
          {lureDetail?.lureType === LURETYPES.COIKE &&
            lureDetail?.lureColor === LURE_COLOR.COIKE.EDGE_SHRIMP && (
              <Box textAlign="center">
                <Text>Coike13mm</Text>
                <Text>（#291 エッジシュリンプ） TOTAL</Text>
              </Box>
            )}
          {lureDetail?.lureType === LURETYPES.MOSAIC_LURE && (
            <Text fontFamily="Helvetica" letterSpacing="0.2em" fontSize="desired-font-size">
              Mosaic Lure TOTAL
            </Text>
          )}
        </Flex>
        <TotalSummury
          fishingResultNftCount={fishingResultNftCount!}
          titleNftCount={titleNftCount!}
          bigFishSize={bigFishSize}
          lureType={lureDetail?.lureType}
        />
        <Divider />
        <Flex minHeight="100vh" flexDirection="column" px="3">
          {lureDetail && (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py="4"
                color="white"
              >
                <Box
                  fontSize="3xl"
                  px="2"
                  minWidth="32px"
                  onClick={() => handleOnClickArrow(previousLureId())}
                >
                  {previousLureId() && '<'}
                </Box>
                <Image
                  src={lureDetail.imagePath}
                  maxWidth="150px"
                  rounded="2xl"
                  onError={(e) => (e.currentTarget.src = defaultImage.src)}
                  onClick={onOpen}
                />
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                  <ModalContent width="85%" border="1px solid white" borderRadius="none">
                    <ModalCloseButton
                      top={3}
                      color="white"
                      borderRadius={5}
                      size="sm"
                      fontSize="sm"
                      style={{ border: '1px solid white' }}
                    />
                    <Image
                      src={lureDetail.imagePath}
                      width="100%"
                      onError={(e) => (e.currentTarget.src = defaultImage.src)}
                      alt="lure_image"
                    />
                  </ModalContent>
                </Modal>
                <Box
                  fontSize="3xl"
                  px="2"
                  minWidth="32px"
                  onClick={() => handleOnClickArrow(nextLureId())}
                >
                  {nextLureId() && '>'}
                </Box>
              </Box>
              <Flex width="100%" py="4" gap="2" color="white" fontSize="xs">
                <Flex direction="row" flexGrow="1" alignItems="center">
                  <Flex fontSize="xs" direction="column" flexGrow="1" px="16px" gap="2">
                    <TextWithSquare>
                      {lureDetail.lureType === LURETYPES.W3_CRANKBAIT &&
                        `W3 CRANKBAIT #${lureDetail.lureColor}`}
                      {lureDetail.lureType === LURETYPES.DRAFTWAKER &&
                        `DRAFT WAKER #${lureDetail.lureColor}`}
                      {lureDetail?.lureType === LURETYPES.LC_MTO15 &&
                        lureDetail?.lureColor === LURE_COLOR.LC_MTO15.MS_MOEBI_SHAD &&
                        `LC MTO1.5（MSモエビシャッド）`}
                      {lureDetail?.lureType === LURETYPES.LC_MTO15 &&
                        lureDetail?.lureColor === LURE_COLOR.LC_MTO15.MS_KOHAKU_SHAD &&
                        `LC MTO1.5（MSコハクシャッド）`}
                      {lureDetail?.lureType === LURETYPES.VOLBEAT70F &&
                        lureDetail.lureColor === LURE_COLOR.VOLBEAT70F.MOEBI_CLAW &&
                        `VOLBEAT70F（モエビクロー）`}
                      {lureDetail?.lureType === LURETYPES.VOLBEAT70S &&
                        lureDetail.lureColor === LURE_COLOR.VOLBEAT70S.APPLE_RED_CLAW &&
                        `VOLBEAT70S（アップルレッドクロー）`}
                      {lureDetail?.lureType === LURETYPES.DOT_SIX &&
                        lureDetail.lureColor === LURE_COLOR.DOT_SIX.KOHAKU_CLAW &&
                        `Dot SIX（コハククロー）`}
                      {lureDetail?.lureType === LURETYPES.DOT_SIX &&
                        lureDetail.lureColor === LURE_COLOR.DOT_SIX.SAKURA_SHAD &&
                        `Dot SIX（サクラシャッド）`}
                      {lureDetail?.lureType === LURETYPES.BOXER &&
                        `Boxer（ビーバーレイクシャッド）`}
                      {lureDetail?.lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
                        lureDetail?.lureColor === LURE_COLOR.SUPER_JORDAN_68.BCL_SAKURA &&
                        `Super Jordan 68（BCL SAKURA）`}
                      {lureDetail?.lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
                        lureDetail?.lureColor === LURE_COLOR.SUPER_JORDAN_68.BCL_KIZAKURA &&
                        `Super Jordan 68（BCL KIZAKURA）`}
                      {lureDetail?.lureType === LURETYPES.TAPPEI_BNSP && `TAPPEI BNSP`}
                      {lureDetail.lureType === LURETYPES.SCREW_WAKATARO &&
                        `スクリューワカ太郎 #${lureDetail.lureColor}`}
                      {lureDetail?.lureType === LURETYPES.BALAM_200 &&
                        lureDetail?.lureColor === LURE_COLOR.BALAM_200.ONDORYA_CHART &&
                        `BALAM200 (オンドリャーチャート)`}
                      {lureDetail?.lureType === LURETYPES.RANKAKU_80 && `乱獲80`}
                      {lureDetail.lureType === LURETYPES.HYOUSOU_BAKA_ICHIDAI && `表層バカ一代Z`}
                      {lureDetail?.lureType === LURETYPES.N_SHAD && `N-Shad`}
                      {lureDetail?.lureType === LURETYPES.BALAM_300_YUKI && `BALAM300 幽鬼`}
                      {lureDetail?.lureType === LURETYPES.VARIANT_255_YUKI && `VARIANT255`}
                      {lureDetail?.lureType === LURETYPES.COIKE &&
                        lureDetail?.lureColor === LURE_COLOR.COIKE.SMOKER_BG_F &&
                        `Coike13mm（#288 スモーカーBG-F）`}
                      {lureDetail?.lureType === LURETYPES.COIKE &&
                        lureDetail?.lureColor === LURE_COLOR.COIKE.CLEAR_ORANGE_PGG_F &&
                        `Coike13mm（#289 クリアーオレンジPGG-F）`}
                      {lureDetail?.lureType === LURETYPES.COIKE &&
                        lureDetail?.lureColor === LURE_COLOR.COIKE.SPG &&
                        `Coike13mm（#290 SPG）`}
                      {lureDetail?.lureType === LURETYPES.COIKE &&
                        lureDetail?.lureColor === LURE_COLOR.COIKE.EDGE_SHRIMP &&
                        `Coike13mm（#291 エッジシュリンプ）`}
                      {lureDetail?.lureType === LURETYPES.MOSAIC_LURE && `Mosaic Lure`}
                    </TextWithSquare>
                    {(lureDetail.lureType === LURETYPES.HYOUSOU_BAKA_ICHIDAI ||
                      lureDetail.lureType === LURETYPES.RANKAKU_80) && (
                      <TextWithSquare>コラボメーカー：さとう漁協</TextWithSquare>
                    )}
                    {lureDetail.lureType === LURETYPES.LC_MTO15 && (
                      <TextWithSquare>コラボメーカー：ラッキークラフト</TextWithSquare>
                    )}
                    {lureDetail.lureType === LURETYPES.HMKL_SUPER_JORDAN_68 && (
                      <TextWithSquare>コラボメーカー：HMKL</TextWithSquare>
                    )}
                    {lureDetail.lureType === LURETYPES.N_SHAD && (
                      <TextWithSquare>コラボメーカー：ロイヤルブルー</TextWithSquare>
                    )}
                    {lureDetail.lureType === LURETYPES.COIKE && (
                      <TextWithSquare>コラボメーカー：HIDE UP</TextWithSquare>
                    )}
                    <TextWithSquare>
                      {t('シリアルNO')} : {lureDetail.serialCode}{' '}
                    </TextWithSquare>
                    <TextWithSquare>
                      {t('取得日')} : {new Date(lureDetail.purchasedAt).toLocaleDateString('ja')}
                    </TextWithSquare>
                  </Flex>
                  <Grid
                    flexGrow="1"
                    columnGap="5"
                    rowGap="2"
                    gridTemplateAreas={`"button1 button2"
                    "text text"`}
                  >
                    {!lureDetail.isLost &&
                      lureDetail.userName === userData?.userName &&
                      !lureDetail.legendary &&
                      lureDetail?.lureType !== LURETYPES.TAPPEI_BNSP &&
                      lureDetail?.lureType !== LURETYPES.N_SHAD &&
                      lureDetail?.lureType !== LURETYPES.COIKE &&
                      lureDetail?.lureType !== LURETYPES.MOSAIC_LURE && (
                        <GridItem area="button1">
                          <LureLostDialog
                            handleClick={async () => handleOnClickApplyLost(lureDetail.id)}
                          />
                        </GridItem>
                      )}
                    {!!lureDetail.legendary && (
                      <GridItem area="button1">
                        <Button
                          width="full"
                          fontSize="xs"
                          height="6"
                          backgroundColor="yellow.400"
                          color="white"
                        >
                          {t('殿堂入り')}
                        </Button>
                      </GridItem>
                    )}
                    {!lureDetail.isLost &&
                      !lureDetail.legendary &&
                      lureDetail.userName === userData?.userName &&
                      lureDetail?.lureType !== LURETYPES.TAPPEI_BNSP &&
                      lureDetail?.lureType !== LURETYPES.N_SHAD &&
                      lureDetail?.lureType !== LURETYPES.COIKE &&
                      lureDetail?.lureType !== LURETYPES.MOSAIC_LURE && (
                        <GridItem area="button2">
                          <ApplyLegendaryDialog
                            handleClick={async () => handleOnClickApplyLegendary(lureDetail.id)}
                          />
                        </GridItem>
                      )}
                    {!!lureDetail.isLost && (
                      <GridItem area="button1">
                        <Tag
                          fontSize="sm"
                          height="6"
                          backgroundColor="#FF2860"
                          color="white"
                          fontWeight="bold"
                        >
                          &nbsp;&nbsp;LOST&nbsp;&nbsp;
                        </Tag>
                      </GridItem>
                    )}
                    {!hasLures && lureDetail.userName === userData?.userName && (
                      <GridItem area="button2">
                        <Button
                          width="full"
                          fontSize="xs"
                          height="6"
                          backgroundColor="gray"
                          color="white"
                          onClick={() => router.push(paths.lureCreate)}
                        >
                          {t('新規登録')}
                        </Button>
                      </GridItem>
                    )}
                    <GridItem area="text">
                      <Flex justifyContent="space-around" gap="1">
                        <Box>
                          <Box
                            color="brand.bclBlue"
                            fontWeight="bold"
                            fontSize="2xl"
                            textAlign="center"
                          >
                            {lureDetail?.lureType === LURETYPES.MOSAIC_LURE
                              ? '?'
                              : fishingList?.summary}
                          </Box>
                          <Box>{t('釣果NFT')}</Box>
                        </Box>
                        <Divider orientation="vertical" height="auto" />
                        <Box>
                          <Box
                            color="brand.bclBlue"
                            fontWeight="bold"
                            fontSize="2xl"
                            textAlign="center"
                          >
                            {lureDetail?.lureType === LURETYPES.MOSAIC_LURE
                              ? '?'
                              : titleList?.summary}
                          </Box>
                          <Box>{t('タイトルNFT')}</Box>
                        </Box>
                        <Divider orientation="vertical" height="auto" />
                        <Flex direction="column">
                          <Box
                            color="brand.bclBlue"
                            fontWeight="bold"
                            flexGrow="1"
                            textAlign="center"
                          >
                            <Text as="span" fontSize="2xl">
                              {lureDetail?.lureType === LURETYPES.MOSAIC_LURE
                                ? '?'
                                : lureDetail?.bigfish || 0}
                            </Text>
                            {lureDetail?.lureType !== LURETYPES.MOSAIC_LURE && 'cm'}
                          </Box>
                          <Box bottom={0}>Big Fish</Box>
                        </Flex>
                      </Flex>
                    </GridItem>
                  </Grid>
                </Flex>
              </Flex>
            </>
          )}
          <TitleCarousal
            titleList={titleList?.results?.map((t) => ({
              trophyId: t.trophyId,
              trophyTitle: t.trophyTitle,
              trophyImage: t.trophyImagePath,
            }))}
          />
          <FishingGrid fishingList={fishingList?.results} />
        </Flex>
        <Footer />
      </Box>
    </>
  );
};

export default LureDetail;
