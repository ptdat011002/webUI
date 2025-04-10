import EncryptStreamForm from '../components/EncryptStreamForm.tsx';
import React from 'react';
import { IStream } from '../types';
import { Box, Spinner, styled } from '@packages/ds-core';
import { PaddingWrapper } from 'modules/_shared/index.ts';
import { useMainStream } from '../hooks';

export interface EncryptMainStreamContainerProps {
  className?: string;
}

const defaultStreamValue: IStream = {
  resolution: '2592x1944',
  fps: 30,
  encode_type: 'H264',
  encode_level: 'MainProfile',
  bitrate_control: 'CBR',
  bitrate: 4000,
  i_frame_interval: 1,
  audio_enable: true,
};

const EncryptMainStreamContainer: React.FC<
  EncryptMainStreamContainerProps
> = () => {
  const { setMainStream, loading, mainStreamData, isMainStreamLoading } =
    useMainStream();

  const onSubmit = async (values: IStream) => {
    await setMainStream(values);
  };

  if (isMainStreamLoading) {
    return <Spinner />;
  }

  return (
    <PaddingWrapper type="formTab">
      <Wrapper>
        <EncryptStreamForm
          onSubmit={onSubmit}
          isLoading={loading}
          defaultValue={mainStreamData || defaultStreamValue}
        />
      </Wrapper>
    </PaddingWrapper>
  );
};
export default EncryptMainStreamContainer;

const Wrapper = styled(Box)`
  width: 652px;
  max-width: 100%;
`;
