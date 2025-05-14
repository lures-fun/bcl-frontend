import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useCustomToast } from '@/hooks/useCustomToast';
import axiosInstance from '@/lib/axiosInstance';
import { User } from '@/types/User';
import { SettingNameInput } from '@/components/MyPage/SettingNameInput';
import { SettingInput } from '@/components/MyPage/SettingInput';
import { SettingChangeButton } from '@/components/uiParts/button/SettingChangeButton';
import { ProfileIcon } from '@/components/MyPage/ProfileIcon';
import { ProfileIconValidationRules, userNameValidationRules } from '@/lib/validationRules';
import { paths } from '@/utils/constValues';
import { useRouter } from 'next/navigation';
import { useFetchUserData } from '@/hooks/useFetchUserData';
import { useTranslation } from 'react-i18next';

type FormProps = {
  userData?: User;
};

type SettingFormFields = {
  lastName?: string;
  firstName?: string;
  userName?: string;
  profileIcon?: string;
  files: File[];
};

const SettingForm: React.FC<FormProps> = ({ userData }) => {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      userName: userData?.userName,
      files: [],
    },
  });
  const router = useRouter();
  const { refetch: refetchUser } = useFetchUserData();
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const { t } = useTranslation();

  useEffect(() => {
    setIsFirstLogin(!userData?.userName);
    setValue('firstName', userData?.firstName);
    setValue('lastName', userData?.lastName);
    setValue('userName', userData?.userName);
  }, [userData, setValue]);
  function isValidUserName(userName: string | undefined): boolean {
    if (!userName) {
      return false;
    }
    const pattern = /^[A-Za-z0-9_-]+$/;
    return pattern.test(userName);
  }

  const handleSettingUpdate = async (data: SettingFormFields) => {
    try {
      if (!isValidUserName(data.userName)) {
        showErrorToast(
          t('入力エラーです'),
          t('ユーザーネームは英数字、アンダースコア (_) 、ハイフン (-) のみを利用してください')
        );
        return;
      }
      const form = new FormData();
      form.append('file', getValues('files')[0]);
      if (data.firstName) form.append('firstName', data.firstName);
      if (data.lastName) form.append('lastName', data.lastName);
      if (data.userName) form.append('userName', data.userName);
      const response = await axiosInstance.patch('/users/profile', form, {});
      if (response.status === 204) {
        if (isFirstLogin) {
          router.push(paths.home);
        }
        refetchUser();
        showSuccessToast(t('成功しました'), t('プロフィールを更新しました'));
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.message === 'duplicate user name') {
        showErrorToast(
          t('すでに登録されているユーザーネームです'),
          t('他のユーザーネームを登録してください')
        );
      } else if (error?.response?.status === 400) {
        showErrorToast(t('入力エラーです'), error?.response?.data.message);
      } else {
        showErrorToast(t('失敗しました'), t('プロフィールの更新に失敗しました'));
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit((data: SettingFormFields) => {
          handleSettingUpdate(data);
        })}
      >
        <Box display="flex" justifyContent="flex-end" mt="3" p={5} pb={0}>
          <SettingChangeButton
            type="submit"
            buttonText={t('保存する')}
            isDisabled={
              (!dirtyFields.firstName || errors.firstName?.message !== undefined) &&
              (!dirtyFields.lastName || errors.lastName?.message !== undefined) &&
              (!dirtyFields.userName || errors.userName?.message !== undefined) &&
              (!dirtyFields.files || errors.files?.message !== undefined) &&
              !isSubmitting
            }
            isBackgroundColorWhite={true}
          />
        </Box>
        <SettingNameInput
          register={register}
          errors={errors}
          lastName={userData?.lastName}
          firstName={userData?.firstName}
        />
        <SettingInput
          label={t('ユーザーネーム')}
          placeholder="user name"
          defaultValue={userData?.userName}
          validation={userNameValidationRules}
          register={register}
          name="userName"
          errors={errors}
        />
        <ProfileIcon
          defaultImage={userData?.profileIcon}
          validations={ProfileIconValidationRules}
          register={register}
          errors={errors}
        />
      </form>
    </>
  );
};

export default SettingForm;
