import {useEffect, useState} from "react";

import {QueryClient, useQuery, useQueryClient} from 'react-query';

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  // 데이터 preFetching 을 위한 queryClient
  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      // prefetchQuery의 인수는 useQuery의 인수와 비슷하다.
      // 첫번째 인자로 쿼리키를 받는데, React Query가 캐시에 이미 데이터가 있는지를 여기서 확인한다.
      queryClient.prefetchQuery(["posts", nextPage], () => fetchPosts(nextPage));
    }
  }, [currentPage, QueryClient])

  // replace with useQuery
  // const data = [];

  // useQuery는 몇가지 인자를 가지는데,

  // 우선 첫번째 인자는 'QueryKey' 이다.  // Query 이름을 말한다.
  // 아래 예시에서 QueryKey(즉, 쿼리 이름)는 "posts" 이다.

  // 두번째 인자는 "쿼리 함수" 이다. => 쿼리에 대한 데이터를 가져오는 방법에 대한 함수
  // 아래 예시에서는 "fetchPosts"라는 (위에 작성해놓은) 함수가 반환하는 데이터가
  // useQuery의 구조분해 할당으로 "data"에 할당이 된다.

  // 세번째 인자는 "옵션" 이다.

  const { data, isError, error, isLoading } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
    staleTime: 2000,
    keepPreviousData: true  // 지난 데이터로 돌아갔을때, 캐시에 해당 데이터가 남아있도록 하는 옵션!!
  });
  // 세번째 인자는 옵션이고, staleTime은 밀리세컨드(ms) 기준이므로 2000이면 2초이다.
  // 위처럼 설정하면 블로그 게시물이 2초마다 만료되도록 설정한것!


  // isError, isLoading 은 boolean
  // error는 쿼리 함수에서 전달하는 오류를 반환

  if (isLoading) return <h3>Loading...</h3>;
  // 시도 횟수를 변경 할 수 있지만, reactQuery는 기본적으로 3번의 시도를 하고 안될 경우 error를 뱉는다.
  if (isError) return (
    <>
      <h3>Oops, something went wrong</h3>
      <p>{error.toString()}</p>
    </>
  );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage(previousValue => previousValue - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage(previousValue => previousValue + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
