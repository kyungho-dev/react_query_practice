import { AxiosResponse } from 'axios';
import { useQuery, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

async function getUser(
  user: User | null,
  signal: AbortSignal,
): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
      signal,
    },
  );
  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const queryClient = useQueryClient();

  // const user = null;
  // data: user 해줌으로써 data라는걸 구조분해할당받고 그걸 user라는 이름으로
  // rename 해준것
  const { data: user } = useQuery(
    queryKeys.user, // 첫번째 인수는 쿼리키,
    ({ signal }) => getUser(user, signal), //  두번째 인수는 쿼리 함수
    {
      initialData: getStoredUser, // 초기값(initialData를 함수로 할당)
      onSuccess: (received: User | null) => {
        // onSuccess는 쿼리 함수(여기서는 getUser가 쿼리 함수)나 setQueryData에서 데이터를 가져오는 함수이다.
        // received가 User인 경우는
        // null 이면 사용자 스토리지에 있던 사용자 정보를 지우겠다는 뜻(clearUser 실행시)
        if (!received) {
          // received 가 falsy 하다면 clearStoredUser 함수를 실행
          // user-storage에서 export 해준 함수
          clearStoredUser();
        } else {
          // received 를 쿼리 함수 (여기서는 getUser)나 updateUser에서
          // truthy 한 값을 받을 경우에는 해당 값을 로컬 스토리지로 저장
          setStoredUser(received);
        }
      },
    },
  );

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // default 값을 설정해주기 위해 setQueryData 메서드 실행
    // 설정하려는 쿼리키의 쿼리키를 인자로 준다
    queryClient.setQueryData(queryKeys.user, newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // 유저가 로그아웃 한 경우
    // 마찬가지로 같은 쿼리 키값을 주지만, value를 null로 주는것
    queryClient.setQueryData(queryKeys.user, null);
    // 사용자가 로그아웃 할 때 , useAuth에서 호출한 clearUser가
    // 쿼리 데이터를 null로 설정해서 onSuccess를 트리거 할 뿐만 아니라, (여기서 onSuccess는 저 위에 useQuery의 onSuccess)
    // clearStoredUser()를 통해 로컬 스토리지로부터 사용자를 지운다. 그리고 여기서 추가로 removeQueries를 실행
    // 사용하는 인자는 하나인데, 쿼리키를 사용한다.
    // 여기서는 useUserAppointments에서 사용했던
    // 'user-appointments' 이다.
    // queryClient.removeQueries('user-appointments');
    queryClient.removeQueries([queryKeys.appointments, queryKeys.user]);
  }

  return { user, updateUser, clearUser };
}
