/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { RadioFormConfig } from '../types';
import { Radio } from 'antd';

export interface FormItemRadioGroupProps<T> {
  config: RadioFormConfig<T, keyof T>;
}

export const FormItemRadioGroup = <T,>({
  config,
  ...props
}: FormItemRadioGroupProps<T>) => {
  const { formType, ...rest } = config;
  return <Radio.Group {...props} {...rest} />;
};
