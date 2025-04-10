import { Flex, styled } from '@packages/ds-core';
import { Meta, Story, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { Modal, NotificationModalContent } from './components';
import { ModalProvider } from './ModalProvider';
import { Button } from 'antd';
import { useModal } from './hooks/useModal';
export default {
  title: 'react-noti/Modal',
} as Meta;

export const Default: Story = () => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  return (
    <Wrapper className="App">
      <button onClick={toggleModal}>Open</button>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Thông báo"
        closeable
        renderChild={({ close }) => (
          <NotificationModalContent
            id="1"
            type="success"
            message="Tên đăng nhập hoặc mật khẩu chưa đúng. Vui lòng đăng nhập lại."
            onCancel={close}
            onConfirm={close}
          />
        )}
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

Default.storyName = 'Modal';

export const ModalProviderStory: StoryObj = () => {
  return (
    <ModalProvider>
      <ModalButtons />
    </ModalProvider>
  );
};

const ModalButtons = () => {
  const modal = useModal();

  const handleSuccess = () => {
    modal.success({
      title: 'Notification',
      message: 'This is a success message',
      onCancel: ({ close }) => close(),
      onConfirm: ({ close }) => close(),
      closeable: true,
    });
  };
  const handleError = () => {
    modal.error({
      title: 'Notification',
      message: 'This is a success message',
      onCancel: ({ close }) => close(),
      onConfirm: ({ close }) => close(),
      closeable: true,
    });
  };
  const handleWarning = () => {
    modal.warning({
      title: 'Notification',
      message: 'This is a success message',
      onCancel: ({ close }) => close(),
      onConfirm: ({ close }) => close(),
      closeable: true,
    });
  };
  const handleConfirm = () => {
    modal.confirm({
      title: 'Notification',
      message: 'This is a success message',
      onCancel: ({ close }) => close(),
      onConfirm: ({ close }) => close(),
      closeable: true,
    });
  };

  return (
    <Flex gapX="s16">
      <Button type="primary" onClick={handleSuccess}>
        Success
      </Button>
      <Button ghost type="primary" onClick={handleConfirm}>
        Confirm
      </Button>
      <Button danger onClick={handleWarning}>
        Warning
      </Button>
      <Button danger type="primary" onClick={handleError}>
        Error
      </Button>
      <Button>Customize</Button>
    </Flex>
  );
};

ModalProviderStory.storyName = 'ModalProvider';
