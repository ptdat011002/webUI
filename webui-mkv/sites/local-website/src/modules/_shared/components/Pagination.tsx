import React from 'react';
import { Pagination as BasePagination, PaginationProps } from 'antd';
import { styled } from '@packages/ds-core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@packages/ds-icons';

export const Pagination: React.FC<PaginationProps> = (props) => {
  return (
    <Wrapper>
      <BasePagination
        showSizeChanger={false}
        itemRender={(page, type, element) => {
          if (type === 'prev') {
            return (
              <PaginationItem>
                <ChevronLeftOutlined />
              </PaginationItem>
            );
          }
          if (type === 'next') {
            return (
              <PaginationItem>
                <ChevronRightOutlined />
              </PaginationItem>
            );
          }
          if (type === 'jump-next') {
            return <PaginationItem>...</PaginationItem>;
          }

          if (type === 'jump-prev') {
            return <PaginationItem>...</PaginationItem>;
          }

          if (type === 'page') {
            return <PaginationItem>{page}</PaginationItem>;
          }
          return element;
        }}
        {...props}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .ant-pagination-item {
    border: none;
    border-radius: unset;
    background-color: transparent;
  }
  .ant-pagination-item-active div {
    background-color: ${({ theme }) => theme.colors.primary} !important;
  }
`;

const PaginationItem = styled.div`
  border-radius: 9999px !important;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 9999px;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
