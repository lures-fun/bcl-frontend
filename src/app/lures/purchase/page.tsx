'use client';

import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { LURETYPES, paths } from '@/utils/constValues';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { REDIRECT_URL_COOKIE_KEY } from '@/utils/cookieUtil';
import { usePurchaseLure } from '@/hooks/usePurchaseLure';
import defaultLure from '@/assets/preview.png';
import W3 from '@/assets/W3_CRANKBAIT.gif';
import DRAFTWAKER from '@/assets/DraftWakerComplete.gif';
import HYOUSOU from '@/assets/Hyosou.gif';
import RANKAKU from '@/assets/rankaku.gif';
import TAPPEI from '@/assets/TAPPEI_BNSP.gif';
import LCMTO_Moebi from '@/assets/LC1.5_Moebi.gif';
import LCMTO_Kohaku from '@/assets/LC1.5_Kohaku.gif';
import HMKL_Sakura from '@/assets/HMKL_Super_Jordan_68_SAKURA.gif';
import HMKL_Kizakura from '@/assets/HMKL_Super_Jordan_68_KIZAKURA.gif';
import Nshad from '@/assets/N_Shad.gif';
import BOXER from '@/assets/BOXER_NFT.gif';
import DOTSIX_Kohaku from '@/assets/DotSIXkohaku.gif';
import DOTSIX_Sakura from '@/assets/DotSIXsakura.gif';
import VOLBEAT70F from '@/assets/VOLBEAT70F.gif';
import VOLBEAT70S from '@/assets/VOLBEAT70S.gif';
import BALAM_200_ONDORYA from '@/assets/14OndoryaChart.gif';
import BALAM_300 from '@/assets/BALAM_300_YUKI_01_001.gif';
import VARIANT_255 from '@/assets/VARIANT_255_YUKI_01_001.gif';

import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const handleImg = (lureType: LURETYPES, color: string) => {
  if (lureType === LURETYPES.W3_CRANKBAIT) return W3.src;
  else if (lureType === LURETYPES.DRAFTWAKER) return DRAFTWAKER.src;
  else if (lureType === LURETYPES.HYOUSOU_BAKA_ICHIDAI) return HYOUSOU.src;
  else if (lureType === LURETYPES.RANKAKU_80) return RANKAKU.src;
  else if (lureType === LURETYPES.TAPPEI_BNSP) return TAPPEI.src;
  else if (lureType === LURETYPES.N_SHAD) return Nshad.src;
  else if (lureType === LURETYPES.BOXER) return BOXER.src;
  else if (lureType === LURETYPES.VOLBEAT70F) return VOLBEAT70F.src;
  else if (lureType === LURETYPES.VOLBEAT70S) return VOLBEAT70S.src;
  else if (lureType === LURETYPES.BALAM_300_YUKI) return BALAM_300.src;
  else if (lureType === LURETYPES.VARIANT_255_YUKI) return VARIANT_255.src;
  else if (lureType === LURETYPES.BALAM_200) {
    if (color === '14') return BALAM_200_ONDORYA.src;
    return BALAM_200_ONDORYA.src;
  } else if (lureType === LURETYPES.LC_MTO15) {
    if (color === '01') return LCMTO_Moebi.src;
    return LCMTO_Kohaku.src;
  } else if (lureType === LURETYPES.HMKL_SUPER_JORDAN_68) {
    if (color === '01') return HMKL_Sakura.src;
    return HMKL_Kizakura.src;
  } else if (lureType === LURETYPES.DOT_SIX) {
    if (color === '01') return DOTSIX_Kohaku.src;
    return DOTSIX_Sakura.src;
  } else return defaultLure.src;
};

const PurchaseConfirm = () => {
  const router = useRouter();
  const { userData } = useFetchUserData();
  const searchParams = useSearchParams();
  const lureType = searchParams.get('lureType') as LURETYPES;
  const lureColor = searchParams.get('lureColor') || '01';
  const lureImage = handleImg(lureType, lureColor);
  const lure = lureType && lureType.replace(/_/g, ' ');
  const { isLoading, lurePurchase } = usePurchaseLure();
  Cookies.remove(REDIRECT_URL_COOKIE_KEY, { path: '/lures/purchase' });
  const { t } = useTranslation();

  const handlePurchase = async () => {
    if (!userData) {
      const query = new URLSearchParams({
        lureType,
        lureColor,
        lureImage,
      }).toString();
      router.replace(`${paths.login}?${query}`);
    } else {
      lurePurchase({ lureType, color: lureColor, image: lureImage });
    }
  };

  const handleCancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(paths.home);
    }
  };

  return (
    <Box bg="black">
      {userData && <HeaderMenu />}
      <Flex
        minHeight="100vh"
        maxW="750px"
        mx="auto"
        flexDirection="column"
        px={{ base: '4', md: '12' }}
        align="center"
        gap={10}
      >
        <Box mt={12}>
          <Image
            src={handleImg(lureType, lureColor)}
            w="3xs"
            h="3xs"
            borderRadius={5}
            alt="lure-img"
          />
          <Text color="white" textAlign="center" fontSize={14} mt={2}>
            {lure} #{lureColor}
          </Text>
        </Box>
        <Text color="white" fontSize={14}>
          {t('このルアーを登録しますか?')}
        </Text>
        <Flex flexDir="column" gap={5}>
          <Button
            onClick={handlePurchase}
            isLoading={isLoading}
            loadingText={t('提出する')}
            colorScheme="blue"
            size="sm"
            minW={24}
          >
            {t('登録する')}
          </Button>
          <Button size="sm" minW={24} onClick={handleCancel}>
            {t('登録しない')}
          </Button>
        </Flex>
      </Flex>
      {userData && <Footer />}
    </Box>
  );
};

export default PurchaseConfirm;
