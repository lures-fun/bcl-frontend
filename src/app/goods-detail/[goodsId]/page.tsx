'use client';

import { AspectRatio, Box, Flex, Image, Text } from '@chakra-ui/react';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import previewImage from '@/assets/preview.png';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Merchandise } from '@/types/Goods';
import { useCustomToast } from '@/hooks/useCustomToast';
import { TextWithSquare } from '@/components/uiParts/Text/TextWithSquare';
import { useParams } from 'next/navigation';

const GoodsDetail = () => {
  const { goodsId } = useParams<{ goodsId: string }>();
  const { showErrorToast } = useCustomToast();
  const [merchandise, setMerchandise] = useState<Merchandise>();
  useEffect(() => {
    axiosInstance
      .get(`merchandises/${goodsId}`)
      .then((response) => {
        setMerchandise(response.data);
      })
      .catch((error) => {
        showErrorToast('Failed to fetch data', error.message);
      });
  }, [goodsId, setMerchandise, showErrorToast]);
  return (
    <Box bg={'black'} color={'white'}>
      <HeaderMenu />
      <Flex minHeight={'100vh'} flexDirection={'column'} py="5" px="3" gap="5">
        <Box>
          <AspectRatio maxW="600px" ratio={1 / 1} margin="auto">
            <Image
              src={merchandise ? merchandise.imagePath : previewImage.src}
              objectFit="cover"
              rounded="md"
            />
          </AspectRatio>
        </Box>
        <Flex flexDirection={'column'}>
          <TextWithSquare>タイトル</TextWithSquare>
          <Text>{merchandise && merchandise.title}</Text>
        </Flex>
        <Flex flexDirection={'column'}>
          <TextWithSquare>コメント</TextWithSquare>
          <Text>{merchandise && merchandise.content}</Text>
        </Flex>
      </Flex>
      <Footer />
    </Box>
  );
};

export default GoodsDetail;
