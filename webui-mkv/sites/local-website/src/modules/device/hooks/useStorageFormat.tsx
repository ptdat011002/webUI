import { deviceService } from '../device-service.ts';
import { ModalWrapper, useAPIErrorHandler } from 'modules/_shared';
import { useState } from 'react';
import { IStorageFormatRequest } from '../types';
import { useModal } from '@packages/react-modal';
import { t } from 'i18next';
import { FormattingModal } from '../components';

export const useStorageFormat = () => {
  const { handlerError } = useAPIErrorHandler();
  const modal = useModal();

  const [loading, setLoading] = useState(false);

  const setStorageFormat = async (data: IStorageFormatRequest) => {
    const { id: modalId } = showLoadingModal();

    try {
      setLoading(true);
      await deviceService.setStorageFormat(data);

      modal.close(modalId);
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  const showLoadingModal = () =>
    modal.show({
      title: t('notification'),
      render: (_state, close) => (
        <ModalWrapper>
          <div style={{ width: 400, minHeight: 200 }}>
            <FormattingModal close={() => close?.()} />
          </div>
        </ModalWrapper>
      ),
    });
  return {
    loading,
    setStorageFormat,
  };
};
