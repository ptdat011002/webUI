import React from 'react';
import { InputPasswordFormItemConfig } from '../types';
import { Input } from 'antd';

export interface FormItemInputPasswordProps<T> {
  config: InputPasswordFormItemConfig<T, keyof T>;
}

export const FormItemInputPassword = <T,>({
  config,
  ...props
}: FormItemInputPasswordProps<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formType, ...rest } = config;
  return <Input.Password {...rest} {...props} />;
};
