'use client';

import { Box, Button, Flex, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { FormMultiImage } from '@/components/uiParts/Input/FormMultiImage';
import { FormTextArea } from '@/components/uiParts/Input/FormTextArea';
import { ApiLoading } from '@/components/uiParts/Loading/ApiLoading';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { getExtensionsFromBase64 } from '@/lib/videoSupport';
import { paths, pathsCreator } from '@/utils/constValues';
import { decode } from 'urlsafe-base64';
import { useRouter } from 'next/navigation';

type SnsFormFields = {
  imagesUrl: string[];
  imagesUpload: string[];
  comment: string;
};
const SnsPost = () => {
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SnsFormFields>();
  const { userData } = useFetchUserData();
  const images = watch('imagesUpload');
  const [progressValue, setProgressValue] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { t } = useTranslation();
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [hasShownError, setHasShownError] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    // トーストが複数表示されないようにするために、hasShownErrorで状態管理
    if (userData && !userData.userName && !hasShownError) {
      setHasShownError(true);
      if (isMounted) {
        router.push(paths.myPage);
        showErrorToast(
          <Text whiteSpace="pre-line">
            {t('ユーザーネームは必ず入力してください\nユーザーネームは英数字で入力してください')}
          </Text>,
          t('投稿するにはユーザーネームが必須です')
        );
      }
    }

    return () => {
      isMounted = false;
    };
  }, [userData, router, showErrorToast, t, hasShownError]);

  const onSubmit = useCallback(
    async (data: SnsFormFields) => {
      try {
        if (userData?.isGuest) {
          showErrorToast(t('エラーです'), t('ただいまメンテナンス中です'));
          return;
        }
        setIsPosting(true);
        const response = await axiosInstance.post(`/post`, {
          images: data.imagesUrl,
          comment: data.comment,
        });
        if (response.status === 201) {
          if (response.data.earnedToken && response.data.earnedToken > 0) {
            showSuccessToast(
              t('投稿が完了しました。'),
              t(`Black Bass Token（BBT）付与。${response.data.earnedToken}BBT。`)
            );
          } else {
            showSuccessToast(t('投稿が完了しました。'), t('投稿が完了しました。'));
          }
        }
        router.push(pathsCreator.timeline());
      } catch (e: any) {
        console.log(e.response);
        showErrorToast(t('投稿に失敗しました'), t('投稿に失敗しました。'));
      } finally {
        setIsPosting(false);
      }
    },
    [router, showSuccessToast, showErrorToast, t, userData?.isGuest]
  );

  return (
    <Box bg="black">
      {isPosting && <ApiLoading />}
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
            <FormMultiImage
              onChange={async (files) => {
                const urls: string[] = [];
                if (files) {
                  try {
                    setIsUploading(true);
                    for (const file of files) {
                      const extension = getExtensionsFromBase64(file);
                      const binary = decode(file.split(',')[1]);
                      const res = await axiosInstance.get<string>(
                        `/s3/presigned-url/post/${extension}`
                      );
                      await axios({
                        method: 'PUT',
                        url: res.data,
                        data: binary,
                        onUploadProgress: (progressEvent) => {
                          // undefinedの可能性があるため、1を設定
                          const total = progressEvent.total ?? 1;
                          const progress = Math.round((progressEvent.loaded / total) * 100);
                          setProgressValue(progress);
                        },
                      });
                      const url = new URL(res.data);
                      urls.push(`${url.origin}${url.pathname}`);
                      if (files) {
                        setValue('imagesUrl', urls, { shouldDirty: true });
                        setValue('imagesUpload', files, { shouldDirty: true });
                      }
                    }
                  } catch (e) {
                    showErrorToast(
                      t('アップロード処理が失敗しました'),
                      t('再アップロードしてください')
                    );
                    return;
                  } finally {
                    setIsUploading(false);
                    setProgressValue(0);
                  }
                }
              }}
              label={t('釣りトーク投稿')}
              error={errors.imagesUpload}
              fileSize={5 * 1024 * 1024}
              videoSize={500 * 1024 * 1024}
              register={register}
              validation={{ required: t('画像/動画アップロードは必須です') }}
              name="imagesUpload"
              defaultImage={images}
              progressValue={progressValue}
              isUploading={isUploading}
            />
            <FormTextArea
              label={t('テキスト')}
              name="comment"
              register={register}
              type={'textarea'}
              rows={10}
              maxLength={2000}
              focusBorderColor="white"
              bg="white"
              color="brand.inputBorderGray"
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

export default SnsPost;
