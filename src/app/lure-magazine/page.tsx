'use client';

import { Box, Image, Text, Flex, LinkBox, Link } from '@chakra-ui/react';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { Footer } from '@/components/uiParts/Footer/Footer';
import luremaga_header from '@/assets/luremaga_header.png';
import luremaga_logo from '@/assets/icon/luremaga_logo.png';
import luremaga_plus_icon from '@/assets/icon/luremaga_plus_icon.png';
import rikuo_open from '@/assets/rikuo_open.png';
import { useTranslation } from 'react-i18next';
import { paths } from '@/utils/constValues';

const LureMagazine = () => {
  const { t } = useTranslation();
  const mainContent = {
    title: t('陸王オープン'),
    link: paths.rikuoRanking,
    image: rikuo_open,
  };

  const subContents = [
    {
      title: t('ルアマガ＋'),
      link: 'https://plus.luremaga.jp/',
      image: luremaga_plus_icon,
    },
  ];
  return (
    <Box bg="black" color="white">
      <HeaderMenu />
      <Box minHeight="100vh">
        <Flex justifyContent="center" alignItems="center" flexDirection="column">
          <Image src={luremaga_header.src} width="100%" height="150px" objectFit="cover" />
          <Box mt="-55px" width="100px" height="100px" overflow="hidden" borderRadius="full">
            <Image
              src={luremaga_logo.src}
              width="100%"
              height="100%"
              objectFit="cover"
              transform="scale(1.2)"
            />
          </Box>
        </Flex>
        <Link href={mainContent.link}>
          <LinkBox as={Flex} m={{ base: '4', md: '6' }} flexDirection="column" alignItems="center">
            <Image
              src={mainContent.image.src}
              objectFit="cover"
              borderRadius="10px"
              width="100%"
              height={{ base: '200px', md: '250px', lg: '380px' }}
            />
            <Text m="4">{mainContent.title}</Text>
          </LinkBox>
        </Link>
        <Flex justifyContent="flex-start" flexWrap="wrap" m={{ base: '2', md: '4' }}>
          {subContents.map((content, index) => (
            <Link key={index} href={content.link}>
              <LinkBox p="2">
                <Image
                  src={content.image.src}
                  borderRadius="10px"
                  width="130px"
                  height="130px"
                  objectFit="cover"
                />
                <Text textAlign="center" m="2">
                  {content.title}
                </Text>
              </LinkBox>
            </Link>
          ))}
        </Flex>
      </Box>
      <Footer />
    </Box>
  );
};

export default LureMagazine;
