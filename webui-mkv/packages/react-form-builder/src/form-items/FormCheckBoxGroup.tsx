import React from 'react';
import { CheckBoxGroupFormConfig } from '../types';
import { Checkbox } from 'antd';
import { Box, Flex } from '@packages/ds-core';

export interface FormItemCheckBoxGroupProps<T> {
  config: CheckBoxGroupFormConfig<T, keyof T>;
}

export const FormItemCheckBoxGroup = <T,>({
  config,
  ...props
}: FormItemCheckBoxGroupProps<T>) => {
  const { options, ...rest } = config;
  return (
    <Checkbox.Group {...props} {...(rest as any)}>
      <Flex direction="column" gap="s2">
        {config.options.map((option, index) => (
          <Checkbox key={index} {...option}>
            <Box
              style={{
                height: 38,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {option.label}
            </Box>
          </Checkbox>
        ))}
      </Flex>
    </Checkbox.Group>
  );
};
