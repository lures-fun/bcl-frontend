'use client';

import { Box, Grid, Image, Link, Text } from '@chakra-ui/react';
import { paths } from '@/utils/constValues';
import lure_registration from '@/assets/icon/lure_registration.svg';
import fishing_result from '@/assets/fishing_result .svg';
import BCLshop from '@/assets/BCLshop.svg';
import ranking from '@/assets/ranking.svg';
import title from '@/assets/title.svg';
import FAQ from '@/assets/FAQ.svg';
import inquiry from '@/assets/inquiry.svg';
import X from '@/assets/X.svg';
import insta from '@/assets/insta.svg';
import discord from '@/assets/Discord.svg';
import use_BCL from '@/assets/use_BCL.svg';
// import bbt_exchange from '@/assets/bbt_exchange.svg';
import { useCallback } from 'react';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export const MenuGrid = () => {
  const { userData } = useFetchUserData();
  const router = useRouter();
  const { t } = useTranslation();

  const { showErrorToast } = useCustomToast();

  const isUserData = useCallback(() => {
    if (userData && !userData.userName) {
      router.push(paths.myPage);
      showErrorToast(
        <Text whiteSpace="pre-line">
          {t('ユーザーネームは必ず入力してください\nユーザーネームは英数字で入力してください')},
        </Text>,
        t('釣果申請するにはユーザーネームが必須です')
      );
    } else {
      router.push(paths.lureCreate);
    }
  }, [showErrorToast, userData, router, t]);

  const MENUITEMS = [
    {
      alt: t('ルアー登録'),
      text: t('ルアー登録'),
      image: lure_registration,
      isExternal: false,
      onClick: isUserData,
    },
    {
      alt: t('釣果申請'),
      text: t('釣果申請'),
      link: paths.fishingResultCreate,
      image: fishing_result,
      isExternal: false,
    },
    {
      alt: t('BCL Shop'),
      text: t('BCL Shop'),
      link: 'https://blockchainlures.myshopify.com/',
      // link: 'https://xn-cckjx0c6ak6k8gna8d4ed.myshopify.com/',
      image: BCLshop,
      isExternal: true,
      // onClick: handleLinkClick,
    },
    {
      alt: t('ランキング'),
      text: t('ランキング'),
      link: paths.rankings,
      image: ranking,
      isExternal: false,
    },
    {
      alt: t('タイトル'),
      text: t('タイトル'),
      link: paths.titleLists,
      image: title,
      isExternal: false,
    },
    {
      alt: t('BCLの使い方'),
      text: t('BCLの使い方'),
      link: 'https://bcl-shuo-ming.gitbook.io/bcl_instructions/',
      image: use_BCL,
      isExternal: true,
    },
    {
      alt: t('FAQ'),
      text: t('FAQ'),
      link: 'https://bcl-whitepaper.gitbook.io/bcl-whitepaper/faq',
      image: FAQ,
      disabled: false,
      isExternal: true,
    },
    {
      alt: t('問い合わせ'),
      text: t('問い合わせ'),
      link: 'https://docs.google.com/forms/d/e/1FAIpQLSfpmbEKCZMCEoSyv9IXpOGqGBvoi295IyJkH7CJZ4MnBAKycQ/viewform',
      image: inquiry,
      isExternal: true,
    },
    {
      alt: t('X'),
      text: t('X'),
      link: 'https://twitter.com/blockchainlures',
      image: X,
      isExternal: true,
    },
    {
      alt: t('Instagram'),
      text: t('Instagram'),
      link: 'https://www.instagram.com/blockchainlures',
      image: insta,
      isExternal: true,
    },
    {
      alt: t('Discord'),
      text: t('Discord'),
      link: 'https://t.co/lSbZk8F511',
      image: discord,
      isExternal: true,
    },
    // {
    //   alt: t('BBT交換所'),
    //   text: t('BBT交換所'),
    //   link: 'https://x.bcl.fish',
    //   image: bbt_exchange,
    //   isExternal: true,
    // },
  ];

  return (
    <Grid templateColumns="repeat(4, 1fr)" mx={-4} mt="1rem" justifyItems="center">
      {MENUITEMS.map((menuItem, index) => (
        <Box key={index} mt="0.5rem">
          <Link
            href={menuItem.link}
            isExternal={menuItem.isExternal}
            // onClick={menuItem.onClick ? (e) => handleLinkClick(menuItem.link, e) : undefined}
            onClick={
              menuItem.onClick
                ? (e) => {
                    menuItem.onClick();
                    e.preventDefault();
                  }
                : undefined
            }
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              w="62px"
              h="62px"
              borderRadius="50%"
              overflow="hidden"
              bg="white"
              boxShadow="md"
              mx="auto"
            >
              <Box mx="auto" my="auto">
                <Image
                  src={menuItem.image.src}
                  alt={menuItem.alt}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  alignItems="center"
                />
              </Box>
            </Box>
            <Text fontSize="0.7rem" textAlign="center" mt="0.3rem">
              {menuItem.text}
            </Text>
          </Link>
        </Box>
      ))}
      {/* <Box mt="0.5rem">
        <Link href="">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            w="70px"
            h="70px"
            borderRadius="50%"
            overflow="hidden"
            bg="white"
            boxShadow="md"
            opacity="0.8"
          >
            <Box mx="auto" my="auto">
              <Image src={wallet} alt="ウォレット" w="100%" h="100%" objectFit="cover" />
            </Box>
          </Box>
          <Text fontSize="0.7rem" textAlign="center" mt="0.3rem" opacity="0.7">
            ウォレット
          </Text>
        </Link>
      </Box> */}
    </Grid>
  );
};
