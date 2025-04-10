import React from 'react';
import { TextAreaFormItemConfig } from '../types';
import { Input } from 'antd';

export interface FormItemInputProps<T> {
  config: TextAreaFormItemConfig<T, keyof T>;
}

export const FormItemTextArea = <T,>({
  config,
  ...props
}: FormItemInputProps<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formType, ...rest } = config;
  return <Input.TextArea {...props} {...rest} />;
};
