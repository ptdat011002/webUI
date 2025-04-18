import React from 'react';
import { SelectFormConfig } from '../types';
import { Select } from 'antd';

export interface FormItemSelectProps<T> {
  config: SelectFormConfig<T, keyof T>;
}

export const FormItemSelect = <T,>({
  config,
  ...props
}: FormItemSelectProps<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formType, ...rest } = config;
  return <Select {...rest} {...props} />;
};
