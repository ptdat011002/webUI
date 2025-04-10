import React, { useEffect } from 'react';
import { Box, Flex, Spinner, styled, Text } from '@packages/ds-core';
import { useWarningList } from '../hooks';
import { IWarningData } from '../types';
import { Image } from 'antd';
import { CalendarEventOutlined } from '@packages/ds-icons';

export interface WarningContainerProps {
  className?: string;
}

export const WarningContainer: React.FC<WarningContainerProps> = ({
  className,
}) => {
  const { loading, data, actionLoading, triggerReload } = useWarningList();

  // Client check định kỳ với chu kỳ < 30s
  useEffect(() => {
    const interval = setInterval(triggerReload, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading || actionLoading) return <Spinner />;

  return (
    <Wrapper className={className} padding="s8">
      {data?.event_lists.length === 0 && (
        <Flex
          justify="center"
          align="center"
          style={{
            height: '100%',
          }}
        >
          <Text color="textSecondary">{'No warning'}</Text>
        </Flex>
      )}
      {(data?.event_lists || []).map((item) => (
        <Flex direction="column" key={item.information? (item.information.person_id? item.information.person_id : item.sub_type) : item.sub_type}>
          <WithPadding>
            <WarningItem data={item} />
          </WithPadding>
          <Divider />
        </Flex>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 85%;
  padding: 1rem 0;
`;

const WithPadding = styled.div`
  padding: 0 1rem;
`;

const Divider = styled.div`
  height: 1px;
  border-bottom: 1px solid #0c1c23;
  width: 100%;
`;

interface WarningItemProps {
  data: IWarningData;
}

const WarningItem: React.FC<WarningItemProps> = ({ data }) => {
  return (
    <Box padding={['s12', 's2']}>
      <Flex direction="row" gapX="s16">
        {/*Ko co ảnh*/}
        <ImageWrapper
          // check if image is undefined -> base64 image else show default image
          src={
            data.information?.image
              ? `data:image/png;base64,${data.information.image}`
              : '/logo.svg'
          }
          width="33%"
          preview={false}
        />
        <Flex direction="column" gapY={'s2'}>
          <Text fontWeight="500" fontSize="l">
            {data.main_type} : {data.sub_type}
          </Text>
          <Text fontWeight="400" fontSize="m">
          {data.information?.name ? data.information.name : ""}
          </Text>
          <Flex direction="column" gapY="s10">
            <Flex align="center" gapX="s8">
              <CalendarEventOutlined />
              <Text fontWeight="400" fontSize="m">
                {data.start_date} - {data.start_time}
              </Text>
            </Flex>
          </Flex>
          <Text fontWeight="300" fontSize="s">
          {data.information?.person_id ? data.information.person_id : ""}
          </Text>
        </Flex>
        {/*{!data.isRead && <Badge>{'New'}</Badge>}*/}
      </Flex>
    </Box>
  );
};

const ImageWrapper = styled(Image)`
  aspect-ratio: 4 / 3;
  object-fit: contain;
  border: 2px solid #0c1c23;
  border-radius: 6px;
`;

// const Badge = styled.span`
//   margin-left: auto;
//   height: fit-content;
//   padding: 4px 10px;
//   display: inline-flex;
//   border-radius: 9999px;
//   background-color: ${({ theme }) => theme.colors.error};
//   justify-content: center;
//   align-items: center;
//   color: ${({ theme }) => theme.colors.textPrimary};
//   font-weight: 500;
//   font-size: 15;
// `;
