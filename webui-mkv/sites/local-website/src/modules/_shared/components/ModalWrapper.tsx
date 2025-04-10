import React from 'react';
import { ThemeModalProvider } from '../providers/ThemeModalProvider';

export interface ModalWrapperProps {
  children: React.ReactNode;
}
export const ModalWrapper: React.FC<ModalWrapperProps> = ({ children }) => {
  return (
    <ThemeModalProvider selector=".modal-provider">
      <div className="modal-provider">{children}</div>
    </ThemeModalProvider>
  );
};
