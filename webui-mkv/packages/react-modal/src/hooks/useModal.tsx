import { useContext } from 'react';
import { IModal, NotiParams } from '../types';
import { ModalContext } from '../modal-context';
import { NotificationModalContent } from '../components';
import React from 'react';

export interface UseModalReturn {
  show: (modal: IModal) => { id: string };
  close: (id: string) => void;
  error: (params: Omit<NotiParams, 'type'>) => void;
  success: (params: Omit<NotiParams, 'type'>) => void;
  warning: (params: Omit<NotiParams, 'type'>) => void;
  confirm: (params: Omit<NotiParams, 'type'>) => void;
}

export const useModal = (): UseModalReturn => {
  const { showModal, closeModal } = useContext(ModalContext);

  return {
    show: showModal,
    close: closeModal,
    error: (params) => {
      showModal({
        ...params,
        render: (state, close) => (
          <NotificationModalContent
            {...params}
            id={state.id}
            type="error"
            onClose={close}
          />
        ),
      });
    },
    success: (params) => {
      showModal({
        ...params,
        render: (state, close) => (
          <NotificationModalContent
            {...params}
            id={state.id}
            type="success"
            onClose={close}
          />
        ),
      });
    },
    warning: (params) => {
      showModal({
        ...params,
        render: (state, close) => (
          <NotificationModalContent
            {...params}
            id={state.id}
            type="warning"
            onClose={close}
          />
        ),
      });
    },
    confirm: (params) => {
      showModal({
        ...params,
        render: (state, close) => (
          <NotificationModalContent
            {...params}
            id={state.id}
            type="confirm"
            onClose={close}
          />
        ),
      });
    },
  };
};
