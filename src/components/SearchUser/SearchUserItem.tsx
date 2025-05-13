import { Avatar, Button, Flex, Link, ListItem, Text } from '@chakra-ui/react';
import { pathsCreator } from '@/utils/constValues';
import defaultImage from '@/assets/preview.png';
import { useCallback, useState } from 'react';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { useCustomToast } from '@/hooks/useCustomToast';
import axiosInstance from '@/lib/axiosInstance';

export type Props = {
  id: string;
  profileImage: string;
  userName: string;
  firstName: string;
  lastName: string;
  followed: boolean;
};

const SearchUserItem = ({ id, profileImage, userName, firstName, lastName, followed }: Props) => {
  const [isFollowedState, setIsFollwedState] = useState(followed);
  const { userData } = useFetchUserData();

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
  }, [id, isFollowedState, showErrorToast]);
  return (
    <ListItem>
      <Flex gap="3" alignItems="center" justifyContent="space-between">
        <Flex gap="3" alignItems="center">
          <Link href={pathsCreator.gallery(userName)}>
            <Avatar src={profileImage || defaultImage.src} size="md" name={userName} />
          </Link>
          <Flex direction="column">
            <Text fontSize="xs" noOfLines={1}>
              @{userName}
            </Text>
            <Flex gap="3" fontSize="xs">
              <Text>{firstName}</Text>
              <Text>{lastName}</Text>
            </Flex>
          </Flex>
        </Flex>
        {userData?.id !== id && (
          <Button
            size="xs"
            onClick={() => handleOnItemClick()}
            type="button"
            bgColor={isFollowedState === true ? 'lightgray' : 'brand.bclBlue'}
            color={isFollowedState === true ? 'black' : 'white'}
            rounded="md"
            px="4"
            fontSize="xs"
            fontWeight="bold"
          >
            {isFollowedState ? 'フォロー中' : 'フォローする'}
          </Button>
        )}
      </Flex>
    </ListItem>
  );
};

export default SearchUserItem;
