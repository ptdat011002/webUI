import { Text } from '@packages/ds-core';
import { useCountdown } from '@packages/react-helper';
import { t } from 'configs/i18next';
import React from 'react';

export interface DelayMessageProps {
  className?: string;
  /**
   * unit: second
   */
  delay?: number;
  message?: React.ReactNode;
}

export const DelayMessage: React.FC<DelayMessageProps> = ({
  delay = 5,
  message,
}) => {
  const [show, setShow] = React.useState(true);

  useCountdown(delay, {
    onEnd: () => {
      setShow(true);
    },
  });

  if (!show) return null;

  const defaultMessage =
    message ||
    t('action_success', {
      action: t('save'),
    });
  return message ?? <Text>{defaultMessage}</Text>;
};
