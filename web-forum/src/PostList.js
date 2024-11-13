import React from 'react';
 

function PostList({ posts }) {
  return (
    <div className="post-list">
      <h2>Posts</h2>
      <li>
        <strong>User X:</strong> Test Post
            <br />
            <small>{new Date('December 17, 1995 03:24:00').toLocaleString()}</small>
            <br />
            <img src = 'C:\Users\tiern\Senior Project\COMP-491-24-25-TheBrink-intro-project\web-forum\src\comment_icon.png' alt = 'comments'/>
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
