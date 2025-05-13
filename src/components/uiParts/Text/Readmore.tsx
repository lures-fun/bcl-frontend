import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { User } from '@/types/User';
import { useTranslation } from 'react-i18next';

type Props = {
  line: number;
  content: string;
  userData?: User;
};

export const Readmore = ({ line, content, userData }: Props) => {
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [renderedContent, setRenderedContent] = useState<JSX.Element | null>(null);
  const { t } = useTranslation();

  const reAdjustScrollHeight = useCallback(() => {
    if (textRef.current && textRef.current.scrollHeight > textRef.current.clientHeight) {
      setHasMore(true);
    }
  }, []);

  useEffect(() => {
    reAdjustScrollHeight();
  }, [reAdjustScrollHeight, renderedContent, textRef]);

  useEffect(() => {
    // TODO: We might want to make an API for the list of usernames.
    const fetchUserData = async (userName: string) => {
      try {
        const response = await axiosInstance.get<User>(`/follow/followees/${userName}`);
        if (response.status === 200) {
          return response.data;
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    };

    const renderContent = async (text: string) => {
      if (!text) return <></>;
      const parts = text.split(/(@\w+)/g);
      const transformedParts = await Promise.all(
        parts.map(async (part, index) => {
          const match = part.match(/@(\w+)/);
          if (match) {
            const [, username] = match;
            const user = await fetchUserData(username);
            if (!user) return part;
            return (
              <Link
                key={index}
                href={`/gallery/${username}`}
                color={userData?.userName === username ? 'yellow.500' : 'blue.500'}
              >
                @{username}
              </Link>
            );
          } else {
            return part;
          }
        })
      );
      return <Text as="span">{transformedParts}</Text>;
    };

    renderContent(content).then((result) => {
      setRenderedContent(result);
    });
  }, [content, reAdjustScrollHeight, userData?.userName]);

  return (
    <Flex direction={showAll ? 'column' : 'row'} alignItems="flex-start" px={userData ? 0 : 3}>
      <Text
        noOfLines={showAll ? 0 : line}
        ref={textRef}
        as="p"
        whiteSpace="pre-wrap"
        overflowWrap="break-word"
        wordBreak="break-all"
      >
        {renderedContent}
      </Text>
      <Box alignSelf={showAll ? '' : 'end'}>
        {hasMore && content && content.toString().length > 0 && (
          <Button
            variant="link"
            fontSize="sm"
            color="blue.200"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? t('表示を減らす') : t('続きを読む')}
          </Button>
        )}
      </Box>
    </Flex>
  );
};
