import { Box, Image } from '@chakra-ui/react';
import React from 'react';
import playButton from '@/assets/icon/play-button.png';
import { getVideoSource, isVideoSupported } from '@/lib/videoSupport';

interface Props {
  imagePreview: string;
  handleClick?: () => void;
  handleError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const ThumbnailImage: React.FC<Props> = ({ imagePreview, handleClick, handleError }) => {
  return (
    <>
      {isVideoSupported(imagePreview) ? (
        <Box aspectRatio={1} position="relative">
          <Image
            onClick={handleClick ? handleClick : undefined}
            src={playButton.src}
            position="absolute"
            right="2"
            alt="play button"
            width={{ base: '30px', md: '30px' }}
            marginTop="3px"
          />
          <video
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            preload="metadata"
            controls={false}
          >
            <source {...getVideoSource(imagePreview, true)} />
          </video>
        </Box>
      ) : (
        <Box aspectRatio={1}>
          <Image
            src={imagePreview}
            onClick={handleClick ? handleClick : undefined}
            objectFit="cover"
            w="100%"
            h="100%"
            loading="lazy"
            onError={handleError ? handleError : undefined}
          />
        </Box>
      )}
    </>
  );
};

export default ThumbnailImage;
