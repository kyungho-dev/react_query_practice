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

async function getUser(user: User | null): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
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
    () => getUser(user), //  두번째 인수는 쿼리 함수
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
  }

  return { user, updateUser, clearUser };
}
