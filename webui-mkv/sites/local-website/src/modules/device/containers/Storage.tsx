import React, { useMemo, useState } from 'react';
import { PaddingWrapper, useAPIErrorHandler } from 'modules/_shared';
import { Box, Spinner, styled, Text } from '@packages/ds-core';
import {
  IOverwriteFormValues,
  OverwriteForm,
  StorageInformationTable,
} from '../components';
import { IStorageInfo } from '../types';
import {
  useStorageFormat,
  useStorageInformation,
  useStorageSchedule,
} from '../hooks';
import _ from 'lodash';
import { t } from '../../../configs/i18next.ts';
import { useModal } from '@packages/react-modal';
import { message } from 'antd';

export interface StorageProps {
  className?: string;
}

const Storage: React.FC<StorageProps> = () => {
  const modal = useModal();
  const { handlerError } = useAPIErrorHandler();

  const [selectedStorage, setSelectedStorage] = useState<IStorageInfo[]>([]);

  const {
    data: storageInformation,
    isFetching: isStorageInformationFetching,
    setStorageInformation,
    loading: isStorageInformationLoading,
    mutate,
  } = useStorageInformation();

  const {
    data: storageSchedule,
    isFetching: isStorageScheduleFetching,
    setStorageSchedule,
    isUpdating: isStorageScheduleLoading,
  } = useStorageSchedule();

  const { loading: isFormatLoading, setStorageFormat } = useStorageFormat();

  const isFetching = useMemo(
    () => isStorageInformationFetching || isStorageScheduleFetching,
    [isStorageInformationFetching, isStorageScheduleFetching],
  );

  const isLoading = useMemo(
    () =>
      isStorageInformationLoading ||
      isStorageScheduleLoading ||
      isFormatLoading,
    [isStorageInformationLoading, isStorageScheduleLoading, isFormatLoading],
  );

  const initialValues: IOverwriteFormValues = useMemo(() => {
    const scheduleData = _.get(storageSchedule, 'schedules[0]', null);

    return {
      schedule_enable: scheduleData?.schedule_enable || false,
      wday: _.get(scheduleData, 'schedule_time.list_day[0].wday', 'Sun'),
      start_time: _.get(
        scheduleData,
        'schedule_time.list_day[0].list_time[0].start_time',
        '00:00:00',
      ),
      end_time: _.get(
        scheduleData,
        'schedule_time.list_day[0].list_time[0].end_time',
        '00:00:00',
      ),
      override: storageInformation?.storage_info.override || 'Off',
      threshold: storageInformation?.storage_info.threshold || 80,
    };
  }, [storageSchedule, storageInformation]);

  const handleOnFormatStorage = () => {
    if (!selectedStorage[0]) return;

    modal.confirm({
      title: t('notification'),
      message: (
        <Text color="dark">
          {t(
            'Are you sure you want to format the memory? Please make sure you have backed up all important information before continuing.',
          )}
        </Text>
      ),
      onConfirm: async ({ close }) => {
        close();
        await setStorageFormat({
          device_type: selectedStorage[0].device_type,
          serial: selectedStorage[0].serial,
        }).then(async () => {
          await mutate();
          showSuccessModal();
        });
      },
    });
  };

  const showSuccessModal = () => {
    modal.success({
      title: t('notification'),
      message: (
        <Text color="dark">{t('Memory has been formatted successfully')}</Text>
      ),
      onConfirm: ({ close }) => close(),
      confirmText: t('agree'),
    });
  };

  const handleOnFinish = async (values: IOverwriteFormValues) => {
    try {
      if (!storageInformation) return;

      const updateStorageInfo = async () => {
        await setStorageInformation({
          storage_info: {
            ...storageInformation.storage_info,
            override: values.override,
            threshold:
              values.override === 'Auto'
                ? values.threshold
                : storageInformation.storage_info.threshold,
          },
        });
      };

      const updateStorageSchedule = async () => {
        await setStorageSchedule({
          schedules: [
            {
              schedule_type: 'Storage',
              schedule_enable: values.schedule_enable,
              schedule_time: {
                mode: 'weekly',
                period_time: 0,
                list_day: [
                  {
                    wday: values.wday,
                    mday: 1,
                    list_time: [
                      {
                        start_time: values.start_time,
                        end_time: values.start_time,
                      },
                    ],
                  },
                ],
              },
            },
          ],
        });
      };

      const [infoResult, scheduleResult] = await Promise.allSettled([
        updateStorageInfo(),
        updateStorageSchedule(),
      ]);

      const hasError = [infoResult, scheduleResult].some(
        (result) => result.status === 'rejected',
      );

      if (hasError) {
        handlerError('error');
        return;
      }

      message.success(
        t('action_success', {
          action: t('update'),
        }),
      );
    } catch (e) {
      handlerError(e);
    }
  };

  if (isFetching) return <Spinner />;

  return (
    <Wrapper>
      <PaddingWrapper type="formTab">
        <StorageInformationTable
          onRowSelect={setSelectedStorage}
          data={storageInformation}
        />
        <FormWrapper>
          <OverwriteForm
            initialValues={initialValues}
            isLoading={isLoading}
            handleOnFormatStorage={handleOnFormatStorage}
            handleOnFinish={handleOnFinish}
          />
        </FormWrapper>
      </PaddingWrapper>
    </Wrapper>
  );
};

export default Storage;

const Wrapper = styled(Box)`
  width: 100%;
`;

const FormWrapper = styled(Box)`
  margin-top: 24px;
`;
