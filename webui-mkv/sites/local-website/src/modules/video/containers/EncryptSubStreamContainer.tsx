import EncryptStreamForm from '../components/EncryptStreamForm.tsx';
import React from 'react';
import { IStream } from '../types';
import { Box, Spinner, styled } from '@packages/ds-core';
import { useSubStream } from '../hooks';
import { PaddingWrapper } from 'modules/_shared/index.ts';

export interface EncryptSubStreamContainerProps {
  className?: string;
}

const defaultStreamValue: IStream = {
  resolution: '1280x720',
  fps: 15,
  encode_type: 'H264',
  encode_level: 'MainProfile',
  bitrate_control: 'CBR',
  bitrate: 4000,
  i_frame_interval: 1,
  audio_enable: true,
};

const EncryptSubStreamContainer: React.FC<
  EncryptSubStreamContainerProps
> = () => {
  const { setSubStream, loading, subStreamData, isSubStreamLoading } =
    useSubStream();

  const onSubmit = async (values: IStream) => {
    await setSubStream(values);
  };

  if (isSubStreamLoading) {
    return <Spinner />;
  }

  return (
    <PaddingWrapper type="formTab">
      <Wrapper>
        <EncryptStreamForm
          onSubmit={onSubmit}
          isLoading={loading}
          defaultValue={subStreamData || defaultStreamValue}
          type="sub"
        />
      </Wrapper>
    </PaddingWrapper>
  );
};
export default EncryptSubStreamContainer;

const Wrapper = styled(Box)`
  width: 652px;
  max-width: 100%;
`;
