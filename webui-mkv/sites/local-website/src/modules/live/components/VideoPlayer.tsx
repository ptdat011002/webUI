import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Spinner, Text } from '@packages/ds-core';
import { OPEN_VIDEO_SRC_FAILED, VideoHandle } from '../types';
import { useModal } from '@packages/react-modal';
import { t } from 'configs/i18next.ts';

export interface VideoPlayerProps {
  className?: string;
  hasDrawCoordinates?: boolean;
  onEnded?: () => void;
}

const defaultPath = '//:0';

export const VideoPlayer = forwardRef<VideoHandle, VideoPlayerProps>(
  ({ className, hasDrawCoordinates, onEnded }, rootRef) => {
    const modal = useModal();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExtendWidth, setIsExtendWidth] = useState(true);

    useImperativeHandle(rootRef, () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      return {
        // live video
        play: (videoURL) => {
          if (!video || !canvas) return;

          video.src = videoURL;
          video.load();

          setIsLoading(true);
          setIsPlaying(false);

          video.play().then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          });
        },
        pause: () => {
          if (!video || !canvas) return;

          video.pause();

          const context = canvas.getContext('2d');
          if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
          }

          video.src = defaultPath;
          video.load();

          setIsPlaying(false);
        },

        // recorded video
        preloadRecord: (videoURL: string) => {
          if (!video) return;
          video.src = videoURL;
          video.preload = 'auto';
          video.load();

          video.play().then(() => {
            video.pause();
            video.currentTime = 0;
          });
        },
        playRecord: () => {
          if (!video) return;
          video.play().then(() => {
            setIsPlaying(true);
          });
        },
        pauseRecord: () => {
          if (!video) return;
          video.pause();
        },

        // actions
        setScreenType: (screenType) => {
          setIsExtendWidth(screenType === 'extend');
        },
        setVolume(value: number) {
          if (!video) return;
          video.volume = value / 100;
        },
        setScale: (scale: number) => {
          if (!video || !canvas) return;
          video.style.transform = `scale(${scale})`;
          canvas.style.transform = `scale(${scale})`;
        },
        setRate: (rate: number) => {
          if (!video) return;
          video.playbackRate = rate;
        },
        capture: () => {
          const video = videoRef.current;
          const canvas = canvasRef.current;

          if (!video || !canvas) return;

          const targetCanvas = document.createElement('canvas');
          const context = targetCanvas.getContext('2d');

          if (!context) return;

          if (isPlaying) {
            targetCanvas.width = video.videoWidth;
            targetCanvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          } else {
            targetCanvas.width = canvas.width;
            targetCanvas.height = canvas.height;
            context.drawImage(canvas, 0, 0, canvas.width, canvas.height);
          }

          return targetCanvas;
        },
        playFromTime: (url: string, time: number) => {
          if (!video) return;

          video.src = url;
          video.load();

          setIsLoading(true);
          setIsPlaying(false);

          video.play().then(() => {
            video.currentTime = time;
            setIsPlaying(true);
            setIsLoading(false);
          });
        },
      };
    });

    const handleLoadStart = () => {
      if (!videoRef.current || videoRef.current.src === defaultPath) return;

      setIsLoading(true);
    };

    const handleOnError = (error: MediaError) => {
      if (error.message === OPEN_VIDEO_SRC_FAILED) {
        modal.confirm({
          title: t('notification'),
          message: (
            <Text color="dark">
              {t('Unable to get video stream. Please try again.')}
            </Text>
          ),
          onConfirm: ({ close }) => {
            close();
            videoRef.current?.load();
          },
        });
      }
    };

    return (
      <Wrapper className={className}>
        <LoadingSpinner isLoading={isLoading} />
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        {hasDrawCoordinates ? (
          <div
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              onLoadStart={handleLoadStart}
              style={{
                display: 'block',
                maxHeight: '100%',
                maxWidth: '100%',
                height: '100%',
                objectFit: 'fill',
              }}
              crossOrigin={'anonymous'}
              onError={(error) => {
                const target = error.target as HTMLVideoElement;
                if (!target.error) return;
                handleOnError(target.error);
              }}
            />
            <canvas ref={canvasRef} />
          </div>
        ) : (
          <div
            style={{
              position: 'relative',
              height: '100%',
              width: '100%',
              display: isLoading ? 'none' : 'block',
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              style={{
                display: isPlaying ? 'block' : 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: isExtendWidth ? 'fill' : undefined,
              }}
              crossOrigin={'anonymous'}
              onError={(error) => {
                const target = error.target as HTMLVideoElement;
                if (!target.error) return;
                handleOnError(target.error);
              }}
              onEnded={onEnded}
            />
            <canvas
              ref={canvasRef}
              style={{
                display: isPlaying ? 'none' : 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: isExtendWidth ? 'fill' : undefined,
              }}
            />
          </div>
        )}
      </Wrapper>
    );
  },
);
VideoPlayer.displayName = 'VideoPlayerForwardRef';

const Wrapper = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const LoadingSpinner = styled(Spinner)<{ isLoading?: boolean }>`
  position: absolute;
  z-index: 1;
  display: ${({ isLoading }) => (isLoading ? 'block' : 'none')};
`;
