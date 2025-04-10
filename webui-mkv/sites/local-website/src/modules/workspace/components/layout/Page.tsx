import { Box, styled, Flex } from '@packages/ds-core';
import React from 'react';
import { Link } from 'react-router-dom';
import { CopyRight } from '../../../_shared/components/CopyRight';
import { PaddingWrapper } from 'modules/_shared';

export interface IBreadcrumb {
  title: string;
  path: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  extra?: React.ReactNode;
}

export interface PageProps {
  icon: React.ReactNode;
  children?: React.ReactNode;
  breadcrumbs?: IBreadcrumb[];
  className?: string;
  extra?: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({
  children,
  icon,
  breadcrumbs,
  extra,
}) => {
  return (
    <PageWrapper>
      <Wrapper>
        <PageHeader block>
          <Flex align="center" gap="s16" justify="space-between" block>
            <Flex align="center" gapX="s16">
              {icon}
              <Flex>
                {breadcrumbs?.map((breadcrumb, index) => (
                  <StyledLink
                    to={breadcrumb.path}
                    onClick={breadcrumb.onClick}
                    key={index}
                  >
                    {breadcrumb.title}
                  </StyledLink>
                ))}
              </Flex>
            </Flex>
            {extra}
          </Flex>
        </PageHeader>
        <Content>{children}</Content>
      </Wrapper>
      <CopyRight />
    </PageWrapper>
  );
};

const PageWrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 0 1.25rem 0.5rem 1.875rem;

  @media screen and (max-width: 1024px) {
    padding: 0.5rem;
  }
`;

const Wrapper = styled(Box)`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  /* min-height: calc(100% - 64px); */
`;

const PageHeader = styled(Flex)`
  height: 64px;
  line-height: 64px;
  align-items: center;
  padding: 0 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.l}px;
  width: 100%;

  @media screen and (max-width: 768px) {
    height: 56px;
    line-height: 56px;
    padding: 0 0.5rem;
  }
`;

const Content = styled(PaddingWrapper)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textPrimary};

  :hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  :not(:last-child) {
    ::after {
      content: '/';
      margin: 0 0.375rem;
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;
