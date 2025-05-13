import { Box, Image } from '@chakra-ui/react';
import React from 'react';
import playButton from '@/assets/icon/play-button.png';
import { getVideoSource, isVideoSupported } from '@/lib/videoSupport';

interface Props {
  imagePreview: string;
  handleClick?: () => void;
  handleError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const TimeLineThumbnail: React.FC<Props> = ({ imagePreview, handleClick, handleError }) => {
  return (
    <>
      {isVideoSupported(imagePreview) ? (
        <Box
          onClick={handleClick ? handleClick : undefined}
          width={{ base: '105px', sm: '125px', md: '150px', lg: '285px' }}
          height={{ base: '105px', sm: '125px', md: '150px', lg: '285px' }}
          border={'1px solid gray'}
        >
          <Image
            src={playButton.src}
            position={'absolute'}
            width={{ base: '20px', sm: '30px', md: '30px', lg: '40px' }}
            marginLeft={{ base: '80px', sm: '90px', md: '110px', lg: '240px' }}
            marginTop={{ base: '3px', sm: '4px', md: '5px' }}
            height={'auto'}
            loading="lazy"
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
        <Image
          src={imagePreview}
          onClick={handleClick ? handleClick : undefined}
          objectFit="cover"
          border={'1px solid gray'}
          width={{ base: '105px', sm: '125px', md: '150px', lg: '285px' }}
          height={{ base: '105px', sm: '125px', md: '150px', lg: '285px' }}
          loading="lazy"
          onError={handleError ? handleError : undefined}
        />
      )}
    </>
  );
};

export default TimeLineThumbnail;
