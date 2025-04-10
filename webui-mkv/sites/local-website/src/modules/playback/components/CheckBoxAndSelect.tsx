import { mapRecordTypeToText, RecordType } from '../types';
import React from 'react';
import { Checkbox, Select } from 'antd';
import { Flex } from '@packages/ds-core';

export interface CheckBoxAndSelectProps {
  className?: string;
  options: RecordType[];
  enableCheckBox?: boolean;
  hint?: string;
  onChange?: (value?: RecordType[]) => void;
  value?: RecordType[];
}

const CheckBoxAndSelect: React.FC<CheckBoxAndSelectProps> = ({
  options,
  className,
  hint,
  onChange,
  value,
}) => (
  <Flex gapX="s16" block className={className}>
    <Checkbox
      checked={value !== undefined && value.length > 0}
      onChange={(e) => {
        if (!e.target.checked) {
          onChange && onChange([]);
        } else {
          onChange && onChange([options[0]]);
        }
      }}
    />
    <Select
      mode={'multiple'}
      value={value}
      placeholder={hint}
      disabled={value === undefined || value.length === 0}
      allowClear={false}
      options={options.map((value) => ({
        label: mapRecordTypeToText(value),
        value: value,
      }))}
      onChange={onChange}
    />
  </Flex>
);

export default CheckBoxAndSelect;
