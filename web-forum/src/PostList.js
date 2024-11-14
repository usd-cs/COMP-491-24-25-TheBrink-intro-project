import React from 'react';

function PostList({ posts }) {
  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.post_id}>
            <strong>User {post.user_id}:</strong> {post.content}
            <br />
            <small>{new Date(post.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
