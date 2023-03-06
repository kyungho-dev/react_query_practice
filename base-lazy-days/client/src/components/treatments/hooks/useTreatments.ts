import { useQuery } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  // const toast = useCustomToast();

  const fallback = [];
  // 빈 배열을 만들어 준 후, 아래처럼 해주면 data의 default 값이 fallback이 되는 것
  // const { data = fallback } = useQuery(queryKeys.treatments, getTreatments, {
  //   onError: (error) => {
  //     // error가 어느 타입이든 올 수 있기 때문에 error의 타입을 확인하는 과정이 필요
  //     const title =
  //       error instanceof Error // error가 자바스크립트 Error 클래스의 인스턴스 라면?
  //         ? error.message
  //         : 'error connecting to server';
  //     // 그리고 toast를 호출한 후 몇가지 옵션
  //     toast({ title, status: 'error' });
  //   },
  // });

  // queryClient에서 만든 에러 핸들러 사용하기 위해 onError 제거
  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments);
  return data;
}
