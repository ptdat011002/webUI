import { useForm, useWatch } from 'antd/es/form/Form';
import { Button, Form, Select } from 'antd';
import { t } from '../../../configs/i18next.ts';
import { Box, Spinner } from '@packages/ds-core';
import React, { useMemo } from 'react';
import { AnimateSlider } from '../../_shared/components/AnimateSlider.tsx';
import { usePhotoConfig } from '../hooks/usePhotoConfig.ts';
import { IImageControlConfig } from '../types';

export interface PhotoFormProps {
  className?: string;
}

export interface IPhotoConfigForm {
  nightvision_mode: 'AUTO' | 'ON' | 'OFF' | 'MANUAL';
  day_night_mode: 'ON' | 'OFF';
  ir_cut_mode: 'ON' | 'OFF';
  ir_led_mode: 'SmartIR' | 'MANUAL';
  near_led: number;
  far_led: number;
  hdr_mode: 'Linear' | '2x';
  rotate_photo: 0 | 180;
}

const getRotatePhoto = (values?: IImageControlConfig): 0 | 180 => {
  if (values?.mirror_mode === 'All' && values?.angle_rotation === 0) {
    return 180;
  }
  return 0;
};

export const PhotoForm: React.FC<PhotoFormProps> = () => {
  const { isFetching, data, update, isUpdating } = usePhotoConfig();
  const [form] = useForm();

  const nightVisionMode = useWatch('nightvision_mode', form);
  const irLedMode = useWatch('ir_led_mode', form);

  const initialValues: IPhotoConfigForm | undefined = useMemo(() => {
    if (!data) return undefined;
    console.log("IPhotoConfigForm: data is ", data);

    const nightVisionMode = data.nightVision?.nightvision_mode || 'AUTO';
    const irLedMode =
      nightVisionMode === 'MANUAL'
        ? data.nightVision?.ir_led?.mode || 'SmartIR'
        : 'SmartIR';

    return {
      nightvision_mode: nightVisionMode,
      day_night_mode: data.nightVision?.day_night_mode || 'OFF',
      ir_cut_mode: data.nightVision?.ir_cut_mode || 'ON',
      ir_led_mode: irLedMode,
      far_led: data.nightVision?.ir_led?.high_value || 0,
      near_led: data.nightVision?.ir_led?.low_value || 0,
      rotate_photo: getRotatePhoto(data.imageControl),
      hdr_mode: data.imageControl?.hdr_mode || 'Linear',
    };
  }, [data]);

  if (isFetching) return <Spinner />;

  return (
    <Form<IPhotoConfigForm>
      form={form}
      colon={false}
      labelCol={{ span: 10 }}
      initialValues={initialValues}
      onFinish={update}
      labelAlign={'left'}
    >
      <Form.Item label={t('Night Vision Mode')} name={'nightvision_mode'}>
        <Select
          onSelect={(value) => {
            if (value !== 'MANUAL') {
              form.setFieldsValue({
                ir_led_mode: 'SmartIR',
              });
            }
          }}
        >
          <Select.Option value="AUTO">{t('auto')}</Select.Option>
          <Select.Option value="ON">{t('always_on')}</Select.Option>
          <Select.Option value="OFF">{t('always_off')}</Select.Option>
          <Select.Option value="MANUAL">{t('manual')}</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={t('Day Night Mode')}
        hidden={nightVisionMode !== 'MANUAL'}
        name={'day_night_mode'}
      >
        <Select>
          <Select.Option value="ON">{t('black_white_image')}</Select.Option>
          <Select.Option value="OFF">{t('color_image')}</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={t('IR Cut Mode')}
        name={'ir_cut_mode'}
        hidden={nightVisionMode !== 'MANUAL'}
      >
        <Select>
          <Select.Option value="ON">{t('on')}</Select.Option>
          <Select.Option value="OFF">{t('off')}</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={t('IR LED')}
        name={'ir_led_mode'}
        hidden={nightVisionMode !== 'MANUAL'}
      >
        <Select>
          <Select.Option value="SmartIR">{t('auto')}</Select.Option>
          <Select.Option value="MANUAL">{t('manual')}</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={t('Near LED')}
        name={'near_led'}
        hidden={irLedMode !== 'MANUAL'}
      >
        <AnimateSlider max={100} min={0} tooltip />
      </Form.Item>

      <Form.Item
        label={t('Far LED')}
        name={'far_led'}
        hidden={irLedMode !== 'MANUAL'}
      >
        <AnimateSlider max={100} min={0} tooltip />
      </Form.Item>

      <Form.Item label={t('Rotate Photo')} name={'rotate_photo'}>
        <Select>
          <Select.Option value={0}>0</Select.Option>
          <Select.Option value={180}>180</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="HDR" name={'hdr_mode'}>
        <Select>
          <Select.Option value="Linear">{t('off')}</Select.Option>
          <Select.Option value="2x">{t('on')}</Select.Option>
        </Select>
      </Form.Item>

      <Box marginTop="s24">
        <Button type="primary" htmlType="submit" loading={isUpdating}>
          {t('save')}
        </Button>
      </Box>
    </Form>
  );
};
