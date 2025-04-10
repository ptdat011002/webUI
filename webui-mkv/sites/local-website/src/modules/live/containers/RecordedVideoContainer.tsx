import { Box, styled } from '@packages/ds-core';
import { ScreenType, VideoHandle } from '../types';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { IPLayerInfo, VideoController, VideoPlayer } from '../components';
import { IRecordSearch } from '../../playback/types';
import { getDateTime, StorageDirectory } from '../../_shared';
import { DOWNLOAD_URL } from '../../../configs/constants/cam-config.ts';

export interface RecordedVideoContainerProps {
  className?: string;
  records?: IRecordSearch[];
}

export interface RecordedVideoHandle {
  playFromTime: (timeInSeconds: number) => void;
}

const allowedRate = [1, 2, 4, 16];

const defaultPlayerInfo: IPLayerInfo = {
  isPlaying: true,
  volume: 100,
  scale: '1',
  screenType: ScreenType.extend,
  playbackRate: allowedRate[0],
};

// const mockVideoListUrl = [
//   'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//   'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//   'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//   'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
//   'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//   'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
//   'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
// ];

export const RecordedVideoContainer = forwardRef<
  RecordedVideoHandle,
  RecordedVideoContainerProps
>(({ className, records = [] }, ref) => {
  const videoRefs = [useRef<VideoHandle>(null), useRef<VideoHandle>(null)];

  const [playerInformation, setPlayerInformation] =
    useState<IPLayerInfo>(defaultPlayerInfo);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePlayer, setActivePlayer] = useState(0);

  useImperativeHandle(ref, () => ({
    playFromTime: (timeInSeconds: number) => {
      const record = records.find(
        (r) =>
          r.start_time <= timeInSeconds &&
          timeInSeconds < r.start_time + r.duration,
      );
      if (!record) return;

      const offset = timeInSeconds - record.start_time;
      const videoUrl = `${DOWNLOAD_URL}${record.file_name}`;
      const index = records.indexOf(record);

      const currentActivePlayer = activePlayer;
      const nextActivePlayer = 1 - activePlayer;

      videoRefs[currentActivePlayer].current?.pauseRecord();
      setActivePlayer(nextActivePlayer);
      setCurrentIndex(index);

      videoRefs[nextActivePlayer].current?.playFromTime(videoUrl, offset);

      const nextIndex = (index + 1) % records.length;
      if (records[nextIndex]) {
        const nextVideoUrl = `${DOWNLOAD_URL}${records[nextIndex].file_name}`;
        videoRefs[currentActivePlayer].current?.preloadRecord(nextVideoUrl);
      }
    },
  }));

  const applyVideoAttributes = (playerIndex: number) => {
    const videoPlayer = videoRefs[playerIndex].current;
    if (!videoPlayer) return;
    videoPlayer.setVolume(playerInformation.volume);
    videoPlayer.setScale(Number(playerInformation.scale));
    videoPlayer.setRate(playerInformation?.playbackRate || allowedRate[0]);
    videoPlayer.setScreenType(playerInformation.screenType);
  };

  const handleVideoEnded = () => {
    const currentActivePlayer = activePlayer;
    const nextActivePlayer = 1 - activePlayer;

    videoRefs[currentActivePlayer].current?.pauseRecord();
    setActivePlayer(nextActivePlayer);

    videoRefs[nextActivePlayer].current?.playRecord();
    applyVideoAttributes(nextActivePlayer);

    const nextIndex = (currentIndex + 1) % records.length;

    if (records[nextIndex]) {
      const nextVideoUrl = `${DOWNLOAD_URL}${records[nextIndex].file_name}`;
      // const nextVideoUrl = mockVideoListUrl[nextIndex];
      videoRefs[currentActivePlayer].current?.preloadRecord(nextVideoUrl);

      setCurrentIndex(nextIndex);
    }
  };

  const onClickStopVideo = () => {
    const video = videoRefs[activePlayer].current;
    if (!video) return;

    video.pauseRecord();
    setPlayerInformation({
      ...playerInformation,
      isPlaying: false,
    });
  };

  const onClickStartVideo = () => {
    const video = videoRefs[activePlayer].current;
    if (!video) return;

    video.playRecord();
    setPlayerInformation({
      ...playerInformation,
      isPlaying: true,
    });
  };

  const handleNextScreenType = (nextScreenType: ScreenType) => {
    if (playerInformation.screenType === nextScreenType) {
      return;
    }

    switch (nextScreenType) {
      case ScreenType.normal:
        videoRefs[activePlayer].current?.setScreenType(ScreenType.normal);
        setPlayerInformation({
          ...playerInformation,
          screenType: ScreenType.normal,
        });
        break;
      case ScreenType.extend:
        videoRefs[activePlayer].current?.setScreenType(ScreenType.extend);
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
    const targetCanvas = videoRefs[activePlayer].current?.capture();
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
    videoRefs[activePlayer].current?.setScale(Number(value));
  };

  const handleChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPlayerInformation({
      ...playerInformation,
      volume: value,
    });
    videoRefs[activePlayer].current?.setVolume(value);
  };

  const handleChangeRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (allowedRate.indexOf(value) === -1) return;

    setPlayerInformation({
      ...playerInformation,
      playbackRate: value,
    });
    videoRefs[activePlayer].current?.setRate(value);
  };

  const handleOnDownload = async () => {
    const video = videoRefs[activePlayer].current;
    if (!video) return;

    if (!records[currentIndex]) return;

    const currentVideoUrl = `${DOWNLOAD_URL}${records[currentIndex].file_name}`;

    const fileName =
      records[currentIndex]?.file_name || `Recorded Video ${getDateTime()}.mp4`;

    // const canSave = await StorageDirectory.canSaveFile();
    // if (!canSave) {
    const aTag = document.createElement('a');
    aTag.href = currentVideoUrl;
    aTag.download = fileName;
    aTag.click();
    return;
    // }
    //
    // const blob = await fetch(currentVideoUrl).then((response) =>
    //   response.blob(),
    // );
    // if (blob) {
    //   await StorageDirectory.saveFile(blob, fileName);
    // }
  };

  useEffect(() => {
    if (records.length === 0) return;

    const currentActivePlayer = activePlayer;
    const nextActivePlayer = 1 - activePlayer;

    if (records[currentIndex]) {
      const currentVideoUrl = `${DOWNLOAD_URL}${records[currentIndex].file_name}`;
      // const currentVideoUrl = mockVideoListUrl[currentIndex];
      videoRefs[currentActivePlayer].current?.play(currentVideoUrl);

      const nextIndex = (currentIndex + 1) % records.length;

      if (records[nextIndex]) {
        const nextVideoUrl = `${DOWNLOAD_URL}${records[nextIndex].file_name}`;
        // const nextVideoUrl = mockVideoListUrl[nextIndex];

        videoRefs[nextActivePlayer].current?.preloadRecord(nextVideoUrl);
        setCurrentIndex(nextIndex);
      }
    }
  }, [records]);

  return (
    <Wrapper className={className}>
      <VideoFrame id={'full-screen-wrapper'}>
        <div
          style={{
            display: activePlayer === 0 ? 'block' : 'none',
            height: '100%',
            width: '100%',
          }}
        >
          <VideoPlayer ref={videoRefs[0]} onEnded={handleVideoEnded} />
        </div>
        <div
          style={{
            display: activePlayer === 1 ? 'block' : 'none',
            height: '100%',
            width: '100%',
          }}
        >
          <VideoPlayer ref={videoRefs[1]} onEnded={handleVideoEnded} />
        </div>
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
          onChangeRate={handleChangeRate}
          onClickDownload={handleOnDownload}
        />
      </ControlBar>
    </Wrapper>
  );
});
RecordedVideoContainer.displayName = 'RecordedVideoContainer';

const Wrapper = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 0.75rem;
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
