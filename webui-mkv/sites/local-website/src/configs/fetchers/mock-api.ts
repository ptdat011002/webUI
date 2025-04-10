import MockAdapter from 'axios-mock-adapter';
import appApi from './app-api';
import { IMockFun } from 'modules/_shared/types';
import { aiApiMock } from 'modules/ai/mock';
import { authApiMock } from 'modules/auth/mock-api';
import { systemDeviceApiMock } from 'modules/device/mock-api';
import { eventApiMock } from 'modules/event/mock-api';
import { liveMockApi } from 'modules/live/mock-api';
import { networkMockApi } from 'modules/network/mock-api';
import { playbackMockApi } from 'modules/playback/mock-api';
import { recordMockApi } from 'modules/record/mock-api';
import { systemApiMock } from 'modules/system/mock-api';
import { userApiMock } from 'modules/users/mock-api';

const mocks: IMockFun[] = [
  authApiMock,
  userApiMock,
  systemApiMock,
  liveMockApi,
  networkMockApi,
  recordMockApi,
  systemDeviceApiMock,
  eventApiMock,
  aiApiMock,
  recordMockApi,
  playbackMockApi,
];

export const setupMockAdapter = () => {
  if (!import.meta.env.VITE_MOCK_API) return;

  console.log('Mock API enabled');

  const mockAdapter = new MockAdapter(appApi, {
    onNoMatch: 'passthrough',
  });

  if (import.meta.env.DEV) {
    mocks.forEach((mock) => mock(mockAdapter));
  }
};
