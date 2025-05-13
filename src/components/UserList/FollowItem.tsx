import { Avatar, Button, Flex, Link, ListItem, Text } from '@chakra-ui/react';
import { pathsCreator } from '@/utils/constValues';
import defaultImage from '@/assets/preview.png';
import { useCallback, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { useCustomToast } from '@/hooks/useCustomToast';

export type Props = {
  id: string;
  profileImage: string;
  username: string;
  isFollowed: boolean;
  isOwnProfile: boolean;
  onFollowUpdate?: (newState: boolean) => void;
};

export const UserItem = ({
  profileImage,
  username,
  isFollowed,
  id,
  isOwnProfile,
  onFollowUpdate,
}: Props) => {
  const [isFollowedState, setIsFollwedState] = useState(isFollowed);
  const { showErrorToast } = useCustomToast();

  const handleOnItemClick = useCallback(async () => {
    try {
      const newState = !isFollowedState;
      if (newState) {
        await axiosInstance.post('/follow', {
          followedMemberId: id,
        });
      } else {
        await axiosInstance.delete('/follow', {
          data: {
            followedMemberId: id,
          },
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onFollowUpdate && onFollowUpdate(newState);
      setIsFollwedState(newState);
    } catch (error) {
      console.log(error);
      showErrorToast(
        '操作に失敗した。',
        !isFollowedState
          ? 'ユーザーをフォローすることはできません。'
          : 'ユーザーのフォローを解除することはできません。'
      );
    }
  }, [id, isFollowedState, onFollowUpdate, showErrorToast]);
  return (
    <ListItem>
      <Flex gap="3" alignItems="center">
        <Link href={pathsCreator.gallery(username)} flex="1 0 auto">
          <Avatar src={profileImage || defaultImage.src} size="md" name={username} />
        </Link>
        <Text fontSize="sm" width="full" noOfLines={1}>
          @{username}
        </Text>
        {!isOwnProfile && (
          <Button
            onClick={handleOnItemClick}
            type="button"
            bgColor={isFollowedState ? 'lightgray' : 'brand.bclBlue'}
            color={isFollowedState ? 'black' : 'white'}
            rounded="md"
            height="8"
            px="10"
            fontSize="md"
            flex="1 0 auto"
            fontWeight="bold"
          >
            {isFollowedState ? 'フォロー中' : 'フォローする'}
          </Button>
        )}
      </Flex>
    </ListItem>
  );
};
