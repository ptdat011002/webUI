import { FormBuilder } from '@packages/react-form-builder';
import React from 'react';
import {
  IAlarmConfig,
  IPhotoSetting,
  PhotoSettingEvent,
} from '../types/setting';
import { Box, Flex, styled } from '@packages/ds-core';
import { Button, Col, Form, Row } from 'antd';
import { PaddingWrapper } from 'modules/_shared';
import { t } from 'configs/i18next';
import { useCaptureConfig } from '../hooks/useCaptureConfig';

export interface PhotoSettingContainerProps {
  className?: string;
}

const PhotoSettingContainer: React.FC<PhotoSettingContainerProps> = () => {
  const [form] = Form.useForm<
    IPhotoSetting & {
      all: boolean;
    }
  >();

  const { data, updateConfig, actionLoading } = useCaptureConfig({
    onSuccess: (data) => {
      form.setFieldsValue({
        event: PhotoSettingEvent.all,
        enable: data?.[PhotoSettingEvent.all]?.snapshot_mode?.enable,
        cycle: data?.[PhotoSettingEvent.all]?.snapshot_mode?.interval,
      });
    },
  });

  const submit = async (values: IPhotoSetting) => {
    const objectValue: Partial<IAlarmConfig> = {
      [values.event as every]: {
        ...data?.[values.event as every],
        snapshot_mode: {
          enable: values.enable,
          interval: values.cycle,
          count: 1,
        },
      },
    };

    if (!objectValue) return;

    await updateConfig(objectValue);
  };
  return (
    <Wrapper>
      <PaddingWrapper type="form">
        <Row>
          <Col span={24} xl={16} xxl={12} lg={24}>
            <Form
              labelCol={{ span: 10 }}
              colon={false}
              form={form}
              onFinish={submit}
            >
              <FormBuilder<
                IPhotoSetting & {
                  all: boolean;
                }
              >
                configs={{
                  enable: {
                    label: t('capture'),
                    formType: 'switch',
                  },
                  cycle: {
                    label: t('cycle_capture'),
                    formType: 'select',
                    options: [
                      ...Array.from({ length: 11 }, (_, i) => ({
                        label: `${i} ${t('second')}`,
                        value: i,
                      })).filter((item) => item.value !== 0),
                    ],
                  },
                  event: {
                    label: t('event'),
                    formType: 'select',
                    options: [
                      {
                        label: t('move_detection'),
                        value: PhotoSettingEvent.move_detection,
                      },
                      {
                        label: t('face_detection'),
                        value: PhotoSettingEvent.face_detection,
                      },
                      {
                        label: t('face_recognition'),
                        value: PhotoSettingEvent.face_recognition,
                      },
                      {
                        label: t('hurdle_detection'),
                        value: PhotoSettingEvent.hurdle_detection,
                      },
                      {
                        label: t('intrusion_detection'),
                        value: PhotoSettingEvent.intrusion_detection,
                      },
                      {
                        label: t('crowd_detection'),
                        value: PhotoSettingEvent.crowd_detection,
                      },
                      {
                        label: t('all'),
                        value: PhotoSettingEvent.all,
                      },
                    ],
                    onSelect: (value) => {
                      const event = value as PhotoSettingEvent;
                      form.setFieldsValue({
                        event: event,
                        enable: data?.[event]?.snapshot_mode?.enable,
                        cycle: data?.[event]?.snapshot_mode?.interval,
                      });
                    },
                  },
                }}
                layouts={[
                  {
                    name: 'enable',
                    span: 24,
                  },
                  {
                    name: 'cycle',
                    span: 24,
                  },
                  {
                    name: 'event',
                    span: 24,
                  },
                  {
                    name: 'all',
                    style: {
                      marginTop: -20,
                    },
                    span: 24,
                  },
                ]}
                asChild
              />
              <Box marginTop="s32">
                <Flex>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={actionLoading}
                  >
                    {t('save')}
                  </Button>
                </Flex>
              </Box>
            </Form>
          </Col>
        </Row>
      </PaddingWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

export default PhotoSettingContainer;
