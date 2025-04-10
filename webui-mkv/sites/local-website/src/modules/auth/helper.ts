import { MD5 } from 'crypto-js';
import { IDigestsAccessAuthentication } from './types';
import JSEncrypt from 'jsencrypt';

export const encodeByRSA = async (message: string, publicKey: string) => {
  console.log('publicKey', publicKey);
  const encrypt = new JSEncrypt();

  encrypt.setPublicKey(publicKey);

  const cipher = encrypt.encrypt(message);

  if (!cipher) {
    throw new Error('Can not encrypt');
  }
  return cipher;
};

export const generateNonce = (length = 8) => {
  const chars = '0123456789';
  let nonce = '';
  for (let i = 0; i < length; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
};

export const encodeResponse = (
  username: string,
  password,
  digest: IDigestsAccessAuthentication,
  uri: string,
  method: string,
) => {
  const ha1 = MD5(`${username}:${digest.realm}:${password}`).toString();
  const ha2 = MD5(`${method}:${uri}`).toString();
  const response = MD5(
    `${ha1}:${digest.nonce}:${digest.nc}:${digest.cnonce}:${digest.qop}:${ha2}`,
  ).toString();

  return response;
};
