import { createContext } from 'react';
import { IVideoFlow } from './types';

export interface ILiveContext {
  flow: IVideoFlow;
}

export const LiveContext = createContext<ILiveContext>({
  flow: 'primary',
});
