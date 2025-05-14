'use client';

import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { UserList } from '@/components/UserList/FollowList';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { LikeMember } from '@/types/LikeMember';
import { useParams } from 'next/navigation';

const FishingResultLikedUser = () => {
  const { userData } = useFetchUserData();
  const [userList, setUserList] = useState<LikeMember[]>([]);
  const { resultId = '' } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timelineResponse = await axiosInstance.get<LikeMember[]>(`/good/${resultId}/members`);
        if (timelineResponse.status === 200) {
          setUserList(timelineResponse.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [resultId]);

  return (
    <>
      <Box bg="black">
        <HeaderMenu />
        <Flex minHeight="100vh" flexDirection="column" color="white" py="5" gap="5">
          <Text as="h1" color="white" textAlign="center">
            いいね！
          </Text>
          <Divider />
          <Box px="5">
            <UserList
              userList={userList.map((user) => ({
                id: user.id,
                profileIcon: user.profileIcon,
                userName: user.userName,
                followed: user.followed,
                isOwnProfile: userData?.id && user.id === userData.id ? true : false,
              }))}
            />
          </Box>
        </Flex>
        <Footer />
      </Box>
    </>
  );
};

export default FishingResultLikedUser;