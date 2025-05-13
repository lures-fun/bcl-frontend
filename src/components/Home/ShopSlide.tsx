import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, Img, Link, LinkBox, Text } from '@chakra-ui/react';
import DraftWakerComplete from '@/assets/DraftWakerComplete.gif';
import TAPPEI_BNSP from '@/assets/TAPPEI_BNSP.gif';
import W3_CRANKBAIT from '@/assets/W3_CRANKBAIT.gif';
import HMKL_Super_Jordan_68_SAKURA from '@/assets/HMKL_Super_Jordan_68_SAKURA.gif';
import HMKL_Super_Jordan_68_KIZAKURA from '@/assets/HMKL_Super_Jordan_68_KIZAKURA.gif';
import LC_MTO_Moebi from '@/assets/LC1.5_Moebi.gif';
import LC_MTO_Kohaku from '@/assets/LC1.5_Kohaku.gif';

export const ShopSlide = () => {
  const shopItems = [
    // {
    //   title: 'Shopify テスト用リンク',
    //   link: 'https://xn-cckjx0c6ak6k8gna8d4ed.myshopify.com/',
    //   image: W3_CRANKBAIT,
    // },
    {
      title: 'HMKL Super Jordan 68\nBCL KIZAKURA',
      link: 'https://blockchainlures.myshopify.com/collections/hmkl-super-jordan-68-bcl-kizakura',
      image: HMKL_Super_Jordan_68_KIZAKURA,
    },
    {
      title: 'HMKL Super Jordan 68\nBCL SAKURA',
      link: 'https://blockchainlures.myshopify.com/collections/2024%E5%B9%B48%E6%9C%888%E6%97%A5%E7%99%BA%E5%A3%B2%E9%96%8B%E5%A7%8B%E4%BA%88%E5%AE%9A',
      image: HMKL_Super_Jordan_68_SAKURA,
    },
    {
      title: 'LC MTO 1.5\nMSコハクシャッド',
      link: 'https://blockchainlures.myshopify.com/products/2025%E9%99%90%E5%AE%9A%E7%99%BA%E5%A3%B2-lc-mto-1-5-ms%E7%90%A5%E7%8F%80%E3%82%B7%E3%83%A3%E3%83%83%E3%83%89-bcl%E3%82%AA%E3%83%AA%E3%82%B8%E3%83%8A%E3%83%AB%E3%82%AB%E3%83%A9%E3%83%BC',
      image: LC_MTO_Kohaku,
    },
    {
      title: 'LC MTO 1.5\nMSモエビシャッド',
      link: 'https://blockchainlures.myshopify.com/collections/coming-soon-lc1-5-ms%E3%83%A2%E3%82%A8%E3%83%93%E3%82%B7%E3%83%A3%E3%83%83%E3%83%89-lucky-craft-bcl',
      image: LC_MTO_Moebi,
    },

    {
      title: 'W3CRANKBAIT',
      link: 'https://blockchainlures.myshopify.com/collections/w3',
      image: W3_CRANKBAIT,
    },
    {
      title: 'DRAFT WAKER',
      link: 'https://blockchainlures.myshopify.com/collections/draft-waker ',
      image: DraftWakerComplete,
    },
    {
      title: 'BCL×GEEC RACK\nTAPPEI BNSP',
      link: 'https://blockchainlures.myshopify.com/products/%E3%83%99%E3%83%AD%E3%83%BC%E3%82%BA%E3%82%AE%E3%83%AB-tappei-bnsp-bcl%E3%82%AA%E3%83%AA%E3%82%B8%E3%83%8A%E3%83%AB%E3%82%AB%E3%83%A9%E3%83%BC',
      image: TAPPEI_BNSP,
    },
  ];

  return (
    <Box boxShadow="base" minWidth="100%">
      <Flex justify="space-between" alignItems="center">
        <Heading size="md">Shop</Heading>
        <Link
          // href={addQueryParams('https://blockchainlures.myshopify.com/', memberId, oneTimeToken)}
          href="https://blockchainlures.myshopify.com/"
          isExternal
        >
          <ChevronRightIcon boxSize={10} color="white" fontWeight={2} />
        </Link>
      </Flex>

      <Flex overflowX="auto" mb="0.7rem" mx="-1.2rem" px={3}>
        {shopItems.map((shopItem, index) => (
          <Link
            key={index}
            // onClick={() => handleLinkClick(shopItem.link)}
            href={shopItem.link}
            isExternal
            maxWidth="220px"
            mt="8px"
            mr="8px"
          >
            <LinkBox alignContent="center">
              <Box
                width="160px"
                height="190px"
                rounded="xl"
                overflow="hidden"
                borderStyle="solid"
                boxShadow="base"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <Box
                  width="143px"
                  height="143px"
                  rounded="xl"
                  overflow="hidden"
                  borderStyle="solid"
                  boxShadow="base"
                >
                  <Img src={shopItem.image.src} width="143px" height="143px" />
                </Box>
                <Text mt="1rem" fontSize="xs" textAlign="center" minH="2rem" whiteSpace="pre-line">
                  {shopItem.title}
                </Text>
              </Box>
            </LinkBox>
          </Link>
        ))}
      </Flex>
    </Box>
  );
};
