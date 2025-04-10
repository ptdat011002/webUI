import React from 'react';
import { Box, Flex } from '@packages/ds-core';
import { FormBuilder } from '@packages/react-form-builder';
import { IOperatorImportFile } from '../types';
import { t } from 'i18next';
import { Button, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useBackUp } from '../hooks';
import { FormFileInput } from 'modules/_shared';
import { reject } from 'lodash';

export interface ImportConfigContainerProps {
  className?: string;
}

export const ImportConfigContainer: React.FC<ImportConfigContainerProps> = ({
  className,
}) => {
  const [form] = useForm();

  const { uploadBackUpFile, actionLoading } = useBackUp();

  const handleSaveData = async (value: IOperatorImportFile) => {
    const data = await readFile(value.importFile);

    return uploadBackUpFile(data);
  };

  const readFile = async (file: File): Promise<object> => {
    const reader = new FileReader();
    reader.readAsText(file);

    return new Promise((resolve) => {
      reader.onload = (e) => {
        const text = e.target?.result;
        if (text === null || text === undefined) return;

        resolve(JSON.parse(text as string));
      };

      reader.onerror = reject;
    });
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      onFinish={handleSaveData}
      colon={false}
      className={className}
    >
      <FormBuilder<IOperatorImportFile>
        asChild
        configs={{
          importFile: {
            formType: 'custom',
            label: t('input_backup_file'),
            required: false,
            render: (props) => (
              <Flex gapX="s24" align="center" direction="row">
                <FormFileInput
                  {...(props as every)}
                  placeholder={t('chooseFile')}
                  accept=".txt"
                  style={{
                    width: '60%',
                  }}
                />
                <Box>
                  <Button
                    type="primary"
                    block
                    htmlType="submit"
                    loading={actionLoading}
                  >
                    {t('import')}
                  </Button>
                </Box>
              </Flex>
            ),
            validateFirst: true,
            rules: [
              {
                required: true,
                message: t('fieldIsRequired', {
                  field: t('File'),
                }),
              },
              {
                // only allow .txt file
                validator: (_, value) => {
                  if (value && !value.name.match(/.*\.txt$/)) {
                    return Promise.reject(
                      t('fieldIsInvalid', {
                        field: 'File',
                      }),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ],
          },
        }}
        layouts={[
          {
            name: 'importFile',
            span: 24,
          },
        ]}
      />
    </Form>
  );
};
