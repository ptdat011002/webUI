import React, { ReactNode } from 'react';
import { ServiceProvider } from './ServiceProvider';

export interface IGlobalContext {
  value?: string;
}

export const GlobalContext = React.createContext<IGlobalContext>({});

export const useGlobal = () => React.useContext(GlobalContext);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <GlobalContext.Provider value={{}}>
      <ServiceProvider>{children}</ServiceProvider>
    </GlobalContext.Provider>
  );
};
