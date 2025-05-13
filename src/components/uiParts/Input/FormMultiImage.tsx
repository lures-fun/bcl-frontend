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
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import defaultLure from '@/assets/preview.png';
import { useCustomToast } from '@/hooks/useCustomToast';
import Base64Image from '@/components/uiParts/Image/Base64Image';
import { convertSingleFileToBase64 } from '@/lib/base64Converter';

const pagination = {
  clickable: true,
  renderBullet: function (index: number, className: string) {
    return `<span class="${className}" 
    style="width: 10px; 
    height: 10px; 
    border-radius: 50%; 
    background: white; 
    margin: 0 4px;"></span>`;
  },
};

type FormImageProps = {
  onChange: (files?: string[]) => {};
  fileSize: number;
  videoSize?: number;
  error: any;
  label: string;
  subLabel?: string;
  name: string;
  register: UseFormRegister<any>;
  validation: any;
  progressValue?: number;
  isUploading?: boolean;
  defaultImage?: string[];
  maxLength?: number;
};

export const FormMultiImage = ({
  onChange,
  fileSize,
  videoSize,
  error,
  label,
  subLabel,
  name,
  register,
  validation,
  progressValue,
  isUploading,
  defaultImage,
  maxLength = 3,
}: FormImageProps) => {
  const { showErrorToast } = useCustomToast();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [imagesPreview, setImagesPreview] = useState<string[]>(defaultImage || []);

  const handleOnChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const files = e.target.files;

      if (files.length > maxLength) {
        showErrorToast('失敗しました', `最大${maxLength}ファイルをアップロードしてください。`);
        return;
      }

      const base64Images: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (videoSize && files[i].type.includes('video')) {
          if (files[i].size > videoSize) {
            showErrorToast(
              '失敗しました',
              `動画 ${i + 1} のサイズが大きすぎます。${
                videoSize / 1024 / 1024
              }MB以下のファイルをアップロードしてください。`
            );
            return;
          }
          const video = document.createElement('video');
          const objectUrl = URL.createObjectURL(files[i]);
          await new Promise<void>(async (resolve) => {
            video.onloadedmetadata = () => {
              if (video.duration > 60) {
                showErrorToast(
                  '失敗しました',
                  `動画の長さが1分を超えています。1分以下のファイルをアップロードしてください。`
                );
              } else {
                resolve();
              }
            };
            video.src = objectUrl;
          });
          const base64Video = await convertSingleFileToBase64(files[i]);
          base64Images.push(base64Video);
        } else if (videoSize && files[i].type.includes('image')) {
          if (files[i].size > fileSize) {
            showErrorToast(
              '失敗しました',
              `画像 ${i + 1} のサイズが大きすぎます。${
                fileSize / 1024 / 1024
              }MB以下のファイルをアップロードしてください。`
            );
            return;
          }
          const base64Image = await convertSingleFileToBase64(files[i]);
          base64Images.push(base64Image);
        }
      }
      if (base64Images.length > 0) {
        onChange(base64Images);
      } else {
        onChange(undefined);
      }
    },
    [fileSize, videoSize, maxLength, onChange, showErrorToast]
  );

  useEffect(() => {
    if (defaultImage) {
      setImagesPreview(defaultImage);
    }
  }, [defaultImage]);

  return (
    <FormControl isInvalid={!!error} pb={8}>
      <FormLabel
        htmlFor={name}
        color="white"
        fontWeight="bold"
        fontSize="md"
        textAlign="center"
        pb="3"
      >
        {label}
        {subLabel && (
          <Text fontSize="xs" textAlign="left">
            {subLabel}
          </Text>
        )}
      </FormLabel>
      <Box
        justifyContent="center"
        sx={{
          '.swiper': {
            bgColor: 'whiteAlpha.800',
            border: '0.1px solid white',
            rounded: 'lg',
          },
        }}
      >
        <Swiper modules={[Pagination]} pagination={pagination} slidesPerView={1} loop={true}>
          {imagesPreview.length > 0 ? (
            imagesPreview.map((image, index) => (
              <SwiperSlide key={index}>
                <AspectRatio
                  ratio={16 / 11}
                  onClick={() => hiddenFileInput.current?.click()}
                  rounded="lg"
                  overflow="hidden"
                >
                  <Base64Image imagePreview={image} />
                </AspectRatio>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <AspectRatio
                maxH="80%"
                ratio={16 / 11}
                onClick={() => hiddenFileInput.current?.click()}
                rounded="lg"
                overflow="hidden"
              >
                <Image src={defaultLure.src} objectFit="cover" width="full" height="full" />
              </AspectRatio>
            </SwiperSlide>
          )}
        </Swiper>
        <Input
          type="file"
          id={name}
          accept="image/*, video/*"
          {...register(name, validation)}
          ref={hiddenFileInput}
          onChange={handleOnChange}
          style={{ display: 'none' }}
          multiple
        />
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
