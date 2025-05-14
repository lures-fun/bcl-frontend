'use client';

import { Box, Flex, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import HallOfFameGrid from '@/components/TackleBox/HallofFameGrid';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useCustomToast } from '@/hooks/useCustomToast';
import axiosInstance from '@/lib/axiosInstance';
import hallOfFameTitle from '@/assets/hall-of-fame-title.svg';
import { useParams } from 'next/navigation';

const HallOfFame = () => {
  const params = useParams();
  const userName = params.userName;
  const { showErrorToast } = useCustomToast();
  const [lures, setLures] = useState();
  useEffect(() => {
    axiosInstance
      .get(`tackle-box/hall-of-fame/${userName}`)
      .then((response) => {
        setLures(response.data);
      })
      .catch((error) => {
        showErrorToast('Failed to fetch data', error.message);
      });
  }, [setLures, showErrorToast, userName]);
  return (
    <Box color={'white'} bg={'black'}>
      <HeaderMenu />
      <Flex px={4} minHeight={'100vh'} alignItems={'center'} flexDirection={'column'}>
        <Image src={hallOfFameTitle.src} py={3}/>
        {lures && userName && <HallOfFameGrid item={lures} />}
      </Flex>
      <Footer />
    </Box>
  );
};

export default HallOfFame;
