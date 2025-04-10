import { systemService } from '../system-service.ts';
import { useState } from 'react';
import { useAPIErrorHandler } from 'modules/_shared/hooks/useErrorHandler.tsx';

export const useManualReboot = () => {
  const { handlerError } = useAPIErrorHandler();

  const [loading, setLoading] = useState(false);

  const updateManualReboot = async () => {
    try {
      setLoading(true);
      await systemService.updateManualReboot();
    } catch (e) {
      handlerError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateManualReboot,
    loading,
  };
};
