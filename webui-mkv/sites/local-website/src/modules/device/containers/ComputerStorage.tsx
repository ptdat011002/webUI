import React, { useCallback, useEffect, useState } from 'react';
import {
  FormFileInput,
  PaddingWrapper,
  StorageDirectory,
} from 'modules/_shared';
import { Button, Form, message } from 'antd';
import { t } from 'configs/i18next.ts';
import { Box, styled } from '@packages/ds-core';
import { MultiFileOutlined } from '@packages/ds-icons';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';

export interface ComputerStorageProps {
  className?: string;
}

const ComputerStorage: React.FC<ComputerStorageProps> = () => {
  const [fileHandle, setFileHandle] = useState<FileSystemDirectoryHandle>();

  const [form] = useForm();

  const createFileWithSavedHandle = useCallback(async () => {
    const newHandle = await window.showDirectoryPicker();

    setFileHandle(newHandle);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!fileHandle) {
      return;
    }
    await StorageDirectory.saveDirectoryHandle(fileHandle);
    message.success(
      t('action_success', {
        action: t('update'),
      }),
    );
  }, [fileHandle]);

  useEffect(() => {
    (async () => {
      const handle = await StorageDirectory.getSavedDirectoryHandle();

      setFileHandle(handle);
    })();
  }, []);

  return (
    <PaddingWrapper type="formTab">
      <Wrapper>
        <Form
          colon={false}
          labelCol={{
            span: 10,
          }}
          form={form}
          onFinish={handleSubmit}
          labelAlign={'left'}
        >
          <FormItem label={t('saveOnComputer')}>
            <FormFileInput
              placeholder={t('chooseFile2')}
              suffixIcon={<MultiFileOutlined />}
              onClick={createFileWithSavedHandle}
              value={
                !!fileHandle?.name
                  ? ({
                      name: fileHandle?.name,
                    } as File)
                  : undefined
              }
            />
          </FormItem>
          <Box marginTop={'s24'}>
            <Button type="primary" htmlType="submit">
              {t('save')}
            </Button>
          </Box>
        </Form>
      </Wrapper>
    </PaddingWrapper>
  );
};

export default ComputerStorage;

const Wrapper = styled(Box)`
  width: 652px;
  max-width: 100%;
`;
