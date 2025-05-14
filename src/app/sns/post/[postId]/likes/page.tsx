'use client';

import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { UserList } from '@/components/UserList/FollowList';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { LikeMember } from '@/types/LikeMember';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

const SnsPostLikedUser = () => {
  const { userData } = useFetchUserData();
  const [userList, setUserList] = useState<LikeMember[]>([]);
  const { postId = '' } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timelineResponse = await axiosInstance.get<LikeMember[]>(`/good/${postId}/members`);
        if (timelineResponse.status === 200) {
          setUserList(timelineResponse.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [postId]);

  return (
    <>
      <Box bg="black">
        <HeaderMenu />
        <Flex minHeight="100vh" flexDirection="column" color="white" py="5" gap="5">
          <Text as="h1" color="white" textAlign="center">
            {t('いいね！')}
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

export default SnsPostLikedUser;
