import { createStandaloneToast } from '@chakra-ui/react';
import { QueryClient } from 'react-query';

import { theme } from '../theme';

const toast = createStandaloneToast({ theme });

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();
  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}

// to satisfy typescript until this file has uncommented contents
// QueryClient()에 몇가지 옵션을 추가!
// 여기에서 error 처리를 해주기 떄문에, 각각의 queryClient에서 에러 처리 해주지
// 않아도 되는것! 즉, 전역 처리 해놓은것이다.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      staleTime: 600000, // 10 minutes
      cacheTime: 900000, // 15minutes
      refetchOnMount: false, // staleTime과 cacheTime
      refetchOnReconnect: false, // 그리고 여기 refetch 세가지 옵션들 설정해서
      refetchOnWindowFocus: false, // 전역으로 refetch 관리하는것
      // 위처럼 설정해주면 리페칭이 자주 일어나지 않을 것
      // 그러므로, 이런 설정은 정보의 변동이 적거나
      // 사용자 세션 동안 정보 변동이 거의 없는 데이터에 사용하기 좋다
    },
  },
});
