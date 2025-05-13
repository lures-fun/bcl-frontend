import { Box, Divider, HStack, Input, SimpleGrid, Spacer, Text } from '@chakra-ui/react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type FormProps = {
  lastName: string;
  firstName: string;
};

type SettingNameInputProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors<FormProps>;
  lastName?: string;
  firstName?: string;
};

export const SettingNameInput: React.FC<SettingNameInputProps> = ({
  firstName,
  lastName,
  register,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <Box p={5} pb={0}>
      <HStack>
        <Text color="white" fontWeight="bold">
          {t('氏名')}
        </Text>
        <Spacer />
      </HStack>
      <SimpleGrid columns={2} spacingX={5} spacingY={2} py="5">
        <Input
          id="lastName"
          type="text"
          bg="brand.bclBgBlue"
          _placeholder={{ opacity: 0.4, color: 'white' }}
          color="white"
          borderColor="white"
          placeholder="姓"
          defaultValue={lastName}
          {...register('lastName', {
            required: t('姓は必ず入力してください'),
          })}
        />
        <Input
          id="firstName"
          type="text"
          bg="brand.bclBgBlue"
          _placeholder={{ opacity: 0.4, color: 'white' }}
          color="white"
          borderColor="white"
          placeholder="名"
          defaultValue={firstName}
          {...register('firstName', {
            required: t('名は必ず入力してください'),
          })}
        />
        {(errors.lastName || errors.firstName) && (
          <>
            <Text fontSize="14" color="brand.inputError" flexGrow={1}>
              {errors.lastName?.message}
            </Text>
            <Text fontSize="14" color="brand.inputError" flexGrow={1}>
              {errors.firstName?.message}
            </Text>
          </>
        )}
      </SimpleGrid>
      <Divider />
    </Box>
  );
};
