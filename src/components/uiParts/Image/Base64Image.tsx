import { Image } from '@chakra-ui/react';
import React from 'react';
import { getVideoSourceBase64, isVideoSupportedBase64 } from '@/lib/videoSupport';

interface Props {
  imagePreview: string;
  handleClick?: () => void;
  isImageFullSize?: boolean;
}

const Base64Image: React.FC<Props> = ({ imagePreview, handleClick, isImageFullSize }) => {
  return (
    <>
      {isVideoSupportedBase64(imagePreview) ? (
        <video
          onClick={handleClick ? handleClick : undefined}
          width="100%"
          height="auto"
          loop
          controls={false}
          playsInline={true}
          muted
          autoPlay={true}
          preload="metadata"
        >
          <source {...getVideoSourceBase64(imagePreview)} />
        </video>
      ) : (
        <Image
          src={imagePreview}
          onClick={handleClick ? handleClick : undefined}
          objectFit="cover"
          loading="lazy"
          {...(isImageFullSize ? { w: '100%', h: '100%' } : {})}
        />
      )}
    </>
  );
};

export default Base64Image;
