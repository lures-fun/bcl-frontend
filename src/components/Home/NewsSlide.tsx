import { Box, Flex, Img, Link, LinkBox, Text } from '@chakra-ui/react';
import coin_telegraph from '@/assets/coin_telegraph.jpg';
import lure_magazine_news_202409 from '@/assets/lure_magazine_news_202409.jpg';
import lure_magazine_news_202411 from '@/assets/lure_magazine_news_202411.jpeg';
import { useTranslation } from 'react-i18next';
import tournament_announce from '@/assets/tournament_announce.png';
import bbt_coin from '@/assets/info_bbt.png';
import bbt_ranking_1118 from '@/assets/bbt_ranking_1118.png';
import lure_magazine_news_202501 from '@/assets/lure_magazine_news_202501.jpeg';
import lure_magazine_news_202502 from '@/assets/lure_magazine_news_202502.jpeg';
import bcl_youtube from '@/assets/BCL_youtube_1year.jpg';
import ama_202412 from '@/assets/AMA_202412.jpeg';

export const NewsSlide = () => {
  const { t } = useTranslation();
  const newsItems = [
    {
      title: t('ルアーマガジン記事掲載'),
      link: 'https://plus.luremaga.jp/2025/01/15/402652/',
      image: lure_magazine_news_202502,
    },
    {
      title: t('12/16 豪華対談!\n4社によるAMA開催！'),
      link: 'https://prtimes.jp/main/html/rd/p/000000020.000131228.html',
      image: ama_202412,
    },
    {
      title: t('BCL1周年記念トーナメント\nyoutube公開！'),
      link: 'https://www.youtube.com/watch?v=R2QHqeFUx4s',
      image: bcl_youtube,
    },
    {
      title: t('ルアーマガジン記事掲載'),
      link: 'https://plus.luremaga.jp/2024/11/22/392709/',
      image: lure_magazine_news_202501,
    },
    {
      title: t('BBT獲得ランキング(11/18時点)'),
      link: 'https://bcl-whitepaper.gitbook.io/bcl-whitepaper/bbt-ranking',
      image: bbt_ranking_1118,
    },
    {
      title: t('BBT(Black Bass Token)\nリリースのお知らせ！'),
      link: 'https://jp.cointelegraph.com/news/bcl-aiming-to-be-the-worlds-first-fish-to-earn-to-launch-solana-meme-map-and-issue-black-bass-token-by-the-end-of-the-year?fbclid=IwY2xjawGMBrJleHRuA2FlbQIxMAABHVLkFDAj9JYBOn6zEzVw5BCABegCqcZ30VdlkeqkGfP0HCPZasIJCclt1A_aem_Idj9_r5eC8UlRtCi6n2J0Q',
      image: bbt_coin,
    },
    {
      title: t('BCL1周年記念トーナメント開催！'),
      link: 'https://prtimes.jp/main/html/rd/p/000000018.000131228.html',
      image: tournament_announce,
    },
    {
      title: t('ルアーマガジン記事掲載'),
      link: 'https://plus.luremaga.jp/2024/09/27/379456/',
      image: lure_magazine_news_202411,
    },
    {
      title: t('コインテレグラフ記事掲載'),
      link: 'https://jp.cointelegraph.com/news/fusion-of-web3-and-bass-fishing-new-product-bcl-with-solana-chain',
      image: coin_telegraph,
    },
    {
      title: t('ルアーマガジン記事掲載'),
      link: 'https://plus.luremaga.jp/2024/07/23/363047/',
      image: lure_magazine_news_202409,
    },
  ];

  return (
    <Box boxShadow="base" minWidth="100%">
      <Text fontSize="15px" fontWeight="bold">
        News
      </Text>
      <Flex overflowX="auto" mx="-1.2rem" px={3}>
        {newsItems.map((newsItem, index) => (
          <Link key={index} href={newsItem.link} isExternal maxWidth="220px" mt="8px" mr="8px">
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
                  <Img src={newsItem.image.src} width="143px" height="143px" />
                </Box>
                <Text mt="1rem" fontSize="xs" textAlign="center" minH="2rem" whiteSpace="pre-line">
                  {newsItem.title}
                </Text>
              </Box>
            </LinkBox>
          </Link>
        ))}
      </Flex>
    </Box>
  );
};
