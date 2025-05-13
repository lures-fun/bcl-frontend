import { AspectRatio, Box, Flex, Heading, Image, Input } from '@chakra-ui/react';
import defaultLure from '@/assets/preview.png';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useTranslation } from 'react-i18next';

type LureUploaderProps = {
  onChange: (file?: string) => {};
};

const LureImageUploader = ({ onChange }: LureUploaderProps) => {
  const { showErrorToast } = useCustomToast();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      const file = e.target.files && e.target.files[0];

      if (file) {
        if (file.size > 52428800) {
          showErrorToast(t('失敗しました'), t('50MB以下のファイルをアップロードしてください。'));
          return;
        }

        const reader = new FileReader();

        reader.onload = () => {
          const base64Image = reader.result as string;
          setImagePreview(base64Image);
          onChange(base64Image);
        };

        reader.readAsDataURL(file);
      } else {
        setImagePreview(undefined);
        onChange(undefined);
      }
    },
    [onChange, showErrorToast,t]
  );

  return (
    <Flex gap="8px" direction="column">
      <Heading as="h6" color="white" size="xs" textAlign="center">
        {t('購入ルアー写真アップロード')}
      </Heading>
      <Box
        justifyContent="center"
        border="1px solid white"
        rounded="lg"
        bgColor="whiteAlpha.800"
        overflow="hidden"
      >
        <AspectRatio maxW="100%" ratio={16 / 9}>
          <Image
            src={imagePreview || defaultLure.src}
            onClick={() => hiddenFileInput.current?.click()}
            objectFit="cover"
          />
        </AspectRatio>
        <Input
          type="file"
          id="lureHiddenFileInput"
          accept="image/*"
          ref={hiddenFileInput}
          onChange={handleOnChange}
          style={{ display: 'none' }}
        />
      </Box>
    </Flex>
  );
};

export default LureImageUploader;
