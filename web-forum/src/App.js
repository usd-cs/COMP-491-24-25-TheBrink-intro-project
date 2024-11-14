import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [postContent, setPostContent] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;

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
  }, [apiUrl]); // Memoize using apiUrl as a dependency

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
    fetchPosts(); // Safe to include due to memoization
  }, [fetchPosts]); // Include fetchPosts in the dependency array

  return (
    <div className="app-container">
      <header className="App-header">
        <div className="layout-container">
          <div className="empty-section"></div>
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
                <button onClick={() => handleViewPost(post)}>View Post</button>
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
                    comments.map((comment) => (
                      <li key={comment.comment_id}>
                        <strong>User {comment.user_id}:</strong> {comment.content}
                        <br />
                        <small>
                          {new Date(comment.created_at).toLocaleDateString()} at{' '}
                          {new Date(comment.created_at).toLocaleTimeString()}
                        </small>
                      </li>
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
