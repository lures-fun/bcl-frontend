import { Box } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import UrlImage from '../uiParts/Image/UrlImage';

// Swiperの必須スタイル
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type Props = {
  images: (string | undefined)[];
  onClickImage?: () => void;
};

export const SnsImageSlider = ({ images, onClickImage }: Props) => {
  const pagination = {
    clickable: true,
  };

  return (
    <Box
      width="full"
      maxW="container.md"
      mx="auto"
      sx={{
        '.swiper': {
          border: '0.1px solid white',
        },
        '.swiper-button-prev, .swiper-button-next': {
          color: 'white',
          '&::after': {
            fontSize: '20px',
          },
        },
        '.swiper-button-prev': {
          left: '5px',
        },
        '.swiper-button-next': {
          right: '5px',
        },
        '.swiper-pagination': {
          bottom: '1px',
          '.swiper-pagination-bullet': {
            background: 'white',
            width: '6px',
            height: '6px',
            margin: '0 1%',
          },
        },
      }}
    >
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={pagination}
        navigation={true}
        speed={500}
        slidesPerView={1}
      >
        {images &&
          images.map(
            (image, i) =>
              image && (
                <SwiperSlide key={i}>
                  <UrlImage imagePreview={image} handleClick={onClickImage} />
                </SwiperSlide>
              )
          )}
      </Swiper>
    </Box>
  );
};
