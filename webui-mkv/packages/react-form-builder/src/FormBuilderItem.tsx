/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FormItemLayout } from './types';
import { Col } from 'antd';
import { formItemMappings } from './form-item-mapping';
import { useFormItem } from './useFormItem';
import FormItem from 'antd/es/form/FormItem';
import { styled } from '@packages/ds-core';

export interface FormBuilderItemProps<T> {
  layout: FormItemLayout<T>;
}

export const FormBuilderItem = <T,>(props: FormBuilderItemProps<T>) => {
  const { span, ...colProps } = props.layout;
  const [itemConfig] = useFormItem(props.layout.name as string);
  const {
    label,
    rules,
    dependencies,
    formType,
    validateFirst,
    validateDebounce,
    ...configs
  } = itemConfig || {};

  const getInput = () => {
    if (!formType) return null;
    if (formType === 'custom') return ((itemConfig as any)?.render as any)!;
    return formItemMappings[formType];
  };

  const Input = getInput();

  return (
    <Col span={span} {...colProps}>
      <StyledFormItem
        className={props.layout.className}
        label={label}
        rules={rules}
        dependencies={dependencies}
        name={props.layout.name}
        labelCol={props.layout.labelCol}
        validateFirst={validateFirst}
        required={itemConfig?.required}
        labelAlign={props.layout.labelAlign || 'left'}
        align={props.layout.align}
        validateDebounce={validateDebounce}
      >
        {Input && <Input config={configs} disabled={itemConfig.disabled} />}
      </StyledFormItem>
    </Col>
  );
};

const StyledFormItem = styled(FormItem)<{
  align?: FormItemLayout<any>['align'];
}>`
  /* margin-bottom: 0.25rem !important; */

  .ant-form-item-row {
    align-items: ${({ align }) => align || 'flex-start'} !important;
  }

  .ant-form-item-explain-error,
  .ant-form-item-explain-success {
    font-size: ${({ theme }) => theme.fontSizes.xs}px !important;
  }

  .ant-form-item-explain-error:empty {
    margin: 0 !important;
  }

  .ant-form-item-explain-connected {
    margin-top: 0.375rem;
  }

  // required mark red color and right align
  .ant-form-item-required {
    ::before {
      clear: both !important;
      content: '' !important;
      width: 0 !important;
      margin-right: 0 !important;
    }
    ::after {
      display: inline-block;
      margin-left: 0.25rem !important;
      color: ${({ theme }) => theme.colors.red};
      font-size: 12px;
      content: '*' !important;
    }
  }

  // label style
  .ant-form-item-label {
    label {
      white-space: normal !important;
      max-height: auto !important;
    }
  }
`;
