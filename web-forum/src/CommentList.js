import React from 'react';
 
const comment_image = (<img src = 'C:\Users\tiern\Senior Project\COMP-491-24-25-TheBrink-intro-project\web-forum\src\comment_icon.png' alt='comments' />);

function commentList({ comments }) {
  return (
    <div>
      <h2>Comments</h2>
      <li>
        <strong>User X:</strong> Test Post
            <br />
            <small>{new Date('December 17, 1995 03:24:00').toLocaleString()}</small>
            <br />
            <div>{comment_image}</div>      
        </li>
      <ul>
        {comments.map((comment) => (
          <li key={comment.comment_id}>
            <strong>User {comment.user_id}:</strong> {comment.content}
            <br />
            <small>{new Date(comment.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default commentList;
