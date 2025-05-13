'use client';

import {
  AspectRatio,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Progress,
  Text,
} from '@chakra-ui/react';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import defaultLure from '@/assets/preview.png';
import { useCustomToast } from '@/hooks/useCustomToast';
import Base64Image from '@/components/uiParts/Image/Base64Image';
import { convertSingleFileToBase64 } from '@/lib/base64Converter';

type FormImageProps = {
  onChange: (file?: string) => {};
  fileSize: number;
  videoSize?: number;
  error: any;
  label: string;
  subLabel?: string;
  name: string;
  register: UseFormRegister<any>;
  validation: any;
  defaultImage?: string;
  isRegisterLure?: boolean;
  isImageOnly?: boolean;
  progressValue?: number;
  isUploading?: boolean;
};

export const FormImage = ({
  onChange,
  fileSize,
  videoSize,
  error,
  label,
  subLabel,
  name,
  register,
  validation,
  defaultImage,
  isRegisterLure = false,
  isImageOnly = false,
  progressValue,
  isUploading,
}: FormImageProps) => {
  const { showErrorToast } = useCustomToast();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  const handleOnChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      const file = e.target.files && e.target.files[0];

      if (file) {
        let base64Image = '';
        if (videoSize && file.type.includes('video')) {
          if (file.size > videoSize) {
            showErrorToast(
              '失敗しました',
              `${videoSize / 1024 / 1024}MB以下のファイルをアップロードしてください。`
            );
            return;
          }
          base64Image = await convertSingleFileToBase64(file);
        } else if (fileSize && file.type.includes('image')) {
          if (file.size > fileSize) {
            showErrorToast(
              '失敗しました',
              `${fileSize / 1024 / 1024}MB以下のファイルをアップロードしてください。`
            );
            return;
          }
          base64Image = await convertSingleFileToBase64(file);
        }

        if (base64Image) {
          onChange(base64Image);
        } else {
          onChange(undefined);
        }
      }
    },
    [fileSize, videoSize, onChange, showErrorToast]
  );

  useEffect(() => {
    setImagePreview(defaultImage);
  }, [defaultImage, setImagePreview]);

  return (
    <FormControl isInvalid={!!error} pb={8}>
      <FormLabel htmlFor={name} color="white" fontWeight="bold" fontSize="md" textAlign="center">
        {label}
        {subLabel && (
          <Text fontSize="xs" textAlign="left" py="2">
            {subLabel}
          </Text>
        )}
      </FormLabel>
      <Box
        justifyContent="center"
        border="1px solid white"
        rounded="lg"
        bgColor="whiteAlpha.800"
        overflow="hidden"
        marginX="auto"
      >
        {imagePreview ? (
          <Base64Image
            imagePreview={imagePreview}
            handleClick={() => hiddenFileInput.current?.click()}
            isImageFullSize={true}
          />
        ) : (
          <AspectRatio maxW="100%" ratio={16 / 9}>
            {isRegisterLure ? (
              <Image
                src={imagePreview || defaultLure.src}
                onClick={() => hiddenFileInput.current?.click()}
                objectFit="cover"
              />
            ) : (
              <Base64Image
                imagePreview={imagePreview || defaultLure.src}
                handleClick={() => hiddenFileInput.current?.click()}
              />
            )}
          </AspectRatio>
        )}
        <Input
          type="file"
          id={name}
          accept={isImageOnly ? 'image/*' : 'image/*, video/*'}
          {...register(name, validation)}
          ref={hiddenFileInput}
          onChange={handleOnChange}
          style={{ display: 'none' }}
        />
      </Box>
      <Box>
        {isUploading && (
          <Box display="flex" flexDirection="row" alignItems="center" width="100%">
            <Progress value={progressValue} colorScheme="green" size="md" flex="1" />
            <Text color="white" ml="0.5" fontSize="sm" width="10">
              {progressValue}%
            </Text>
          </Box>
        )}
      </Box>
      <FormErrorMessage color="brand.inputError">{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};
