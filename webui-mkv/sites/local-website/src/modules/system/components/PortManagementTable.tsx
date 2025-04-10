import { Input, Table } from 'antd';
import React, { useState } from 'react';
import { t } from 'i18next';
import { IPortManagement } from '../types/access_management';

export interface PortManagementTableProps {
  portData: IPortManagement[];
  onPortChange: (index: number, value: string) => void;
}

const PortManagementTable: React.FC<PortManagementTableProps> = ({ portData, onPortChange }) => {
  const [errors, setErrors] = useState<string[]>([]);
  
  // Cập nhật tên `service` và protocol mặc định là TCP
  const serviceMap = {
    'HTTPS': 'HTTPS Port_Website',
    'RTSP': 'RTSP Port',
    'Onvif': 'Onvif Port',
    'MP4_Live': 'HTTPS Port_Live',
    'MP4_Playback': 'HTTPS Port_Playback'
  };
  
  const dataWithDefaultProtocol = portData.map((item, index) => {
    const protocol = item.protocol || 'TCP';
    const service = serviceMap[item.service] || item.service;
  
    return { ...item, protocol, service, old_index: index }; // Thêm old_index ngay trong map
  });
  
  // Sắp xếp theo `service`
  const sortedPortData = dataWithDefaultProtocol.sort((a, b) => a.service.localeCompare(b.service));

  const handlePortChange = (index: number, value: string) => {
    onPortChange(index, value);
    
    // Validate required port
    if (!value) {
      setErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = t('please_enter_port');
        return newErrors;
      });
    } else {
      setErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = '';
        return newErrors;
      });
    }
  };

  return (
    <div>
      <Table<IPortManagement>
        bordered
        pagination={false}
        dataSource={sortedPortData}
        columns={[
          {
            title: t('server'),
            dataIndex: 'service',
            align: 'center',
          },
          {
            title: t('port'),
            dataIndex: 'port',
            align: 'center',
            render: (value, record) => (
              <div>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => handlePortChange(record.old_index, e.target.value)}
                />
                {errors[record.old_index] && <span style={{ color: 'red', fontSize: '14px' }}>{errors[record.old_index]}</span>}
              </div>
            ),
          },
          {
            title: t('protocol'),
            dataIndex: 'protocol',
            align: 'center',
          },
        ]}
      />
    </div>
  );
};

export default PortManagementTable;