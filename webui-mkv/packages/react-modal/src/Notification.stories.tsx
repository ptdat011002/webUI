import { Meta, Story } from '@storybook/react';
import React from 'react';
import { NotificationModal } from './components/NotificationModal';
import { styled } from '@packages/ds-core';

export default {
  title: 'react-noti/Notification',
} as Meta;

export const Default: Story = () => {
  return (
    <Wrapper>
      <NotificationModal
        title="Thông báo"
        id="1"
        type="success"
        message="Tên đăng nhập hoặc mật khẩu chưa đúng. Vui lòng đăng nhập lại."
        onCancel={() => console.log('cancel')}
      />

      <NotificationModal
        title="Thông báo"
        id="1"
        type="warning"
        message="Tên đăng nhập hoặc mật khẩu chưa đúng. Vui lòng đăng nhập lại."
        onCancel={() => console.log('cancel')}
      />

      <NotificationModal
        title="Thông báo"
        id="1"
        type="error"
        message="Tên đăng nhập hoặc mật khẩu chưa đúng. Vui lòng đăng nhập lại."
        onCancel={() => console.log('cancel')}
      />

      <NotificationModal
        title="Thông báo"
        id="1"
        type="confirm"
        message="Tên đăng nhập hoặc mật khẩu chưa đúng. Vui lòng đăng nhập lại."
        onCancel={() => console.log('cancel')}
      />
    </Wrapper>
  );
};
const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.grayA50};
  width: 100%;
  padding: 2rem;
  display: flex;
  row-gap: 1rem;
  column-gap: 1rem;
  flex-wrap: wrap;
`;

Default.storyName = 'Notification';
