import React, { useState, useEffect } from 'react';
import MainTextbox from './MainTextbox';
import PostButton from './PostButton';
import SendCommentButton from './SendCommentButton';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState({}); // Store comments by post ID

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: data,
        }));
        const selectedPost = posts.find((post) => post.post_id === postId);
        setSelectedPost(selectedPost);
        setSelectedPostId(postId);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="app-container">
      <header className="App-header">
        <div className="content">
          <div className="posts-list">
            {posts.map((post) => (
              <div key={post.post_id} className="post">
                <p>
                  <strong>User {post.user_id}:</strong> {post.content}
                </p>
                <small>
                  <em>
                    Posted on {new Date(post.created_at).toLocaleDateString()} at{' '}
                    {new Date(post.created_at).toLocaleTimeString()}
                  </em>
                </small>
                <br />
                <button onClick={() => fetchComments(post.post_id)}>View Post</button>
              </div>
            ))}
          </div>

          {selectedPost && (
            <div className="selected-post">
              <div className="post-details">
                <h3>Selected Post</h3>
                <p>
                  <strong>User {selectedPost.user_id}:</strong> {selectedPost.content}
                </p>
                <small>
                  <em>
                    Posted on {new Date(selectedPost.created_at).toLocaleDateString()} at{' '}
                    {new Date(selectedPost.created_at).toLocaleTimeString()}
                  </em>
                </small>
              </div>
              <div className="comments-section">
                <h4>Comments</h4>
                {comments[selectedPostId] && comments[selectedPostId].length > 0 ? (
                  comments[selectedPostId].map((comment) => (
                    <div key={comment.comment_id} className="comment">
                      <p>
                        <strong>User {comment.user_id}:</strong> {comment.content}
                      </p>
                      <small>
                        <em>
                          Commented on {new Date(comment.created_at).toLocaleDateString()} at{' '}
                          {new Date(comment.created_at).toLocaleTimeString()}
                        </em>
                      </small>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
                <div className="make-comment">
                  <textarea
                    id="makeComment"
                    placeholder="Add a comment..."
                    className="comment-textbox"
                  ></textarea>
                  <SendCommentButton
                    postId={selectedPostId}
                    refreshComments={() => fetchComments(selectedPostId)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="make-post">
          <MainTextbox />
          <PostButton refreshPosts={fetchPosts} />
        </div>
      </header>
    </div>
  );
}

export default App;
