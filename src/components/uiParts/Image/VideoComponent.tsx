import { useRef, useEffect, useState } from 'react';
import { getVideoSource } from '@/lib/videoSupport';
import { useSearchParams } from 'next/navigation';
import { TIMELINE_TYPES } from '@/utils/constValues';

type Props = {
  imagePreview: string;
  handleClick?: () => void;
};

export const VideoComponent = ({ imagePreview, handleClick }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const timelineType = searchParams.get('timelineType');
  const postId = searchParams.get('postId');

  const seekBarControls =
    (timelineType === TIMELINE_TYPES.daoResults &&
      timelineType === TIMELINE_TYPES.fishingResults) ||
    !!postId;

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    const currentVideoRef = videoRef.current;

    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    const currentVideoRef = videoRef.current;
    if (isVisible && currentVideoRef) {
      currentVideoRef.play().catch(() => currentVideoRef.pause());
    } else if (!isVisible && currentVideoRef) {
      currentVideoRef.pause();
    }
  }, [isVisible]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
      <video
        ref={videoRef}
        width="100%"
        height="auto"
        style={{
          objectFit: 'cover',
        }}
        loop
        playsInline
        controlsList="nodownload"
        preload="metadata"
        controls={seekBarControls}
      >
        <source {...getVideoSource(imagePreview)} />
      </video>
      {handleClick && (
        <div
          onClick={handleClick}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
};
