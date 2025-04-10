import React from 'react';
import { IModal, IModalState } from './types';

export interface IModalContext {
  closeModal?: (id: string) => void;
  showModal?: (modal: IModal) => { id: string };
  modals?: IModalState[];
}

export const ModalContext = React.createContext<IModalContext>({});
