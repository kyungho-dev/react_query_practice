import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

// import { defaultQueryClientOptions } from '../react-query/queryClient';

// make a function to generate a unique query client for each test
const generateQueryClient = () => {
  return new QueryClient();
};

export function renderWithQueryClient(
  ui: ReactElement,
  client?: QueryClient,
): RenderResult {
  // 여기에서 렌더링 결과, 테스팅 라이브러리 렌더링 결과를 반환할 것
  // 이 함수의 역할은 그 결과를 아직 얻지 못했을 경우 , 쿼리 클라이언트를 생성하는 것
  // 따라서 queryClient를 알 수 없는 경우 client와 동일하게 설정하거나
  // 아니면 client를 알 수 있는 경우 generateQueryClient를 실행해
  // 새로 생성
  const queryClient = client ?? generateQueryClient();

  // 우선 provider를 render해줘야하는데
  // 이 provider는 ui를 queryClient와 래핑한다.
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrapper = (): React.FC => {
  const queryClient = generateQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
