'use client';

import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { GoodsGrid } from '@/components/GoodsBox/GoodsGrid';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useCustomToast } from '@/hooks/useCustomToast';
import axiosInstance from '@/lib/axiosInstance';
import { Goods } from '@/types/Goods';
import { useTranslation } from 'react-i18next';

const GoodsBox = () => {
  const params = useParams();
  const userName = params.userName;
  const { showErrorToast } = useCustomToast();
  const [goods, setGoods] = useState<Goods[]>();
  const { t } = useTranslation();
  useEffect(() => {
    axiosInstance
      .get<Goods[]>(`merchandises/list/${userName}`)
      .then((response) => {
        setGoods(Object.values(response.data));
      })
      .catch((error) => showErrorToast('Failed to fetch data', error.message));
  }, [userName, showErrorToast]);
  return (
    <Box bg="black">
      <HeaderMenu />
      <Flex px={4} color={'white'} flexDirection={'column'} alignItems={'center'} minHeight="100vh">
        <Text py={5}>{t('デジタルクローゼット')}</Text>
        {goods && userName && <GoodsGrid goods={goods} />}
      </Flex>
      <Footer />
    </Box>
  );
};

export default GoodsBox;
