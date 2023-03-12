import { useQuery, useQueryClient } from 'react-query';

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
  // refetching 설정을 위한 세번째 인자 추가
  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments, {
    staleTime: 600000, // 10 minutes
    // 참고로 캐싱타임의 기본값은 5분이다.
    // 만료시간이 캐싱시간보다 긴 것은 말이 안된다.
    // 만료된 데이터를 불러오는 동안 캐싱에 백업된 내용이 보여질 것.
    // 그러므로 캐싱시간도 늘려줘야함.
    cacheTime: 900000, // 15 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return data;
}

export function usePrefetchTreatments(): void {
  // preFetch를 하는 것은
  // 캐시를 채우는 것이 목적이기 때문에 void형태로.
  // 아무것도 반환하지 않는다.
  // React Query의 useQueryClient 훅을 사용한다.
  // 그러면 query Provider 에서 프로퍼티로 사용한
  // query Client가 반환된다.
  // queryClient를 가져온 다음 prefetchQuery를 실행하면 되는데,
  const queryClient = useQueryClient();
  // prefetchQuery로 쿼리키를 사용(위에 사용한 useQuery의 키와 같은걸 사용)
  // 여기에서 키는 캐시에서 어느 useQuery가 이 데이터를 찾아야 하는지 알려주므로
  // 매우 중요하다
  queryClient.prefetchQuery(queryKeys.treatments, getTreatments, {
    staleTime: 600000,
    cacheTime: 900000, // prefetch 옵션에 staleTime과 cacheTime 옵션을 추가해주면
    // prefetching이 staleTIme과 cacheTime을 참조하여, 데이터의 새로 고침 여부를 결정하게 된다.
  });
}
// 이렇게 만든 훅을 Home에서 사용할것
