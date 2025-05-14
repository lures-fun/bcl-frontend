'use client';

import { Box, Flex, Link, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import {
  GoogleRestoreResponse,
  GoogleRestoreWallet,
  GoogleWalletFounder,
  UserInfo,
  AppleRestoreWallet,
  AppleRestoreResponse,
  AppleWalletFounder,
  AppleUserInfo,
} from '@nokey-wallet/adapter';
import logo from '@/assets/BCL_logo.png';
import background from '@/assets/TOP.png';
import solanaLogo from '@/assets/solanaLogo.svg';
import { useEffect, useState } from 'react';
import { useCustomToast } from '@/hooks/useCustomToast';
import LoginCheckbox from '@/components/uiParts/Checkbox/LoginCheckbox';
import { encryptText } from '@/lib/crypt';
import axiosInstance from '@/lib/axiosInstance';
import { REDIRECT_URL_COOKIE_KEY, setAuthToken } from '@/utils/cookieUtil';
import { useRouter, useSearchParams } from 'next/navigation';
import ApiLoading from '@/components/uiParts/Loading/ApiLoading';
import { useAuthenticate } from '@/hooks/useAuthenticate';
import { usePurchaseLure } from '@/hooks/usePurchaseLure';
import Cookies from 'js-cookie';
import { LURETYPES } from '@/utils/constValues';

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticate, authState } = useAuthenticate();
  const [isEnable] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [, setIsRedirect] = useState(false);
  const [, setUserInfo] = useState<UserInfo | AppleUserInfo>();
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const nativeAppUrl = process.env.NEXT_PUBLIC_MOBILE_SCHEME as string;
  const [isLoading, setIsLoading] = useState(false);

  const lureType = searchParams.get('lureType') as LURETYPES;
  const color = searchParams.get('lureColor');
  const image = searchParams.get('lureImage');
  const { lurePurchase } = usePurchaseLure();

  useEffect(() => {
    (async () => {
      const redirectUrl = Cookies.get(REDIRECT_URL_COOKIE_KEY) || '/home';
      await authenticate(redirectUrl);
      if (authState.auth.checkedAuth && authState.auth.loggedIn) {
        router.push(redirectUrl);
      }
    })();
  }, [authState.auth.checkedAuth, authState.auth.loggedIn, authenticate, router]);

  const goToHome = () => {
    setIsRedirect(true);
    router.push('/home');
  };

  const onOkGoogle = async (ok: GoogleRestoreResponse) => {
    console.debug('#### onOk ####', ok);
    setIsLoading(true);
    setUserInfo(ok.userInfo);
  };

  const onOkApple = async (ok: AppleRestoreResponse) => {
    console.debug('#### onOk ####', ok);
    setIsLoading(true);
    setUserInfo(ok.userInfo);
  };

  const onErr = (err: Error) => {
    console.log('#### onErr ####', err);
    showErrorToast('失敗しました', 'ログインに失敗しました');
  };

  return (
    <>
      {isLoading && <ApiLoading />}
      <Flex minH="100vh" maxH="100%" justify="center" bg="black">
        <Stack
          spacing={8}
          mx="auto"
          maxW="lg"
          w="100%"
          py={12}
          px={6}
          bgImage={`url(${background.src})`}
          backgroundPosition="bottom"
          backgroundSize="100% 100%"
          backgroundRepeat="no-repeat"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <Stack align="center" position="absolute" top={['20%', '15%', '20%', '20%']}>
            <Box width={{ base: '40%', md: '30%', lg: '30%' }} position="relative">
              <Image src={logo} alt="logo" layout="responsive" objectFit="contain" />
            </Box>
          </Stack>
          <Box
            style={{
              opacity: isAgree ? 1 : 0.5,
              pointerEvents: isAgree ? 'auto' : 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            <GoogleWalletFounder clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}>
              <GoogleRestoreWallet
                onOk={onOkGoogle}
                onErr={onErr}
                useOneTap={isEnable}
                auto_select
                width="235px"
              />
            </GoogleWalletFounder>
            <AppleWalletFounder
              clientId={process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!}
              redirectURI={process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI!}
            >
              <AppleRestoreWallet
                onOk={onOkApple}
                onErr={onErr}
                style={{ color: 'white', borderRadius: '10px', width: '235px', height: '40px' }}
              />
            </AppleWalletFounder>
          </Box>
          <Stack align="center">
            <Flex
              pl="2"
              textColor="white"
              textAlign="center"
              gap={2}
              fontSize={[10, 13, 14]}
              alignItems="center"
            >
              <LoginCheckbox onChange={(e) => setIsAgree(e.target.checked)} />
              <Flex>
                <Link
                  href="http://www.blockchain-lures.com/kiyaku/"
                  target="_blank"
                  textDecoration={'underline'}
                >
                  利用規約
                </Link>
                <Text>と</Text>
                <Link
                  href="http://www.blockchain-lures.com/privacy_policy/"
                  target="_blank"
                  textDecoration={'underline'}
                >
                  プライバシーポリシー
                </Link>
                <Text>に同意する</Text>
              </Flex>
            </Flex>
          </Stack>
          <Stack align="center" position="fixed" bottom="60px" left="0" right="0">
            <Text color="white" fontSize={12} align="left" w="120px" fontWeight="bold">
              Powered by
            </Text>
            <Image src={solanaLogo} alt="solanaLogo" width={120} />
          </Stack>
        </Stack>
      </Flex>
    </>
  );
};

export default Login;
