import { LiveContext } from './live-context';
import { IVideoFlow } from './types';

export interface LiveProviderProps {
  children: React.ReactNode;
  flow: IVideoFlow;
}

export const LiveProvider: React.FC<LiveProviderProps> = ({
  children,
  flow = 'primary',
}) => {
  return (
    <LiveContext.Provider
      value={{
        flow,
      }}
    >
      {children}
    </LiveContext.Provider>
  );
};
