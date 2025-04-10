import React from 'react';
import { ILayoutType, useBreakPoint } from '../hooks/useMedia';

export interface IMediaContext {
  mode: ILayoutType;
}

export const MediaContext = React.createContext<IMediaContext>({
  mode: 'hd',
});

export interface MediaProviderProps {
  children: React.ReactNode;
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
  const mode = useBreakPoint();

  return (
    <MediaContext.Provider value={{ mode: mode }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  return React.useContext(MediaContext);
};
