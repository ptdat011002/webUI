import React from 'react';
import { CheckBoxFormConfig } from '../types';
import { Checkbox } from 'antd';

export interface FormItemCheckBoxProps<T> {
  config: CheckBoxFormConfig<T, keyof T>;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const FormItemCheckBox = <T,>({
  config,
  value,
  onChange,
  ...props
}: FormItemCheckBoxProps<T>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { formType, ...rest } = config;
  return (
    <Checkbox
      checked={value}
      {...rest}
      {...props}
      onChange={(e) => {
        if (config?.onChange) {
          config.onChange(e);
        }
        onChange?.(e.target.checked);
      }}
    />
  );
};
