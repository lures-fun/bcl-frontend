'use client';

import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { FieldByBlockCode } from '@/types/Ranking';
import { APPLY_TYPE, paths } from '@/utils/constValues';
import { useRouter } from 'next/navigation';
import { RikuoFiveColumnsStyle } from '@/components/Ranking/RikuoFiveColumnStyle';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { useCustomToast } from '@/hooks/useCustomToast';

const RikuoRanking = () => {
  const { t } = useTranslation();
  const router = useRouter();
  // default tab is 'A'
  const [activeTab, setActiveTab] = useState('A');
  const [rankingData, setRankingData] = useState<FieldByBlockCode[]>([]);
  const [isRankingFullyDisplayed, setIsRankingFullyDisplayed] = useState(false);
  const { userData } = useFetchUserData();
  const { showErrorToast } = useCustomToast();

  const fetchRikuoRanking = useCallback(
    async (blockCode: string) => {
      try {
        const FieldsByBlockCodeResponse = await axiosInstance.get<FieldByBlockCode[]>(
          `/ranking/${APPLY_TYPE.RIKUO}/${blockCode}`
        );
        setRankingData(FieldsByBlockCodeResponse.data);
      } catch (error) {
        console.error('Failed to fetch ranking data:', error);
        showErrorToast(t('ランキングの取得に失敗しました'), t('ランキングの取得に失敗しました'));
      }
    },
    [showErrorToast, t]
  );

  useEffect(() => {
    fetchRikuoRanking(activeTab);
  }, [activeTab, fetchRikuoRanking]);
  // Define block codes for tabs
  const blockCodes = ['A', 'B', 'C', 'D'];

  return (
    <Box bg={'black'} color={'white'}>
      <HeaderMenu />
      <Flex minHeight={'100vh'} flexDirection={'column'} width={'95%'} mx={'auto'} py={4}>
        <Text py={3} fontWeight={'bold'} textAlign={'center'}>
          {t('陸王オープン2025 ランキング')}
        </Text>
        <Tabs variant="unstyled" isFitted onChange={(index) => setActiveTab(blockCodes[index])}>
          <TabList borderBottom="1px" borderBottomColor="gray">
            {blockCodes.map((code) => (
              <Tab
                key={code}
                _selected={{
                  borderBottom: '2px solid',
                  borderBottomColor: 'white',
                }}
              >
                {t(code)}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {blockCodes.map((code) => (
              <TabPanel key={code}>
                <RikuoFiveColumnsStyle
                  FieldsRanking={rankingData}
                  isRankingFullyDisplayed={isRankingFullyDisplayed}
                />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
        {!isRankingFullyDisplayed && (
          <Text
            textAlign="center"
            py={3}
            onClick={() => setIsRankingFullyDisplayed(true)}
            cursor="pointer"
          >
            {t('続きを読む')}
          </Text>
        )}
        <Box
          as="button"
          bg="#c0001e"
          color="white"
          px={4}
          py={3}
          borderRadius="md"
          textAlign="center"
          mx="auto"
          display="block"
          width="100%"
          fontSize="3xl"
          fontFamily="'ヒラギノ角ゴシック W6', 'Hiragino Kaku Gothic W6', sans-serif"
          fontWeight="extrabold"
          mb={2}
          letterSpacing="wider"
          _hover={{ bg: '#800014' }}
          boxShadow="0px 3px 8px rgba(0, 0, 0, 0.8)"
          onClick={() => router.push(paths.rikuoApply)}
        >
          {t('陸王オープン釣果登録')}
        </Box>
        <Flex justifyContent="flex-start" gap={4} mt={2}>
          <Text
            as="a"
            onClick={() => {
              if (!userData?.userName) {
                t('ユーザーデータが見つかりません');
                return;
              }
              router.push(paths.RikuoDraft);
            }}
            textDecoration="underline"
            textDecorationColor="gray"
            textUnderlineOffset="6px"
            cursor="pointer"
          >
            {t('下書き')}
          </Text>
          <Text
            as="a"
            href="https://docs.google.com/forms/d/e/1FAIpQLSeax1AOvcFKWM1DH0Jf5Gcf-9WE0ZvWrDVXRj352iDdFZzWuA/viewform"
            textDecoration="underline"
            textDecorationColor="gray"
            textUnderlineOffset="6px"
            cursor="pointer"
          >
            {t('お問い合わせ')}
          </Text>
        </Flex>
      </Flex>
      <Footer />
    </Box>
  );
};

export default RikuoRanking;
