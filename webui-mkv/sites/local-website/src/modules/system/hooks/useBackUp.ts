import { message } from 'antd';
import { systemService } from '../system-service.ts';
import { useAPIErrorHandler } from 'modules/_shared/index.ts';
import { useState } from 'react';
import { t } from 'configs/i18next.ts';
import { useManualReboot } from './useManualReboot.ts';
import { handleCreateAndDownloadFileTxt } from 'modules/_shared/helpers/download.ts';

export const useBackUp = () => {
  const { handlerError } = useAPIErrorHandler();

  const { updateManualReboot } = useManualReboot();
  const [actionLoading, setActionLoading] = useState(false);

  const triggerBackup = async (fileName: string) => {
    try {
      setActionLoading(true);
      const data = await systemService.getExportConfig();

      await handleCreateAndDownloadFileTxt(data, fileName);

      message.success(
        t('action_success', {
          action: t('export'),
        }),
      );
    } catch (e) {
      handlerError(e);
    } finally {
      setActionLoading(false);
    }
  };
  const uploadBackUpFile = async (data: object) => {
    try {
      setActionLoading(true);
      await systemService.importConfig(data);

      message.success(
        t('action_success', {
          action: t('import'),
        }),
      );

      await updateManualReboot();

      message.info(t('waitingForReboot'));
    } catch (e) {
      handlerError(e);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionLoading,
    triggerBackup,
    uploadBackUpFile,
  };
};
