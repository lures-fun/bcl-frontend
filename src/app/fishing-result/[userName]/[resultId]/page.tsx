'use client';

import { Box, Divider, Flex, IconButton, Image, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import defaultImage from '@/assets/preview.png';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { TextWithSquare } from '@/components/uiParts/Text/TextWithSquare';
import { useFetchMasterData } from '@/hooks/useFetchMasterData';
import axiosInstance from '@/lib/axiosInstance';
import { useTranslation } from 'react-i18next';
import likedAfterIcon from '@/assets/icon/like_after_icon.svg';
import likedBeforeIcon from '@/assets/icon/like_before_icon.svg';
import UrlImage from '@/components/uiParts/Image/UrlImage';
import { useCustomToast } from '@/hooks/useCustomToast';
import { FishingResultDetail as FishingResultDetailType } from '@/types/FishingResultDetail';
import { Good } from '@/types/Good';
import { FieldMaster, LineMaster, ReelMaster, RodMaster } from '@/types/Master';
import {
  APPLY_TYPE,
  FISHTYPES,
  LANGUAGE,
  LURETYPES,
  LURE_COLOR,
  PREFECTURES,
  pathsCreator,
} from '@/utils/constValues';
import { formatDate } from '@/utils/dateUtil';
import { useParams, useRouter } from 'next/navigation';

type translatedTexts = {
  title: string;
  comment: string;
};

const defaultImageUrl = defaultImage.src;

const FishingResultDetail = () => {
  const { showErrorToast } = useCustomToast();
  const router = useRouter();
  const { t } = useTranslation();
  const [fishingResult, setFishingResult] = useState<FishingResultDetailType>();
  const [goodState, setGoodState] = useState<Good>({ count: 0, isGood: false });
  const params = useParams();
  const userName = String(params.userName || '');
  const resultId = String(params.resultId || '');
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [translatedTexts, setTranslatedTexts] = useState<translatedTexts>();

  const { masterData: fieldMaster } = useFetchMasterData<FieldMaster>('fields');
  const { masterData: reelMaster } = useFetchMasterData<ReelMaster>('reels');
  const { masterData: lineMaster } = useFetchMasterData<LineMaster>('lines');
  const { masterData: rodMaster } = useFetchMasterData<RodMaster>('rods');

  const getField = useCallback(
    (field_id: string) => {
      const field = fieldMaster?.find((f) => f.id === field_id);
      if (!field) return '';
      const prefecture = PREFECTURES.find((p) => p.value === field.prefectureId);
      return `${prefecture?.name} ${field.name}`;
    },
    [fieldMaster]
  );

  const likeFishingResult = useCallback(async () => {
    try {
      if (!goodState.isGood) await axiosInstance.post(`/good/${resultId}`);
      else await axiosInstance.delete(`/good/${resultId}`);
      setGoodState((prevState) => ({
        isGood: !prevState.isGood,
        count: !prevState.isGood ? prevState.count + 1 : prevState.count - 1,
      }));
    } catch {
      showErrorToast(
        t('失敗しました。'),
        !goodState.isGood
          ? t('いいねすることはできません。')
          : t('いいねを解除することはできません。')
      );
    }
  }, [goodState.isGood, resultId, showErrorToast, t]);

  useEffect(() => {
    const fetchFishingResult = async () => {
      try {
        const [fishingResultDetailResponse, likeResponse] = await Promise.all([
          axiosInstance.get<FishingResultDetailType>(`/fishing-results/${userName}/${resultId}`),
          axiosInstance.get<Good>(`/good/${resultId}`),
        ]);
        setFishingResult(fishingResultDetailResponse.data);
        setGoodState(likeResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFishingResult();
  }, [resultId, userName]);

  const handleLureLabel = (
    lureType: FishingResultDetailType['lure']['lureType'],
    lureColor: FishingResultDetailType['lure']['color']
  ) => {
    return (
      (lureType === LURETYPES.W3_CRANKBAIT && `W3 CRANKBAIT #${lureColor}`) ||
      (lureType === LURETYPES.DRAFTWAKER && `DRAFT WAKER #${lureColor}`) ||
      (lureType === LURETYPES.LC_MTO15 &&
        lureColor === LURE_COLOR.LC_MTO15.MS_MOEBI_SHAD &&
        `LC MTO1.5（MSモエビシャッド）`) ||
      (lureType === LURETYPES.LC_MTO15 &&
        lureColor === LURE_COLOR.LC_MTO15.MS_KOHAKU_SHAD &&
        `LC MTO1.5（MSコハクシャッド）`) ||
      (lureType === LURETYPES.VOLBEAT70F &&
        lureColor === LURE_COLOR.VOLBEAT70S.APPLE_RED_CLAW &&
        `VOLBEAT70S（アップルレッドクロー）`) ||
      (lureType === LURETYPES.VOLBEAT70S &&
        lureColor === LURE_COLOR.VOLBEAT70F.MOEBI_CLAW &&
        `VOLBEAT70F（モエビクロー）`) ||
      (lureType === LURETYPES.DOT_SIX &&
        lureColor === LURE_COLOR.DOT_SIX.KOHAKU_CLAW &&
        `Dot SIX（コハククロー）`) ||
      (lureType === LURETYPES.DOT_SIX &&
        lureColor === LURE_COLOR.DOT_SIX.SAKURA_SHAD &&
        `Dot SIX（サクラシャッド）`) ||
      (lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
        lureColor === LURE_COLOR.SUPER_JORDAN_68.BCL_SAKURA &&
        `Super Jordan 68（BCL SAKURA）`) ||
      (lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
        lureColor === LURE_COLOR.SUPER_JORDAN_68.BCL_KIZAKURA &&
        `Super Jordan 68（BCL KIZAKURA）`) ||
      (lureType === LURETYPES.BALAM_200 &&
        lureColor === LURE_COLOR.BALAM_200.ONDORYA_CHART &&
        `BALAM200 (オンドリャーチャート)`) ||
      (lureType === LURETYPES.TAPPEI_BNSP && `TAPPEI BNSP`) ||
      (lureType === LURETYPES.SCREW_WAKATARO && `スクリューワカ太郎`) ||
      (lureType === LURETYPES.RANKAKU_80 && `乱獲80`) ||
      (lureType === LURETYPES.HYOUSOU_BAKA_ICHIDAI && `表層バカ一代`) ||
      (lureType === LURETYPES.N_SHAD && `N-Shad`) ||
      (lureType === LURETYPES.BALAM_300_YUKI && `BALAM300 幽鬼`) ||
      (lureType === LURETYPES.VARIANT_255_YUKI && `VARIANT255 幽鬼`) ||
      (lureType === LURETYPES.COIKE &&
        lureColor === LURE_COLOR.COIKE.SMOKER_BG_F &&
        `#288 Coike13mm（スモーカーBG-F）`) ||
      (lureType === LURETYPES.COIKE &&
        lureColor === LURE_COLOR.COIKE.CLEAR_ORANGE_PGG_F &&
        `#289 Coike13mm（クリアーオレンジPGG-F）`) ||
      (lureType === LURETYPES.COIKE &&
        lureColor === LURE_COLOR.COIKE.SPG &&
        `#290 Coike13mm（SPG）`) ||
      (lureType === LURETYPES.COIKE &&
        lureColor === LURE_COLOR.COIKE.EDGE_SHRIMP &&
        `#291 Coike13mm（エッジシュリンプ）`)
    );
  };

  const translateText = async (title: string, comment: string) => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }
    if (translatedTexts?.title && translatedTexts?.comment) {
      setIsTranslated(true);
      return;
    }
    try {
      await axiosInstance
        .post(`/translate`, { texts: [title, comment], targetLanguage: LANGUAGE.EN })
        .then((res) => {
          setTranslatedTexts({ title: res.data[0], comment: res.data[1] });
          setIsTranslated(true);
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    } catch (error) {
      Promise.reject(error);
    }
  };

  return (
    <Box bg="black">
      <HeaderMenu />
      <Flex minHeight="100vh" flexDirection="column" textColor="white" py="5" px="3" gap="5">
        {fishingResult && (
          <>
            <Box
              width="full"
              maxW="container.md"
              marginX="auto"
              rounded="lg"
              border="1px solid white"
            >
              <UrlImage
                imagePreview={fishingResult.imagePathForNft}
                handleError={(e) => (e.currentTarget.src = defaultImageUrl)}
              />
            </Box>
            <Flex gap="2" alignItems="center">
              <IconButton
                colorScheme="black"
                size="sm"
                icon={
                  <Image
                    objectFit="contain"
                    src={goodState.isGood ? likedAfterIcon.src : likedBeforeIcon.src}
                    alt="like_icon"
                  />
                }
                aria-label="Like"
                onClick={likeFishingResult}
              />
            </Flex>
            <Flex gap="5" fontSize="sm">
              <Flex
                gap="2"
                direction="column"
                onClick={() =>
                  router.push(pathsCreator.fishingResultLikedUsers(userName, resultId))
                }
              >
                <Text>
                  {t('いいね！')}
                  {goodState.count}
                  {t('件')}
                </Text>
              </Flex>
            </Flex>
            <Divider />
            <Box>
              <TextWithSquare>{t('釣果詳細')}</TextWithSquare>
              <Text lineHeight={'8'}>
                {t('フィールド')} : {getField(fishingResult.field)}
              </Text>
              <Text lineHeight={'8'}>
                {t('サイズ')} : {fishingResult.size}cm{' '}
              </Text>
              {fishingResult.applyType !== APPLY_TYPE.RIKUO && (
                <Text lineHeight={'8'}>
                  {t('魚種')} : {FISHTYPES.find((f) => f.id === fishingResult.fishType)?.display}
                </Text>
              )}
              <Text lineHeight={'8'}>
                {t('日時')} : {formatDate(fishingResult.caughtAt)}
              </Text>
              {fishingResult.freeTextLure ? (
                <Text lineHeight={'8'}>
                  {t('ルアー')} : {fishingResult.freeTextLure}
                </Text>
              ) : (
                <Text lineHeight={'8'}>
                  {t('ルアー')} :{' '}
                  {handleLureLabel(fishingResult.lure.lureType, fishingResult.lure.color)}
                </Text>
              )}
              <Text lineHeight={'8'}>
                {t('ロッド')} :{' '}
                {fishingResult.applyType === APPLY_TYPE.RIKUO
                  ? fishingResult.freeTextRod
                  : rodMaster && rodMaster.find((r) => r.id === fishingResult.rod)?.name}
              </Text>
              <Text lineHeight={'8'}>
                {t('リール')} :{' '}
                {fishingResult.applyType === APPLY_TYPE.RIKUO
                  ? fishingResult.freeTextReel
                  : reelMaster && reelMaster.find((r) => r.id === fishingResult.reel)?.name}
              </Text>
              <Text lineHeight={'8'}>
                {t('ライン')} :{' '}
                {fishingResult.applyType === APPLY_TYPE.RIKUO
                  ? fishingResult.freeTextLine
                  : lineMaster && lineMaster.find((l) => l.id === fishingResult.line)?.name}
              </Text>
            </Box>

            <Box>
              <TextWithSquare>{t('タイトル')}</TextWithSquare>
              <Text lineHeight={'8'}>
                {isTranslated ? translatedTexts?.title : fishingResult.title}
              </Text>
            </Box>
            <Box>
              <TextWithSquare>{t('コメント')}</TextWithSquare>
              <Text lineHeight={'8'} whiteSpace="pre-line">
                {' '}
                {isTranslated ? translatedTexts?.comment : fishingResult.comment}
              </Text>
            </Box>
            <Box>
              <Text
                onClick={() => translateText(fishingResult.title, fishingResult.comment)}
                cursor="pointer"
                fontSize="sm"
              >
                {isTranslated ? t('元のテキスト') : t('翻訳する')}
              </Text>
            </Box>
          </>
        )}
      </Flex>
      <Footer />
    </Box>
  );
};

export default FishingResultDetail;
