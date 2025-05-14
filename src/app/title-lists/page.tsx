'use client';

import { Button, Flex } from '@chakra-ui/react';
import { useCallback } from 'react';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { paths } from '@/utils/constValues';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const TitleList = () => {
  const router = useRouter();
  const goToFieldTitle = useCallback(() => router.push(paths.fieldTitleList), [router]);
  const goToLureTitle = useCallback(() => router.push(paths.lureTitleList), [router]);
  const { t } = useTranslation();
  return (
    <Flex direction="column" minHeight="100vh" bg="black">
      <HeaderMenu />
      <Flex
        flex="1 0 auto"
        maxW="425px"
        width="100%"
        alignSelf="center"
        px="10"
        flexDirection="column"
        textColor="white"
        justifyContent="center"
      >
        <Button
          type="button"
          my="10"
          rounded="3xl"
          width="100%"
          color="white"
          bgColor="brand.bclBlue"
          onClick={goToFieldTitle}
        >
          {t('フィールド')}
        </Button>
        <Button
          type="button"
          my="10"
          rounded="3xl"
          width="100%"
          color="white"
          bgColor="brand.bclBlue"
          onClick={goToLureTitle}
        >
          {t('ルアー')}
        </Button>
      </Flex>
      <Footer />
    </Flex>
  );
};

export default TitleList;
