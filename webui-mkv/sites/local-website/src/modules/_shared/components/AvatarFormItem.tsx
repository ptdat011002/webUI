import { Box, styled } from '@packages/ds-core';
import { fileToBase64 } from '@packages/react-helper';
import { Typography } from 'antd';
import { t } from 'configs/i18next';
import React from 'react';

export interface AvatarFormItemProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const AvatarFormItem: React.FC<AvatarFormItemProps> = ({
  value,
  onChange,
}) => {
  const imageRef = React.useRef<HTMLImageElement>(null);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    onChange?.(base64);
  };

  return (
    <Wrapper>
      <input
        type="file"
        style={{
          display: 'none',
        }}
        onChange={handleChange}
        accept="image/*"
      />
      <img
        ref={imageRef}
        className="image"
        src={value || '/user.svg'}
        width={!value ? '80%' : '100%'}
        height={!value ? '90%' : '100%'}
        onError={(e) => {
          e.currentTarget.src = '/user.svg';
        }}
        alt={'avatar'}
      />
      <Box className="bottom-btn">
        <Typography.Text>{t('select_image')}</Typography.Text>
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled.label`
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.primary300};
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
  text-align: center;
  justify-content: end;
  align-items: center;
  position: relative;
  cursor: pointer;

  image {
    object-fit: cover;
  }

  .bottom-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 4px;
    background-color: ${({ theme }) => theme.colors.secondary400};
  }
`;
