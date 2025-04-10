import { useFormBuilder } from './FormBuilderProvider';

export const useFormItem = <T extends object>(name: keyof T) => {
  const { itemConfigs } = useFormBuilder<T>();
  return [itemConfigs[name as keyof T]] as const;
};
