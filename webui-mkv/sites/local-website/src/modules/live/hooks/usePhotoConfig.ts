import { useState } from 'react';
import useSWR from 'swr';
import { liveService } from '../live-service.ts';
import { IImageControlConfig, INightVisionConfig } from '../types';
import { IApiError, useAPIErrorHandler } from '../../_shared';
import { IPhotoConfigForm } from '../containers';
import { message } from 'antd';
import { t } from 'configs/i18next.ts';

export const usePhotoConfig = () => {
  const [loading, setLoading] = useState(false);

  const { handlerError } = useAPIErrorHandler();

  const { data, isLoading, mutate } = useSWR(
    'image-control-configuration',
    async () => {
      const res = await Promise.all([
        liveService.getImageControlConfig(),
        liveService.getNightVisionConfig(),
      ]);

      return {
        imageControl: res[0],
        nightVision: res[1],
      };
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      shouldRetryOnError: false,
      onError: (error) => {
        handlerError(error as IApiError);
      },
    },
  );

  const update = async (config: IPhotoConfigForm) => {
    try {
      setLoading(true);

      const imageControlPayload: IImageControlConfig = {
        hdr_mode: config.hdr_mode,
        ...mapFormToData(config),
      };

      const nightVisionPayload: INightVisionConfig = {
        nightvision_mode: config.nightvision_mode,
        ir_led: {
          mode: config.ir_led_mode,
          high_value: config.far_led,
          low_value: config.near_led,
        },
        day_night_mode: config.day_night_mode,
        ir_cut_mode: config.ir_cut_mode,
      };

      const [imageControlResult, nightVisionResult] = await Promise.allSettled([
        liveService.setImageControlConfig(imageControlPayload),
        liveService.setNightVisionConfig(nightVisionPayload),
      ]);

      const hasError = [imageControlResult, nightVisionResult].some(
        (result) => result.status === 'rejected',
      );

      if (hasError) {
        handlerError('error');
        return;
      }

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
    mutate,
    isUpdating: loading,
    isFetching: isLoading,
    data,
    update,
  };
};

const mapFormToData = (
  values: IPhotoConfigForm,
): {
  mirror_mode: 'All' | 'None';
  angle_rotation: 0;
} => {
  if (values.rotate_photo === 180) {
    return {
      mirror_mode: 'All',
      angle_rotation: 0,
    };
  }

  return {
    mirror_mode: 'None',
    angle_rotation: 0,
  };
};
