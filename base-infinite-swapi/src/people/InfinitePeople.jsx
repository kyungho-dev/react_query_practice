import InfiniteScroll from "react-infinite-scroller";

import { useInfiniteQuery } from "react-query";

import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {

  // useInfiniteQuery를 구조분해 할당해서 data, fetchNextPage, hasNextPage 등을 받는데
  // data는 우리가 페이지를 계속 로드할 때 데이터의 페이지가 포함되는 곳
  // fetchNextPage는 더 많은 데이터가 필요할 때, 어느 함수를 실행할지를 InfiniteScroll에게 지시하는 역할
  // hasNextPage는 boolean값이고, 수집할 데이터가 더 있는지 확인

  // useInfiniteQuery()는 몇가지 인자를 받는데,
  // 우선 쿼리키를 받는다.
  // 그리고 useQuery처럼 쿼리 함수를 받는다.
  // 이 쿼리 함수는 객체 매개변수를 받고, 프로퍼티중 하나로 pageParam을 갖고 있다.
  // pageParam은 fetchNextPage가 어떻게 보일지 결정하고, 다음 페이지가 있는지 결정한다.
  // pageParam은 default value 를 주면 된다.
  // useInfiniteQuery를 처음 실행할 땐
  // pageParam이 설정돼 있지 않고, 기본값이 바로 initialUrl 이니까!
  // 그 다음은 getNextPageParam 옵션
  // 이 옵션은 lastPage를 가진 함수이고, allPage를 두번째 인자로 받을수 있지만, 잘 사용하지 않음
  // useInfiniteQuery의 세번째 인자인 hasNextPage는
  // (lastPage) => lastPage.next 의 반환값이 undefined인지에 따라 결정된다.
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isError, error } = useInfiniteQuery(
    "sw-people",
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined
    }
  );

  // TODO: get data for InfiniteScroll via React Query
  // useInfiniteQuery에는 두가지 정해진 프로퍼티가 있다.
  // loadMore 프로퍼티는 데이터가 더 필요할 때 불러온다.
  // useInfiniteQuery에서 나온 fetchNextPage 함수값을 이용한다.
  // hasMore 프로퍼티는 hasNextPage라고 하는데, useInfiniteQuery에서 나온
  // 객체를 해체한 값을 이용한다.

  if (isLoading) return <div className="loading">Loading...</div>
  if (isError) return <div>Error! {error.toString()}</div>

  return (
    <>
      {
        isFetching && <div className="loading">Loading...</div>
      }
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            )
          })
        })}
      </InfiniteScroll>
    </>)


}
