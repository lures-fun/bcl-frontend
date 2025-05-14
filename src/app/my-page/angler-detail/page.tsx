'use client';

import { Box, Button, Flex, FormLabel, Text, VStack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { FormInput } from '@/components/uiParts/Input/FormInput';
import { FormTextArea } from '@/components/uiParts/Input/FormTextArea';
import { SelectInput } from '@/components/uiParts/Input/SelectInput';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchMasterData } from '@/hooks/useFetchMasterData';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import axiosInstance from '@/lib/axiosInstance';
import { FieldMaster, LineMaster, ReelMaster, RodMaster } from '@/types/Master';
import { User } from '@/types/User';
import { PREFECTURES, paths } from '@/utils/constValues';
import { useTranslation } from 'next-i18next';

type FormInputProps = {
  fishingCareer: number;
  mainField: string;
  mainRod: string;
  mainReel: string;
  mainLine: string;
  introduction: string;
  prefecture: string;
};

const AnglerDetail = () => {
  const router = useRouter();
  const { refetch: refetchUser } = useFetchUserData();
  const [fieldMaster, setFieldMaster] = useState<FieldMaster[]>();
  const { masterData: reelMaster } = useFetchMasterData<ReelMaster>('reels');
  const { masterData: lineMaster } = useFetchMasterData<LineMaster>('lines');
  const { masterData: rodMaster } = useFetchMasterData<RodMaster>('rods');
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const [fieldOptions, setFieldOptions] = useState<FieldMaster[]>([]);
  const { t } = useTranslation();

  const {
    handleSubmit,
    register,
    watch,
    resetField,
    formState: { errors, isDirty },
  } = useForm<FormInputProps>({
    mode: 'onChange',
    defaultValues: async () => {
      try {
        const fieldResponse = await axiosInstance.get<FieldMaster[]>(`/master/fields`);
        setFieldMaster(fieldResponse.data);
        const response = await axiosInstance.get<User>('/users/profile');
        const prefectureId =
          fieldResponse.data.filter((f) => f.id === response.data.mainField)[0].prefectureId || '';
        return {
          fishingCareer: response.data.fishingCareer,
          mainField: response.data.mainField,
          mainRod: response.data.mainRod,
          mainReel: response.data.mainReel,
          mainLine: response.data.mainLine,
          introduction: response.data.introduction,
          prefecture: prefectureId,
        };
      } catch (error) {
        console.log(error);
        showErrorToast(t('ルアーは存在しません。'), t('ルアーは存在しません。'));
      }
      return {
        fishingCareer: 0,
        mainField: '',
        mainRod: '',
        mainReel: '',
        mainLine: '',
        introduction: '',
        prefecture: '',
      };
    },
  });

  const selectedPrefecture = watch('prefecture');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateFieldOptions = useCallback(
    (prefecture: string) => {
      const fieldOptionsList =
        fieldMaster && prefecture ? fieldMaster.filter((f) => f.prefectureId === prefecture) : [];
      setFieldOptions(fieldOptionsList);
    },
    [fieldMaster]
  );

  useEffect(() => {
    updateFieldOptions(selectedPrefecture);
  }, [selectedPrefecture, updateFieldOptions]);

  useEffect(() => {
    if (!isDirty) resetField('mainField');
  }, [fieldOptions, isDirty, resetField]);

  const onSubmit = useCallback(
    async (data: FormInputProps) => {
      try {
        const response = await axiosInstance.patch(`/users/profile/angler`, {
          fishingCareer: data.fishingCareer,
          mainField: data.mainField,
          mainRod: data.mainRod,
          mainReel: data.mainReel,
          mainLine: data.mainLine,
          introduction: data.introduction,
        });
        if (response.status === 204) {
          refetchUser();
          showSuccessToast(t('成功しました'), t('アングラーの詳細が変更されました'));
          router.push(paths.myPage);
        }
      } catch (e: any) {
        console.log(e.response);
        showErrorToast(
          t('失敗しました'),
          t('ユーザーネームの更新に失敗しました。ユーザーネームの形式を確認してください')
        );
      }
    },
    [router, showErrorToast, showSuccessToast, refetchUser, t]
  );

  return (
    <>
      <Box bg="black">
        <HeaderMenu />
        <Flex minHeight="100vh" maxW="750px" mx="auto" flexDirection="column" px="3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing="7" py="7">
              <FormInput
                label={t('釣り歴')}
                name="fishingCareer"
                register={register}
                type={'number'}
                placeholder="6"
                error={errors.fishingCareer}
                validation={{
                  required: t('釣り歴は必須です。'),
                  max: { value: 100, message: 'Cannot be larger than 100' },
                  min: { value: 0, message: 'Cannot be smaller than 0' },
                }}
                rightElement={<>{t('年')}</>}
              />
              <Box width="full">
                <FormLabel
                  htmlFor="prefecture"
                  color="white"
                  fontWeight="bold"
                  fontSize="sm"
                  textAlign="left"
                >
                  {t('メインフィールド')}
                </FormLabel>
                <Flex gap="5">
                  <SelectInput
                    label=""
                    name="prefecture"
                    options={PREFECTURES.map((p) => ({ label: p.name, value: p.value }))}
                    register={register}
                    validation={{ required: t('フィールドは必須です。') }}
                    placeholder={t('選択')}
                    error={errors.prefecture}
                    showError={false}
                  />
                  <SelectInput
                    label=""
                    name="mainField"
                    options={fieldOptions.map((f) => ({ label: f.name, value: f.id }))}
                    register={register}
                    validation={{ required: t('フィールドは必須です。') }}
                    placeholder={t('選択')}
                    error={errors.mainField}
                    showError={false}
                  />
                </Flex>
                {(errors.prefecture || errors.mainField) && (
                  <Text color="brand.inputError" fontSize="sm" py="2">
                    {errors.prefecture?.message || errors.mainField?.message}
                  </Text>
                )}
              </Box>
              <SelectInput
                label={t('メインロット')}
                name="mainRod"
                register={register}
                placeholder={t('-選択')}
                error={errors.mainRod}
                options={rodMaster ? rodMaster.map((d) => ({ label: d.name, value: d.id })) : []}
                validation={{
                  required: t('メインロットは必須です。'),
                }}
              />
              <SelectInput
                label={t('メインリール')}
                name="mainReel"
                register={register}
                placeholder={t('-選択')}
                error={errors.mainReel}
                options={reelMaster ? reelMaster.map((d) => ({ label: d.name, value: d.id })) : []}
                validation={{
                  required: t('メインリールは必須です。'),
                }}
              />
              <SelectInput
                label={t('メインライン')}
                name="mainLine"
                register={register}
                placeholder={t('-選択')}
                error={errors.mainLine}
                options={lineMaster ? lineMaster.map((d) => ({ label: d.name, value: d.id })) : []}
                validation={{
                  required: t('メインラインは必須です。'),
                }}
              />
              <FormTextArea
                label={t('自己紹介')}
                name="introduction"
                register={register}
                type={'textarea'}
                placeholder={t('○○です。宜しくお願いします')}
                error={errors.introduction}
                rows={8}
                //  validation={}
              />
              <Button
                type="submit"
                my="10"
                color="white"
                border="1px"
                borderStyle="solid"
                borderColor="white"
                rounded="3xl"
                width="100%"
                bgColor="black"
              >
                {t('変更する')}
              </Button>
            </VStack>
          </form>
        </Flex>
        <Footer />
      </Box>
    </>
  );
};

export default AnglerDetail;
