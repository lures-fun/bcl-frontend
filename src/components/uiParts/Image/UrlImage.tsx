import { Image } from '@chakra-ui/react';
import React from 'react';
import { isVideoSupported } from '@/lib/videoSupport';
import { VideoComponent } from '@/components/uiParts/Image/VideoComponent';

interface Props {
  imagePreview: string;
  handleClick?: () => void;
  handleError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const UrlImage: React.FC<Props> = ({ imagePreview, handleClick, handleError }) => {
  return (
    <>
      {isVideoSupported(imagePreview) ? (
        <VideoComponent imagePreview={imagePreview} handleClick={handleClick} />
      ) : (
        <Image
          src={imagePreview}
          width="100%"
          height="auto"
          onClick={handleClick ? handleClick : undefined}
          objectFit={'cover'}
          loading="lazy"
          onError={handleError ? handleError : undefined}
        />
      )}
    </>
  );
};

export default UrlImage;
