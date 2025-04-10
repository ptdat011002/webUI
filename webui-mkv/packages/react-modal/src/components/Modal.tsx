import { Text, styled } from '@packages/ds-core';
import { debounce } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { StyledModal } from './StyleModal';
import { CloseOutlined } from '@packages/ds-icons';
import { ModalHeader } from './ModalHeader';

export interface ModalProps {
  show: boolean;
  closeable?: boolean;
  title?: string;
  onCancel?: () => void;
  onClose?: () => void;
  renderChild?: (params: { close?: () => void }) => React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ ...props }: ModalProps) => {
  const modalContainer = React.useRef(document.createElement('div'));

  React.useLayoutEffect(() => {
    const currentEle = modalContainer.current;
    document.body.appendChild(currentEle);
  }, []);

  if (!modalContainer.current) {
    return null;
  }

  return ReactDOM.createPortal(
    <ModalContent {...props} />,
    modalContainer.current,
  );
};

const ModalContent: React.FC<ModalProps> = ({
  show: visiable,
  onCancel,
  title,
  closeable = true,
  onClose,
  renderChild,
}) => {
  const [show, setShow] = React.useState(false);

  const triggerOnchange = useMemo(() => {
    return debounce((value: boolean, callback?: () => void) => {
      setShow(value);
      setTimeout(callback, 200);
    }, 200);
  }, []);

  useEffect(() => {
    triggerOnchange(visiable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiable]);

  return (
    <ModalWrapper className="modal" visiable={visiable} show={show}>
      <div
        style={{
          position: 'relative',
          height: '100%',
        }}
      >
        <Overlay
          className="modal-overlay"
          onClick={() => closeable && triggerOnchange(false, onCancel)}
        />
        <ModalChild className="modal-content">
          <StyledModal>
            {closeable && (
              <Text
                className="close-icon"
                onClick={() => triggerOnchange(false, onClose)}
              >
                <CloseOutlined size={36} color="light" />
              </Text>
            )}
            <ModalHeader>
              <Text color="light" fontSize="l">
                {title}
              </Text>
            </ModalHeader>
            {renderChild?.({
              close: () => triggerOnchange(false, onClose),
            })}
          </StyledModal>
        </ModalChild>
      </div>
    </ModalWrapper>
  );
};

const ModalChild = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.2s linear;
  transform-origin: center center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.overlay};
  transition: all 0.2s linear;
`;

const ModalWrapper = styled.div<{
  visiable: boolean;
  show: boolean;
}>`
  display: ${({ visiable }) => (visiable ? 'block' : 'none')};
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.modal};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};

  .modal-content {
    opacity: ${({ show }) => (show ? '100%' : '0%')};
    top: ${({ show }) => (show ? '50%' : '45%')};
    max-width: 95vw;
  }

  .modal-overlay {
    opacity: ${({ show }) => (show ? '100%' : '0%')};
  }
`;
