import React from 'react';
 

function PostList({ posts }) {
  function showComments(){
    alert("comments button clicked");
  };
  
  return (
    <div className="post-list">
      <h2>Posts</h2>
      <li>
        <strong>User X:</strong> Test Post
            <br />
            <small>{new Date('December 17, 1995 03:24:00').toLocaleString()}</small>
            <br />
            <button onClick = {showComments}> Comments </button>
      </li>
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
