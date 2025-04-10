import { FormBuilder } from '@packages/react-form-builder';
import React, { useMemo } from 'react';
import { Slider } from 'modules/_shared';
import {
  ColorMode,
  colorModeArray,
  IColorProperties,
  IImageColorRequest,
} from '../types';
import { t } from 'configs/i18next';
import { useForm } from 'antd/es/form/Form';
import { Button, Form } from 'antd';
import { Box, Flex, Spinner, styled } from '@packages/ds-core';
import { debounce, padStart } from 'lodash';
import { useColorProperties } from '../hooks';

const ColorSlider = ({ max = 100, min = -100, ...props }) => {
  return (
    <Slider
      {...(props as every)}
      renderLabel={(value) =>
        `${value >= 0 ? '+' : ''}${padStart(value.toString(), 2, '0')}`
      }
      disabled={props.config.disabled}
      max={max}
      min={min}
    />
  );
};

export interface ColorPropertiesContainerProps {
  className?: string;
}

export const ColorPropertiesContainer: React.FC<
  ColorPropertiesContainerProps
> = ({ className }) => {
  const [form] = useForm<IColorProperties>();
  // const mode = useWatch('colorMode', form);
  const { loading, colorConfig, actionLoading, onUpdate, onReset } =
    useColorProperties();

  const handleValuesChange = useMemo(
    () =>
      debounce(async (values: Record<string, every>) => {
        const config: IImageColorRequest = {
          wb_mode: values.colorMode,
          hue: values.hue,
          brightness: values.brightness,
          contrast: values.contrast,
          saturation: values.saturation,
          sharpening: values.sharpness,
          // black_white: values.black_white,
          // mctf_str_lvl: values.noiseReduction,
          // wb_ratio: [values.red, values.cyan],
          // anti_flicker_mode: values.antiFlickerMode,
          // slow_shutter_mode: values.slowShutterMode
          //   ? SlowShutterMode.SLOW_SHUTTER_ON
          //   : SlowShutterMode.SLOW_SHUTTER_OFF,
        };

        await onUpdate(config);
      }, 1000),
    [],
  );

  const handleResetColor = onReset;
  if (loading) return <Spinner />;

  return (
    <Wrapper className={className} padding="s8">
      <StyledForm
        labelCol={{
          span: 9,
        }}
        form={form}
        colon={false}
        // onFinish={handleSubmit}
        onValuesChange={(_, allValues) => handleValuesChange(allValues)}
        initialValues={{
          colorMode: ColorMode.WB_CUSTOM,
          brightness: colorConfig?.brightness ?? 18,
          contrast: colorConfig?.contrast ?? 65,
          saturation: colorConfig?.saturation ?? 66,
          hue: colorConfig?.hue ?? 1,
          sharpness: colorConfig?.sharpening ?? 7,
          // black_white: colorConfig?.black_white ?? 0,
          // noiseReduction: colorConfig?.mctf_str_lvl ?? 6,
          // red: colorConfig?.wb_ratio?.[0] ?? 2023,
          // cyan: colorConfig?.wb_ratio?.[1] ?? 2099,
          // slowShutterMode:
          //   (colorConfig?.slow_shutter_mode ??
          //     SlowShutterMode.SLOW_SHUTTER_OFF) ===
          //   SlowShutterMode.SLOW_SHUTTER_ON,
          // antiFlickerMode:
          //   colorConfig?.anti_flicker_mode ?? AntiFlickerMode.ANTI_FLICKER_OFF,
        }}
      >
        <FormBuilder<IColorProperties>
          asChild
          configs={{
            colorMode: {
              disabled: true,
              placeholder: t('chooseMode'),
              formType: 'select',
              label: t('colorMode'),
              options: colorModeArray.map((mode) => ({
                label: t(ColorMode[mode] as every),
                value: mode,
              })),
            },
            brightness: {
              formType: 'custom',
              render: (props) => (
                <ColorSlider max={255} min={-255} {...props} />
              ),
              label: t('brightness'),
            },
            contrast: {
              formType: 'custom',
              render: (props) => <ColorSlider max={128} min={0} {...props} />,
              label: t('contrast'),
            },
            saturation: {
              formType: 'custom',
              render: (props) => <ColorSlider max={255} min={0} {...props} />,
              label: t('saturation'),
            },
            hue: {
              formType: 'custom',
              render: (props) => <ColorSlider max={15} min={-15} {...props} />,
              label: t('hue'),
            },
            sharpness: {
              formType: 'custom',
              render: (props) => <ColorSlider max={11} min={0} {...props} />,
              label: t('sharpness'),
            },
            // black_white: {
            //   formType: 'custom',
            //   render: (props) => <ColorSlider max={1} min={0} {...props} />,
            //   label: t('black_white'),
            //   disabled: true,
            // },
            // noiseReduction: {
            //   formType: 'custom',
            //   render: (props) => (
            //     <ColorSlider max={16777215} min={1} {...props} />
            //   ),
            //   label: t('noiseReduction'),
            //   disabled: true,
            // },
            // red: {
            //   formType: 'custom',
            //   render: (props) => (
            //     <ColorSlider max={16777215} min={1} {...props} />
            //   ),
            //   label: t('red'),
            //   disabled: true,
            // },
            // cyan: {
            //   formType: 'custom',
            //   render: (props) => (
            //     <ColorSlider max={16777215} min={1} {...props} />
            //   ),
            //   label: t('cyan'),
            //   disabled: true,
            // },
            // slowShutterMode: {
            //   formType: 'switch',
            //   label: t('slowShutterMode'),
            //   disabled: true,
            // },
            // antiFlickerMode: {
            //   formType: 'select',
            //   label: t('antiFlicker'),
            //   disabled: true,
            //   options: [
            //     {
            //       label: t('50Hz'),
            //       value: AntiFlickerMode.ANTI_FLICKER_50HZ,
            //     },
            //     {
            //       label: t('60Hz'),
            //       value: AntiFlickerMode.ANTI_FLICKER_60HZ,
            //     },
            //     {
            //       label: t('off'),
            //       value: AntiFlickerMode.ANTI_FLICKER_OFF,
            //     },
            //   ],
            // },
          }}
          layouts={[
            // {
            //   name: 'colorMode',
            //   span: 24,
            //   align: 'center',
            // },
            // {
            //   name: 'black_white',
            //   span: 24,
            //   align: 'center',
            // },
            {
              name: 'brightness',
              span: 24,
              align: 'center',
            },

            {
              name: 'saturation',
              span: 24,
              align: 'center',
            },
            {
              name: 'hue',
              span: 24,
              align: 'center',
            },
            {
              name: 'contrast',
              span: 24,
              align: 'center',
            },
            {
              name: 'sharpness',
              span: 24,
              align: 'center',
            },
            // {
            //   name: 'noiseReduction',
            //   span: 24,
            //   align: 'center',
            // },
            // {
            //   name: 'red',
            //   span: 24,
            //   align: 'center',
            // },
            // {
            //   name: 'cyan',
            //   span: 24,
            //   align: 'center',
            // },
            // {
            //   name: 'slowShutterMode',
            //   span: 24,
            //   align: 'flex-start',
            // },
            // {
            //   name: 'antiFlickerMode',
            //   span: 24,
            //   align: 'flex-start',
            // },
          ]}
        />
        <Box marginTop="s32">
          <Flex gapX="s24" justify="center">
            <Button
              type="primary"
              ghost
              htmlType="reset"
              loading={actionLoading}
              onClick={handleResetColor}
            >
              {t('reset')}
            </Button>
            {/*<Button*/}
            {/*  type="primary"*/}
            {/*  block*/}
            {/*  htmlType="submit"*/}
            {/*  loading={actionLoading}*/}
            {/*>*/}
            {/*  {t('save')}*/}
            {/*</Button>*/}
          </Flex>
        </Box>
      </StyledForm>
    </Wrapper>
  );
};

const StyledForm = styled(Form<IColorProperties>)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
`;

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 85%;

  padding: 1rem;

  @media screen and (max-width: 768px) {
    padding: 0.5rem;
  }
`;
