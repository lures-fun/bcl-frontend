'use client';

import { Button } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { Box, Flex, Text } from '@chakra-ui/react';
import sent from '@/assets/sent.png';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { paths } from '@/utils/constValues';
import { useRouter } from 'next/navigation';

const InquirySent = () => {
  const router = useRouter();
  const handleOnClick = () => {
    router.push(paths.home);
  };

  return (
    <Box bg="brand.bclBgGlay">
      <HeaderMenu />
      <Flex minHeight="100vh" flexDirection="column" px="3">
        <Flex flexGrow={1} flexDirection="column" mb={10} py="12" px="10">
          <Box pt={10}>
            <Box display="flex" justifyContent="center" pt={5}>
              <Image src={sent.src} alt="contact_complete" w="20%" h="20%" />
            </Box>
          </Box>
          <Box display="flex" justifyContent="center" pt="5">
            <Text color="white" fontSize={20} fontWeight="bold">
              送信完了いたしました
            </Text>
          </Box>
          <Box display="flex" justifyContent="center" pt="5">
            <Text color="white" fontSize={14} textAlign="center" lineHeight="2">
              この度はお問い合わせいただきまして、
              <br />
              誠にありがとうございます。
              <br />
              ご入力いただいたメールアドレス宛へ、
              <br />
              ご確認メールをお送りしておりますので
              <br />
              ご確認ください。
              <br />
              内容を確認次第、担当者より折返し
              <br />
              ご連絡させていただきます。
              <br />
              今しばらくお待ちくださいませ。
            </Text>
          </Box>
          <Box px={5} pt={10}>
            <Button
              type="button"
              my="3"
              color="white"
              rounded="3xl"
              width="100%"
              bgColor="transparent"
              border={'2px solid white'}
              onClick={handleOnClick}
            >
              トップページへ戻る
            </Button>
          </Box>
        </Flex>
      </Flex>
      <Footer />
    </Box>
  );
};

export default InquirySent;
