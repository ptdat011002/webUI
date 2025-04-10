import React from 'react';
import { InputFormItemConfig } from '../types';
import { Input } from 'antd';

export interface FormItemInputProps<T> {
  config: InputFormItemConfig<T, keyof T>;
}

export const FormItemInput = <T,>({
  config,
  ...props
}: FormItemInputProps<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formType, ...rest } = config;
  return <Input {...props} {...rest} />;
};
