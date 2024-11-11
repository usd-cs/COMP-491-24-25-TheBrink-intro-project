import React, { useState, useEffect } from 'react';
import MainTextbox from './MainTextbox';
import PostButton from './PostButton';
import PostList from './PostList';

function App() {
  const [posts, setPosts] = useState([]);

  // Define fetchPosts inside App
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

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <header className="App-header">
        {/* Display the list of posts */}
        <PostList posts={posts} />
      </header>
      <header className="Make-post">
        <MainTextbox />
        {/* Pass fetchPosts as a prop to PostButton */}
        <PostButton refreshPosts={fetchPosts} />
      </header>
    </div>
  );
}

export default App;
