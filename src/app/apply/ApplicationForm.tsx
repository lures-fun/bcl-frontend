'use client';

import { Box, Button, Divider, Flex, FormLabel, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormImage } from '@/components/uiParts/Input/FormImage';
import { FormInput } from '@/components/uiParts/Input/FormInput';
import { FormNumberInput } from '@/components/uiParts/Input/FormNumberInput';
import { FormTextArea } from '@/components/uiParts/Input/FormTextArea';
import { SelectInput } from '@/components/uiParts/Input/SelectInput';
import { useCustomToast } from '@/hooks/useCustomToast';
import axiosInstance from '@/lib/axiosInstance';
import { getExtensionsFromBase64 } from '@/lib/videoSupport';
import { Lure } from '@/types/Lure';
import { FieldMaster, LineMaster, ReelMaster, RodMaster } from '@/types/Master';
import {
  APPLY_TYPE,
  FISHTYPES,
  LURETYPES,
  POST_STATUS,
  PREFECTURES,
  S3_TYPES,
  convertToColorNumber,
  displayLureNames,
} from '@/utils/constValues';
import { decode } from 'urlsafe-base64';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { useTranslation } from 'react-i18next';

type FishingApplicationFormFields = {
  imageForNft: string;
  imageUrlForNft: string;
  imageForApply: string;
  imageUrlForApply: string;
  imageForSizeConfirmation: string;
  imageUrlForSizeConfirmation: string;
  caughtYearAt: number;
  caughtMonthAt: number;
  caughtDayAt: number;
  size: number;
  field: string;
  fishType: string;
  rod: string;
  reel: string;
  line: string;
  title: string;
  comment: string;
  prefecture: string;
  lureId: string;
  freeTextLure: string;
};

type Props = {
  type: 'official' | 'others';
  tackleBox?: Lure[];
  fieldMaster?: FieldMaster[];
  reelMaster?: ReelMaster[];
  lineMaster?: LineMaster[];
  rodMaster?: RodMaster[];
};

const START_DAY = 23;
const START_MONTH = 10;
const START_YEAR = 2023;
const years = [...Array(new Date().getFullYear() - (START_YEAR - 1))].map(
  (_, i) => new Date().getFullYear() + i
);

export const ApplicationForm = ({
  type,
  tackleBox,
  fieldMaster,
  reelMaster,
  lineMaster,
  rodMaster,
}: Props) => {
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { t } = useTranslation();

  const [dayOptions, setDayOptions] = useState<number[]>([]);
  const [monthOptions, setMonthOptions] = useState<number[]>([]);
  const [fieldOptions, setFieldOptions] = useState<FieldMaster[]>([]);
  const [uploadProgress, setUploadProgress] = useState({
    imageForApply: 0,
    imageForNft: 0,
    imageForSizeConfirmation: 0,
  });
  const [isUploading, setIsUploading] = useState({
    imageForApply: false,
    imageForNft: false,
    imageForSizeConfirmation: false,
  });

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FishingApplicationFormFields>();

  const selectedYear = watch('caughtYearAt');
  const selectedMonth = watch('caughtMonthAt');
  const selectedPrefecture = watch('prefecture');
  const imageForApply = watch('imageForApply');
  const imageForNft = watch('imageForNft');
  const imageForSizeConfirmation = watch('imageForSizeConfirmation');
  const { userData } = useFetchUserData();

  const prefectures = PREFECTURES.filter((prefecture) => {
    if (fieldMaster) {
      return fieldMaster.some(
        (field) => field.prefectureId === prefecture.value && field.name !== 'その他'
      );
    }
    return [];
  });
  useEffect(() => {
    const fieldOptions =
      fieldMaster && selectedPrefecture
        ? fieldMaster.filter((f) => f.prefectureId === selectedPrefecture && f.name !== 'その他')
        : [];
    setFieldOptions(fieldOptions);
  }, [fieldMaster, selectedPrefecture]);

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

  useEffect(() => {
    if (type === 'official') {
      register('lureId');
      register('imageForApply');
    } else register('freeTextLure');
  });

  const handleFile = useCallback(
    async (file: any, fileUrlField: any, filePropField: any, s3Url: string) => {
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
    [setValue, showErrorToast, isUploading, t]
  );

  const onSubmit = useCallback(
    async (data: FishingApplicationFormFields) => {
      try {
        if (userData?.isGuest) {
          showErrorToast(t('エラーです'), t('ただいまメンテナンス中です'));
          return;
        }
        const endpoint = type === 'official' ? `/fishing-results` : `/fishing-results/other-lures`;
        const response = await axiosInstance.post(endpoint, {
          imageForNft: data.imageUrlForNft,
          imageForApply: data.imageUrlForApply,
          imageForSizeConfirmation: data.imageUrlForSizeConfirmation,
          caughtYearAt: data.caughtYearAt,
          caughtMonthAt: data.caughtMonthAt,
          caughtDayAt: data.caughtDayAt,
          size: data.size,
          field: data.field,
          fishType: data.fishType,
          rod: data.rod,
          reel: data.reel,
          line: data.line,
          title: data.title,
          comment: data.comment,
          prefecture: data.prefecture,
          lureId: data.lureId,
          freeTextLure: data.freeTextLure,
          applyType: APPLY_TYPE.BCL,
          postStatus: POST_STATUS.PUBLISHED,
        });
        if (response.status === 201) {
          showSuccessToast(t('釣果申請が完了しました。'), t('審査結果をお待ちください。'));
          reset();
        }
      } catch (e: any) {
        console.log(e.response);
        showErrorToast(t('申請に失敗しました。'), e.response?.data?.message[0]);
      }
    },
    [userData?.isGuest, type, showErrorToast, t, showSuccessToast, reset]
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
        <Flex px="4" alignSelf="center" direction="column">
          {type === 'official' && (
            <FormImage
              onChange={async (file) =>
                handleFile(
                  file,
                  'imageUrlForApply',
                  'imageForApply',
                  `/s3/presigned-url/${S3_TYPES.FISHING_RESULT_APPLY}`
                )
              }
              label={t('申請用画像/動画アップロード')}
              subLabel={t('※魚にルアーがフックされている画像をアップロードしてください。')}
              error={errors.imageForApply}
              fileSize={30 * 1024 * 1024}
              videoSize={500 * 1024 * 1024}
              register={register}
              validation={{ required: t('申請用画像/動画アップロードは必須です') }}
              name="imageForApply"
              defaultImage={imageForApply}
              progressValue={uploadProgress.imageForApply}
              isUploading={isUploading.imageForApply}
            />
          )}
          <Divider mb={4} />
          <FormImage
            onChange={async (file) =>
              handleFile(
                file,
                'imageUrlForSizeConfirmation',
                'imageForSizeConfirmation',
                `/s3/presigned-url/${S3_TYPES.FISHING_RESULT_SIZE_CONFIRMATION}`
              )
            }
            label={t('申請用画像/動画アップロード')}
            subLabel={t(
              '※バスのサイズを正確に評価できるよう、メジャー等の参照物と 一緒に写っている画像をアップロードしてください。'
            )}
            error={errors.imageForSizeConfirmation}
            register={register}
            validation={{ required: t('サイズ確認用の画像/動画アップロードは必須です') }}
            fileSize={30 * 1024 * 1024}
            videoSize={500 * 1024 * 1024}
            name="imageForSizeConfirmation"
            defaultImage={imageForSizeConfirmation}
            progressValue={uploadProgress.imageForSizeConfirmation}
            isUploading={isUploading.imageForSizeConfirmation}
          />
          <Divider mb={4} />
          <FormImage
            onChange={async (file) =>
              handleFile(
                file,
                'imageUrlForNft',
                'imageForNft',
                `/s3/presigned-url/${S3_TYPES.FISHING_RESULT_NFT}`
              )
            }
            label={t('NFT用画像アップロード')}
            subLabel={t('※申請が通った場合、こちらの画像がNFTとなります。')}
            error={errors.imageForNft}
            register={register}
            validation={{ required: t('NFT用画像アップロードは必須です') }}
            fileSize={30 * 1024 * 1024}
            name="imageForNft"
            defaultImage={imageForNft}
            isImageOnly={true}
            progressValue={uploadProgress.imageForNft}
            isUploading={isUploading.imageForNft}
          />
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
              name="prefecture"
              options={prefectures.map((p) => ({ label: p.name, value: p.value }))}
              register={register}
              validation={{ required: t('フィールドは必須です。') }}
              placeholder={t('選択')}
              error={errors.prefecture}
              showError={false}
              showLine={true}
              focusBorderColor="white"
              bg="white"
              color="brand.inputBorderGray"
            />
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
          {(errors.prefecture || errors.field) && (
            <Text color="brand.inputError" fontSize="sm" py="2">
              {errors.prefecture?.message || errors.field?.message}
            </Text>
          )}
        </Box>
        <FormNumberInput
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
        <SelectInput
          label={t('魚種')}
          name="fishType"
          placeholder={t('選択')}
          options={FISHTYPES.map((ft) => ({ label: ft.display, value: ft.id }))}
          validation={{ required: t('魚種は必須です。') }}
          register={register}
          error={errors.fishType}
          showLine={true}
          focusBorderColor="white"
          bg="white"
          color="brand.inputBorderGray"
        />
        {type === 'official' ? (
          <SelectInput
            label={t('ルアー')}
            name="lureId"
            placeholder={t('選択')}
            options={
              tackleBox
                ? tackleBox
                    .filter((lure) => lure.lureType && lure.lureType !== LURETYPES.MOSAIC_LURE)
                    .map((lure) => ({
                      label: `${handleLureLabel(lure.lureType, lure.lureColor)}`,
                      value: lure.id,
                    }))
                : []
            }
            register={register}
            validation={{ required: t('ルアーは必須です。') }}
            error={errors.lureId}
            showLine={true}
            focusBorderColor="white"
            bg="white"
            color="brand.inputBorderGray"
          />
        ) : (
          <FormInput
            name="freeTextLure"
            label={t('ルアー')}
            register={register}
            validation={{ required: t('ルアーは必須です。') }}
            error={errors.freeTextLure}
            showLine={true}
            focusBorderColor="white"
            bg="white"
            color="brand.inputBorderGray"
          />
        )}
        <SelectInput
          label={t('ロッド')}
          name="rod"
          placeholder={t('選択')}
          options={rodMaster ? rodMaster.map((d) => ({ label: d.name, value: d.id })) : []}
          register={register}
          validation={{ required: t('ロッドは必須です。') }}
          error={errors.rod}
          showLine={true}
          focusBorderColor="white"
          bg="white"
          color="brand.inputBorderGray"
        />
        <SelectInput
          label={t('リール')}
          name="reel"
          placeholder={t('選択')}
          options={reelMaster ? reelMaster.map((d) => ({ label: d.name, value: d.id })) : []}
          register={register}
          validation={{ required: t('リールは必須です。') }}
          error={errors.reel}
          showLine={true}
          focusBorderColor="white"
          bg="white"
          color="brand.inputBorderGray"
        />
        <SelectInput
          label={t('ライン')}
          name="line"
          placeholder={t('選択')}
          options={lineMaster ? lineMaster.map((d) => ({ label: d.name, value: d.id })) : []}
          register={register}
          validation={{ required: t('ラインは必須です。') }}
          error={errors.line}
          showLine={true}
          focusBorderColor="white"
          bg="white"
          color="brand.inputBorderGray"
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
