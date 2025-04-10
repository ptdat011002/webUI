import { ReactNode } from 'react';

export type NotiType = 'confirm' | 'success' | 'warning' | 'error';

export interface NotiParams {
  title?: string;
  type: NotiType;
  message: ReactNode;
  closeable?: boolean;
  onCancel?: (params: {
    close: () => void;
    setLoading: (loading: boolean) => void;
  }) => void;
  cancelText?: string;
  onConfirm?: (params: {
    close: () => void;
    setLoading: (loading: boolean) => void;
  }) => void;
  confirmText?: string;
  buttonType?: 'inline' | 'block';
  loading?: boolean;
}

export type RenderNotiFun = (params: Omit<NotiParams, 'type'>) => void;

export interface NotiInstance {
  info: RenderNotiFun;
  success: RenderNotiFun;
  warning: RenderNotiFun;
  error: RenderNotiFun;
}

export interface IModal {
  title?: string;
  closeable?: boolean;
  destroyOnClose?: boolean;
  render: (
    state?: Omit<IModalState, 'render'>,
    close?: () => void,
  ) => ReactNode;
}
export interface IModalState extends IModal {
  visible?: boolean;
  id: string;
}
