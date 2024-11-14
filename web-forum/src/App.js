import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import MainTextbox from './MainTextbox';
import PostButton from './PostButton';
import PostList from './PostList';

function App() {
  const [posts, setPosts] = useState([]);
=======
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [postContent, setPostContent] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;
>>>>>>> Stashed changes

  const fetchPosts = async () => {
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
  };

<<<<<<< Updated upstream
  // Fetch posts when component mounts
=======
  const handleCreatePost = async () => {
    const textarea = document.getElementById('newPostContent');
    const content = textarea.value.trim(); // Get the content from the textarea and trim spaces
  
    if (!content) {
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
          user_id: 1, // Replace with the actual user ID if required
          content,
        }),
      });
  
      if (response.ok) {
        console.log('Post created successfully');
        textarea.value = ''; // Clear the textarea
        fetchPosts(); // Refresh the posts list
      } else {
        const errorText = await response.text();
        console.error('Failed to create post. Response:', errorText);
        alert('Failed to create post. Check console for details.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  
  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}/comments`);
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
    const textarea = document.getElementById('makeComment');
    const content = textarea.value.trim();

    if (!content) {
      alert('Comment cannot be empty!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/posts/${selectedPost.post_id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Replace with actual user_id if needed
          content,
        }),
      });

      if (response.ok) {
        console.log('Comment added successfully');
        textarea.value = '';
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

  const handleAddPost = async () => {
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
          user_id: 1, // Replace with actual user_id if needed
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
      console.error('Error:', error);
    }
  };

>>>>>>> Stashed changes
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
<<<<<<< Updated upstream
    <div>
      <header className="App-header">
        {/* Display the list of posts */}
        <PostList posts={posts} />
      </header>
      <header className="Make-post">
        <MainTextbox />
        {/* Pass fetchPosts as a prop to PostButton */}
        <PostButton refreshPosts={fetchPosts} />
=======
    <div className="app-container">
      <header className="App-header">
        <div className="layout-container">
          <div className="empty-section"></div> {/* Empty space above the text box */}
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
                <textarea id="makeComment" placeholder="Add a comment"></textarea>
                <button onClick={handleAddComment}>Comment</button>
              </div>
            </div>
          )}
        </div>
>>>>>>> Stashed changes
      </header>
      <div className="make-post">
        <textarea
          className="main-textbox"
          placeholder="Write a new post..."
          id="newPostContent"
        ></textarea>
        <button
          className="post-button"
          onClick={handleCreatePost} // Define this function to handle post creation
        >
          Post
        </button>
      </div>
    </div>
  );
  
}

export default App;
