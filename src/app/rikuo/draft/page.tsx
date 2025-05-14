'use client';

import { Box, Flex, Image, SimpleGrid, Text, Circle } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';
import { paths, POST_STATUS } from '@/utils/constValues';
import { FishingResultDetail } from '@/types/FishingResultDetail';
import defaultImage from '@/assets/preview.png';
import { CheckIcon } from '@chakra-ui/icons';
import { useCustomToast } from '@/hooks/useCustomToast';
import { ConfirmDialog } from '@/components/uiParts/Dialog/ConfirmDialog';

const RikuoDraft = () => {
  const { userData } = useFetchUserData();
  const router = useRouter();
  const { t } = useTranslation();
  const [draftData, setDraftData] = useState<FishingResultDetail[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const fetchDraftData = useCallback(async () => {
    try {
      const response = await axiosInstance.get<FishingResultDetail[]>(
        `/fishing-results/search/${userData?.id}/${POST_STATUS.DRAFT}`
      );
      setDraftData(response.data);
    } catch (error) {
      console.error('Failed to fetch draft data:', error);
      showErrorToast(t('下書きの取得に失敗しました'), t('下書きの取得に失敗しました'));
    }
  }, [userData, showErrorToast, t]);

  useEffect(() => {
    if (!userData) return;
    fetchDraftData();
  }, [userData, fetchDraftData]);

  const handleItemClick = (id: string) => {
    if (isSelecting) {
      toggleItemSelection(id);
    } else {
      router.push(`${paths.rikuoApply}?fishingResultId=${id}`);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const openDeleteConfirmationModal = () => {
    if (selectedItems.length === 0) return;
    setIsModalOpen(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    try {
      await axiosInstance.delete('/fishing-results', {
        data: { ids: selectedItems },
      });
      // After successful deletion, refresh the list
      await fetchDraftData();
      setSelectedItems([]);
      setIsSelecting(false);
      setIsModalOpen(false);
      showSuccessToast(t('下書きの削除に成功しました'), t('下書きの削除に成功しました'));
    } catch (error) {
      showErrorToast(t('下書きの削除に失敗しました'), t('下書きの削除に失敗しました'));
      console.error('Failed to delete items:', error);
    }
  };

  return (
    <Box bg="black">
      <HeaderMenu />
      <Flex minHeight="100vh" flexDirection="column" textColor="white">
        <Flex py={3} px={4} position="relative" width="100%">
          {isSelecting && (
            <Text
              position="absolute"
              left={5}
              cursor="pointer"
              onClick={() => setIsSelecting(false)}
            >
              {t('キャンセル')}
            </Text>
          )}
          <Text fontWeight="bold" width="100%" textAlign="center">
            {t('下書き')}
          </Text>
          <Text
            position="absolute"
            right={2}
            cursor="pointer"
            onClick={isSelecting ? openDeleteConfirmationModal : () => setIsSelecting(true)}
          >
            {isSelecting ? t('削除') : t('選択')}
          </Text>
        </Flex>
        <SimpleGrid columns={{ base: 3, sm: 3, md: 5 }} spacing={2}>
          {draftData &&
            draftData.map((data) => (
              <Box
                key={data.id}
                position="relative"
                onClick={() => handleItemClick(data.id)}
                cursor="pointer"
              >
                <Box aspectRatio={1}>
                  <Image
                    src={data.imagePathForApply || defaultImage.src}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    loading="lazy"
                  />
                </Box>

                {isSelecting && (
                  <Circle
                    size="30px"
                    position="absolute"
                    top="1"
                    right="1"
                    borderWidth="2px"
                    borderColor="white"
                    bg={selectedItems.includes(data.id) ? 'blue.500' : 'transparent'}
                    overflow="hidden"
                  >
                    {selectedItems.includes(data.id) && <CheckIcon color="white" boxSize={3} />}
                  </Circle>
                )}
              </Box>
            ))}
        </SimpleGrid>
      </Flex>
      <Footer />

      <ConfirmDialog
        title={t('削除の確認')}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleClick={handleDeleteSelected}
        confirmButtonText={t('削除')}
        cancelButtonText={t('キャンセル')}
        confirmButtonColor="red"
      >
        <Text>{t('選択した項目を削除しますか？')}</Text>
        <Text>{t('この操作は元に戻せません。')}</Text>
      </ConfirmDialog>
    </Box>
  );
};

export default RikuoDraft;
