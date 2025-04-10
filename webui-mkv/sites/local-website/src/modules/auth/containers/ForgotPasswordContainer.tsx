import { Box, Flex, Text, styled } from '@packages/ds-core';
// import { Logo } from 'modules/_shared/components/Logo';
// import { ILoginWithPasswordPayload } from '../types';
import { ISecurityQuestionPayload } from '../types';
import { FormBuilder } from '@packages/react-form-builder';
import i18next, { t } from 'configs/i18next';
import { Button, Form } from 'antd';
import { LanguageDropDown } from 'modules/locale/containers';
import { useForm } from 'antd/es/form/Form';
import { useSecurityQuestion } from '../hooks';
import React, { useEffect } from 'react';
// import { use } from 'i18next';
export const ForgotPasswordContainer: React.FC = () => {
  const { loading, questionsList, securityQuestion, verifySecurityQuestion } = useSecurityQuestion();
  const [form] = useForm();
  const option_list_question_1 = questionsList.list_question_1.map((item) => ({
    label: t(item.text),
    value: item.id,
    text: item.text,
  }));
  const option_list_question_2 = questionsList.list_question_2.map((item) => ({
    label: t(item.text),
    value: item.id,
    text: item.text,
  }));
  const option_list_question_3 = questionsList.list_question_3.map((item) => ({
    label: t(item.text),
    value: item.id,
    text: item.text,
  }));
  const defaultValues = securityQuestion?.question_used || [];

  console.log('defaultValues',defaultValues);
  useEffect(() => {
    // Set the default values when the security question data is loaded
    form.setFieldsValue({
      ID1: defaultValues?.[0] || null,
      ID2: defaultValues?.[1] || null,
      ID3: defaultValues?.[2] || null,
    });
  }, [defaultValues, form]);

  const onFinish = (values: ISecurityQuestionPayload) => {
    const payload = {
      ...values,
      Question1: i18next.t(
        option_list_question_1.find((q) => String(q.value) === String(values.ID1))?.text || '',
        { lng: 'en' }
      ),
      Question2: i18next.t(
        option_list_question_2.find((q) => String(q.value) === String(values.ID2))?.text || '',
        { lng: 'en' }
      ),
      Question3: i18next.t(
        option_list_question_3.find((q) => String(q.value) === String(values.ID3))?.text || '',
        { lng: 'en' }
      ),
    };
  
    console.log('Payload to submit:', payload);
    verifySecurityQuestion(payload);
  };

  return (
    <Wrapper>
      <Form layout="horizontal" form={form} onFinish={onFinish}>
        <Flex justify="center" direction="column" align="center">
          <Box padding={['s16', 's8']}>
            <Text fontSize="l">{t('HeadForgotPassword')}</Text>
          </Box>
          <Box marginTop="s24">
            <FormBuilder<ISecurityQuestionPayload>
              asChild
              configs={{
                ID1: {
                  formType: 'select',
                  label: t('ListQuestion_1'),
                  options: option_list_question_1,
                  placeholder: t('Select_question'),
                  rules: [
                    {
                      required: true,
                      message: t('Select_question_Required'),
                    },
                  ],
                },
                Answer1: {
                  formType: 'input',
                  label: t('Answer'),
                  rules: [
                    {
                      required: true,
                      message: t('Select_answer_Required'),
                    },
                  ],
                },
                ID2: {
                  formType: 'select',
                  label: t('ListQuestion_2'),
                  options: option_list_question_2,
                  placeholder: t('Select_question'),
                  rules: [
                    {
                      required: true,
                      message: t('Select_question_Required'),
                    },
                  ],
                },
                Answer2: {
                  formType: 'input',
                  label: t('Answer'),
                  rules: [
                    {
                      required: true,
                      message: t('Select_answer_Required'),
                    },
                  ],
                },
                ID3: {
                  formType: 'select',
                  label: t('ListQuestion_3'),
                  options: option_list_question_3,
                  placeholder: t('Select_question'),
                  rules: [
                    {
                      required: true,
                      message: t('Select_question_Required'),
                    },
                  ],
                },
                Answer3: {
                  formType: 'input',
                  label: t('Answer'),
                  rules: [
                    {
                      required: true,
                      message: t('Select_answer_Required'),
                    },
                  ],
                },
              }}
              layouts={[
                {
                  name: 'ID1',
                  span: 24,
                  labelCol: { span: 6 },
                },
                {
                  name: 'Answer1',
                  span: 24,
                  labelCol: { span: 6 },
                  align: 'flex-end',
                },
                {
                  name: 'ID2',
                  span: 24,
                  labelCol: { span: 6 },
                },
                {
                  name: 'Answer2',
                  span: 24,
                  labelCol: { span: 6 },
                },
                {
                  name: 'ID3',
                  span: 24,
                  labelCol: { span: 6 },
                },
                {
                  name: 'Answer3',
                  span: 24,
                  labelCol: { span: 6 },
                },
              ]}
            />
            <Box marginTop="s20">
              <Button type="primary" block htmlType="submit" loading={loading}>
                {t('Answer_question')}
              </Button>
            </Box>
          </Box>
          <Box marginTop="s48">
            <Flex gap="s8" align="center">
              <Text fontSize="s">{t('selectLanguage')}</Text>
              <LanguageDropDown />
            </Flex>
          </Box>
        </Flex>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: inline-block;
  margin: auto;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spaces.s28};
  border-radius: 20px;
  width: 830px;
  max-width: 100%;
  box-sizing: border-box;
`;
