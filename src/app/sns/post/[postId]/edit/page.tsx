'use client';

import { Box, Button, Flex, Image, Text, Textarea } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { paths, pathsCreator } from '@/utils/constValues';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';

type SnsFormFields = {
  imagesUrl: string[];
  comment: string;
};

const SnsEdit = () => {
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SnsFormFields>();
  const [snsPost, setSnsPost] = useState<Sns>();
  const { userData } = useFetchUserData();
  const router = useRouter();
  const { postId = '' } = useParams();

  const { t } = useTranslation();

  const isVideo = (path: string) => {
    return /\.(mp4|webm|ogg)$/i.test(path);
  };
  useEffect(() => {
    document.body.style.overflow = 'auto';
  });

  useEffect(() => {
    if (userData && !userData.userName) {
      router.push(paths.myPage);
      showErrorToast(
        <Text whiteSpace="pre-line">
          {t('ユーザーネームは必ず入力してください\nユーザーネームは英数字で入力してください')},
        </Text>,
        t('投稿するにはユーザーネームが必須です')
      );
    }
  }, [router, showErrorToast, userData, t]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/post/${postId}`);
        const data = response.data;
        setSnsPost(data);
        setValue('imagesUrl', [data.imagePath1]);
        setValue('comment', data.comment);
      } catch (error) {
        showErrorToast(t('Failed to fetch post'), t('Failed to fetch post'));
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, showErrorToast, t, setValue]);

  const onSubmit = useCallback(
    async (data: SnsFormFields) => {
      try {
        console.log(data);
        const response = await axiosInstance.patch(`/post/${snsPost?.id}`, {
          images: data.imagesUrl,
          comment: data.comment,
        });
        if (response.status === 204) {
          showSuccessToast(t('投稿を編集しました。'), t('投稿を編集しました。'));
        }
        router.push(pathsCreator.timeline());
        document.body.style.overflow = 'auto';
      } catch (e: any) {
        console.log(e.response);
        showErrorToast(t('失敗しました'), t('投稿編集が失敗しました。'));
      }
    },
    [router, showSuccessToast, showErrorToast, t, snsPost]
  );

  return (
    <Box bg="black">
      <HeaderMenu />
      <Flex
        minHeight="100vh"
        maxW="750px"
        mx="auto"
        flexDirection="column"
        px={{ base: '4', md: '12' }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexGrow={1} flexDirection="column" mb={10} py="12" px="4" gap="8">
            {snsPost?.imagePath1 &&
              (isVideo(snsPost?.imagePath1) ? (
                <Box as="video" borderRadius="lg" boxShadow="xl">
                  <source src={snsPost?.imagePath1} />
                  Your browser does not support the video tag.
                </Box>
              ) : (
                <Image
                  src={snsPost?.imagePath1}
                  alt="Uploaded Media"
                  borderRadius="lg"
                  boxShadow="xl"
                />
              ))}
            <Textarea
              defaultValue={snsPost?.comment}
              {...register('comment', { required: t('コメントは必須です') })}
              rows={10}
              maxLength={2000}
              focusBorderColor="white"
              bg="white"
              color="brand.inputBorderGray"
              isInvalid={!!errors.comment}
            />
            <Button
              isDisabled={isSubmitting || !isDirty}
              type="submit"
              my="10"
              color="white"
              rounded="3xl"
              width="100%"
              bgColor="brand.bclBlue"
            >
              {t('投稿')}
            </Button>
          </Flex>
        </form>
      </Flex>
      <Footer />
    </Box>
  );
};

export default SnsEdit;
