import { useQuery, useMutation } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const { data, isLoading, isError, error } = useQuery(['comments', post.id], () => fetchComments(post.id));


  // 삭제 로직
  // useMutation은 mutate 함수(mutate()) 를 반환하게 된다.
  // useQuery와 달리 (첫번째 인자로) 쿼리키를 받지 않는다.
  // 함수에 인자를 넣을 수 있다. (useMutation((postId) => dele... 앞에 useMutation((이부분) =>
  const deleteMutation = useMutation((postId) => deletePost(postId));

  // Chap.18 퀴즈
  // update 로직
  const updateMutation = useMutation((postId) => updatePost(postId))

  if (isLoading) return <h3>Now Loading...</h3>;
  if (isError) return (
    <>
      <h3>the page went something wrong..</h3>
      <p> { error.toString() } </p>
    </>
  );

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {
        deleteMutation.isError && <p style={{color: 'red' }}>Error deleting the post</p>
      }
      {
        deleteMutation.isLoading && <p style={{color: 'purple' }}>Deleting the post</p>
      }
      {
        deleteMutation.isSuccess && <p style={{color: 'green' }}>Post has (not) been delete :) </p>
      }
      <button onClick={() => updateMutation.mutate(post.id)}>Update title</button>
      {
        updateMutation.isError && <p style={{color : 'red' }} > Update Error! </p>
      }
      {
        updateMutation.isLoading && <p style={{color : 'purple' }} > Now Updating! </p>
      }
      {
        updateMutation.isSuccess && <p style={{color : 'green' }} > Update Success! </p>
      }
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
