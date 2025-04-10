import appApi from 'configs/fetchers/app-api';
import {
  ILoginInformation,
  ILoginResponse,
  IGetDeviceInfoResponse,
  ILoginWithPasswordPayload,
  ISetPasswordPayload,
  IGetPublicKey,
  IKey,
  IDigestsAccessAuthentication,
  ILoginHeaders,
  IListQuestionResponse,
  ISecurityQuestionPayload,
} from './types';
import { encodeByRSA, encodeResponse, generateNonce } from './helper';
import { IApiError } from 'modules/_shared/types';

function* loginTime() {
  let time = 1;
  while (true) {
    yield time++;
  }
}

const timeGen = loginTime();

export const authService = {
  async getDeviceInfoBeforeLogin() {
    return appApi.post<ILoginInformation>('/Login/Range').then((res) => ({
      ...res.data,
    }));
  },

  async firstLoginSetPassword(payload: ISetPasswordPayload, encodeKey: IKey) {
    const cipher = await encodeByRSA(payload.password, encodeKey.key);

    return appApi
      .post('/FirstLogin/Password/Set', {
        base_enc_password: {
          cipher: cipher,
          seq: encodeKey.seq,
          peer_key: encodeKey.key,
        },
      })
      .then((res) => res.data);
  },

  async getSecurityQuestion() {
    return appApi
      .post<IListQuestionResponse>('/RecoverPassword/Get')
      .then((res) => res.data);
  },

  async resetPassword(payload: ISetPasswordPayload, encodeKey: IKey) {
    const cipher = await encodeByRSA(payload.password, encodeKey.key);
      try {
        const res = await appApi
          .post('/RecoverPassword/ResetPassword', {
            base_enc_password: {
              cipher: cipher,
              seq: encodeKey.seq,
              peer_key: encodeKey.key,
            },
      });
      return res.data;
      } catch (error) {
        console.log('Have error when reset password:', error);
        throw error;
      }
  },

  // Verify security question on forgot password
  async verifySecurityQuestion(payload: ISecurityQuestionPayload, public_key: string) {
    const cipher_question1 = await encodeByRSA(payload.Question1, public_key);
    const cipher_question2 = await encodeByRSA(payload.Question2, public_key);
    const cipher_question3 = await encodeByRSA(payload.Question3, public_key);
    const cipher_answer1 = await encodeByRSA(payload.Answer1, public_key);
    const cipher_answer2 = await encodeByRSA(payload.Answer2, public_key);
    const cipher_answer3 = await encodeByRSA(payload.Answer3, public_key);
    try {
      const res = await appApi
      .post('/RecoverPassword/Verify', {
        answers: {
          answer_1: {
            id: parseInt(payload.ID1, 10),
            answer: cipher_answer1,
            question: cipher_question1,
          },
          answer_2: {
            id: parseInt(payload.ID2, 10),
            answer: cipher_answer2,
            question: cipher_question2,
          },
          answer_3: {
            id: parseInt(payload.ID3, 10),
            answer: cipher_answer3,
            question: cipher_question3,
          },
        }
      });

      return res.data;
    } catch (error) {
      console.log('Have error when reset password:', error);
      throw error;
    }
  },

  // Set security question on first login
  async setSecurityQuestion(payload: ISecurityQuestionPayload, public_key: string) {
    const cipher_question1 = await encodeByRSA(payload.Question1, public_key);
    const cipher_question2 = await encodeByRSA(payload.Question2, public_key);
    const cipher_question3 = await encodeByRSA(payload.Question3, public_key);
    const cipher_answer1 = await encodeByRSA(payload.Answer1, public_key);
    const cipher_answer2 = await encodeByRSA(payload.Answer2, public_key);
    const cipher_answer3 = await encodeByRSA(payload.Answer3, public_key);
    try {
      const res = await appApi
      .post('/RecoverPassword/Set', {
        answers: {
          answer_1: {
            id: parseInt(payload.ID1, 10),
            answer: cipher_answer1,
            question: cipher_question1,
          },
          answer_2: {
            id: parseInt(payload.ID2, 10),
            answer: cipher_answer2,
            question: cipher_question2,
          },
          answer_3: {
            id: parseInt(payload.ID3, 10),
            answer: cipher_answer3,
            question: cipher_question3,
          },
        }
      }); 

      return res.data;
    } catch (error) {
      console.log('Have error when submit security question:', error);
      throw error;
    }
  },

  async login(
    payload: ILoginWithPasswordPayload,
    digest: IDigestsAccessAuthentication,
  ): Promise<ILoginResponse> {
    const method = 'POST';
    const uri = '/Web/Login';
    const response = encodeResponse(
      payload.username,
      payload.password,
      digest,
      uri,
      method,
    );

    const headerAuthObj = {
      username: payload.username,
      realm: digest.realm,
      nonce: digest.nonce,
      uri: uri,
      response: response,
      opaque: digest.opaque,
      qop: digest.qop,
      nc: digest.nc,
      cnonce: digest.cnonce,
    };
    return appApi
      .post<ILoginResponse>(
        '/Web/Login',
        {},
        {
          headers: {
            Authorization: `Digest ${Object.entries(headerAuthObj)
              .filter(([, value]) => !!value)
              .map(([key, value]) => `${key}="${value}"`, '')
              .join(', ')}`,
          },
        },
      )
      .then((res) => {
        const headers = res.headers as ILoginHeaders;
        return {
          ...res.data,
          'X-csrfToken': headers?.['x-csrftoken'],
          user_name: payload.username,
        };
      });
  },

  async heartbeat() {
    return appApi
      .post('/Login/Heartbeat', { keep_alive: true })
      .then((res) => res.data);
  },

  async getDeviceInformation() {
    return appApi
      .post<IGetDeviceInfoResponse>('/Login/DeviceInfo/Get')
      .then((res) => res.data);
  },

  async logout() {
    return appApi.post('/Web/Logout').then((res) => res.data);
  },

  async requestPublicKey(): Promise<IKey | undefined> {
    return appApi
      .post<IGetPublicKey>('/Login/TransKey/Get', {
        type: ['base_x_public'],
      })
      .then((res) =>
        (res.data as IGetPublicKey).Key_lists.find(
          (k) => k.type == 'base_x_public',
        ),
      );
  },
  async requestDigestsAccessAuthentication() {
    return appApi
      .post<IDigestsAccessAuthentication>('/Web/Login')
      .then((res) => res.data || {})
      .catch((e) => {
        const error: IApiError = e;
        const www_authenticate = error.headers?.['www-authenticate'];
        // get realm, nonce, opaque, qop
        const realm = www_authenticate?.match(/realm="([^"]*)"/)?.[1];
        const nonce = www_authenticate?.match(/nonce="([^"]*)"/)?.[1];
        const opaque = www_authenticate?.match(/opaque="([^"]*)"/)?.[1];
        const qop = www_authenticate?.match(/qop="([^"]*)"/)?.[1];
        const cnonce = generateNonce(8);
        const loginTime = timeGen.next().value;

        return {
          realm,
          nonce,
          opaque,
          qop,
          cnonce,
          nc: ('00000000' + loginTime).slice(-8),
        } as IDigestsAccessAuthentication;
      });
  },
};
