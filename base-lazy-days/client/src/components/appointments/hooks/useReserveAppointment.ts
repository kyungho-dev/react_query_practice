import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from '../../user/hooks/useUser';

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined,
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update type for React Query mutate function
// type AppointmentMutationFunction = (appointment: Appointment) => void;

// useMutateFunction의 제네릭으로 설정하는 타입
// 첫번째 : mutate 함수에서 반환된 데이터 -> void
// 두번째 : Error 타입으로 -> unknown -> onError 핸들러 확인
// 세번째 : mutate 함수에서 내부의 함수(아래에서는 setAppointmentUser)로
//  보내줄 변수 -> 여기서는 Appointment 타입! (위에서 import 해온 타입임)
// 마지막은 컨텍스트 타입 : 우선 unknown으로 해두고
// 다음에 optimistic update(낙관적 업데이트) 할떄 채워 넣을 예정
export function useReserveAppointment(): UseMutateFunction<
  void,
  unknown,
  Appointment,
  unknown
> {
  const { user } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  // return에서 mutate 함수를 구조 분해 할당
  //  useMutation 에는 쿼리키 필요 없다.
  // 중요! 캐시에 있는 쿼리와는 관련 없음!
  // 변이 함수만 있으면 된다!
  const { mutate } = useMutation(
    (appointment: Appointment) => setAppointmentUser(appointment, user?.id),
    {
      // mutate시 리페치 트리거를 위한 onSuccess 핸들러 추가
      onSuccess: () => {
        // invalidQueires에도 첫번째 인자는 쿼리키
        // 그렇다면 어떤 쿼리키를 무효화 해야할까?
        // queryKeys.appointments 쿼리를 무효화 할 것
        queryClient.invalidateQueries([queryKeys.appointments]);
        // toast 추가
        toast({
          title: 'you have reserved appointment!',
          status: 'success',
        });
      },
    },
  );

  return mutate;
}
