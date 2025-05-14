'use client';

import { Box, Button, Divider, Flex, FormLabel, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/components/uiParts/Input/FormInput';
import { FormTextArea } from '@/components/uiParts/Input/FormTextArea';
import { SelectInput } from '@/components/uiParts/Input/SelectInput';
import { useCustomToast } from '@/hooks/useCustomToast';
import axiosInstance from '@/lib/axiosInstance';
import { getExtensionsFromBase64 } from '@/lib/videoSupport';
import { Lure } from '@/types/Lure';
import { FieldMaster } from '@/types/Master';
import {
  APPLY_TYPE,
  LURETYPES,
  POST_STATUS,
  S3_TYPES,
  convertToColorNumber,
  displayLureNames,
  paths,
} from '@/utils/constValues';
import { decode } from 'urlsafe-base64';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { useTranslation } from 'react-i18next';
import { FishingResultDetail } from '@/types/FishingResultDetail';
import { FormProviderNumberInput } from '@/components/uiParts/Input/FormProviderNumberInput';
import { FormImage } from '@/components/uiParts/Input/FormImage';

type FishingApplicationFormFields = {
  imageForApply: string;
  imageUrlForApply: string;
  caughtYearAt: number;
  caughtMonthAt: number;
  caughtDayAt: number;
  size: number;
  field: string;
  freeTextRod: string;
  freeTextReel: string;
  freeTextLine: string;
  title: string;
  comment: string;
  prefecture: string;
  lureId: string;
  freeTextLure: string;
  latitude: string;
  longitude: string;
};

type Props = {
  fishingResultId?: string;
  tackleBox?: Lure[];
  fieldMaster?: FieldMaster[];
};

const START_DAY = 23;
const START_MONTH = 10;
const START_YEAR = 2023;
const years = [...Array(new Date().getFullYear() - (START_YEAR - 1))].map(
  (_, i) => new Date().getFullYear() + i
);

export const RikuoApplicationForm = ({ fishingResultId, tackleBox, fieldMaster }: Props) => {
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { t } = useTranslation();

  const [dayOptions, setDayOptions] = useState<number[]>([]);
  const [monthOptions, setMonthOptions] = useState<number[]>([]);
  const [fieldOptions, setFieldOptions] = useState<FieldMaster[]>([]);
  const [uploadProgress, setUploadProgress] = useState({
    imageForApply: 0,
  });
  const [isUploading, setIsUploading] = useState({
    imageForApply: false,
  });
  // 位置情報の許可状態を管理
  const [locationPermitted, setLocationPermitted] = useState<boolean | null>(null);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useFormContext<FishingApplicationFormFields>();
  const selectedYear = watch('caughtYearAt');
  const selectedMonth = watch('caughtMonthAt');
  const imageForApply = watch('imageForApply');
  const freeTextLure = watch('freeTextLure');
  const lureId = watch('lureId');
  const { userData } = useFetchUserData();
  const lureInputError =
    freeTextLure && lureId ? t('ルアーは、どちらか一つの入力形式のみ入力してください') : null;

  // 画面初期表示時に位置情報許可をリクエスト
  useEffect(() => {
    const initializeLocation = async () => {
      if (!navigator.geolocation) {
        setLocationPermitted(false);
        return;
      }
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          });
        });

        // 位置情報が取得できた場合
        setLocationPermitted(true);
        setValue('latitude', String(position.coords.latitude), { shouldDirty: true });
        setValue('longitude', String(position.coords.longitude), { shouldDirty: true });
      } catch (error) {
        // 位置情報が拒否された場合
        setLocationPermitted(false);
        setValue('latitude', '', { shouldDirty: true });
        setValue('longitude', '', { shouldDirty: true });
        showErrorToast(
          t('位置情報が必要です'),
          t('画像のアップロードには位置情報の許可が必要です。設定から位置情報を許可してください。')
        );
      }
    };

    initializeLocation();
  }, [setValue, showErrorToast, t]);

  const fetchFishingResults = useCallback(async () => {
    // fishingResultIdがないまたは、Usernameがない場合は何もせず、早期return
    if (!fishingResultId || !userData?.userName) {
      return;
    }
    try {
      const endpoint = `/fishing-results/${userData.userName}/${fishingResultId}`;
      const response = await axiosInstance.get<FishingResultDetail>(endpoint);

      const caughtAtDate = new Date(response.data.caughtAt);
      const caughtYearAt = caughtAtDate.getFullYear();
      const caughtMonthAt = caughtAtDate.getMonth() + 1;
      const caughtDayAt = caughtAtDate.getDate();

      reset({
        caughtYearAt,
        caughtMonthAt,
        caughtDayAt,
        field: response.data.field,
        size: response.data.size,
        lureId: response.data.lure.id,
        freeTextLure: response.data.freeTextLure,
        freeTextRod: response.data.freeTextRod,
        freeTextReel: response.data.freeTextReel,
        freeTextLine: response.data.freeTextLine,
        title: response.data.title,
        comment: response.data.comment,
        imageForApply: response.data.imagePathForApply,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
      });
    } catch (error) {
      console.error('釣果詳細の取得に失敗しました:', error);
      showErrorToast(t('エラー'), t('釣果詳細の取得に失敗しました'));
    }
  }, [fishingResultId, userData?.userName, showErrorToast, t, reset]);

  useEffect(() => {
    if (fishingResultId) {
      fetchFishingResults();
    }
  }, [fishingResultId, fetchFishingResults]);

  useEffect(() => {
    if (fieldMaster) {
      // フィールドマスターからblockCodeがあるものだけをフィルタリング
      const filteredFields = fieldMaster
        .filter((field) => field.blockCode)
        // blockCodeでソート（A, B, C...の順）
        .sort((a, b) => {
          if (a.blockCode && b.blockCode) {
            return a.blockCode.localeCompare(b.blockCode);
          }
          return 0;
        })
        // 表示名を「Aブロック（fieldname）」の形式に変更
        .map((field) => ({
          ...field,
          name: `${field.blockCode}ブロック（${field.name}）`,
        }));

      setFieldOptions(filteredFields);
    }
  }, [fieldMaster]);

  useEffect(() => {
    const daysInMonth =
      selectedYear && selectedMonth ? new Date(selectedYear, selectedMonth, 0).getDate() : 31;
    if (selectedYear === 2023 && selectedMonth === 10) {
      setDayOptions(
        Array.from({ length: daysInMonth - (START_DAY - 1) }, (_, i) => START_DAY - 1 + i + 1)
      );
    } else setDayOptions(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (selectedYear === 2023)
      setMonthOptions(
        Array.from({ length: 12 - (START_MONTH - 1) }, (_, i) => START_MONTH - 1 + i + 1)
      );
    else setMonthOptions(Array.from({ length: 12 }, (_, i) => i + 1));
  }, [selectedYear]);

  const handleFile = useCallback(
    async (file: any, fileUrlField: any, filePropField: any, s3Url: string) => {
      // 位置情報が許可されていない場合はアップロードを拒否
      if (!locationPermitted) {
        showErrorToast(
          t('画像のアップロードには、位置情報が必要です'),
          t('位置情報を許可してから画像をアップロードしてください')
        );
        return;
      }
      // 既に最新の位置情報が設定されていない場合は再取得
      const currentLatitude = watch('latitude');
      const currentLongitude = watch('longitude');
      if (!currentLatitude || !currentLongitude) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0, // 最新の位置情報を取得
            });
          });

          setValue('latitude', String(position.coords.latitude), { shouldDirty: true });
          setValue('longitude', String(position.coords.longitude), { shouldDirty: true });
        } catch (error) {
          showErrorToast(
            t('位置情報の取得に失敗しました'),
            t('位置情報を許可してから再試行してください')
          );
          return;
        }
      }
      // 画像のアップロード処理
      if (file) {
        try {
          setIsUploading({ ...isUploading, [filePropField]: true });
          const extension = getExtensionsFromBase64(file);
          const binary = decode(file.split(',')[1]);
          const response = await axiosInstance.get<string>(`${s3Url}/${extension}`);
          await axios({
            method: 'PUT',
            url: response.data,
            data: binary,
            onUploadProgress: (progressEvent) => {
              // undefinedの可能性があるため、1を設定
              const total = progressEvent.total ?? 1;
              const progress = Math.round((progressEvent.loaded / total) * 100);
              setUploadProgress((prev) => ({ ...prev, [filePropField]: progress }));
            },
          });
          const url = new URL(response.data);
          if (file) {
            setValue(fileUrlField, `${url.origin}${url.pathname}`, { shouldDirty: true });
            setValue(filePropField, file, { shouldDirty: true });
          }
        } catch (e) {
          showErrorToast(t('アップロード処理が失敗しました'), t('再アップロードしてください'));
        } finally {
          setIsUploading((prev) => ({ ...prev, [filePropField]: false }));
          setUploadProgress((prev) => ({ ...prev, [filePropField]: 0 }));
        }
      }
    },
    [setValue, showErrorToast, isUploading, t, locationPermitted, watch]
  );

  const onSubmit = useCallback(
    async (formData: FishingApplicationFormFields) => {
      try {
        if (userData?.isGuest) {
          showErrorToast(t('エラーです'), t('ただいまメンテナンス中です'));
          return;
        }
        // 両方のルアー入力がある場合のバリデーション
        if (formData.freeTextLure && formData.lureId) {
          showErrorToast(
            t('ルアー入力エラー'),
            t(
              'ルアーは、テキストボックスまたはドロップダウンリストのどちらか一つを入力してください。'
            )
          );
          return;
        }
        const endpoint = `/fishing-results/upsert`;
        const response = await axiosInstance.post(endpoint, {
          id: fishingResultId,
          caughtYearAt: formData.caughtYearAt,
          caughtMonthAt: formData.caughtMonthAt,
          caughtDayAt: formData.caughtDayAt,
          field: formData.field,
          size: formData.size,
          lureId: formData.lureId,
          freeTextLure: formData.freeTextLure,
          freeTextRod: formData.freeTextRod,
          freeTextReel: formData.freeTextReel,
          freeTextLine: formData.freeTextLine,
          title: formData.title,
          comment: formData.comment,
          imageForApply: formData.imageUrlForApply,
          applyType: APPLY_TYPE.RIKUO,
          postStatus: POST_STATUS.PUBLISHED,
          latitude: formData.latitude,
          longitude: formData.longitude,
        });
        if (response.status === 200) {
          showSuccessToast(t('陸王釣果申請が完了しました。'), t('審査結果をお待ちください。'));
          if (fishingResultId) {
            window.location.href = paths.rikuoApply;
          } else {
            reset();
          }
        }
      } catch (e: any) {
        console.log(e.response);
        showErrorToast(t('申請に失敗しました。'), e.response?.data?.message[0]);
      }
    },
    [userData?.isGuest, showErrorToast, t, showSuccessToast, reset, fishingResultId]
  );

  const handleLureLabel = (lureType: Lure['lureType'], lureColor) => {
    if (lureType === LURETYPES.W3_CRANKBAIT || lureType === LURETYPES.DRAFTWAKER) {
      return `${lureType.split('_').join(' ')}#${lureColor}`;
    } else if (lureType === LURETYPES.COIKE) {
      // COIKEの場合はカラーを数値に変換して表示。表示用の値とデータ保持用のカラーが異なるため。
      const lureColorCoike = convertToColorNumber(lureType, lureColor);
      return `${displayLureNames(lureType, lureColor)}#${lureColorCoike}`;
    } else {
      return `${displayLureNames(lureType, lureColor)}#${lureColor}`;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        minHeight="100vh"
        maxW="750px"
        mx="auto"
        flexDirection="column"
        textColor="white"
        p="8"
        px={{ base: '4', md: '12' }}
        gap="3"
      >
        <Flex px="6" py="4" alignSelf="center" direction="column" width="100%">
          <FormImage
            onChange={async (file) =>
              handleFile(
                file,
                'imageUrlForApply',
                'imageForApply',
                `/s3/presigned-url/${S3_TYPES.FISHING_RESULT_APPLY}`
              )
            }
            label={t('申請用画像アップロード')}
            subLabel={t('※ルアマガメジャー〜')}
            error={errors.imageForApply}
            fileSize={30 * 1024 * 1024}
            videoSize={500 * 1024 * 1024}
            register={register}
            validation={{ required: t('申請用画像/動画アップロードは必須です') }}
            name="imageForApply"
            defaultImage={imageForApply}
            progressValue={uploadProgress.imageForApply}
            isUploading={isUploading.imageForApply}
            isImageOnly={true}
            isCameraOnly={true}
          />
          <Divider mb={6} />
        </Flex>
        <Box>
          <Flex gap="5">
            <SelectInput
              label={t('年')}
              name="caughtYearAt"
              type="number"
              options={years.map((y) => ({ label: y, value: y }))}
              register={register}
              placeholder={t('選択')}
              validation={{ required: t('年は必須です。') }}
              error={errors.caughtYearAt}
              showError={false}
              showLine={true}
              focusBorderColor="white"
              bg="white"
              color="brand.inputBorderGray"
            />
            <SelectInput
              label={t('月')}
              name="caughtMonthAt"
              type="number"
              options={monthOptions.map((m) => ({ label: m, value: m }))}
              register={register}
              placeholder={t('選択')}
              validation={{ required: t('月は必須です。') }}
              error={errors.caughtMonthAt}
              showError={false}
              showLine={true}
              focusBorderColor="white"
              bg="white"
              color="brand.inputBorderGray"
            />
            <SelectInput
              label={t('日')}
              name="caughtDayAt"
              type="number"
              options={dayOptions.map((d) => ({ label: d, value: d }))}
              register={register}
              placeholder={t('選択')}
              validation={{ required: t('日は必須です。') }}
              error={errors.caughtDayAt}
              showError={false}
              showLine={true}
              focusBorderColor="white"
              bg="white"
              color="brand.inputBorderGray"
            />
          </Flex>
          {(errors.caughtYearAt || errors.caughtMonthAt || errors.caughtDayAt) && (
            <Text color="brand.inputError" fontSize="sm" py="2">
              {errors.caughtYearAt?.message ||
                errors.caughtMonthAt?.message ||
                errors.caughtDayAt?.message}
            </Text>
          )}
        </Box>
        <Box>
          <FormLabel
            htmlFor="prefecture"
            color="white"
            fontWeight="bold"
            fontSize="sm"
            textAlign="left"
            margin={0}
          >
            {t('フィールド')}
          </FormLabel>
          <Flex gap="5">
            <SelectInput
              label=""
              name="field"
              options={fieldOptions.map((f) => ({ label: f.name, value: f.id }))}
              register={register}
              validation={{ required: t('フィールドは必須です。') }}
              placeholder={t('選択')}
              error={errors.field}
              showError={false}
              showLine={true}
              focusBorderColor="white"
              bg="white"
              color="brand.inputBorderGray"
            />
          </Flex>
          {errors.field && (
            <Text color="brand.inputError" fontSize="sm" py="2">
              {errors.field?.message}
            </Text>
          )}
        </Box>
        <FormProviderNumberInput
          name="size"
          label={t('サイズ')}
          precision={1}
          register={register}
          rightElement={<>cm</>}
          validation={{ required: t('サイズは必須です。') }}
          error={errors.size}
          bg="white"
          color="brand.inputBorderGray"
          showLine={true}
        />
        <Flex gap={5}>
          <FormInput
            name="freeTextLure"
            label={t('ルアー')}
            register={register}
            error={errors.freeTextLure}
            bg="white"
            color="brand.inputBorderGray"
            focusBorderColor="white"
            showLine={true}
            placeholder={t('任意')}
          />
          {tackleBox && tackleBox.length > 0 && (
            <SelectInput
              label={t('※BCLルアーをお持ちの方はこちら')}
              name="lureId"
              placeholder={t('任意')}
              options={tackleBox
                .filter((lure) => lure.lureType && lure.lureType !== LURETYPES.MOSAIC_LURE)
                .map((lure) => ({
                  label: `${handleLureLabel(lure.lureType, lure.lureColor)}`,
                  value: lure.id,
                }))}
              register={register}
              error={errors.lureId}
              showLine={true}
              focusBorderColor="white"
              bg="white"
              color="brand.inputBorderGray"
              isLabelSmall={true}
            />
          )}
        </Flex>
        {lureInputError && (
          <Text color="brand.inputError" fontSize="sm">
            {lureInputError}
          </Text>
        )}

        <FormInput
          name="freeTextRod"
          label={t('ロッド')}
          register={register}
          error={errors.freeTextRod}
          bg="white"
          color="brand.inputBorderGray"
          focusBorderColor="white"
          showLine={true}
          placeholder={t('任意')}
        />
        <FormInput
          name="freeTextReel"
          label={t('リール')}
          register={register}
          error={errors.freeTextReel}
          bg="white"
          color="brand.inputBorderGray"
          focusBorderColor="white"
          showLine={true}
          placeholder={t('任意')}
        />
        <FormInput
          name="freeTextLine"
          label={t('ライン')}
          register={register}
          error={errors.freeTextLine}
          bg="white"
          color="brand.inputBorderGray"
          focusBorderColor="white"
          showLine={true}
          placeholder={t('任意')}
        />
        <FormInput
          name="title"
          label={t('タイトル')}
          register={register}
          validation={{
            required: t('タイトルは必須です。'),
            maxLength: {
              value: 10,
              message: t('タイトルは 10 文字以内にしてください。'),
            },
          }}
          error={errors.title}
          bg="white"
          color="brand.inputBorderGray"
          focusBorderColor="white"
          showLine={true}
        />
        <FormTextArea
          label={t('コメント')}
          name="comment"
          register={register}
          type={'textarea'}
          rows={8}
          focusBorderColor="white"
          bg="white"
          color="brand.inputBorderGray"
        />
        <Button
          isDisabled={isSubmitting}
          type="submit"
          my="10"
          rounded="3xl"
          width="100%"
          color="white"
          bgColor="brand.bclBlue"
        >
          {t('申請')}
        </Button>
      </Flex>
    </form>
  );
};
