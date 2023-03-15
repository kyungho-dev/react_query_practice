import dayjs from 'dayjs';
import { useQuery } from 'react-query';

import type { Appointment, User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from './useUser';

// for when we need a query function for useQuery
async function getUserAppointments(
  user: User | null,
): Promise<Appointment[] | null> {
  if (!user) return null;
  const { data } = await axiosInstance.get(`/user/${user.id}/appointments`, {
    headers: getJWTHeader(user),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  // useUser의 user가 참인지 거짓인지에 따라 예약을 활성화할지 안할지 결정
  // user가 참이면 쿼리 함수(getUserAppointments)를 실행
  // 거짓이라면 실행하지 않음
  const { user } = useUser(); // useUser에서 user를 구조분해

  // 쿼리함수가 처음 실행되면 데이터가 undefined이므로
  // fallback 값을 지정해줘야한다.

  const fallback: Appointment[] = [];
  // 위처럼 fallback 값을 선언해주고 , 아래 data: userAppointments에 default value로 할당

  // 첫번째 인자는 쿼리키
  // 두번쨰 인자는 쿼리 함수인데, 쿼리 함수는 익명 함수를 사용한다.
  // 왜냐면 매개변수를 갖기 때문!
  const { data: userAppointments = fallback } = useQuery(
    'user-appointments',
    () => getUserAppointments(user),
    // user의 값이 참인지 거짓인지에 따라 실행 여부를 확인할
    // enabled 옵션 사용
    // user가 참이면 enabled 가 되고
    // 거짓이면 enabled가 되면 안됨
    // 여기서 그냥 user라고 쓰면 enabled에 오류가 생긴다
    // 왜냐하면 user는 User타입이고, enabled는 boolean 타입이여서
    // 이때 user 앞에 !를 붙여 !user를 하면 boolean이 되는데,
    // truthy가 falsy가 되므로 !를 하나 더 붙여줘서
    // user가 truthy 일때 truthy한 값을 보내주도록 한 것
    { enabled: !!user },
  );

  return userAppointments;
}
