import React, { useCallback, useMemo, useState } from 'react';
import { Box, Flex, Text } from '@packages/ds-core';
import {
  ModalWrapper,
  Pagination,
  useAPIErrorHandler,
  useMedia,
} from 'modules/_shared';
import { FaceConfigForm } from '.';
import { Button, Col, Empty, message, Row } from 'antd';
import { t } from 'configs/i18next';
import { Page } from '../../workspace/components';
import { useModal } from '@packages/react-modal';
import { IFaceConfig, ISearchByNameOrId, ISearchFacePayload } from '../types';
import { useAiSearchFace } from '../hooks';
import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox';
import { aiService } from '../service.ts';
import { AiOutlined } from '@packages/ds-icons';
import { menuIconSize } from '../../../configs/theme.tsx';
import { routeKeys, routeNames } from '../../../configs/constants';
import { AiHeader } from './AIHeader.tsx';
import { AiFaceItem } from './AiFaceItem.tsx';
import _ from 'lodash';

const PAGE_SIZE = 16;

export const AiFaceList: React.FC = () => {
  const modal = useModal();
  const { handlerError } = useAPIErrorHandler();
  const [queries, setQueries] = useState<ISearchFacePayload>({});
  const {
    searchData: data,
    removeFace,
    isFetching,
    updateFace,
  } = useAiSearchFace(queries);

  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const showedData = useMemo(() => {
    return data?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) || [];
  }, [data, page]);

  const handleSearch = (newData: ISearchByNameOrId) => {
    setPage(1);
    if (!newData.keyword) {
      setQueries({});
    } else {
      setQueries({ name: newData.keyword });
    }
  };

  const handleSelectAll = useCallback(
    (value: CheckboxChangeEvent) => {
      if (!value.target.checked) {
        setSelectedIds([]);
        return;
      }

      const newSelectedIds = _.compact(data?.map((item) => item.face_id));

      setSelectedIds(newSelectedIds);
    },
    [data],
  );

  const isSelectAll = useMemo(() => {
    return (
      selectedIds.length > 0 &&
      data?.length === selectedIds.length &&
      data?.length > 0
    );
  }, [selectedIds, data]);

  const handleOnRemove = useCallback(async (faceIds: number[]) => {
    if (faceIds.length === 0) {
      return;
    }

    modal.confirm({
      title: t('notification'),
      message: (
        <Text color="dark">
          {faceIds.length === 1
            ? t('are_you_sure_want_to_delete_person')
            : t('are_you_sure_want_to_delete_group')}
        </Text>
      ),
      onConfirm: async ({ close, setLoading }) => {
        try {
          setLoading(true);
          await removeFace({
            count: faceIds.length,
            faceInfo: _.compact(faceIds),
          });
          close();
        } catch (e) {
          handlerError(e);
        } finally {
          setLoading(false);
        }
      },
    });
  }, []);

  const { mode } = useMedia();

  const onSubmit = async (values: IFaceConfig) => {
    await aiService.addFace({
      count: 1,
      faceInfo: [values],
    });
  };
  const onRequestAddFace = () => {
    modal.show({
      title: t('add_new_face'),
      destroyOnClose: true,
      render: (_, close) => {
        return (
          <ModalWrapper>
            <Box
              style={{
                width: 500,
                minHeight: 200,
                boxSizing: 'border-box',
                maxWidth: '100%',
              }}
              padding="s16"
            >
              <FaceConfigForm
                onCancel={() => close?.()}
                onSubmit={async (v) => {
                  try {
                    await onSubmit(v);
                    message.success(
                      t('action_success', {
                        action: t('add_new_face'),
                      }),
                    );
                  } catch (e) {
                    handlerError(e);
                  } finally {
                    close?.();
                  }
                }}
                initialValues={{
                  sex: 1,
                }}
              />
            </Box>
          </ModalWrapper>
        );
      },
    });
  };
  return (
    <Page
      icon={<AiOutlined size={menuIconSize} />}
      breadcrumbs={[
        {
          title: routeNames.ai,
          path: routeKeys.ai,
        },
        {
          title: routeNames.ai_recognition,
          path: routeKeys.ai_recognition,
        },
      ]}
      extra={
        <Button
          disabled={isFetching}
          size="middle"
          type="primary"
          style={{
            width: mode === 'mobile' ? 100 : 150,
          }}
          onClick={onRequestAddFace}
        >
          {t('add_new')}
        </Button>
      }
    >
      <div>
        <Box marginTop="s16">
          <AiHeader
            loading={isFetching}
            onSearch={handleSearch}
            actions={
              <Flex justify="end" align={'center'}>
                <Checkbox
                  onChange={handleSelectAll}
                  checked={isSelectAll}
                  disabled={isFetching}
                >
                  {t('selectAll')}
                </Checkbox>

                {selectedIds.length > 0 && (
                  <Button
                    onClick={() => handleOnRemove(selectedIds)}
                    type={'primary'}
                    ghost
                    disabled={isFetching}
                  >
                    {t('delete')}
                  </Button>
                )}
              </Flex>
            }
          />
        </Box>

        <Box marginTop="s16">
          <Row gutter={[16, 32]}>
            {showedData.length === 0 && (
              <Box
                margin="s8"
                padding="s16"
                style={{
                  width: '100%',
                  backgroundColor: '#333',
                  borderRadius: '8px',
                }}
              >
                <Empty
                  description={<Text color="light">{t('no_data')}</Text>}
                />
              </Box>
            )}
            {showedData.map((item) => (
              <Col
                key={item.face_id}
                xxl={3}
                xl={4}
                lg={6}
                md={8}
                sm={12}
                xs={12}
              >
                <AiFaceItem
                  disabled={isFetching}
                  faceInfo={item}
                  isSelected={
                    item.face_id ? selectedIds.includes(item.face_id) : false
                  }
                  onUpdateFace={updateFace}
                  onSelectItem={(isSelected) => {
                    if (!item.face_id) {
                      return;
                    }

                    if (isSelected) {
                      setSelectedIds([...selectedIds, item.face_id]);
                    } else {
                      setSelectedIds(
                        selectedIds.filter((id) => id !== item.face_id),
                      );
                    }
                  }}
                  onRemove={async () => {
                    if (!item.face_id) {
                      return;
                    }

                    return await handleOnRemove([item.face_id]);
                  }}
                />
              </Col>
            ))}
          </Row>
        </Box>

        <Box marginTop="s16">
          <Flex justify="end">
            <Pagination
              current={page}
              onChange={(page) => setPage(page)}
              pageSize={PAGE_SIZE}
              total={data?.length || 0}
              disabled={isFetching}
            />
          </Flex>
        </Box>
      </div>
    </Page>
  );
};
