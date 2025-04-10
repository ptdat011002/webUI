import { ILog, ILogSubType } from 'modules/system/types/log_history.ts';
import { IApiResponse, IMockFun } from '../_shared/types.ts';
import { IFaceSearchResponse } from './types/index.ts';
import { ISearchLoggerResponse } from './types/stats.ts';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
export const aiApiMock: IMockFun = (adapter) => {
  adapter
    .onPost('/AIConfig/Faces/Search')
    .reply<IApiResponse<IFaceSearchResponse>>(200, {
      data: {
        count: 100,
        faceInfo: Array.from({ length: 100 }).map((_, index) => ({
          id: index,
          name: `Nguyễn Văn ${alphabet.toUpperCase()[index % alphabet.length]}`,
          face_id: 100 + index,
        })),
      },
      result: 'success',
    });

  // /Event/Logger/Search
  adapter
    .onPost('/Event/Logger/Search')
    .reply<IApiResponse<ISearchLoggerResponse>>(200, {
      data: {
        event_lists: Array.from({ length: 100 }).map<ILog>((_, index) => ({
          id: index,
          start_date: '15/12/2024',
          start_time: '11:29:36',
          main_type: 'Event',
          sub_type: ILogSubType.Motion_Detection,
          information: {
            address: 'Nam Dinh',
            age: 30,
            face_id: 19,
            name: 'Nguyen Van Hai',
            person_id: '036095020865',
            sex: 1,
          },
        })),
      },
      result: 'success',
    });
};
