'use client';

import { Avatar, AvatarProps, Box, Button, Flex, Text } from '@chakra-ui/react';
import { Comment } from '@/types/Comment';
import defaultImage from '@/assets/preview.png';
import { TokenBadge } from '../uiParts/Badge/TokenBadge';
import { Readmore } from '../uiParts/Text/Readmore';
import { LANGUAGE, pathsCreator } from '@/utils/constValues';
import { User } from '@/types/User';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useState } from 'react';

type Props = AvatarProps & {
  comment: Comment;
  showThread?: boolean;
  threadCount?: number;
  handleOnShowThread?: () => void;
  handleOpenModal: (comment: Comment) => void;
  userData: User;
};

const CommentDisplay = ({
  comment,
  handleOpenModal,
  showThread,
  handleOnShowThread,
  userData,
  threadCount = 0,
  ...rest
}: Props) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [translatedComment, setTranslatedComment] = useState<string>('');

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
    <>
      <Avatar
        src={comment.profileIcon || defaultImage.src}
        size={rest.size || 'lg'}
        aspectRatio={1}
        onClick={() => router.push(pathsCreator.gallery(comment.userName))}
      />
      <Box flex="1">
        <Text fontSize="sm">
          @{comment.userName}
          {comment.tokenQuantity === 5 && <TokenBadge count={5} />}
          {comment.tokenQuantity === 10 && <TokenBadge count={10} />}
        </Text>
        <Readmore
          line={2}
          content={isTranslated ? translatedComment : comment.comment}
          userData={userData}
        />
        <Flex gap="4">
          <Button color="white" size="xs" variant="link" onClick={() => handleOpenModal(comment)}>
            {t('返信する')}
          </Button>

          {showThread === false && threadCount > 0 && (
            <Button color="white" size="xs" variant="link" onClick={handleOnShowThread}>
              {t('他返信')} {threadCount} {t('件全て見る')}
            </Button>
          )}
          <Button
            color="white"
            size="xs"
            variant="link"
            onClick={() => translateText(comment.comment)}
          >
            {isTranslated ? t('元のテキスト') : t('翻訳する')}
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default CommentDisplay;
