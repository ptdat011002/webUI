import { Text, styled } from '@packages/ds-core';
import { ChevronDownOutlined } from '@packages/ds-icons';
import { Dropdown } from 'antd';
import { t } from 'configs/i18next';
import { deviceService } from 'modules/device/device-service';
import { useTranslation } from 'react-i18next';

const items = [
  {
    key: 'vi',
    value: 'VIE',
    label: t('vietnamese'),
  },
  {
    key: 'en',
    label: t('english'),
    value: 'ENG',
  },
];

export const LanguageDropDown = () => {
  const { i18n } = useTranslation();

  return (
    <Dropdown
      menu={{
        items: items.map((item) => ({
          ...item,
          onClick: () => {
            i18n.changeLanguage(item.key);
            deviceService.setLanguage(item.value as every).finally(() => {
              window.location.reload();
            });
          },
        })),
        selectable: true,
      }}
    >
      <SelectWrapper>
        <Text color="primary" fontSize="s">
          {i18n.language === 'vi' ? 'VN' : 'EN'}
        </Text>
        <ChevronDownOutlined className="icon" />
      </SelectWrapper>
    </Dropdown>
  );
};

const SelectWrapper = styled.div`
  width: 60px;
  background-color: ${({ theme }) => theme.colors?.lightA400};
  overflow: hidden;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.625rem;
  box-sizing: border-box;
  border-radius: 30px;
  column-gap: 0.25rem;
  cursor: pointer;
  .icon {
    color: ${({ theme }) => theme.colors?.gray};
  }
`;
