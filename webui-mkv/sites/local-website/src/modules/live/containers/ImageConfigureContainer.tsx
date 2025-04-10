import React, { useMemo, useState } from 'react';
import { Box, Spinner, styled } from '@packages/ds-core';
import { useForm } from 'antd/es/form/Form';
import { Button, Col, Form, Row, Switch } from 'antd';
import { IImageProperties, IPTZConfig, PTZCommand } from '../types';
import { t } from 'configs/i18next.ts';
import { debounce } from 'lodash';
import { useImageControl, useImageProperties } from '../hooks';
import {
  AnimateSlider,
  SliderRef,
} from 'modules/_shared/components/AnimateSlider';
import { IrisConfig } from 'modules/_shared/components/IrisConfig';

export interface ImageConfigureContainerProps {
  className?: string;
}

export const ImageConfigureContainer: React.FC<
  ImageConfigureContainerProps
> = ({ className }) => {
  const [formLocking, setFormLocking] = useState(false);
  const zoomRef = React.useRef<SliderRef>(null);
  const focusRef = React.useRef<SliderRef>(null);

  const [form] = useForm<IImageProperties>();

  const { loading, imageConfig, onUpdate, onRequestFocus } =
    useImageProperties();

  const { data: imageControlData, updateImageControl } = useImageControl();
  const handleValuesChange = useMemo(
    () =>
      debounce(
        async (values: Record<string, every>) => {
          setFormLocking(true);

          const cmd = calculateCmd(values);

          const kwd = calculateStep(values);

          const payload: IPTZConfig = {
            ptz_cmd: cmd,
            ...values,
            [kwd.key]: kwd.step,
          };

          await onUpdate(payload)
            .then((newValue) => {
              zoomRef.current?.animateTo(newValue?.zoom_cur_pos ?? 100);
              focusRef.current?.animateTo(newValue?.focus_cur_pos ?? 100);
            })
            .catch(() => {
              zoomRef.current?.animateTo(imageConfig?.zoom_cur_pos ?? 100);
              focusRef.current?.animateTo(imageConfig?.focus_cur_pos ?? 100);
            })
            .finally(() => setFormLocking(false));

          // after zooming in or out, we need to focus
          if (
            cmd === PTZCommand.PTZ_CMD_ZOOM_OUT ||
            cmd === PTZCommand.PTZ_CMD_ZOOM_IN
          )
            await handleAutoFocus();
        },
        400,
        {
          leading: true,
        },
      ),
    [imageConfig],
  );

  const handleAutoFocus = async () => {
    setFormLocking(true);

    return onRequestFocus()
      .then((newValue) => {
        zoomRef.current?.animateTo(newValue?.zoom_cur_pos ?? 100);
        focusRef.current?.animateTo(newValue?.focus_cur_pos ?? 100);
      })
      .catch(() => {
        zoomRef.current?.animateTo(imageConfig?.zoom_cur_pos ?? 100);
        focusRef.current?.animateTo(imageConfig?.focus_cur_pos ?? 100);
      })
      .finally(() => {
        setFormLocking(false);
      });
  };

  const calculateCmd = (e: Record<string, every>) => {
    const [values] = Object.entries(e);

    const [key, value] = values;

    const currentStep =
      key === 'zoom_step'
        ? imageConfig?.zoom_cur_pos
        : imageConfig?.focus_cur_pos;

    const step = (currentStep ?? 0) - value;

    return key === 'zoom_step'
      ? step > 0
        ? PTZCommand.PTZ_CMD_ZOOM_OUT
        : PTZCommand.PTZ_CMD_ZOOM_IN
      : step > 0
      ? PTZCommand.PTZ_CMD_FOCUS_NEAR
      : PTZCommand.PTZ_CMD_FOCUS_FAR;
  };
  const calculateStep = (e: Record<string, every>) => {
    const [values] = Object.entries(e);
    const [key, value] = values;

    const currentStep =
      key === 'zoom_step'
        ? imageConfig?.zoom_cur_pos
        : imageConfig?.focus_cur_pos;

    const step = (currentStep ?? 0) - value;

    return {
      key,
      step: Math.abs(step),
    };
  };

  if (loading) return <Spinner />;

  return (
    <Wrapper className={className} padding="s8">
      <Form<IImageProperties>
        labelCol={{
          span: 9,
        }}
        disabled={formLocking}
        style={{
          cursor: formLocking ? 'not-allowed' : 'auto',
        }}
        form={form}
        colon={false}
        initialValues={{
          zoom_step: imageConfig?.zoom_cur_pos ?? 100,
          focus_step: imageConfig?.focus_cur_pos ?? 100,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="zoom_step"
              label={t('Zoom')}
              labelCol={{
                span: 9,
              }}
              wrapperCol={{
                span: 15,
              }}
              labelAlign="left"
            >
              <AnimateSlider
                max={imageConfig?.zoom_max ?? 200}
                min={1}
                control
                ref={zoomRef}
                renderLabel={(value) => value.toString()}
                disabled={formLocking}
                onChange={(value) => {
                  if (formLocking) return;
                  return handleValuesChange({ zoom_step: value });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="focus_step"
              label={t('Focal Length')}
              labelCol={{
                span: 9,
              }}
              wrapperCol={{
                span: 15,
              }}
              labelAlign="left"
            >
              <AnimateSlider
                ref={focusRef}
                max={imageConfig?.focus_max ?? 200}
                min={1}
                control
                renderLabel={(value) => value.toString()}
                disabled={formLocking}
                onChange={(value) => {
                  if (formLocking) return;

                  return handleValuesChange({ focus_step: value });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="focus"
              label={t('Focus')}
              labelCol={{
                span: 9,
              }}
              wrapperCol={{
                span: 15,
              }}
              labelAlign="left"
            >
              <Button
                type="primary"
                ghost
                onClick={handleAutoFocus}
                loading={formLocking}
              >
                {t('autoFocus')}
              </Button>
            </Form.Item>
          </Col>
          {imageConfig?.iris_value ? (
            <><Col span={24}>
            <Box marginTop="s24">
              {t('auto_iris')}
              <Switch
                style={{ marginLeft: '40px' }}
                checked={imageControlData?.['exposure']?.['iris_auto']}
                onChange={async (checked) => {
                  if (formLocking) return;
                  try {
                    setFormLocking(true);
                    const updatedData = {
                      ...imageControlData,
                      exposure: {
                        ...imageControlData?.['exposure'],
                        iris_auto: Number(checked),
                      },
                    };
                    await updateImageControl(updatedData);
                  } catch (error) {
                    console.error('Error updating auto iris:', error);
                  } finally {
                    setFormLocking(false);
                  }
                }}
              />
            </Box>
          </Col>
          
            <Col span={24}>
              <Form.Item
                name="iris"
                label={t('iris')}
                labelCol={{
                  span: 9,
                }}
                wrapperCol={{
                  span: 15,
                }}
                labelAlign="left"
              >
                <IrisConfig
                  value={imageConfig.iris_value}
                  defaultValue={imageConfig.iris_value}
                  disabled={formLocking}
                  onChange={async (newValue) => {
                    if (formLocking) return;
                    try {
                      setFormLocking(true);
                      await onUpdate({ptz_cmd: PTZCommand.PTZ_CMD_IRIS, iris_value: newValue });
                    } catch (error) {
                      console.error('Error saving iris_value:', error);
                    } finally {
                      setFormLocking(false);
                    }
                  }}
                />
              </Form.Item>
            </Col></>
          ) : (
            <p></p>
          )}
        </Row>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 85%;
  padding: 1rem;

  @media screen and (max-width: 768px) {
    padding: 0.5rem;
  }
`;
