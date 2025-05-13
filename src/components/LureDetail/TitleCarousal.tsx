import { Box, Flex, Heading, Image, Link, Text } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Grid } from 'swiper/modules';
import { pathsCreator } from '@/utils/constValues';

// Swiperの必須スタイル
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';

type Props = {
  titleList?: {
    trophyId: string;
    trophyTitle: string;
    trophyImage: string;
  }[];
};

export const TitleCarousal = ({ titleList }: Props) => {
  const pagination = {
    clickable: true,
    renderBullet: (index: number, className: string) => {
      return `<span class="${className}" style="
        width: 10px;
        height: 10px;
        background: white;
        border: 1px solid white;
        border-radius: 9999px;
      "></span>`;
    },
    // ページネーションの位置を下部に固定
    el: '.title-pagination',
  };

  // ブレークポイントごとの設定
  const breakpoints = {
    0: {
      slidesPerView: 4,
      slidesPerGroup: 4,
    },
    480: {
      slidesPerView: 5,
      slidesPerGroup: 5,
    },
    768: {
      slidesPerView: 6,
      slidesPerGroup: 6,
    },
    992: {
      slidesPerView: 8,
      slidesPerGroup: 8,
    },
    1280: {
      slidesPerView: 12,
      slidesPerGroup: 12,
    },
  };

  return (
    <Box position="relative" py="4" px={{ base: 2, sm: 3, lg: 9 }}>
      <Heading as="h5" size="sm" color="white" fontFamily="Helvetica" letterSpacing="0.3em">
        TITLE
      </Heading>
      <Box width="100%" py="2">
        <Swiper
          modules={[Pagination, Grid]}
          pagination={pagination}
          speed={500}
          breakpoints={breakpoints}
        >
          {titleList &&
            titleList.map((title) => (
              <SwiperSlide key={title.trophyId}>
                <Box p="2" height="full">
                  <Link href={pathsCreator.trophies(title.trophyId?.toString() ?? '')}>
                    <Flex gap="2" direction="column" mx="auto" alignItems={'center'}>
                      <Box
                        width={['70px', '79px', '75px']}
                        height={['70px', '79px', '75px']}
                        rounded="md"
                        overflow="hidden"
                      >
                        <Image
                          src={title.trophyImage}
                          bgColor="white"
                          height="full"
                          width="auto"
                          objectFit="cover"
                          rounded="sm"
                          bg="black"
                          mx="auto"
                        />
                      </Box>
                      <Text
                        fontSize={['2xs', 'xs', 'sm', 'md']}
                        color="white"
                        width="full"
                        textAlign="center"
                        noOfLines={2}
                        wordBreak="keep-all"
                      >
                        {title.trophyTitle}
                      </Text>
                    </Flex>
                  </Link>
                </Box>
              </SwiperSlide>
            ))}
        </Swiper>
      </Box>

      {/* カスタムページネーション要素(ドットバー) */}
      <Box
        className="title-pagination"
        width="100%"
        display="flex"
        justifyContent="center"
        position="absolute"
        bottom="0"
        left="0"
        py="2"
      />
    </Box>
  );
};
