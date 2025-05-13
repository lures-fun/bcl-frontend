import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Comment } from '@/types/Comment';
import ReplyModal from './ReplyModal';
import CommentWithReply from './CommentWithReply';
import { useFetchUserData } from '@/hooks/useFetchUserData';

type Props = {
  postId: string;
  comments: Comment[];
  title: string;
  displayComment?: boolean;
};
export const CommentList = ({ postId, comments, title, displayComment = false }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showComment, setShowComment] = useState<boolean>(displayComment);
  const [threadId, setThreadId] = useState('');
  const [replyComment, setReplyComment] = useState<Comment>();
  const { userData } = useFetchUserData();

  const handleOpenModal = (comment: Comment) => {
    onOpen();
    setThreadId(comment.parentCommentId || comment.id);
    setReplyComment(comment);
  };

  return (
    <>
      <Text onClick={() => setShowComment(true)}>{title}</Text>
      <Flex flexDirection="column" gap={8}>
        {showComment &&
          comments.map((comment) => (
            <Box key={comment.id}>
              <CommentWithReply
                postId={postId}
                handleOpenModal={handleOpenModal}
                comment={comment}
                userData={userData}
              />
            </Box>
          ))}
      </Flex>
      <ReplyModal
        isOpen={isOpen}
        onClose={onClose}
        postId={postId}
        threadId={threadId}
        replyTo={replyComment}
      />
    </>
  );
};
