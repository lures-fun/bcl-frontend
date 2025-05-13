import { Button, Flex, IconButton, Image, ListItem, Text, useDisclosure } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import bronze from '@/assets/40UP.png';
import silver from '@/assets/50UP.png';
import gold from '@/assets/60UP.png';
import defaultImage from '@/assets/preview.png';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { isVideoSupported } from '@/lib/videoSupport';
import { FishingResultDetail } from '@/types/FishingResultDetail';
import { LANGUAGE, TIMELINE_TYPES, paths, pathsCreator } from '@/utils/constValues';
import afterLikeIcon from '@/assets/icon/like_after_icon.svg';
import beforeLikeIcon from '@/assets/icon/like_before_icon.svg';
import talkIcon from '@/assets/icon/talk_icon.svg';
import report_icon from '@/assets/icon/report_icon.svg';
import block_icon from '@/assets/icon/block_icon.svg';

import { SnsImageSlider } from '@/components/Sns/SnsImageSlider';
import { Readmore } from '@/components/uiParts/Text/Readmore';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../uiParts/Dialog/ConfirmDialog';
import { ReportDialog } from './ReportDialog';

export type Props = {
  id: string;
  profileImage: string;
  username: string;
  images: string[];
  title: string;
  description: string;
  comment: string;
  goodCount: string;
  timelineType: string;
  isGood: boolean;
  commentCount: number;
  createdAt: string;
  memberId: string;
  onTimelineClick: () => void;
};
type translatedTexts = {
  title: string;
  comment: string;
};

export const TimelineItem = ({
  profileImage,
  username,
  images,
  title,
  comment,
  id,
  goodCount,
  timelineType,
  isGood,
  commentCount,
  createdAt,
  memberId,
  onTimelineClick,
}: Props) => {
  const [liked, setLiked] = useState<boolean>(isGood);
  const [likeCount, setLikeCount] = useState<string>(goodCount);
  const router = useRouter();
  const { userData } = useFetchUserData();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const [fishingResult, setFishingResult] = useState<FishingResultDetail>();
  const { t } = useTranslation();
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [translatedTexts, setTranslatedTexts] = useState<translatedTexts>();

  const getUploadDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    return { day, month };
  };

  useEffect(() => {
    if (timelineType !== TIMELINE_TYPES.fishingResults) return;
    const fetchFishingResults = async () => {
      axiosInstance
        .get<FishingResultDetail>(`/fishing-results/${username}/${id}`)
        .then((response) => setFishingResult(response.data))
        .catch((error: any) => console.log(error));
    };
    fetchFishingResults();
  }, [id, setFishingResult, timelineType, username]);

  const handleOnUserClick = () => {
    router.push(pathsCreator.gallery(username));
  };

  const handleOnGoodCountClick = () => {
    if (timelineType === TIMELINE_TYPES.fishingResults) {
      router.push(pathsCreator.fishingResultLikedUsers(username, id));
    } else if (timelineType === TIMELINE_TYPES.daoResults) {
      router.push(pathsCreator.snsPostLikedUsers(id));
    }
  };

  const handleOnItemClick = () => {
    onTimelineClick();

    if (timelineType === TIMELINE_TYPES.fishingResults) {
      router.push(pathsCreator.fishingResultDetail(username, id));
    } else if (timelineType === TIMELINE_TYPES.daoResults) {
      router.push(pathsCreator.snsDetail(username, id));
    }
  };

  const handleGoodAdd = async () => {
    try {
      await axiosInstance
        .post(`/good/${id}`)
        .then(() => {
          setLiked(true);
          const count = +likeCount + 1;
          setLikeCount(count.toString());
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    } catch (error) {
      Promise.reject(error);
    }
  };
  const handleBlock = async () => {
    try {
      await axiosInstance.post('/block', {
        blockedMemberId: memberId,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
      showErrorToast(t('ブロックエラー'), t('ブロックに失敗しました'));
    }
  };

  const handleReport = async (reportType: string) => {
    try {
      if (!reportType) {
        showErrorToast(t('通報する理由は必須です。'), t('通報する理由を選択してください。'));
        return;
      }
      await axiosInstance.post('/report', {
        reportedMemberId: memberId,
        reportType: reportType,
      });
      showSuccessToast(t('通報しました'), t(''));
      onReportClose();
    } catch (error) {
      console.log(error);
      showErrorToast(t('通報エラー'), t('通報に失敗しました'));
    }
  };

  const handleGoodRemove = async () => {
    try {
      await axiosInstance
        .delete(`/good/${id}`)
        .then(() => {
          setLiked(false);
          const count = +likeCount - 1;
          setLikeCount(count.toString());
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    } catch (error) {
      Promise.reject(error);
    }
  };

  const navigateComment = () => {
    if (timelineType === TIMELINE_TYPES.fishingResults) {
      router.push(pathsCreator.fishingResultComment(username, id));
    } else if (timelineType === TIMELINE_TYPES.daoResults) {
      router.push(pathsCreator.snsPostComment(id));
    }
  };

  const isUserData = useCallback(
    (text: string) => {
      if (userData && !userData.userName) {
        router.push(paths.myPage);
        showErrorToast(
          'ユーザーネームを入力してください。',
          `${text}するにはユーザーネームが必須です`
        );
      }
    },
    [router, showErrorToast, userData]
  );

  const addThumbnailParameterToImage = (imagePath: string) => {
    if (!imagePath || isVideoSupported(imagePath)) {
      return imagePath;
    }
    // https:// で始まり、cloudfront.net を含み、その後に任意の文字が続く形を確認
    const cloudfrontRegex = /^https:\/\/.*cloudfront\.net.*$/;
    if (cloudfrontRegex.test(imagePath)) {
      // URLに既にパラメータが存在するかを確認
      const separator = imagePath.includes('?') ? '&' : '?';
      // CloudFront経由のURLにd=600x600を追加することでリサイズされた画像を返却することができる
      // d=200x200のようにリサイズしたいサイズを指定することができる（但し、200x400などは適用されないため注意）
      return `${imagePath}${separator}d=600x600`;
    }

    return imagePath;
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
        .post(`/translate`, { texts: [title ?? '', comment], targetLanguage: LANGUAGE.EN })
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

  const { isOpen: isBlockOpen, onOpen: onBlockOpen, onClose: onBlockClose } = useDisclosure();
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();

  return (
    <ListItem>
      <Flex gap="2" direction="column">
        <Flex gap={3} maxW="full" onClick={handleOnUserClick} px="3">
          <Image
            src={profileImage || defaultImage.src}
            objectFit="cover"
            mx="auto"
            rounded="full"
            minH="10px"
            maxH="60px"
            aspectRatio={1}
            onError={(error) => {
              error.currentTarget.src = defaultImage.src;
              error.currentTarget.srcset = defaultImage.src;
            }}
          />
          <Text fontSize="sm" marginY="auto" width="full">
            @{username}
          </Text>
          {fishingResult && (
            <>
              {fishingResult.size >= 60 && <Image src={gold.src} boxSize="16" />}
              {fishingResult.size >= 50 && fishingResult.size < 60 && (
                <Image src={silver.src} boxSize="16" />
              )}
              {fishingResult.size >= 40 && fishingResult.size < 50 && (
                <Image src={bronze.src} boxSize="16" />
              )}
            </>
          )}
        </Flex>
        <SnsImageSlider
          images={
            images.filter((image) => image).length > 0
              ? images.map((image) => addThumbnailParameterToImage(image))
              : [defaultImage.src]
          }
          onClickImage={handleOnItemClick}
        />
        <Flex gap="5" fontSize="sm" px="3">
          <Flex gap="2" w="full" direction="column">
            <Flex pt="2" justifyContent="space-between" align="center">
              <Flex gap="5">
                {!liked ? (
                  <IconButton
                    onClick={() => {
                      if (userData && !userData.userName) {
                        isUserData('いいね');
                      } else {
                        handleGoodAdd();
                      }
                    }}
                    size="sm"
                    bg="transparent"
                    aria-label={'Before Like'}
                  >
                    <Image src={beforeLikeIcon.src} objectFit="contain" alt="before_like_icon" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      if (userData && !userData.userName) {
                        isUserData('いいね');
                      } else {
                        handleGoodRemove();
                      }
                    }}
                    size="sm"
                    bg="transparent"
                    aria-label={'After Like'}
                  >
                    <Image src={afterLikeIcon.src} objectFit="contain" alt="after_like_icon" />
                  </IconButton>
                )}
                {timelineType === TIMELINE_TYPES.daoResults && (
                  <IconButton
                    size="sm"
                    bg="transparent"
                    onClick={() => {
                      if (userData && !userData.userName) {
                        isUserData('コメント');
                      } else {
                        navigateComment();
                      }
                    }}
                    aria-label={'Talk'}
                  >
                    <Image src={talkIcon.src} objectFit="contain" align="talk_icon" />
                  </IconButton>
                )}
              </Flex>
              <Flex gap="1">
                <Button variant="plain" size="xs" opacity="0.7" gap={1} onClick={onReportOpen}>
                  <Image src={report_icon.src} h={3.5} objectFit="contain" alt="block_icon" />
                  {t('通報')}
                </Button>
                <Button variant="plain" size="xs" opacity="0.7" gap={1} onClick={onBlockOpen}>
                  <Image src={block_icon.src} h={3.5} objectFit="contain" alt="block_icon" />
                  {t('ブロック')}
                </Button>
              </Flex>
            </Flex>
            <ConfirmDialog
              title={t('このユーザーをブロックしますか？')}
              body={t('ブロックするとタイムラインに表示されなくなります。')}
              onClose={onBlockClose}
              isOpen={isBlockOpen}
              handleClick={async () => {
                handleBlock();
              }}
            />
            <ReportDialog
              onClose={onReportClose}
              isOpen={isReportOpen}
              handleClick={handleReport}
            />
            <Flex gap="2" onClick={() => handleOnGoodCountClick()}>
              <Text>
                {t('いいね！')}
                {likeCount}
                {t('件')}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {title && <Text px="3">{isTranslated ? translatedTexts?.title : title}</Text>}
        <Readmore line={2} content={isTranslated ? (translatedTexts?.comment ?? '') : comment} />
        {commentCount > 0 && timelineType === TIMELINE_TYPES.daoResults && (
          <Text px="3" onClick={() => router.push(pathsCreator.snsDetail(username, id, true))}>
            {t('コメントを')} {commentCount} {t('件表示')}
          </Text>
        )}
        <Flex>
          <Text px="3">
            {getUploadDate(createdAt).month}月{getUploadDate(createdAt).day}日
          </Text>
          <Text onClick={() => translateText(title, comment)} cursor="pointer" fontSize="sm">
            {isTranslated ? t('・元のテキスト') : t('・翻訳を見る')}
          </Text>
        </Flex>
      </Flex>
    </ListItem>
  );
};
