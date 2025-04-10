import { t } from 'configs/i18next';
import { Box, styled } from '@packages/ds-core';
import React from 'react';
import { ISystemDeviceInfo } from '../types';
import { useAuthContext } from '../../auth/hooks';

export interface DeviceInfoTableProps {
  className?: string;
  data?: ISystemDeviceInfo;
}

export const DeviceInfoTable: React.FC<DeviceInfoTableProps> = ({ data }) => {
  const { deviceInfo } = useAuthContext();

  const commitHash = import.meta.env.VITE_COMMIT_HASH;
  console.log("commit ", import.meta.env.VITE_COMMIT_HASH);
  const websiteVersion = `${deviceInfo?.http_api_version || t('unknown')} (${commitHash})`;

  return (
    <TableStyle>
      <table>
        <tbody>
          <tr>
            <th>{t('deviceId')}</th>
            <td>{data?.device_id || t('unknown')}</td>
          </tr>
          <tr>
            <th>{t('deviceType')}</th>
            <td>{data?.device_type || t('unknown')}</td>
          </tr>
          <tr>
            <th>{t('model')}</th>
            <td>{data?.device_model || t('unknown')}</td>
          </tr>
          <tr>
            <th>{t('firmwareVersion')}</th>
            <td>{data?.fw_version || t('unknown')}</td>
          </tr>
          <tr>
            <th>{t('hardwareVersion')}</th>
            <td>{data?.hardware_version || t('unknown')}</td>
          </tr>
          <tr>
            <th>{t('mac1Address(ethernet)')}</th>
            <td>{data?.mac_address || t('unknown')}</td>
          </tr>
          <tr>
            <th>{t('mac2Address(wifi)')}</th>
            <td>{data?.wireless_address || t('unknown')}</td>
          </tr>
          <tr>
            <th>{t('websiteVersion')}</th>
            <td>{websiteVersion}</td>
          </tr>
        </tbody>
      </table>
    </TableStyle>
  );
};

const TableStyle = styled(Box)`
  table {
    width: 100%;
    border: none;
    line-height: 50px;
  }

  th,
  td {
    text-align: left;
    height: 60px;
    width: 50%;
    border-spacing: 0 !important;
  }

  th {
    font-weight: 300;
  }
`;
