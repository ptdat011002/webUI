import { Box, Flex, styled } from '@packages/ds-core';
import { t } from 'configs/i18next.ts';
import { Button, Form } from 'antd';
import { IJoinWifiPayload, IWifiConfigManual, SecurityOption } from '../types';
import { FormBuilder } from '@packages/react-form-builder';
import { useForm, useWatch } from 'antd/es/form/Form';
import { IWifiItem, useWifiAction } from '../hooks';

export interface WifiAddNetworkManuallyContainerProps {
  className?: string;
  close?: () => void;
}

export const WifiAddNetworkManuallyContainer: React.FC<
  WifiAddNetworkManuallyContainerProps
> = ({ className, close }) => {
  const [form] = useForm();
  const security = useWatch('security', form);
  const { loading, addManualWifi } = useWifiAction({} as IWifiItem);

  const handleSaveData = (data: IWifiConfigManual) => {
    const config: IJoinWifiPayload = {
      ssid: data.ssid,
      security: data.security,
      password: data.password,
    };

    return addManualWifi(config).then(close);
  };
  return (
    <Wrapper className={className}>
      <Form<IWifiConfigManual>
        layout="vertical"
        form={form}
        onFinish={handleSaveData}
      >
        <FormBuilder<IWifiConfigManual>
          asChild
          configs={{
            ssid: {
              formType: 'input',
              label: t('wifi_name'),
              placeholder: t('wifi_name_input'),
              required: false,
              rules: [
                {
                  required: true,
                  message: t('fieldIsRequired', { field: t('wifi_name') }),
                },
              ],
            },
            security: {
              formType: 'select',
              label: t('security'),
              placeholder: t('security'),
              options: Object.values(SecurityOption).map((v) => ({
                label: v,
                value: v,
              })),
              required: false,
            },
            password: {
              formType: 'password',
              label: t('password'),
              placeholder: '********',
              required: false,
              rules: [
                {
                  required: security !== SecurityOption.OPEN,
                  message: t('fieldIsRequired', { field: t('password') }),
                },
              ],
            },
          }}
          layouts={[
            {
              name: 'ssid',
              span: 24,
            },
            {
              name: 'security',
              span: 24,
            },
            {
              name: 'password',
              span: 24,
            },
          ]}
        />
        <Box marginTop="s32">
          <Flex gapX="s16">
            <Button type="primary" block ghost onClick={close}>
              {t('cancel')}
            </Button>
            <Button type="primary" block htmlType="submit" loading={loading}>
              {t('connect')}
            </Button>
          </Flex>
        </Box>
      </Form>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  padding: 2rem;
  box-sizing: border-box;
`;
