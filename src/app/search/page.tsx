'use client';

import {
  Box,
  InputGroup,
  InputLeftElement,
  Stack,
  Image,
  Flex,
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  InputRightElement,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import searchicon from '@/assets/icon/search_icon.png';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import SearchData from './SearchData';
import { useCallback, useEffect, useState } from 'react';
import { Footer } from '@/components/uiParts/Footer/Footer';
import axiosInstance from '@/lib/axiosInstance';
import { SearchUser } from '@/types/SearchUser';
import { Follower } from '@/types/Follower';
import { SEARCH_TABS, SEARCH_TYPES } from '@/utils/constValues';
import { CloseIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

const UserTimeLineSearch = () => {
  const [searchData, setSearchData] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<string>(SEARCH_TYPES.users);
  const [searchValue, setSearchValue] = useState<string>('');
  const { t } = useTranslation();

  const fetchUserData = useCallback(
    async (searchValue: string) => {
      const responseUser = await axiosInstance.post(`/search/${searchType}`, {
        searchText: searchValue,
      });
      const responseFollow = await axiosInstance.get(`/follow/followees`);
      if (responseUser.status && responseFollow.status === 200) {
        const filteredData = responseUser.data.map((user: SearchUser) => {
          const follower = responseFollow.data.find((f: Follower) => f.id === user.id);
          if (follower) {
            user.followed = true;
          }
          return user;
        });
        setSearchData(filteredData);
      }
    },
    [searchType]
  );
  const fetchTimelineData = useCallback(
    async (searchValue: string) => {
      const response = await axiosInstance.post(`/search/${searchType}`, {
        searchText: searchValue,
      });
      if (response.status === 200) {
        setSearchData(response.data);
      }
    },
    [searchType]
  );
  const handleChange = (e: any) => {
    setSearchValue(e.target.value);
  };
  const handleDeleteChange = () => {
    setSearchValue('');
  };
  const handleSearchType = (index: number) => {
    if (index === SEARCH_TABS.users) {
      setSearchData([]);
      handleDeleteChange();
      setSearchType(SEARCH_TYPES.users);
    } else if (index === SEARCH_TABS.fishing_results) {
      setSearchData([]);
      handleDeleteChange();
      setSearchType(SEARCH_TYPES.fishing_results);
    } else if (index === SEARCH_TABS.dao_talks) {
      setSearchData([]);
      handleDeleteChange();
      setSearchType(SEARCH_TYPES.dao_talks);
    }
  };
  useEffect(() => {
    if (searchValue.length > 0) {
      switch (searchType) {
        case SEARCH_TYPES.users:
          fetchUserData(searchValue);
          break;
        case SEARCH_TYPES.fishing_results:
          fetchTimelineData(searchValue);
          break;
        case SEARCH_TYPES.dao_talks:
          fetchTimelineData(searchValue);
          break;
      }
    } else {
      setSearchData([]);
    }
  }, [fetchTimelineData, fetchUserData, searchType, searchValue]);
  return (
    <Box bg={'black'}>
      <HeaderMenu />
      <Flex minHeight="100vh" flexDirection="column" textColor="white" py="3">
        <Stack spacing={4} px={7} py={3}>
          <InputGroup>
            <InputLeftElement>
              <Image boxSize={6} objectFit="contain" src={searchicon.src} alt="search_icon" />
            </InputLeftElement>
            <Input value={searchValue} onChange={handleChange} />
            <InputRightElement>
              <IconButton
                onClick={handleDeleteChange}
                color={'gray.300'}
                bgColor={'transparent'}
                icon={<CloseIcon />}
                aria-label={'close-icon'}
              />
            </InputRightElement>
          </InputGroup>
        </Stack>
        <Tabs isFitted color={'white'} onChange={handleSearchType}>
          <TabList borderColor="black">
            <Tab>{t('ユーザー')}</Tab>
            <Tab>{t('釣果')}</Tab>
            <Tab>{t('釣りトーク')}</Tab>
          </TabList>
          <Divider py="0.5px" />
          <TabPanels>
            <TabPanel>
              <SearchData data={searchData} type={searchType}></SearchData>
            </TabPanel>
            <TabPanel padding={0}>
              <SearchData data={searchData} type={searchType}></SearchData>
            </TabPanel>
            <TabPanel padding={0}>
              <SearchData data={searchData} type={searchType}></SearchData>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <Footer></Footer>
    </Box>
  );
};

export default UserTimeLineSearch;
