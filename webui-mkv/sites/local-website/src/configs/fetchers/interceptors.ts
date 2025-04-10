import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { IApiError } from 'modules/_shared/types';
import { APIErrorCode } from './error-code';
import { x_csrf_token } from 'configs/constants';

export const accessApplicationJsonInterceptor = (
  request: InternalAxiosRequestConfig,
) => {
  if (request.headers['Content-Type'] === undefined) {
    request.headers['Content-Type'] = 'application/json';
  }

  return request;
};

export const xCsrfTokenInterceptor = (request: InternalAxiosRequestConfig) => {
  // add csrf token to header
  const token = localStorage.getItem(x_csrf_token);
  if (token) {
    request.headers['X-csrftoken'] = token;
  }
  return request;
};

export const bodyPayloadInterceptor = (request: InternalAxiosRequestConfig) => {
  // if (request.data) {
  request.data = {
    data: request.data || {},
    version: '1.0',
  };
  // }
  return request;
};

export const responseInterceptor = (response: AxiosResponse) => {
  return { ...response.data, headers: response.headers };
};

export const errorInterceptor = (error: AxiosError) => {
  // time oue error
  if (error.code === 'ECONNABORTED') {
    throw {
      error_code: APIErrorCode.request_timeout,
      error_message: 'Request timeout',
    } as IApiError;
  }

  if (error.status === 500) {
    throw {
      error_code: APIErrorCode.internal_server_error,
      error_message: 'Request timeout',
    } as IApiError;
  }

  throw {
    ...(error.response?.data || {}),
    headers: error.response?.headers,
  } as IApiError;
};
