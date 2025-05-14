'use client';

import { Box, Flex } from '@chakra-ui/react';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { Button } from '@chakra-ui/react';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmItem } from '@/components/Inquiry/confirmItem';
import { paths } from '@/utils/constValues';
import { Suspense } from 'react';
import PageLoading from '@/components/uiParts/Loading/PageLoading';

const InquiryConfirmContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const firstNameKana = searchParams.get('firstNameKana');
  const lastNameKana = searchParams.get('lastNameKana');
  const email = searchParams.get('email');
  const content = searchParams.get('content');

  const handleOnClick = () => {
    router.push(paths.inquirySent);
  };

  return (
    <Box bg="brand.bclBgGlay">
      <HeaderMenu />
      <Flex minHeight="100vh" flexDirection="column" px="3">
        <Flex flexGrow={1} flexDirection="column" mb={10} py="12" px="10">
          <ConfirmItem label="お名前" content={`${lastName} ${firstName}`} />
          <ConfirmItem label="フリガナ" content={`${lastNameKana} ${firstNameKana}`} />
          <ConfirmItem label="メールアドレス" content={email as string} />
          <ConfirmItem label="お問い合わせ内容" content={content as string} />
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
            この内容を送信する
          </Button>
        </Flex>
      </Flex>
      <Footer />
    </Box>
  );
};

// useSearchParamsを使う場合は、Suspenseで囲まないとエラーが発生する
const InquiryConfirm = () => {
  return (
        <Suspense fallback={<PageLoading />}>
          <InquiryConfirmContent />
        </Suspense>
  );
};

export default InquiryConfirm;
