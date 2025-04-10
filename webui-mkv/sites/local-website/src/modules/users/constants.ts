import { t } from 'i18next';
import { AccountStatus, UserState } from './types';

export const userStateLabel: Record<AccountStatus, string> = {
  [AccountStatus.Expires]: t('Expires'),
  [AccountStatus.ExpiresClearInfo]: t('ExpiresClearInfo'),
  [AccountStatus.Normal]: t('Normal'),
  [AccountStatus.None]: t('None'),
  [AccountStatus.NotYetStart]: t('NotYetStart'),
};

export const userEnableArray: Record<string, string> = {
  [UserState.Active]: t('active'),
  [UserState.Inactive]: t('inactive'),
};
