import { useState } from "react";

import { useQuery } from 'react-query';

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0"
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  // const data = [];

  // useQuery는 몇가지 인자를 가지는데,
  // 우선 첫번째 인자는 'QueryKey' 이다.  // Query 이름을 말한다.
  // 아래 예시에서 QueryKey(즉, 쿼리 이름)는 "posts" 이다.
  // 두번째 인자는 쿼리 함수이다. => 쿼리에 대한 데이터를 가져오는 방법에 대한 함수
  // 아래 예시에서는 "fetchPosts"라는 (위에 작성해놓은) 함수가 반환하는 데이터가
  // useQuery의 구조분해 할당으로 "data"에 할당이 된다.

  const {data} = useQuery("posts", fetchPosts)

  if (!data) return <></>;

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
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
