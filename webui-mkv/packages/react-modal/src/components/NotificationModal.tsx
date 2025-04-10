import React, { ReactNode, useState } from 'react';
import { NotiParams, NotiType } from '../types';
import { Box, Flex, Text } from '@packages/ds-core';
import {
  FailColored,
  QuestionColored,
  SuccessColored,
  WarningColored,
} from '@packages/ds-icons';
import { ModalBody } from './ModalContent';
import { Button } from 'antd';

export interface NotificationProps extends NotiParams {
  id: string;
  onClose?: () => void;
}

const icons: Record<NotiType, ReactNode> = {
  confirm: <QuestionColored size={78} />,
  success: <SuccessColored size={78} />,
  warning: <WarningColored size={78} />,
  error: <FailColored size={78} />,
};

export const NotificationModalContent: React.FC<NotificationProps> = ({
  message,
  type,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onCancel,
  onConfirm,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <ModalBody style={{ width: 440, maxWidth: '100%' }}>
      <Flex direction="column" justify="center" align="center">
        <Box padding="s8">{icons[type]}</Box>
        <Box
          padding={['s2', 's32']}
          style={{
            textAlign: 'center',
          }}
        >
          <Text>{message}</Text>
        </Box>
      </Flex>
      <Box marginTop="s20">
        <Flex gapX="s20">
          {onCancel && (
            <Button
              ghost
              type="primary"
              block
              onClick={() =>
                onCancel?.({
                  close: onClose,
                  setLoading,
                })
              }
            >
              {cancelText}
            </Button>
          )}
          <Button
            type="primary"
            onClick={() =>
              onConfirm({
                close: onClose,
                setLoading,
              })
            }
            block
            loading={loading}
          >
            {confirmText}
          </Button>
        </Flex>
      </Box>
    </ModalBody>
  );
};
