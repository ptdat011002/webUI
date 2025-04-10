import { ISearchLoggerRequest } from '../types/stats.ts';
import { useState } from 'react';
import { aiService } from '../service.ts';
import { useAPIErrorHandler } from 'modules/_shared/index.ts';
import { handleCreateAndDownloadFileTxt } from '../../_shared/helpers/download.ts';
import { message } from 'antd';
import { t } from '../../../configs/i18next.ts';

export const useAiStats = () => {
  const { handlerError } = useAPIErrorHandler();

  const [actionLoading, setLoading] = useState(false);

  const triggerExportData = async (
    request: ISearchLoggerRequest,
    fileName: string,
  ) => {
    try {
      setLoading(true);
      const data = await aiService.searchEventLog(request);

      await handleCreateAndDownloadFileTxt(data, fileName);

      message.success(
        t('action_success', {
          action: t('download_file'),
        }),
      );
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    triggerExportData: triggerExportData,
    actionLoading,
  };
};
