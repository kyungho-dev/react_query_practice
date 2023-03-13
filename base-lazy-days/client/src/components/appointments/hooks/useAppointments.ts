// @ts-nocheck
import dayjs from 'dayjs';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { QueryClient, useQuery, useQueryClient } from 'react-query';

import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from '../../user/hooks/useUser';
import { AppointmentDateMap } from '../types';
import { getAvailableAppointments } from '../utils';
import { getMonthYearDetails, getNewMonthYear, MonthYear } from './monthYear';

// useQuery와 prefetchQuery를 위한 공용 옵션
const commonOptions = {
  staleTime: 0, // 전역에는 600000(10분)으로 돼있는데 여기서 0으로 오버라이딩 해주는것 (리페칭이 필요한 데이터이므로)
  cacheTime: 300000, // 5분
};

// for useQuery call
async function getAppointments(
  year: string,
  month: string,
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

// types for hook return object
interface UseAppointments {
  appointments: AppointmentDateMap;
  monthYear: MonthYear;
  updateMonthYear: (monthIncrement: number) => void;
  showAll: boolean;
  setShowAll: Dispatch<SetStateAction<boolean>>;
}

// The purpose of this hook:
//   1. track the current month/year (aka monthYear) selected by the user
//     1a. provide a way to update state
// -> 1. 현재 연도와 현재 월을 추적하고, 사용자가 선택한 달을 monthYear라고 한다.
//   2. return the appointments for that particular monthYear
//     2a. return in AppointmentDateMap format (appointment arrays indexed by day of month)
//     2b. prefetch the appointments for adjacent monthYears
//  -> 2. 선택한 monthYear에 해당하는 appointments 반환
//  -> 2a. AppointmentDateMap 형식으로 반환
//  -> 2b. 선택한 monthYear의 이전달과 다음달의 appointments를 prefetching 한다.
//   3. track the state of the filter (all appointments / available appointments)
//     3a. return the only the applicable appointments for the current monthYear
//  -> 3. 필터의 상태를 추적 : 예약된 날짜를 포함해 모든 날짜를 표시하거나, 예약이 가능한 날짜만 보여주도록 필터링

export function useAppointments(): UseAppointments {
  /** ****************** START 1: monthYear state *********************** */
  // get the monthYear for the current date (for default monthYear state)
  const currentMonthYear = getMonthYearDetails(dayjs());

  // state to track current monthYear chosen by user
  // state value is returned in hook return object
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  // setter to update monthYear obj in state when user changes month in view,
  // returned in hook return object
  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  /** ****************** END 1: monthYear state ************************* */
  /** ****************** START 2: filter appointments  ****************** */
  // State and functions for filtering appointments to show all or only available
  const [showAll, setShowAll] = useState(false);

  // We will need imported function getAvailableAppointments here
  // We need the user to pass to getAvailableAppointments so we can show
  //   appointments that the logged-in user has reserved (in white)
  const { user } = useUser();

  const selectFn = useCallback(
    (data) => getAvailableAppointments(data, user),
    [user],
  );

  /** ****************** END 2: filter appointments  ******************** */
  /** ****************** START 3: useQuery  ***************************** */
  // useQuery call for appointments for the current monthYear

  // 얘를 훅 안에 선언해줘야 하는건 아니다.
  // const commonOptions = {
  //   staleTime: 0, // 전역에는 600000(10분)으로 돼있는데 여기서 0으로 오버라이딩 해주는것 (리페칭이 필요한 데이터이므로)
  //   cacheTime: 300000, // 5분
  // };

  // preFetch 구현하기
  const queryClient = useQueryClient();
  useEffect(() => {
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery(
      [queryKeys.appointments, nextMonthYear.year, nextMonthYear.month],
      () => getAppointments(nextMonthYear.year, nextMonthYear.month),
      commonOptions, // staleTime 과 cacheTime prefetch에 적용
      // 의존성 배열에도 추가
    );
  }, [queryClient, monthYear]);

  // Notes:
  //    1. appointments is an AppointmentDateMap (object with days of month
  //       as properties, and arrays of appointments for that day as values)
  //
  //    2. The getAppointments query function needs monthYear.year and
  //       monthYear.month
  // const appointments = {};
  const fallback = {};

  const { data: appointments = fallback } = useQuery(
    [queryKeys.appointments, monthYear.year, monthYear.month],
    () => getAppointments(monthYear.year, monthYear.month),
    // useQuery의 선택자 실행
    // select option은 함수
    // showAll 이 true 일때는 모든 데이터를 반환
    // false 일때는 selecteFn을 실행
    // select 함수는 원래 반환되었을 데이터를 가져와서
    // 변환한 다음 변환한 데이터를 반환한다.
    {
      select: showAll ? undefined : selectFn,
      ...commonOptions,
      // staleTime: 0, // 전역에는 600000(10분)으로 돼있는데 여기서 0으로 오버라이딩 해주는것 (리페칭이 필요한 데이터이므로)
      // cacheTime: 300000, // 5 minutes 그리고, 여기에 staleTime 과 cacheTime을 설정해주면
      // prefetch에도 staleTime과 cacheTime이 적용되므로 해당 부분은 공통 옵션으로 분리
      refetchOnMount: true, // 세 데이터를 모두 true로 해줌으로써 마운트, 리커넥트, 포커스 됐을때 모두 리페칭 일어나도록 설정
      refetchOnReconnect: true, // 세 데이터를 모두 true로 해줌으로써 마운트, 리커넥트, 포커스 됐을때 모두 리페칭 일어나도록 설정
      refetchOnWindowFocus: true, // 세 데이터를 모두 true로 해줌으로써 마운트, 리커넥트, 포커스 됐을때 모두 리페칭 일어나도록 설정
      // refetchInterval: 1000, // 매 초마다 리페칭// 실무에서는 절대 안됨!
      refetchInterval: 60000, // 1분으로 하는게 더 맞겠지
    },
  );

  /** ****************** END 3: useQuery  ******************************* */

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
