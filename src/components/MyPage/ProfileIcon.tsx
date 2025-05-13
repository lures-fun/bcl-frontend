import { Avatar, Box, Divider, HStack, Input, Text } from '@chakra-ui/react';
import defaultAvatar from '@/assets/preview.png';
import { useEffect, useRef, useState } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type ProfileIconProps = {
  defaultImage?: string;
  validations: any;
  register: UseFormRegister<any>;
  errors?: FieldErrors<any>;
};

export const ProfileIcon = ({ defaultImage, validations, register, errors }: ProfileIconProps) => {
  const [imageData, setImageData] = useState<string>(defaultImage || defaultAvatar.src);
  const { t } = useTranslation();

  useEffect(() => {
    if (defaultImage) setImageData(defaultImage);
  }, [defaultImage]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length <= 0) {
      setImageData('');
      return;
    }

    const file = files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImageData(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  };

  const { ref, ...restRegister } = register('files', {
    onChange: onChange,
    validate: validations,
  });

  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  return (
    <Box p={5} pb={0}>
      <HStack>
        <Text color="white" fontWeight="bold">
          {t('プロフィール写真')}
        </Text>
      </HStack>
      <Box display="flex" alignItems="center" py={5} flexDirection="column">
        <Avatar
          src={imageData}
          size="xl"
          name="sample"
          onClick={() => hiddenFileInput.current?.click()}
        />
        <Input
          type="file"
          id="avatarHiddenFileInput"
          accept="image/*"
          style={{ display: 'none' }}
          ref={(e) => {
            ref(e);
            hiddenFileInput.current = e;
          }}
          {...restRegister}
        />
        {errors?.files && typeof errors.files.message === 'string' && (
          <Text fontSize="14" color="brand.inputError" mt="2">
            {errors.files?.message}
          </Text>
        )}
      </Box>
      <Divider />
    </Box>
  );
};
