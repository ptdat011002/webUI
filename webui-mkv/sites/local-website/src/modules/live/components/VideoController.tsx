import React from 'react';
import { Flex, styled } from '@packages/ds-core';
import {
  AspectRatioOutlined,
  CameraOutlined,
  DownloadVideoOutlined,
  MaximizeOutlined,
  MinimizeOutlined,
  PlayerPlayOutlined,
  StopOutlined,
  VideoRate16Outlined,
  VideoRate1Outlined,
  VideoRate2Outlined,
  VideoRate4Outlined,
  VolumeMuteOutlined,
  VolumeOutlined,
  ZoomInOutlined,
} from '@packages/ds-icons';
import { VerticalRangeInput } from './VerticalRangeInput.tsx';
import { ScreenType } from '../types';

const minVolume = 0;
const maxVolume = 100;

const minScale = 0.1;
const maxScale = 2;

export interface IPLayerInfo {
  isPlaying: boolean;
  volume: number;
  scale: string;
  screenType: ScreenType;
  playbackRate?: number;
}

export interface VideoControllerProps {
  className?: string;
  playerInfo: IPLayerInfo;
  onClickStart?: () => void;
  onClickStop?: () => void;
  handleNextScreenType?: (screenType: ScreenType) => void;
  onClickCapture?: () => void;
  onChangeScale?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeVolume?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickFullScreen?: () => void;
  onChangeRate?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickDownload?: () => void;
}

export const VideoController: React.FC<VideoControllerProps> = ({
  playerInfo,
  onClickStart,
  onClickStop,
  handleNextScreenType,
  onClickCapture,
  onChangeScale,
  onChangeVolume,
  onClickFullScreen,
  onChangeRate,
  onClickDownload,
}) => {
  return (
    <Flex gapX="s8">
      <IconButton>
        {playerInfo.isPlaying ? (
          <StopOutlined onClick={onClickStop} />
        ) : (
          <PlayerPlayOutlined onClick={onClickStart} />
        )}
      </IconButton>
      {onChangeRate && (
        <ButtonWrapper>
          <IconButton>
            {playerInfo?.playbackRate === 1 && <VideoRate1Outlined />}
            {playerInfo?.playbackRate === 2 && <VideoRate2Outlined />}
            {playerInfo?.playbackRate === 4 && <VideoRate4Outlined />}
            {playerInfo?.playbackRate === 16 && <VideoRate16Outlined />}
          </IconButton>
          <VerticalRangeInput
            className="range-slider"
            value={playerInfo?.playbackRate}
            onChange={onChangeRate}
            min={1}
            max={16}
          />
        </ButtonWrapper>
      )}
      {playerInfo.screenType !== ScreenType.normal && (
        <IconButton>
          <MinimizeOutlined
            onClick={() => handleNextScreenType?.(ScreenType.normal)}
          />
        </IconButton>
      )}
      {playerInfo.screenType !== ScreenType.extend && (
        <IconButton>
          <AspectRatioOutlined
            onClick={() => handleNextScreenType?.(ScreenType.extend)}
          />
        </IconButton>
      )}
      <IconButton>
        <MaximizeOutlined onClick={onClickFullScreen} />
      </IconButton>
      <IconButton>
        <CameraOutlined onClick={onClickCapture} />
      </IconButton>
      <ButtonWrapper>
        <IconButton>
          <ZoomInOutlined />
        </IconButton>
        <VerticalRangeInput
          className="range-slider"
          value={playerInfo.scale}
          onChange={onChangeScale}
          min={minScale}
          max={maxScale}
          step={0.1}
        />
      </ButtonWrapper>
      <ButtonWrapper>
        <IconButton>
          {playerInfo.volume === 0 ? (
            <VolumeMuteOutlined />
          ) : (
            <VolumeOutlined />
          )}
        </IconButton>
        <VerticalRangeInput
          className={'range-slider'}
          value={playerInfo.volume}
          onChange={onChangeVolume}
          min={minVolume}
          max={maxVolume}
          step={1}
        />
      </ButtonWrapper>
      {onClickDownload && (
        <IconButton>
          <DownloadVideoOutlined onClick={onClickDownload} />
        </IconButton>
      )}
    </Flex>
  );
};

const IconButton = styled.button`
  font-size: 28px;

  background-color: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 0.5rem;
  cursor: pointer;

  :hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
  width: 38px;
  height: 38px;

  :hover {
    .range-slider {
      opacity: 1;
      z-index: 1;
    }
  }
`;
