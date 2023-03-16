import { Spinner, Text } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { useIsFetching, useIsMutating } from 'react-query';

export function Loading(): ReactElement {
  // will use React Query `useIsFetching` to determine whether or not to display
  const isFetching = useIsFetching();
  // useIsFetching은 현재 가져오기 상태인 쿼리 호출의 수를 나타내는 정수 값을 반환한다.
  // isFetching이 0보다 크면가져오기 상태인 호출이 존재하며 falsy하지 않은(truthy) 값이 되겠지.
  // 이 경우 아래 display가 inherit이 될꺼고, 이러면 로딩 스피너 표시 될것
  // 반면, 가져오는 데이터가 없다면 0이 되고, 0은 falsy한 값이므로
  // display가 none 이 되겠지

  const isMutating = useIsMutating();
  // 변이(mutating)가 진행중인 갯수를 숫자로 return 받는다

  const display = isFetching || isMutating ? 'inherit' : 'none';

  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="olive.200"
      color="olive.800"
      role="status"
      position="fixed"
      zIndex="9999"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      display={display}
    >
      <Text display="none">Loading...</Text>
    </Spinner>
  );
}
