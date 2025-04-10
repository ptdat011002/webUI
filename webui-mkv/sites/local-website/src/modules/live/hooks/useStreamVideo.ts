import { IVideoFlow } from '../types';

export const useStreamVideo = (flow: IVideoFlow = 'primary') => {
  return {
    flow,
  };
};
