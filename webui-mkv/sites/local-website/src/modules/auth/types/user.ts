import { IBase } from 'modules/_shared/types';

export interface IUser extends IBase {
  id: string;
}

export interface ILoginPayload {
  password: string;
}
