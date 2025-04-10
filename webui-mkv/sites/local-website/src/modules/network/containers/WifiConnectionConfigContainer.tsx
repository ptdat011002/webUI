import { Box, Flex, Spinner, styled, Text } from '@packages/ds-core';
import { Switch } from 'antd';
import { t } from 'i18next';
import { Collapsible, LineButton, ModalWrapper } from 'modules/_shared';
import React from 'react';
import { ListWifi } from '../components/ListWifi';
import {
  IWifiItem,
  useScanWifi,
  useWifiAction,
  useWifiConfigure,
} from '../hooks';
import { useModal } from '@packages/react-modal';
import { WifiFillPasswordContainer } from './WifiFillPasswordContainer';
import { WifiAddNetworkManuallyContainer } from './WifiAddNetworkManuallyContainer.tsx';
import { WifiChangeInfoContainer } from './WifiChangeInfoContainer.tsx';

export interface WifiConnectionConfigContainerProps {
  enable?: boolean;
  onEnableChange?: (value: boolean) => void;
}

const WifiConnectionConfigContainer: React.FC<
  WifiConnectionConfigContainerProps
> = ({ enable, onEnableChange }) => {
  const { items, loading } = useScanWifi(enable);
  const {} = useWifiConfigure();
  const { joinWifi } = useWifiAction({} as IWifiItem, enable);
  const modal = useModal();

  const handleOnConnect = (wifi: IWifiItem) => {
    modal.show({
      title: t('connect_wifi'),
      render: (_state, close) => (
        <ModalWrapper>
          <div style={{ width: 400, minHeight: 200 }}>
            <WifiFillPasswordContainer wifi={wifi} close={close} />
          </div>
        </ModalWrapper>
      ),
    });
  };
  const handleViewDetail = (wifi: IWifiItem) => {
    modal.show({
      title: t('wifi_detail'),
      render: (_state, close) => (
        <ModalWrapper>
          <div style={{ width: 400, minHeight: 200 }}>
            <WifiChangeInfoContainer close={close} wifi={wifi} />
          </div>
        </ModalWrapper>
      ),
    });
  };

  const handleAddManual = () => {
    modal.show({
      title: t('connect_wifi_manual'),
      render: (_state, close) => (
        <ModalWrapper>
          <div style={{ width: 400, minHeight: 200 }}>
            <WifiAddNetworkManuallyContainer close={close} />
          </div>
        </ModalWrapper>
      ),
    });
  };
  return (
    <div>
      <Flex gapX="s16" justify="start" align="center">
        <Switch checked={enable} onChange={onEnableChange} />
        {loading && (
          <Flex>
            <Spinner size={18} />
          </Flex>
        )}
      </Flex>
      {/* Wi-Fi connection */}
      <Wrapper open={enable && !loading}>
        <Box paddingTop="s16">
          <Flex direction="column" gapY="s4">
            {(items?.recently.length ?? 0) > 0 && (
              <Box>
                <Box>
                  <Text>{t('network_recent')}</Text>
                </Box>
                <Box>
                  <ListWifi
                    items={(items?.recently || []).filter(
                      (_, index) => index < 1,
                    )}
                    onConnect={joinWifi}
                    onDetail={handleViewDetail}
                  />
                </Box>
              </Box>
            )}
            <Box>
              <Collapsible
                title={t('add_other_networks')}
                defaultCollapsed={false}
              >
                <ListWifi
                  items={items?.available || []}
                  onConnect={handleOnConnect}
                />
              </Collapsible>
            </Box>
            <Box>
              <LineButton
                label={t('add_manual_network')}
                onClick={handleAddManual}
              />
            </Box>
          </Flex>
        </Box>
      </Wrapper>
    </div>
  );
};

export default WifiConnectionConfigContainer;

const Wrapper = styled(Box)<{
  open?: boolean;
}>`
  max-height: ${(props) => (props.open ? '999px' : '0')};
  overflow: hidden;
  transition: max-height 0.25s ease-in-out;
`;
