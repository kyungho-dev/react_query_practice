import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useQuery } from 'react-query';

import type { Staff } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { filterByTreatment } from '../utils';

// for when we need a query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

interface UseStaff {
  staff: Staff[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export function useStaff(): UseStaff {
  // for filtering staff by treatment
  const [filter, setFilter] = useState('all');

  const selectFn = useCallback(
    (unfilteredStaff) => filterByTreatment(unfilteredStaff, filter),
    [filter],
  );

  // TODO: get data from server via useQuery
  const fallback = [];

  // 아래처럼 구조 분해 할당시
  // { data: staff  이런식으로 해주면, data라는걸 구조분해로 받은뒤에
  // staff 라는 이름에 담아준다.
  const { data: staff = fallback } = useQuery(queryKeys.staff, getStaff, {
    select: filter === 'all' ? undefined : selectFn,
  });

  return { staff, filter, setFilter };
}
