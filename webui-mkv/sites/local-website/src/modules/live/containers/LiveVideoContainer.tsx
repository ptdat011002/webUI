import { Box, styled } from '@packages/ds-core';
import { ScreenType, VideoHandle } from '../types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IPLayerInfo, VideoController, VideoPlayer } from '../components';
import { useLiveContext } from '../hooks/useLiveContext.ts';
import { debounce } from 'lodash';
import { LIVE_STREAM_URL, LIVE_PORT_NAME } from 'configs/constants/cam-config';
import { getDateTime, StorageDirectory } from '../../_shared';
import { useUpdatePort } from '../../system/hooks';

export interface PlayVideoContainerProps {
  className?: string;
}

type IPlayerInformation = IPLayerInfo & {
  src: string;
};

const defaultPlayerInformation: IPlayerInformation = {
  src: '',
  isPlaying: true,
  volume: 100,
  scale: '1',
  screenType: ScreenType.extend,
};

export const LiveVideoContainer: React.FC<PlayVideoContainerProps> = ({
  className,
}) => {
  const { loadData } = useUpdatePort();
  const { flow } = useLiveContext();

  const videoRef = useRef<VideoHandle>(null);

  const [playerInformation, setPlayerInformation] =
    useState<IPlayerInformation>(defaultPlayerInformation);

  const handleLoadPlayer = useMemo(() => {
    return debounce((url: string) => {
      setPlayerInformation({
        ...playerInformation,
        src: url,
      });
    }, 500);
  }, []);

  const onClickStartVideo = () => {
    videoRef.current?.play(playerInformation.src);

    setPlayerInformation({
      ...playerInformation,
      isPlaying: true,
    });
  };

  const onClickStopVideo = () => {
    videoRef.current?.pause();

    setPlayerInformation({
      ...playerInformation,
      isPlaying: false,
    });
  };

  const handleNextScreenType = (nextScreenType: ScreenType) => {
    if (playerInformation.screenType === nextScreenType) {
      return;
    }

    switch (nextScreenType) {
      case ScreenType.normal:
        setPlayerInformation({
          ...playerInformation,
          screenType: ScreenType.normal,
        });
        break;
      case ScreenType.extend:
        setPlayerInformation({
          ...playerInformation,
          screenType: ScreenType.extend,
        });
        break;
      default:
        break;
    }
  };

  const onClickFullScreen = async () => {
    const fullScreenVideo = document.getElementById('full-screen-wrapper');
    if (!fullScreenVideo) {
      return;
    }
    await fullScreenVideo.requestFullscreen();
  };

  const handleClickCapture = async () => {
    const targetCanvas = videoRef.current?.capture();
    if (!targetCanvas) return;

    const fileName = `Capture ${getDateTime()}.png`;

    const canSave = await StorageDirectory.canSaveFile();

    if (!canSave) {
      const dataUri = targetCanvas.toDataURL('image/png', 1);

      const aTag = document.createElement('a');
      aTag.href = dataUri;
      aTag.download = fileName;
      aTag.click();
      return;
    }

    const blob = await new Promise<Blob | null>((resolve) => {
      targetCanvas.toBlob((blob) => resolve(blob));
    });

    if (blob) {
      await StorageDirectory.saveFile(blob, fileName);
    }
  };

  const handleChangeScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value).toFixed(1);
    setPlayerInformation({
      ...playerInformation,
      scale: value,
    });
  };

  const handleChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPlayerInformation({
      ...playerInformation,
      volume: value,
    });
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (playerInformation.src === '') return;
    videoElement?.play(playerInformation.src);

    return () => {
      videoElement?.pause();
    };
  }, [playerInformation.src]);

  useEffect(() => {
    videoRef.current?.setScale(Number(playerInformation.scale));
  }, [playerInformation.scale]);

  useEffect(() => {
    videoRef.current?.setVolume(playerInformation.volume);
  }, [playerInformation.volume]);

  useEffect(() => {
    videoRef.current?.setScreenType(playerInformation.screenType);
  }, [playerInformation.screenType]);

  useEffect(() => {
    handleLoadPlayer(
      `${LIVE_STREAM_URL}?stream_type=${flow === 'primary' ? 'main' : 'sub'}`,
    );
    const videoSrc = new URL(`${LIVE_STREAM_URL}?stream_type=${flow === 'primary' ? 'main' : 'sub'}`);
    if (loadData) {
      try {  
        // Update the live port
        videoSrc.port = String(loadData.services.find(service => service.service === `${LIVE_PORT_NAME}`)?.port);
      } catch (error) {
        console.error("Invalid URL:", error);
      }
    }
    const newVideoUrl = videoSrc.toString();
    console.log("[LiveVideoContainer] video url is ", newVideoUrl);
    handleLoadPlayer(newVideoUrl);

  }, [loadData, flow, handleLoadPlayer]);

  return (
    <Wrapper className={className}>
      <VideoFrame id={'full-screen-wrapper'}>
        <VideoPlayer ref={videoRef} />
      </VideoFrame>
      <ControlBar>
        <VideoController
          playerInfo={playerInformation}
          onClickStart={onClickStartVideo}
          onClickStop={onClickStopVideo}
          handleNextScreenType={handleNextScreenType}
          onClickCapture={handleClickCapture}
          onChangeScale={handleChangeScale}
          onChangeVolume={handleChangeVolume}
          onClickFullScreen={onClickFullScreen}
        />
      </ControlBar>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
  height: 100%;

  .range-slider {
    position: absolute;
    top: -3.5rem;
    left: -0.6rem;

    z-index: 0;
    opacity: 0;
    transition: opacity 0.3s;
  }
`;

const VideoFrame = styled.div`
  margin: auto;
  max-width: 100%;
  height: 100%;
`;

const ControlBar = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0 1rem;
`;
