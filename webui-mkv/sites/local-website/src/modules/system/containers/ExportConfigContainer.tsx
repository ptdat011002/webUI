import React from 'react';
import { FormBuilder } from '@packages/react-form-builder';
import { IOperatorExportFile } from '../types';
import { t } from 'i18next';
import { Button, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Box, Flex } from '@packages/ds-core';
import { useBackUp } from '../hooks';

export interface ExportConfigContainerProps {
  className?: string;
}

export const ExportConfigContainer: React.FC<ExportConfigContainerProps> = ({
  className,
}) => {
  const [form] = useForm();
  const { triggerBackup, actionLoading } = useBackUp();

  const handleSaveData = async (value: IOperatorExportFile) =>
    triggerBackup(value.exportFile);

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      onFinish={handleSaveData}
      colon={false}
      className={className}
    >
      <FormBuilder<IOperatorExportFile>
        asChild
        configs={{
          exportFile: {
            formType: 'custom',
            label: t('export_file'),
            required: false,
            rules: [
              {
                required: true,
                message: t('pleaseEnterField', {
                  field: t('file_name').toLowerCase(),
                }),
              },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: t('no_special_characters'),
              },
            ],
            render: (props) => (
              <Flex gapX="s24" align="center" direction="row">
                <Input
                  style={{
                    width: '60%',
                  }}
                  {...(props as any)}
                  placeholder={t('fill_name_of_export_file')}
                />
                <Box>
                  <Button
                    type="primary"
                    block
                    htmlType="submit"
                    loading={actionLoading}
                  >
                    {t('export')}
                  </Button>
                </Box>
              </Flex>
            ),
          },
        }}
        layouts={[
          {
            name: 'exportFile',
            span: 24,
          },
        ]}
      />
    </Form>
  );
};
