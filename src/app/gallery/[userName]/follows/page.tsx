'use client';

import { Box, Divider, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

import { UserList } from '@/components/UserList/FollowList';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { Follower } from '@/types/Follower';

const Follow = () => {
  const { userData } = useFetchUserData();
  const [followers, setFollowers] = useState<Follower[]>();
  const [followees, setFollowees] = useState<Follower[]>();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const defaultIndex = tabParam === 'followee' ? 1 : 0;
  const params = useParams();
  const userName = params.userName;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timelineResponse = await axiosInstance.get<Follower[]>(
          `/follow/followers/${userName}`
        );
        if (timelineResponse.status === 200) {
          setFollowers(timelineResponse.data);
        }
        const timelineFollowerResponse = await axiosInstance.get<Follower[]>(
          `/follow/followees/${userName}`
        );
        if (timelineFollowerResponse.status === 200) {
          setFollowees(timelineFollowerResponse.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userName]);

  const onStateChange = useCallback(
    (user: Follower, newState: boolean) => {
      if (!newState) {
        setFollowees(followees?.filter((f) => f.id !== user.id));
      } else if (!followees?.find((f) => f.id === user.id)) {
        setFollowees([...(followees || []), { ...user, followed: true }]);
      }
    },
    [followees]
  );

  return (
    <>
      <Box bg="black">
        <HeaderMenu />
        <Flex minHeight="100vh" flexDirection="column" color="white" p="5">
          <Tabs defaultIndex={defaultIndex}>
            <TabList justifyContent="space-evenly" borderColor="black">
              <Tab flexGrow="1">フォロワー</Tab>
              <Tab flexGrow="1">フォロー中</Tab>
            </TabList>
            <Divider py="0.5px" />
            <TabPanels>
              <TabPanel px="0">
                {followers && followers?.length > 0 && (
                  <UserList
                    userList={followers.map((f) => ({
                      id: f.id,
                      profileIcon: f.profileIcon,
                      userName: f.userName,
                      followed: f.followed,
                      isOwnProfile: userData?.id && f.id === userData.id ? true : false,
                      onFollowUpdate: (newState: boolean) => onStateChange(f, newState),
                    }))}
                  />
                )}
              </TabPanel>
              <TabPanel px="0">
                {followees && followees?.length > 0 && (
                  <UserList
                    userList={followees.map((f) => ({
                      id: f.id,
                      profileIcon: f.profileIcon,
                      userName: f.userName,
                      followed: f.followed,
                      isOwnProfile: userData?.id && f.id === userData.id ? true : false,
                      onFollowUpdate: (newState: boolean) => onStateChange(f, newState),
                    }))}
                  />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
        <Footer />
      </Box>
    </>
  );
};

export default Follow;
