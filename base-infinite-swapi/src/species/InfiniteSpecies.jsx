import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import {useInfiniteQuery} from "react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {

  const { data, hasNextPage, fetchNextPage, isFetching, isLoading, isError, error } = useInfiniteQuery(
    ["sw-species"],
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: lastPage => lastPage.next || undefined
    }
  )

  if (isLoading) return <div className="loading">Loading...</div>
  if (isError) return <div>Oops, it's an error : { error }</div>

  // TODO: get data for InfiniteScroll via React Query
  return (
    <>
      {
        isFetching && <div className="loading">Loading...</div>
      }
      <InfiniteScroll
        hasMore={hasNextPage}
        loadMore={fetchNextPage}
      >
        {
          data.pages.map(pageData => {
            return pageData.results.map(item => {
              return (
                <Species
                  key={item.name}
                  name={item.name}
                  language={item.language}
                  averageLifespan={item.average_lifespan}
                />
              )
            })
          })
        }
      </InfiniteScroll>
    </>
  )
}
