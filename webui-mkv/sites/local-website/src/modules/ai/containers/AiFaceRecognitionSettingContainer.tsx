import { Box, Text } from '@packages/ds-core';
import { Button, Col, Form, Row, Switch } from 'antd';
import { Slider } from 'modules/_shared';
import React from 'react';
import { VideoSettingLayout } from 'modules/live/containers';
import { useAIFaceConfig } from '../hooks';
import { useForm, useWatch } from 'antd/es/form/Form';
import { t } from 'configs/i18next';

export interface AiFaceRecognitionSettingContainerProps {
  className?: string;
  signal?: AbortSignal;
}

const AiFaceRecognitionSettingContainer: React.FC<AiFaceRecognitionSettingContainerProps> = ({ signal }) => {
  const [form] = useForm();

  const { isLoading, updateConfig, actionLoading } = useAIFaceConfig({
    onSuccess: (data) => {
      form.setFieldsValue(data.FR);
    },
    signal,
  });

  const minOfMaxW = useWatch('minW', form);
  const maxOfMinW = useWatch('maxW', form);

  return (
    <VideoSettingLayout
      leftContent={
        <Box>
          <Form
            form={form}
            colon={false}
            onFinish={(values) => {
              updateConfig({ FR: values });
            }}
            labelCol={{
              span: 11,
              xxl: 8,
              md: 8,
            }}
            labelAlign="left"
            initialValues={{
              minW: 60,
              maxW: 1920,
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Text whiteSpace="normal">{t('face_recognition')}</Text>
                  }
                  name="enable"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={<Text whiteSpace="normal">{t('face_min_w')}</Text>}
                  name="minW"
                >
                  <Slider
                    min={60}
                    max={1920}
                    tooltip
                    maxSlider={maxOfMinW - 1}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={<Text whiteSpace="normal">{t('face_max_w')}</Text>}
                  name="maxW"
                >
                  <Slider
                    min={60}
                    max={1920}
                    tooltip
                    minSlider={minOfMaxW + 1}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={t('record')}
                  name="record_enable"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Box marginTop="s24">
            <Button
              type="primary"
              loading={isLoading || actionLoading}
              onClick={form.submit}
            >
              {t('save')}
            </Button>
          </Box>
        </Box>
      }
    />
  );
};

export default AiFaceRecognitionSettingContainer;