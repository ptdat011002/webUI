import { FormBuilder } from '@packages/react-form-builder';
import React from 'react';
import { IFaceConfig } from '../types';
import { Button, Col, InputNumber, Radio, Row } from 'antd';
import { t } from 'configs/i18next';
import { Box } from '@packages/ds-core';
import { AvatarFormItem } from 'modules/_shared/components/AvatarFormItem';

export interface FaceConfigFormProps {
  onSubmit: (values: IFaceConfig) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<IFaceConfig>;
}
export const FaceConfigForm: React.FC<FaceConfigFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: IFaceConfig) => {
    setLoading(true);
    const base64String = values.image?.replace(/data:image\/.*;base64,/g, '');
    try {
      await onSubmit({
        ...values,
        image: base64String,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <FormBuilder<IFaceConfig & { submit: string }>
        configs={{
          image: {
            formType: 'custom',
            render: (props) => {
              return <AvatarFormItem {...(props as every)} />;
            },
            rules: [
              {
                required: true,
                message: t('fieldIsRequired', {
                  field: t('photo'),
                }),
              },
            ],
          },

          face_id: {
            formType: 'custom',
            render: ({ value, onChange }) => {
              return (
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                  value={value as every}
                  onChange={onChange as every}
                  placeholder={t('enterField', {
                    field: 'ID',
                  })}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value?.replace(/(,*)/g, '') ?? ''}
                />
              );
            },
            label: 'ID',
          },
          name: {
            formType: 'input',
            label: 'Name',
            placeholder: t('enterField', {
              field: t('name').toLowerCase(),
            }),
            rules: [
              {
                required: true,
                message: t('pleaseEnterField', {
                  field: t('name').toLowerCase(),
                }),
              },
            ],
          },
          sex: {
            formType: 'custom',
            render: ({ onChange, value }) => {
              return (
                <Radio.Group value={value} onChange={onChange as every}>
                  <Row>
                    <Col span={12}>
                      <Radio value={1}>{t('male')}</Radio>
                    </Col>
                    <Col span={12}>
                      <Radio value={0}>{t('female')}</Radio>
                    </Col>
                  </Row>
                </Radio.Group>
              );
            },
          },
          age: {
            formType: 'custom',
            label: t('age'),
            render: ({ value, onChange }) => {
              return (
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                  value={value as every}
                  onChange={onChange as every}
                  placeholder={t('enterField', {
                    field: t('age').toLowerCase(),
                  })}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value?.replace(/(,*)/g, '') ?? ''}
                />
              );
            },
          },
          submit: {
            formType: 'custom',
            render: ({}) => {
              return (
                <Box marginTop="s24">
                  <Row gutter={12}>
                    <Col span={12}>
                      <Button type="default" block onClick={onCancel}>
                        {t('cancel')}
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                      >
                        {t('save')}
                      </Button>
                    </Col>
                  </Row>
                </Box>
              );
            },
          },
        }}
        initialValues={initialValues}
        layouts={[
          {
            type: 'group',
            span: 24,
            lg: 11,
            items: [
              {
                span: 12,
                lg: 24,
                name: 'image',
              },
              {
                span: 24,
                name: 'sex',
              },
            ],
          },
          {
            type: 'group',
            span: 24,
            lg: 13,
            items: [
              {
                span: 24,
                name: 'face_id',
              },
              {
                span: 24,
                name: 'name',
              },
              {
                span: 24,
                name: 'age',
              },
            ],
          },
          {
            name: 'submit',
            span: 24,
          },
        ]}
        formLayout="vertical"
        gutter={[16, 0]}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
