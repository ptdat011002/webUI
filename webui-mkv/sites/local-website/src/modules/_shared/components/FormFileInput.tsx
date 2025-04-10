import { Box, styled } from '@packages/ds-core';
import { UploadOutlined } from '@packages/ds-icons';
import { Input, InputRef } from 'antd';
import React, { useImperativeHandle, useRef } from 'react';

export interface FormFileInputProps {
  id?: string;
  value?: File;
  onChange?: (file?: File) => void;
  className?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  config?: every;
  accept?: string;
  maxLength?: number;
  placeholder?: string;
  suffixIcon?: React.ReactNode;
  onClick?: () => void;
  isUseInputClick?: boolean;
}

export const FormFileInput = React.forwardRef<
  HTMLInputElement,
  FormFileInputProps
>(
  (
    {
      className,
      onChange,
      value,
      id,
      onClick,
      isUseInputClick = true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      config,
      accept,
      maxLength = 100,
      placeholder,
      suffixIcon = <UploadOutlined />,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const titleRef = useRef<InputRef | null>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const file = e.target.files?.[0];
      if (onChange && !!file) {
        onChange(file);
      }
    };

    const valueName =
      (value as every)?.name?.length > maxLength
        ? value?.name.slice(0, maxLength - 20) + '...' + value?.name.slice(-10)
        : value?.name;

    return (
      <Wrapper
        className={className}
        {...props}
        onClick={() => {
          onClick?.();
          if (isUseInputClick) inputRef.current?.click();
        }}
      >
        <input
          type="file"
          hidden
          onChange={onFileChange}
          name={id}
          ref={inputRef}
          className="input-file"
          accept={accept}
        />
        <Input
          value={valueName}
          readOnly
          suffix={suffixIcon}
          ref={titleRef as every}
          placeholder={placeholder}
        />
      </Wrapper>
    );
  },
);

FormFileInput.displayName = 'FormFileInput';

const Wrapper = styled(Box)`
  position: relative;

  .input-file {
    display: none !important;
  }

  cursor: pointer;

  input {
    // ellipse the text
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
