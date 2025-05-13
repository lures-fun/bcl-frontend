import { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { Comment } from '@/types/Comment';
import axiosInstance from '@/lib/axiosInstance';
import CommentDisplay from './CommentDisplay';

type Props = {
  comment: Comment;
  postId: string;
  handleOpenModal: (comment: Comment) => void;
  userData: any;
};

const CommentWithReply = ({ postId, comment, handleOpenModal, userData }: Props) => {
  const [threads, setThreads] = useState<Comment[]>();
  const [showThread, setShowThread] = useState(false);

  useEffect(() => {
    const fetchReplyThreads = async () => {
      try {
        const response = await axiosInstance.get(`/comments/${postId}/thread/${comment.id}`);
        setThreads(response.data);
      } catch (e: any) {
        console.log(e.response);
      }
    };
    fetchReplyThreads();
  }, [postId, comment, handleOpenModal]);

  const handleOnShowThread = () => {
    setShowThread(true);
  };

  return (
    <>
      <Flex gap={4}>
        <CommentDisplay
          handleOpenModal={handleOpenModal}
          comment={comment}
          showThread={showThread}
          threadCount={threads?.length}
          handleOnShowThread={handleOnShowThread}
          userData={userData}
        />
      </Flex>
      {showThread && (
        <Flex gap={6} pl={20} my={6} flexDirection={'column'}>
          {threads?.map((thread: Comment) => (
            <Flex gap={4} key={thread.id}>
              <CommentDisplay
                handleOpenModal={handleOpenModal}
                comment={thread}
                size="md"
                userData={userData}
              />
            </Flex>
          ))}
        </Flex>
      )}
    </>
  );
};

export default CommentWithReply;
