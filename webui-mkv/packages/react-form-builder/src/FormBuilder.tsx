/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import {
  FormBuilderProps,
  FormBuilderUnWrapperProps,
  FormGroupLayout,
  IFormType,
} from './types';
import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormBuilderContext, useFormBuilder } from './FormBuilderProvider';
import { FormBuilderItem } from './FormBuilderItem';

export const FormBuilder = <T extends IFormType>({
  gutter = [8, 8],
  ...props
}: FormBuilderProps<T>) => {
  const { asChild } = props;
  const layouts = props.layouts;

  const Wrapper: React.FC<
    FormBuilderProps<object> & { children: React.ReactNode }
  > = useMemo(() => (!asChild ? FormWrapper : React.Fragment), [asChild]);

  return (
    <Wrapper {...(asChild ? {} : (props as any))}>
      <FormBuilderContext.Provider
        value={{
          itemConfigs: props.configs,
          gutter: gutter,
        }}
      >
        <Row gutter={gutter}>
          {layouts.map((layout, index) => {
            return layout.type === 'group' ? (
              <FormGroupBuilderLayout {...layout} key={index} />
            ) : (
              <FormBuilderItem key={index} layout={layout} />
            );
          })}
        </Row>
      </FormBuilderContext.Provider>
    </Wrapper>
  );
};

const FormGroupBuilderLayout: React.FC<FormGroupLayout<any>> = ({
  items,
  ...props
}) => {
  const { gutter } = useFormBuilder();
  return (
    <Col {...props}>
      <Row gutter={gutter}>
        {items.map((layout, index) => {
          return layout.type === 'group' ? (
            <FormGroupBuilderLayout {...layout} key={index} />
          ) : (
            <FormBuilderItem key={index} layout={layout} />
          );
        })}
      </Row>
    </Col>
  );
};

const FormWrapper = (
  props: FormBuilderUnWrapperProps<any> & {
    children: React.ReactNode;
  },
) => {
  const {
    initialValues,
    form: control,
    onSubmit,
    onValuesChange,
    formLayout,
    validateTrigger,
    hideColon,
    disabled,
    children,
    labelCol,
  } = props;
  const [form] = useForm(control);

  return (
    <Form
      form={form}
      initialValues={{ ...initialValues }}
      onFinish={onSubmit}
      onValuesChange={onValuesChange}
      validateTrigger={validateTrigger}
      layout={formLayout}
      colon={!hideColon}
      autoComplete="off"
      disabled={disabled}
      spellCheck={false}
      labelCol={labelCol}
    >
      {children}
    </Form>
  );
};
