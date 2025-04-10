import axios from 'axios';
import {
  accessApplicationJsonInterceptor,
  bodyPayloadInterceptor,
  errorInterceptor,
  responseInterceptor,
  xCsrfTokenInterceptor,
} from './interceptors';

const baseURL = `${window.location.protocol}//${window.location.host}/API`;

const appApi = axios.create({
  baseURL: baseURL || '',
  timeout: 30000,
});

appApi.interceptors.request.use(accessApplicationJsonInterceptor);
appApi.interceptors.request.use(bodyPayloadInterceptor);
appApi.interceptors.request.use(xCsrfTokenInterceptor);

appApi.interceptors.response.use(responseInterceptor, errorInterceptor);

export default appApi;
