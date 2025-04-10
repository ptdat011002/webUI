import { useState } from 'react';
import { useAPIErrorHandler, IApiError } from '../../_shared';
import { IFaceConfig, IRemoveFacePlayLoad, ISearchFacePayload } from '../types';
import { aiService } from '../service.ts';
import useSWR from 'swr';
import { message } from 'antd';
import { t } from 'configs/i18next.ts';

export const useAiSearchFace = (payload: ISearchFacePayload) => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setLoading] = useState(false);
  const { data, isValidating, mutate } = useSWR(
    ['face_search_info', payload],
    async ([, payload]) => {
      const result = await aiService.searchFace(payload);
      return result || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
      onError: (error) => {
        handlerError(error as IApiError);
      },
    },
  );

  const removeFace = async (data: IRemoveFacePlayLoad) => {
    try {
      setLoading(true);
      await aiService.removeFace(data);
      await mutate();
      message.success(
        t('action_success', {
          action: t('delete'),
        }),
      );
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  const updateFace = async (data: IFaceConfig) => {
    try {
      setLoading(true);
      await aiService.updateFace({
        count: 1,
        faceInfo: [data],
      });
      await mutate();
      message.success(
        t('action_success', {
          action: t('update'),
        }),
      );
    } catch (e) {
      handlerError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    isFetching: isValidating,
    removeFace,
    actionLoading,
    searchData: data?.faceInfo,
    mutate,
    updateFace,
  };
};
