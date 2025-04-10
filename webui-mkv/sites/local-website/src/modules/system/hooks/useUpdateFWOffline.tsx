import { useState } from 'react';
import { ModalWrapper, useAPIErrorHandler } from 'modules/_shared';
import { IOperatorUpdateOffline, IUpgradeManualRequest } from '../types';
import { systemService } from '../system-service.ts';
import { t } from 'i18next';
import { UpdatingFwModal } from '../components';
import { useModal } from '@packages/react-modal';
import { getMD5Checksum } from '../helpers/checksum.ts';

export const useUpdateFWOffline = () => {
  const [actionLoading, setActionLoading] = useState(false);
  const { handlerError } = useAPIErrorHandler();

  const modal = useModal();

  const uploadFWToServer = async (payload: IOperatorUpdateOffline) => {
    try {
      setActionLoading(true);

      const md5 = await getMD5Checksum(payload.fileUpload);

      const formData = new FormData();
      formData.append('file', payload.fileUpload);
      formData.append('md5', md5);

      const data = await systemService.operatorUpdateOffline(formData);

      await updateFWOffline(data);
    } catch (e) {
      handlerError(e);
    } finally {
      setActionLoading(false);
    }
  };

  const updateFWOffline = async (payload: IUpgradeManualRequest) => {
    try {
      setActionLoading(true);
      await systemService.upgradeManual(payload);
      showLoadingModal();
    } catch (e) {
      handlerError(e);
    } finally {
      setActionLoading(false);
    }
  };

  const showLoadingModal = () => {
    modal.show({
      title: t('fwUpdating'),
      render: (_state, close) => (
        <ModalWrapper>
          <div style={{ width: 400, minHeight: 200 }}>
            <UpdatingFwModal
              close={async () => {
                // await updateManualReboot();
                close?.();
              }}
            />
          </div>
        </ModalWrapper>
      ),
    });
  };

  return {
    actionLoading,
    uploadFWToServer,
  };
};
