import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Banner from './Banner.js';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;

  const login = async () => {
    if (username === 'user' && password === 'password') {
      setIsLoggedIn(true); // Simulate successful login
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [apiUrl]);

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`${apiUrl}/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    fetchComments(post.post_id);
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`${apiUrl}/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Post deleted successfully');
        fetchPosts(); // Refresh the posts list
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Comment deleted successfully');
        fetchComments(selectedPost.post_id); // Refresh the comments list
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  

  const handleAddComment = async () => {
    const content = document.getElementById('makeComment').value.trim();

    if (!content) {
      alert('Comment cannot be empty!');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/posts/${selectedPost.post_id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,
          content,
        }),
      });

      if (response.ok) {
        console.log('Comment added successfully');
        document.getElementById('makeComment').value = '';
        fetchComments(selectedPost.post_id);
      } else {
        const errorText = await response.text();
        console.error('Failed to add comment. Response:', errorText);
        alert('Failed to add comment. Check console for details.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      alert('Post content cannot be empty!');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,
          content: postContent.trim(),
        }),
      });

      if (response.ok) {
        console.log('Post added successfully');
        setPostContent('');
        fetchPosts();
      } else {
        const errorText = await response.text();
        console.error('Failed to add post. Response:', errorText);
        alert('Failed to add post. Check console for details.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="app-container">
      {/* Banner Component with Login/Profile */}
      <Banner
        message="Welcome to The Brink!"
        isLoggedIn={isLoggedIn}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        login={login}
        logout={logout}
      />

      <header className="App-header">
        <div className="layout-container">
          <div className="empty-section"></div>
          <div className="posts-list">
            {posts.map((post, index) => (
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
                <button onClick={() => handleViewPost(post)}>View Post</button>
                <button onClick={() => handleDeletePost(post.post_id)}>Delete Post</button>
                {index !== posts.length - 1 && <hr className="post-separator" />}
              </div>
            ))}
          </div>
          {selectedPost && (
            <div className="post-comments-container">
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
              <div className="add-comment-section">
                <textarea
                  id="makeComment"
                  placeholder="Add a comment..."
                  className="comment-textbox"
                ></textarea>
                <button className="comment-button" onClick={handleAddComment}>
                  Comment
                </button>
              </div>
              <div className="comments-section">
              <h4>Comments</h4>
              <ul>
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <React.Fragment key={comment.comment_id}>
                      <li>
                        <strong>User {comment.user_id}:</strong> {comment.content}
                        <br />
                        <small>
                          {new Date(comment.created_at).toLocaleDateString()} at{' '}
                          {new Date(comment.created_at).toLocaleTimeString()}
                        </small>
                        {/* Add Delete Button */}
                        <button onClick={() => handleDeleteComment(comment.comment_id)}>
                          Delete Comment
                        </button>
                      </li>
                      {index !== comments.length - 1 && <hr className="comment-separator" />}
                    </React.Fragment>
                  ))
                ) : (
                  <li>No comments yet.</li>
                )}
              </ul>
            </div>
            </div>
          )}
        </div>
      </header>
      <div className="make-post">
        <textarea
          className="main-textbox"
          placeholder="Write a new post..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea>
        <button className="post-button" onClick={handleCreatePost}>
          Post
        </button>
      </div>
    </div>
  );
}

export default App;
