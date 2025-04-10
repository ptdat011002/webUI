import React, { ReactNode } from 'react';
import { Button } from 'antd';
import { useTheme } from '@packages/ds-core';

export interface OutlineButtonProps {
  className?: string;
  onClick?: () => void;
  label: ReactNode;
  htmlType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
  className,
  onClick,
  label,
  htmlType,
  loading,
}) => {
  const theme = useTheme();

  return (
    <Button
      ghost
      onClick={onClick}
      className={className}
      htmlType={htmlType}
      loading={loading}
      style={{
        color: theme.colors.primary,
        background: 'transparent',
        borderColor: theme.colors.primary,
      }}
    >
      {label}
    </Button>
  );
};
