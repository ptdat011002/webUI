/* eslint-disable @typescript-eslint/no-explicit-any */
import { Space } from '@packages/ds-core/dist/theme/token';
import {
  CheckboxProps,
  ColProps,
  DatePickerProps,
  InputProps,
  RadioGroupProps,
  SelectProps,
  SwitchProps,
  TimePickerProps,
} from 'antd';
import { FormInstance, Rule } from 'antd/es/form';
import { ValidateStatus } from 'antd/es/form/FormItem';
import { FormLabelAlign } from 'antd/es/form/interface';
import { SliderSingleProps } from 'antd/es/slider';
import { ReactNode } from 'react';
import { NumberInputProps } from './form-items/FormItemInputNumber';
import { TextAreaProps } from 'antd/es/input';
import { CheckboxGroupProps, CheckboxOptionType } from 'antd/es/checkbox';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFormType {}

export interface IFormItemProps<Key extends keyof T, T> {
  value?: T[Key];
  onChange?: (value: T[Key]) => void;
}

export type IFormItemTypeType =
  | 'input'
  | 'input-number'
  | 'textarea'
  | 'password'
  | 'select'
  | 'multiSelect'
  | 'checkbox'
  | 'checkbox-group'
  | 'radio'
  | 'date'
  | 'dateRange'
  | 'switch'
  | 'slider'
  | 'file-upload'
  | 'time'
  | 'multi-file-upload'
  | 'custom';

export type BaseFormItem<
  T extends IFormType,
  K extends keyof T,
  type extends IFormItemTypeType = IFormItemTypeType,
> = {
  formType: type;
  rules?: Rule[];
  dependencies?: Omit<keyof T, K>[];
  validateStatus?: ValidateStatus;
  required?: boolean;
  hidden?: boolean;
  initialValue?: any;
  messageVariables?: Record<string, string>;
  colon?: boolean;
  htmlFor?: string;
  label?: React.ReactNode;
  labelAlign?: FormLabelAlign;
  labelCol?: ColProps;
  validateFirst?: boolean;
  validateDebounce?: number;
};

export type ValueKey<K, T> = K extends keyof T ? T[K] : never;
export type ArrayValueKey<K, T> = ValueKey<K, T> extends []
  ? ValueKey<K, T>
  : never;

export interface InputFormItemConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'input'>,
    InputProps {
  placeholder?: string;
}

export interface TextAreaFormItemConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'textarea'>,
    TextAreaProps {
  placeholder?: string;
}

export interface InputNumberFormItemConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'input-number'>,
    NumberInputProps {
  placeholder?: string;
}

export interface InputPasswordFormItemConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'password'>,
    InputProps {}

export interface CheckBoxFormConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'checkbox'>,
    CheckboxProps {}

export interface SwitchFormConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'switch'>,
    SwitchProps {}

export interface SelectFormConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'select'>,
    Omit<SelectProps, 'multi'> {}

export interface DatePickerFormConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'date'>,
    DatePickerProps {
  dateFormat?: string;
}

export interface TimePickerFormConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'time'>,
    TimePickerProps {
  timeFormat?: string;
}

export interface SliderFormConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'slider'>,
    SliderSingleProps {}

export interface CheckBoxGroupFormConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'checkbox-group'>,
    Omit<CheckboxGroupProps, 'options'> {
  options: CheckboxOptionType[];
}

export interface RadioFormConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'radio'>,
    RadioGroupProps {}

export interface CustomFormItemConfig<T, K extends keyof T>
  extends BaseFormItem<T, K, 'custom'> {
  render: (props: IFormItemProps<K, T>) => ReactNode;
  disabled?: boolean;
}

/**
 *  value type
 * - number: slider, inputNumber, select,  radio
 * - boolean: switch, checkbox, select
 * - string: select, input, password, date, time, file, radio
 * - object: select
 * - array string: multi-select, checkbox-group, multi-file-upload,
 * - array number: multi-select, checkbox-group, multi-file-upload,
 * - array boolean: multi-select, checkbox-group, multi-file-upload,
 * - array object
 */

export type AllowItemConfigNumber<T, K extends keyof T> =
  | SliderFormConfig<T, K>
  | InputNumberFormItemConfig<T, K>
  | SelectFormConfig<T, K>
  | RadioFormConfig<T, K>
  | CustomFormItemConfig<T, K>;

export type AllowItemConfigBoolean<T, K extends keyof T> =
  | CheckBoxFormConfig<T, K>
  | SwitchFormConfig<T, K>
  | SelectFormConfig<T, K>
  | CustomFormItemConfig<T, K>;

export type AllowItemConfigString<T, K extends keyof T> =
  | InputFormItemConfig<T, K>
  | InputPasswordFormItemConfig<T, K>
  | TextAreaFormItemConfig<T, K>
  | SelectFormConfig<T, K>
  | DatePickerFormConfig<T, K>
  | TimePickerFormConfig<T, K>
  | RadioFormConfig<T, K>
  | CustomFormItemConfig<T, K>;

export type AllowItemConfigObject<T, K extends keyof T> =
  | SelectFormConfig<T, K>
  | CustomFormItemConfig<T, K>;

export type AllowItemConfigArray<T, K extends keyof T> =
  | CheckBoxGroupFormConfig<T, K>
  | CustomFormItemConfig<T, K>;

export type AllowConfig<T, K extends keyof T> = ValueKey<K, T> extends string
  ? AllowItemConfigString<T, K>
  : ValueKey<K, T> extends number
  ? AllowItemConfigNumber<T, K>
  : ValueKey<K, T> extends boolean
  ? AllowItemConfigBoolean<T, K>
  : ValueKey<K, T> extends any[]
  ? AllowItemConfigArray<T, K>
  : ValueKey<K, T> extends object
  ? AllowItemConfigObject<T, K>
  : CustomFormItemConfig<T, K>;

export type FormConfig<T> = {
  [K in keyof T]?: AllowConfig<Required<T>, K>;
};

export type FormLayout<T> = FormItemLayout<T> | FormGroupLayout<T>;
export interface FormGroupLayout<T> extends ColProps {
  className?: string;
  items: Array<FormItemLayout<T> | FormGroupLayout<T>>;
  type: 'group';
}

export interface FormItemLayout<T> extends ColProps {
  type?: 'item';
  name: keyof T;
  labelCol?: ColProps;
  labelAlign?: FormLabelAlign;
  className?: string;
  align?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'baseline'
    | 'stretch'
    | 'inherit'
    | 'initial'
    | 'unset';
}

export type FormBuilderProps<T extends IFormType> =
  | FormBuilderAsChildProps<T>
  | FormBuilderUnWrapperProps<T>;

export type FormBuilderUnWrapperProps<T extends IFormType> = {
  asChild?: false;
  form?: FormInstance<T>;
  configs: FormConfig<T>;
  layouts: FormLayout<FormBuilderUnWrapperProps<T>['configs']>[];
  space?: Space;
  formLayout?: 'horizontal' | 'vertical';
  hideColon?: boolean;
  onSubmit?: (values: T) => void;
  validateTrigger?: 'onChange' | 'onBlur' | 'onSubmit';
  initialValues?: Partial<T>;
  onValuesChange?: (changedValues: Partial<T>, allValues: T) => void;
  disabled?: boolean;
  gutter?: number | [number, number];
  labelCol?: ColProps;
};

export type FormBuilderAsChildProps<T extends IFormType> = {
  asChild?: true;
  configs: FormConfig<T>;
  layouts: FormLayout<FormBuilderAsChildProps<T>['configs']>[];
  onSubmit?: (values: T) => void;
  onValuesChange?: (changedValues: Partial<T>, allValues: T) => void;
  gutter?: number | [number, number];
  labelCol?: ColProps;
};

export interface BaseFormItemProps<T extends AllowConfig<any, any> = any> {
  config?: T;
  className?: string;
  value?: any;
  onChange?: (value: any) => void;
}
