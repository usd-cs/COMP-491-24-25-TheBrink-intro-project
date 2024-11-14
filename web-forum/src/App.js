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
  const [userType, setUserType] = useState(''); // Track user type: "guest", "user", or "admin"

  const apiUrl = process.env.REACT_APP_API_URL;

  const login = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (!data.success) {
        alert(data.message || 'Login failed.');
        return;
      }
  
      setIsLoggedIn(true);
      setUsername(data.username);
      setUserType(data.userType);
      localStorage.setItem('token', data.token); // Save token to localStorage
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };  

  const logout = () => {
    if (!isLoggedIn) {
      alert('No one is logged in. Please log in first.');
      return;
    }
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setUserType(''); // Reset user type
  };

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data); // Update state with fetched posts
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
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
    if (userType !== 'admin') {
      alert('Only admins can delete posts.');
      return;
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass token from localStorage
        },
      });
  
      if (response.ok) {
        console.log('Post deleted successfully');
        await fetchPosts(); // Refresh the posts list
        if (selectedPost && selectedPost.post_id === postId) {
          setSelectedPost(null); // Clear the selected post
          setComments([]); // Clear the comments
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to delete post:', errorText);
        alert(`Failed to delete post: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post.');
    }
  };
  
  
  const handleDeleteComment = async (commentId) => {
    if (userType !== 'admin') {
      alert('Only admins can delete comments.');
      return;
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass token from localStorage
        },
      });
  
      if (response.ok) {
        console.log('Comment deleted successfully');
        await fetchComments(selectedPost.post_id); // Refresh comments list
      } else {
        const errorText = await response.text();
        console.error('Failed to delete comment:', errorText);
        alert(`Failed to delete comment: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment.');
    }
  };
  
  const handleAddComment = async () => {
    if (!isLoggedIn) {
      alert('You must be logged in to comment.');
      return;
    }
  
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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content }),
      });
  
      if (response.ok) {
        const newComment = await response.json();
        document.getElementById('makeComment').value = '';
        setComments((prevComments) => [...prevComments, newComment]); // Add the new comment with username to the list
      } else {
        const errorText = await response.text();
        console.error('Failed to add comment:', errorText);
        alert(`Failed to add comment: ${errorText}`);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment.');
    }
  };  
  
  const handleCreatePost = async () => {
    if (!isLoggedIn) {
      alert('You must be logged in to post.');
      return;
    }
  
    if (!postContent.trim()) {
      alert('Post content cannot be empty!');
      return;
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: postContent.trim() }),
      });
  
      if (response.ok) {
        const newPost = await response.json();
        setPostContent('');
        setPosts((prevPosts) => [newPost, ...prevPosts]); // Add the new post with username to the top of the list
      } else {
        const errorText = await response.text();
        console.error('Failed to add post:', errorText);
        alert(`Failed to add post: ${errorText}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post.');
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
                  <strong>{post.username}:</strong> {post.content}
                </p>
                <small>
                  <em>
                    Posted on {new Date(post.created_at).toLocaleDateString()} at{' '}
                    {new Date(post.created_at).toLocaleTimeString()}
                  </em>
                </small>
                <br />
                <button onClick={() => handleViewPost(post)}>View Post</button>
                <button
                  onClick={() => handleDeletePost(post.post_id)}
                  disabled={userType !== 'admin'} // Disable if the user is not an admin
                >
                  Delete Post
                </button>
                {index !== posts.length - 1 && <hr className="post-separator" />}
              </div>
            ))}
          </div>
          {selectedPost && (
            <div className="post-comments-container">
              <h3>Selected Post</h3>
              <p>
                <strong> {selectedPost.username}:</strong> {selectedPost.content}
              </p>
              <small>
                <em>
                  Posted on {new Date(selectedPost.created_at).toLocaleDateString()} at{' '}
                  {new Date(selectedPost.created_at).toLocaleTimeString()}
                </em>
              </small>
              <div className="add-comment-section">
                {isLoggedIn ? (
                  <>
                    <textarea
                      id="makeComment"
                      placeholder="Add a comment..."
                      className="comment-textbox"
                    ></textarea>
                    <button className="comment-button" onClick={handleAddComment}>
                      Comment
                    </button>
                  </>
                ) : (
                  <p style={{ color: 'red' }}>Login required to add comments.</p>
                )}
              </div>
              <div className="comments-section">
              <h4>Comments</h4>
              <ul>
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <React.Fragment key={comment.comment_id}>
                      <li>
                        <strong>{comment.username}:</strong> {comment.content}
                        <br />
                        <small>
                          {new Date(comment.created_at).toLocaleDateString()} at{' '}
                          {new Date(comment.created_at).toLocaleTimeString()}
                        </small>
                        {isLoggedIn && (
                          <button
                            onClick={() => handleDeleteComment(comment.comment_id)}
                            disabled={userType !== 'admin'}
                          >
                            Delete Comment
                          </button>
                        )}
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
        {isLoggedIn ? (
          <>
            <textarea
              className="main-textbox"
              placeholder="Write a new post..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
            <button className="post-button" onClick={handleCreatePost}>
              Post
            </button>
          </>
        ) : (
          <p style={{ color: 'red' }}>Login required to post.</p>
        )}
      </div>
    </div>
  );
}

export default App;
