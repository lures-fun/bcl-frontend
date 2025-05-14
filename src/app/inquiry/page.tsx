'use client';

import { Box, Flex } from '@chakra-ui/react';
import { HeaderMenu } from '../../components/uiParts/Header/HeaderMenu';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';
import { Footer } from '../../components/uiParts/Footer/Footer';
import { FormInput } from '../../components/uiParts/Input/FormInput';
import { emailValidationRules } from '../../lib/validationRules';
import { FormTextArea } from '../../components/uiParts/Input/FormTextArea';
import { NameInput } from '../../components/uiParts/Input/NameInput';
import { useRouter } from 'next/navigation';
import { paths } from '@/utils/constValues';

export type InquiryFormProps = {
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  email: string;
  content: string;
};

const Inquiry = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<InquiryFormProps>({ mode: 'onChange' });

  const router = useRouter();

  const onSubmit = (data: InquiryFormProps) => {
    // クエリパラメータを文字列として手動で組み立て
    const queryString = new URLSearchParams(data).toString();

    // クエリパラメータ付きのURLにリダイレクト
    router.push(`${paths.inquiryConfirm}?${queryString}`);
  };

  return (
    <Box bg="brand.bclBgGlay">
      <HeaderMenu />
      <Flex minHeight="100vh" flexDirection="column" px="3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexGrow={1} flexDirection="column" mb={10} py="12" px="10" gap="8">
            <NameInput
              label="お名前"
              size="lg"
              fontSize="14px"
              names={{
                firstName: 'firstName',
                lastName: 'lastName',
              }}
              placeholders={{
                firstName: '例）山田',
                lastName: '例）太郎',
              }}
              register={register}
              errors={
                errors.firstName || errors.lastName
                  ? {
                      ...errors?.firstName,
                      ...errors?.lastName,
                    }
                  : undefined
              }
              validation={{ required: 'お名前は必ず入力してください' }}
            />
            <NameInput
              label="フリガナ"
              size="lg"
              fontSize="14px"
              names={{
                firstName: 'firstNameKana',
                lastName: 'lastNameKana',
              }}
              placeholders={{
                firstName: '例）ヤマダ',
                lastName: '例）タロウ',
              }}
              register={register}
              errors={
                errors.firstNameKana || errors.lastNameKana
                  ? {
                      ...errors?.firstNameKana,
                      ...errors?.lastNameKana,
                    }
                  : undefined
              }
              validation={{ required: 'フリガナは必ず入力してください' }}
            />
            <FormInput
              type="email"
              name="email"
              label="メールアドレス"
              size="lg"
              fontSize="14px"
              register={register}
              error={errors.email}
              placeholder="例）name@example.com"
              validation={emailValidationRules}
            />
            <FormTextArea
              label="お問い合わせ内容"
              name="content"
              size="lg"
              fontSize="14px"
              placeholder="お問い合わせ内容をごなご記入ください"
              register={register}
              error={errors.content}
              rows={8}
              validation={{ required: 'お問い合わせ内容をごなご記入ください' }}
            />
            <Button
              type="submit"
              my="3"
              color="white"
              rounded="3xl"
              width="100%"
              bgColor="transparent"
              border={'2px solid white'}
            >
              入力内容を確認する
            </Button>
          </Flex>
        </form>
      </Flex>
      <Footer />
    </Box>
  );
};

export default Inquiry;
