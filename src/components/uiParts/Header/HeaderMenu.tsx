import { Box, Flex, HStack, IconButton, Image, Link as ChakraLink } from '@chakra-ui/react';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';
import { initializeGA, pageView } from '@/lib/gaTracking';
import searchicon from '@/assets/icon/search_icon.png';
import globalIcon from '@/assets/icon/global_icon.svg';
import bellicon from '@/assets/icon/bell_icon.png';
import logotext from '@/assets/logo.png';
import { LANGUAGE, paths } from '@/utils/constValues';
import { getCookies, setWalletAddressCookie, WALLET_ADDRESS_COOKIE_KEY } from '@/utils/cookieUtil';
import { SimpleSelectInput } from '../Input/SimpleSelectInput';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useFetchNotification } from '@/hooks/useFetchNotification';

export const HeaderMenu = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { NotiCount } = useFetchNotification();

  const {
    i18n: { changeLanguage },
  } = useTranslation();
  const { watch, register } = useForm<{ language: LANGUAGE }>({
    defaultValues: {
      language: (getCookies(WALLET_ADDRESS_COOKIE_KEY) as LANGUAGE) ?? LANGUAGE.DEFAULT,
    },
  });
  const language = watch('language');

  function useSnsRoutes() {
    const snsRegex = /^\/sns\/.*/;
    const snsRoutes = pathname.match(snsRegex) || [];
    return snsRoutes;
  }

  function useMatchDaoTalk(routes: string[]) {
    return routes.some((route: string) => route === pathname);
  }

  const isDaoTalk = useMatchDaoTalk(['/timeline/2', '/timeline/2/following']);
  const isSns = useSnsRoutes();

  // check url is on notification or not
  const isNotification = (route: string) => {
    return route === paths.notifications;
  };

  useEffect(() => {
    initializeGA();
  }, []);

  useEffect(() => {
    pageView(pathname);
  }, [pathname]);

  useEffect(() => {
    if (language !== LANGUAGE.DEFAULT) {
      setWalletAddressCookie(language);
    }

    changeLanguage(language);
  }, [changeLanguage, language]);

  return (
    <Box
      bg={isDaoTalk || isSns ? 'transparent' : 'black'}
      px={4}
      borderBottom="1px"
      borderColor="brand.borderGray"
    >
      <Flex h="64px" alignItems="center" justifyContent="center" position="relative">
        {pathname !== paths.home && (
          <ChevronLeftIcon
            boxSize={10}
            color="white"
            fontWeight={2}
            left={-2}
            position={'absolute'}
            onClick={() => router.back()}
          />
        )}
        <HStack spacing={8}>
          {/* Chakra UIのLinkだけを使用 */}
          <ChakraLink href={paths.home}>
            <Image h={8} objectFit="contain" src={logotext.src} alt="Logo Image" />
          </ChakraLink>
        </HStack>
        <SimpleSelectInput
          notSelectablePlaceHolder="Language"
          defaultValue="0"
          name="language"
          placeholder={t('Language')}
          width={{ base: '70px', md: '80px' }}
          height={{ md: '30px', base: '25px' }}
          right={16}
          mr={2}
          left={{ base: 7, md: 'auto' }}
          lineHeight={''}
          position={'absolute'}
          backgroundImage={globalIcon.src}
          backgroundRepeat={'no-repeat'}
          backgroundSize={'contain'}
          textAlign={'right'}
          appearance={'none'}
          options={[
            { value: LANGUAGE.JA, label: t('日本語') },
            { value: LANGUAGE.EN, label: t('英語') },
          ]}
          register={register}
        />
        <Box position={'absolute'} right={9}>
          <Box position="relative">
            {/* Icon Button */}
            <Box position="relative">
              <IconButton
                onClick={() => router.push(paths.notifications)}
                colorScheme="black"
                size="auto"
                disabled={true}
                icon={
                  <Image boxSize={5} objectFit="contain" src={bellicon.src} alt="search_icon" />
                }
                aria-label="Open Notification"
                p="1.5"
                position="relative"
              />

              {/* Notification Count */}
              {NotiCount > 0 && !isNotification(pathname) && (
                <Box
                  position="absolute"
                  top="-1"
                  right="-1"
                  bg="red.500"
                  color="white"
                  fontSize={'xx-small'}
                  borderRadius="full"
                  width={'50%'}
                  height={'50%'}
                  fontWeight="bold"
                  zIndex="1"
                  textAlign={'center'}
                >
                  {NotiCount}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <IconButton
          colorScheme="black"
          size="sm"
          disabled={true}
          icon={<Image boxSize={6} objectFit="contain" src={searchicon.src} alt="search_icon" />}
          aria-label="Open Menu"
          p="1.5"
          position="absolute"
          right="0"
          onClick={() => router.push(paths.userTimelineSearch)}
        />
      </Flex>
    </Box>
  );
});

// memo化されているコンポーネントはdisplayNameを設定する（警告対策）
HeaderMenu.displayName = 'HeaderMenu';
