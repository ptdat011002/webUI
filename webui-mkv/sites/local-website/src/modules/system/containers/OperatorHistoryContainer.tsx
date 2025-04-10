import { Box, styled } from '@packages/ds-core';
import React, { useState } from 'react';
import { LogQueryForm } from '../components/LogQueryForm';
import { LogDataTable } from '../components/LogDataTable';
import { useLogs } from '../hooks/useLogs';
import { ILogQueries } from '../types/log_history';
import dayjs from "dayjs";

export interface OperatorHistoryContainerProps {
  className?: string;
}

const pageSize = 5;

const formatDate = (dateString: string): string => {
  return dayjs(dateString, "MM/DD/YYYY").format("YYYY-MM-DD");
};
const OperatorHistoryContainer: React.FC<
  OperatorHistoryContainerProps
> = () => {
  const [queries, setQueries] = useState<ILogQueries>({});

  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, data } = useLogs(queries);

  const handleSearch = (values) => {
    console.log("[handleSearch] values is ", values );
    const payload: ILogQueries = {
      // string(dd/mm/year)
      start_date: formatDate(values.start_date),
      end_date: formatDate(values.end_date),
      // string(hh/mm/ss)
      start_time: values.start_time,
      end_time: values.end_time,
      sub_type: values.sub_type ? values.sub_type : '',
    };
    setCurrentPage(1);
    setQueries(payload);
  };

  const displayLogs = (data?.logs ?? []).filter((_, index) => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return index >= start && index < end;
  });

  return (
    <Wrapper>
      <WrapperQuery>
        <LogQueryForm onSubmit={handleSearch} loading={isLoading} />
      </WrapperQuery>
      <Box marginBottom="s24" />
      <LogDataTable
        logs={displayLogs}
        loading={isLoading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        total={data?.logs.length}
      />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  width: 100%;
`;

const WrapperQuery = styled(Box)`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spaces.s16};
  border-radius: ${({ theme }) => theme.radius.r8};
`;
export default OperatorHistoryContainer;
