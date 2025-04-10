import React, { Reducer, useCallback, useMemo, useReducer } from 'react';
import useSWR from 'swr';
import { recordService } from '../record-service';
import { useAPIErrorHandler } from 'modules/_shared';
import { message } from 'antd';
import { t } from 'configs/i18next';

type WDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface ScheduleReducerState {
  schedules?: Array<{
    wDay: WDay;
    list_time: Array<{
      start_time: string;
      end_time: string;
    }>;
  }>;
}

export type ScheduleReducerAction =
  | {
      type: 'ADD_SCHEDULE';
      payload: {
        wDay: WDay;
        durationIndex: number;
      };
    }
  | {
      type: 'REMOVE_SCHEDULE';
      payload: {
        wDay: WDay;
        durationIndex: number;
      };
    }
  | {
      type: 'SET_SCHEDULES';
      payload: ScheduleReducerState;
    };

const addToSchedule = (
  state: ScheduleReducerState,
  payload: { wDay: WDay; durationIndex: number },
) => {
  const newState = { ...state };
  const { wDay, durationIndex } = payload;
  if (!state.schedules) {
    state.schedules = [];
  }

  const scheduleDate = state.schedules.find((s) => s.wDay === wDay);

  const durationTime = {
    start_time: `${`${durationIndex}`.padStart(2, '0')}:00:00`,
    end_time: `${`${durationIndex}`.padStart(2, '0')}:59:59`,
  };

  if (scheduleDate) {
    if (!scheduleDate.list_time) {
      scheduleDate.list_time = [];
    }
    scheduleDate.list_time.push(durationTime);
  } else {
    state.schedules.push({
      wDay,
      list_time: [durationTime],
    });
  }

  return newState;
};

const removeFromSchedule = (
  state: ScheduleReducerState,
  payload: { wDay: WDay; durationIndex: number },
) => {
  if (!state.schedules) return state;
  const { wDay, durationIndex } = payload;
  const newState = { ...state };
  const scheduleDateIndex = state.schedules?.findIndex((s) => s.wDay === wDay);

  if (scheduleDateIndex != -1) {
    const durationTime = {
      start_time: `${`${durationIndex}`.padStart(2, '0')}:00:00`,
      end_time: `${`${durationIndex}`.padStart(2, '0')}:59:59`,
    };

    if (
      !newState.schedules?.[scheduleDateIndex].list_time ||
      newState.schedules?.[scheduleDateIndex]?.list_time?.length === 0
    ) {
      return state;
    }

    const newDateSchedules =
      newState.schedules?.[scheduleDateIndex].list_time?.filter((time) => {
        return (
          time.start_time !== durationTime.start_time &&
          time.end_time !== durationTime.end_time
        );
      }) || [];

    newState.schedules[scheduleDateIndex].list_time = newDateSchedules;
  }

  return newState;
};

export const scheduleReducer = (
  state: ScheduleReducerState,
  action: ScheduleReducerAction,
) => {
  switch (action.type) {
    case 'ADD_SCHEDULE':
      return addToSchedule(state, action.payload);
    case 'REMOVE_SCHEDULE':
      return removeFromSchedule(state, action.payload);
    case 'SET_SCHEDULES':
      return action.payload;
    default:
      return state;
  }
};

export const useSchedule = (type: 'Capture' | 'Record') => {
  const { handlerError } = useAPIErrorHandler();
  const [actionLoading, setActionLoading] = React.useState(false);
  const [state, dispatch] = useReducer<
    Reducer<ScheduleReducerState, ScheduleReducerAction>
  >(scheduleReducer, {
    schedules: [],
  });

  const { data } = useSWR(
    ['get-schedule-record', type],
    async ([, type]) => {
      switch (type) {
        case 'Capture':
          return recordService.getCaptureSchedule();
        case 'Record':
          return recordService.getRecordSchedule();
      }
    },
    {
      onSuccess: (data) => {
        const list_day =
          data.schedule_time?.list_day?.reduce((acc, day) => {
            acc?.push({
              wDay: day.wday,
              list_time:
                day.list_time?.map((time) => {
                  return {
                    start_time: time.start_time ?? '',
                    end_time: time.end_time ?? '',
                  };
                }) || [],
            });
            return acc;
          }, [] as Array<{ wDay: WDay; list_time: Array<{ start_time: string; end_time: string }> }>) ??
          [];
        dispatch({
          type: 'SET_SCHEDULES',
          payload: {
            schedules: list_day,
          },
        });
      },
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateIfStale: false,
      keepPreviousData: true,
      errorRetryCount: 0,
      onError: (e) => handlerError(e),
    },
  );

  const addSchedule = (wDay: WDay, durationIndex: number) => {
    dispatch({
      type: 'ADD_SCHEDULE',
      payload: { wDay, durationIndex },
    });
  };

  const removeSchedule = (wDay: WDay, durationIndex: number) => {
    dispatch({
      type: 'REMOVE_SCHEDULE',
      payload: { wDay, durationIndex },
    });
  };

  /**
   * return array of string that is scheduled
   * item format: 'wDay:start_time_end_time'
   */
  const scheduledItems = useMemo<Array<string>>(() => {
    if (state.schedules) {
      return state.schedules?.reduce((acc, schedule) => {
        return schedule.list_time.reduce((acc, time) => {
          acc.push(`${schedule.wDay}:${time.start_time}_${time.end_time}`);
          return acc;
        }, acc);
      }, [] as Array<string>);
    }

    return [];
  }, [JSON.stringify(state.schedules)]);

  const isScheduled = useCallback(
    (wDay: WDay, durationIndex: number) => {
      const startTime = `${`${durationIndex}`.padStart(2, '0')}:00:00`;
      const endTime = `${`${durationIndex}`.padStart(2, '0')}:59:59`;
      const key = `${wDay}:${startTime}_${endTime}`;
      return scheduledItems.some((item) => {
        return item === key;
      });
    },
    [scheduledItems],
  );

  const updateConfig = async () => {
    try {
      setActionLoading(true);

      if (!data) return;
      const schedule_time = {
        mode: 'weekly',
        period_time: 0,
        list_day: state.schedules?.map((schedule) => {
          return {
            wday: schedule.wDay,
            mday: 1,
            list_time: schedule.list_time?.map((time) => {
              return {
                start_time: time.start_time,
                end_time: time.end_time,
              };
            }),
          };
        }),
      };
      switch (type) {
        case 'Capture':
          await recordService.setCaptureSchedule({
            ...(data ?? {}),
            schedule_enable: true,
            schedule_type: 'AI_ALL',
            schedule_time,
          });
          break;
        case 'Record':
          await recordService.setRecordSchedule({
            ...(data ?? {}),
            schedule_enable: true,
            schedule_type: 'AI_ALL',
            schedule_time,
          });
          break;
      }
      message.success(
        t('action_success', {
          action: t('update'),
        }),
      );
    } catch (error) {
      handlerError(error);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    addSchedule,
    dispatch,
    removeSchedule,
    scheduledItems,
    isScheduled,
    updateConfig,
    actionLoading,
  };
};
