import appApi from 'configs/fetchers/app-api';
import {
  IAccountUserInfo,
  IGetAccountRequest,
  ISetAccountRequest,
} from './types';

export const usersService = {
  async updateAccountData(payload: ISetAccountRequest) {
    return appApi
      .post('/SystemConfig/User/Set', { ...payload })
      .then((res) => res.data);
  },

  async getAccountData(query: IGetAccountRequest) {
    return appApi
      .post<IAccountUserInfo>('/SystemConfig/User/Get', { ...query })
      .then((res) => res.data);
  },
};
