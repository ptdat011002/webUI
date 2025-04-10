import React from 'react';
import { ModalContext } from './modal-context';
import { IModal, IModalState } from './types';
import { Modal } from './components';

export interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = React.useState<IModalState[]>([]);

  const showModal = (modal: IModal): { id: string } => {
    const id = `${Date.now()}`;
    setModals((prev) => [
      ...prev,
      { closeable: true, ...modal, id, visible: true },
    ]);

    return {
      id,
    };
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  return (
    <ModalContext.Provider
      value={{
        showModal,
        modals,
        closeModal,
      }}
    >
      {children}
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          show={modal.visible}
          title={modal.title}
          closeable={modal.closeable}
          onClose={() => closeModal(modal.id)}
          onCancel={() => closeModal(modal.id)}
          renderChild={({ close }) =>
            modal.render(
              {
                closeable: modal.closeable,
                visible: modal.visible,
                id: modal.id,
                destroyOnClose: modal.destroyOnClose,
                title: modal.title,
              },
              close,
            )
          }
        />
      ))}
    </ModalContext.Provider>
  );
};

ModalProvider.displayName = 'ModalProvider';
