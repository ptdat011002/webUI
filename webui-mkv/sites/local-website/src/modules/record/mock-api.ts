import { IApiResponse, IMockFun } from 'modules/_shared/types';
import { IAlarmConfig, IScheduleConfig } from './types/setting';

export const recordMockApi: IMockFun = (adapter) => {
  adapter.onPost('/Alarm/AI/Get').reply<IApiResponse<IAlarmConfig>>(200, {
    data: {
      all: {},
    },
  });

  adapter.onPost('/Alarm/AI/Set').reply(200, {
    data: {
      all: {},
    },
  });

  adapter
    .onPost('/Schedules/Record/Get')
    .reply<IApiResponse<IScheduleConfig>>(200, {
      data: {
        schedule_type: 'Record',
        schedule_enable: true,
        schedule_time: {
          mode: 'period',
          period_time: 30,
        },
      },
    });

  adapter.onPost('/Alarm/AI/Get').reply<IApiResponse<IAlarmConfig>>(200, {
    data: {
      cd: {
        snapshot_mode: {
          enable: true,
          interval: 10,
          count: 1,
        },
      },

      fd: {
        snapshot_mode: {
          enable: false,
          interval: 9,
          count: 1,
        },
      },

      fr: {
        snapshot_mode: {
          enable: true,
          interval: 8,
          count: 1,
        },
      },

      md: {
        snapshot_mode: {
          enable: false,
          interval: 7,
          count: 1,
        },
      },

      lcd: {
        snapshot_mode: {
          enable: true,
          interval: 6,
          count: 1,
        },
      },

      pc: {
        snapshot_mode: {
          enable: false,
          interval: 5,
          count: 1,
        },
      },

      pid: {
        snapshot_mode: {
          enable: true,
          interval: 4,
          count: 1,
        },
      },

      all: {
        snapshot_mode: {
          enable: false,
          interval: 3,
          count: 1,
        },
      },
    },
  });
};
