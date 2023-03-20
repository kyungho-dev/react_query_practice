import jsonpatch from 'fast-json-patch';
import { UseMutateFunction, useMutation } from 'react-query';
import { useCustomToast } from '../../app/hooks/useCustomToast';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): UseMutateFunction<
  User,
  unknown,
  User,
  unknown
> {
  const { user, updateUser } = useUser();
  const toast = useCustomToast();

  // mutate가 newUserData를 인수로 받아서 그걸 patchUserOnServer로 넘기는데
  // useUser 훅에 있던 원본 사용자 데이터 (두번째 인자인 user)와 함께
  const { mutate: patchUser } = useMutation(
    (newUserData: User) => patchUserOnServer(newUserData, user),
    // 그리고 onSuccess를 만들어줌
    // onSuccess 에서 해줄건 서버에서 받은 응답으로
    // 위에 useUser에서 만든 updateUser해주는것
    // onSuccess는 mutate 함수에서 반환된 모든 값을 인자로 받는다.
    {
      // mutate함수에서 반환된 응답인 userData를
      // 인자로 받아서 그 userData를 updateUser에 업데이트 해주는것
      onSuccess: (userData: User | null) => {
        // 사용자가 null 인 경우 바로 toast
        if (user) {
          updateUser(userData);
          toast({
            title: 'User updated!',
            status: 'success',
          });
        }
      },
    },
  );

  return patchUser;
}
