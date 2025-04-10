import React from 'react';
import { Box, Flex, styled, Text } from '@packages/ds-core';
import { ISearchByNameOrId } from '../types';
import { useForm } from 'antd/es/form/Form';
import { Button } from 'antd';
import { t } from 'i18next';
import { FormBuilder } from '@packages/react-form-builder';

export interface AiHeaderProps {
  className?: string;
  actions: React.ReactNode;
  onSearch?: (value: ISearchByNameOrId) => void;
  loading?: boolean;
}

export const AiHeader: React.FC<AiHeaderProps> = ({
  className,
  actions,
  onSearch,
  loading,
}) => {
  const [form] = useForm();

  return (
    <Wrapper className={className} direction={'column'} gapY={'s8'}>
      <Text>{t('search')}</Text>
      <Flex
        direction="row"
        justify="space-between"
        align={'end'}
        flexWrap="wrap"
        gap="s8"
      >
        <Flex direction="row" align="start" gapX="s12" justify="start">
          <FormWrapper>
            <FormBuilder<ISearchByNameOrId>
              form={form}
              onSubmit={onSearch}
              configs={{
                keyword: {
                  formType: 'input',
                  placeholder: t('searchByKeywordOrId'),
                },
              }}
              layouts={[
                {
                  name: 'keyword',
                  flex: 1,
                },
              ]}
            />
          </FormWrapper>
          <Button
            type="primary"
            htmlType="submit"
            onClick={form.submit}
            loading={loading}
            style={{
              width: 120,
            }}
          >
            {t('search')}
          </Button>
        </Flex>
        <Box paddingBottom={'s20'}>{actions}</Box>
      </Flex>
    </Wrapper>
  );
};

const FormWrapper = styled.div``;

const Wrapper = styled(Flex)`
  padding: 1rem 1rem 0.25rem 1rem;
  box-sizing: border-box;
  border-radius: 12px;
  background-color: #333333;

  @media screen and (max-width: 768px) {
    padding: 0.75rem;
  }
`;
