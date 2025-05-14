'use client';

import { Box, Divider, Flex, IconButton, Image, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import likedAfterIcon from '@/assets/icon/like_after_icon.svg';
import likedBeforeIcon from '@/assets/icon/like_before_icon.svg';
import commentIcon from '@/assets/icon/talk_icon.svg';
import defaultImage from '@/assets/preview.png';
import { CommentList } from '@/components/CommentList';
import { SnsImageSlider } from '@/components/Sns/SnsImageSlider';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { TextWithSquare } from '@/components/uiParts/Text/TextWithSquare';
import { useCustomToast } from '@/hooks/useCustomToast';
import axiosInstance from '@/lib/axiosInstance';
import { Comment } from '@/types/Comment';
import { Good } from '@/types/Good';
import { LANGUAGE, pathsCreator } from '@/utils/constValues';
import dao_bg from '@/assets/DAOTalkBG.png';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import omissicon from '@/assets/icon/omission.svg';
import deleteIcon from '@/assets/icon/deleteIcon.svg';
import editIcon from '@/assets/icon/editIcon.svg';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const SnsDetail = () => {
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const [snsPost, setSnsPost] = useState<Sns>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [goodState, setGoodState] = useState<Good>({ count: 0, isGood: false });
  const params = useParams();
  const postname = String(params.userName || '');
  const postId = String(params.postId || '');
  const router = useRouter();
  const searchParams = useSearchParams();
  const displayComment = searchParams?.get('displayComment') === 'true';
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [translatedComment, setTranslatedComment] = useState<string>('');

  const { userData } = useFetchUserData();

  const openDialog = () => {
    setShowDialog(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDialog = () => {
    setShowDialog(false);
    document.body.style.overflow = 'auto';
  };

  const openDeleteDialog = () => {
    setShowDialog(false);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    document.body.style.overflow = 'auto';
  };

  const likeSnsPost = useCallback(async () => {
    try {
      if (!goodState.isGood) await axiosInstance.post(`/good/${postId}`);
      else await axiosInstance.delete(`/good/${postId}`);
      setGoodState((prevState) => ({
        isGood: !prevState.isGood,
        count: !prevState.isGood ? prevState.count + 1 : prevState.count - 1,
      }));
    } catch {
      showErrorToast(
        t('失敗しました。'),
        !goodState.isGood ? t('いいねすることはできません。') : t('いいねを解除することはできません。')
      );
    }
  }, [goodState.isGood, postId, showErrorToast,t]);

  const deletePost = useCallback(async () => {
    try {
      await axiosInstance.delete(`/post/${postId}`);
      router.push(pathsCreator.timeline());
      document.body.style.overflow = 'auto';
      showSuccessToast(t('投稿を削除しました'), t('投稿を削除しました'));
    } catch (e) {
      showErrorToast(t('失敗しました。'), t('削除することはできませんでした'));
    }
  }, [router, postId, showErrorToast, showSuccessToast,t]);

  useEffect(() => {
    const fetchFishingResult = async () => {
      try {
        const [snsPostDetailResponse, likeResponse, commentListResponse] = await Promise.all([
          axiosInstance.get<Sns>(`/post/${postId}`),
          axiosInstance.get<Good>(`/good/${postId}`),
          axiosInstance.get<Comment[]>(`/comments/${postId}`),
        ]);
        setSnsPost(snsPostDetailResponse.data);
        setGoodState(likeResponse.data);
        setComments(commentListResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFishingResult();
  }, [postId]);

  const images = useMemo(() => {
    const images = [snsPost?.imagePath1, snsPost?.imagePath2, snsPost?.imagePath3].filter((i) => i);
    return images.length > 0 ? images : [defaultImage.src];
  }, [snsPost?.imagePath1, snsPost?.imagePath2, snsPost?.imagePath3]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        closeDialog();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const translateText = async (text: string) => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }
    if (translatedComment) {
      setIsTranslated(true);
      return;
    }
    try {
      await axiosInstance
        .post(`/translate`, { texts: [text], targetLanguage: LANGUAGE.EN })
        .then((res) => {
          setTranslatedComment(res.data[0]);
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
    <Box
      bg="black"
      bgImage={dao_bg.src}
      backgroundAttachment="fixed"
      backgroundSize="cover"
      backgroundPosition="center"
      bgRepeat="no-repeat"
    >
      <HeaderMenu />
      <Flex minHeight="100vh" flexDirection="column" textColor="white" py="5" px="3" gap="5">
        {snsPost && (
          <>
            <SnsImageSlider images={images} />
            <Flex gap="2" align="center">
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
                onClick={likeSnsPost}
              />
              <IconButton
                colorScheme="black"
                size="sm"
                icon={<Image objectFit="contain" src={commentIcon.src} alt="comment_icon" />}
                aria-label="Comment"
                onClick={() => router.push(pathsCreator.snsPostComment(postId))}
              />
              {userData?.userName === postname && (
                <Box position="relative" ml="auto" mr={2}>
                  <IconButton
                    colorScheme="black"
                    size="sm"
                    icon={<Image objectFit="contain" src={omissicon.src} alt="comment_icon" />}
                    aria-label="Comment"
                    onClick={openDialog}
                  />
                  {showDialog && (
                    <Box
                      ref={dialogRef}
                      position="absolute"
                      transform="translate(-85%, 10px)"
                      bg="white"
                      borderRadius="lg"
                      boxShadow="xl"
                      zIndex="10"
                      textAlign="center"
                      w="230px"
                      mt={2}
                      py={3}
                    >
                      <Flex alignItems="center" ml={5}>
                        <Image src={editIcon.src} />
                        <Text
                          px={4}
                          fontWeight="bold"
                          color="gray"
                          onClick={() =>
                            router.push(pathsCreator.snsEdit(postId))
                          }
                        >
                          {t('編集')}
                        </Text>
                      </Flex>
                      <Divider my={3} />
                      <Flex alignItems="center" ml={5}>
                        <Image src={deleteIcon.src} />
                        <Text px={3} fontWeight="bold" color="red" onClick={openDeleteDialog}>
                          {t('削除')}
                        </Text>
                      </Flex>
                    </Box>
                  )}
                </Box>
              )}
            </Flex>
            <Flex gap="5" fontSize="sm">
              <Flex
                gap="2"
                direction="column"
                onClick={() => router.push(pathsCreator.snsPostLikedUsers(postId))}
              >
                <Text>
                  {t('いいね！')}
                  {goodState.count}
                  {t('件')}
                </Text>
              </Flex>
              {/* <Flex gap='2' direction='column'><Text>獲得トークン20</Text></Flex> */}
            </Flex>
            <Divider />
            <Box>
              <TextWithSquare>{t('コメント')}</TextWithSquare>
              <Text lineHeight={'8'} whiteSpace="pre-line">
                {isTranslated ? translatedComment : snsPost.comment}
              </Text>
              <Text
                onClick={() => translateText(snsPost.comment)}
                cursor="pointer"
                fontSize="small"
                mt="2"
              >
                {isTranslated ? t('元のテキスト') : t('翻訳する')}
              </Text>
            </Box>
            <Divider />
            {comments.length > 0 && (
              <CommentList
                postId={postId}
                comments={comments}
                title={`${t('コメント')}${comments.length}${t('件全て見る')}`}
                displayComment={displayComment}
              />
            )}
          </>
        )}
      </Flex>
      <Footer />
      {showDeleteDialog && (
        <>
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            zIndex="9"
            onClick={closeDeleteDialog}
          />
          <Box
            ref={dialogRef}
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            borderRadius="lg"
            boxShadow="xl"
            zIndex="10"
            textAlign="center"
            w="55%"
          >
            <Box p={6}>
              <Text mb={6} color="gray.600" fontWeight="bold">
                {t('投稿を削除しますか？')}
              </Text>
              <Text color="red" fontWeight="bold" p={3} onClick={deletePost}>
                {t('削除')}
              </Text>
              <Divider />
              <Text onClick={closeDeleteDialog} p={3}>
                {t('キャンセル')}
              </Text>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SnsDetail;
