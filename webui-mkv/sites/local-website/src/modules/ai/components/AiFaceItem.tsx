import React from 'react';
import { IFaceConfig } from '../types';
import { Box, Flex, styled } from '@packages/ds-core';
import { CloseFilled } from '@packages/ds-icons';
import Checkbox from 'antd/es/checkbox';
import { useModal } from '@packages/react-modal';
import { Image } from 'antd';
import { ModalWrapper, useAPIErrorHandler } from 'modules/_shared';
import { FaceConfigForm } from '.';
import { t } from 'configs/i18next';

export interface AiFaceItemProps {
  className?: string;
  faceInfo: IFaceConfig;
  isSelected?: boolean;
  onSelectItem?: (isSelected: boolean) => void;
  onRemove?: () => Promise<void>;
  onUpdateFace?: (faceInfo: IFaceConfig) => void;
  disabled?: boolean;
}

export const AiFaceItem: React.FC<AiFaceItemProps> = ({
  faceInfo,
  isSelected = false,
  onSelectItem,
  onRemove,
  onUpdateFace,
  disabled,
}) => {
  const modal = useModal();
  const { handlerError } = useAPIErrorHandler();

  const showEditModal = () => {
    modal.show({
      title: t('update_face'),
      destroyOnClose: true,
      render: (_, close) => {
        return (
          <ModalWrapper>
            <Box
              style={{
                width: 500,
                minHeight: 200,
                boxSizing: 'border-box',
                maxWidth: '100%',
              }}
              padding="s16"
            >
              <FaceConfigForm
                onCancel={() => close?.()}
                onSubmit={async (v) => {
                  try {
                    await onUpdateFace?.(v);
                    close?.();
                  } catch (e) {
                    handlerError(e);
                  }
                }}
                initialValues={{
                  ...faceInfo,
                  sex: faceInfo?.sex ?? 1,
                }}
              />
            </Box>
          </ModalWrapper>
        );
      },
    });
  };

  const imageUrl = faceInfo
    ? import.meta.env.VITE_APP_API_URL + faceInfo?.image
    : '/user.svg';

  return (
    <Wrapper
      onClick={() => {
        if (disabled) return;
        showEditModal();
      }}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <HeaderWrapper>
        <FaceCheckbox
          disabled={disabled}
          checked={isSelected}
          onChange={(event) => {
            onSelectItem?.(event.target.checked);
          }}
          onClick={(event) => event.stopPropagation()}
        />
        <CloseFilled
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            zIndex: 1,
          }}
          className={'close'}
          onClick={(e) => {
            if (disabled) return;

            e.stopPropagation();
            onRemove?.();
          }}
          size={'1.375rem'}
        />
      </HeaderWrapper>
      <ImageWrapper justify="center" align={'center'}>
        <Image
          className="image"
          src={imageUrl}
          alt="face"
          fallback={'/user.svg'}
          preview={false}
        />
      </ImageWrapper>
      <TextWrapper>
        <span>{faceInfo.face_id}</span>
      </TextWrapper>
      <TextWrapper>
        <span>{faceInfo.name}</span>
      </TextWrapper>
    </Wrapper>
  );
};

const ImageWrapper = styled(Flex)`
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.primary300};
  aspect-ratio: 0.9;
  background-color: white;
  overflow: hidden;

  .image {
    object-fit: cover;
  }
`;

const FaceCheckbox = styled(Checkbox)`
  top: 0.25rem;
  left: 0.25rem;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const TextWrapper = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const HeaderWrapper = styled(Flex)`
  position: absolute;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0.5rem;

  .close {
    color: ${({ theme }) => theme.colors.primary300};
    cursor: pointer;
    accent-color: ${({ theme }) => theme.colors.primary300};
  }
`;
