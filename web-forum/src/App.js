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
      {/* Add a banner here */}
      <div className="App-banner">
        <h1>Welcome to The Brink!</h1>
      </div>
      {/* Main layout with login section on the left */}
      <div style={{ display: 'flex', padding: '20px' }}>
        {/* Left-side login section */}
        <div className="Login-section" style={{ width: '250px', padding: '20px', marginRight: '20px', borderRight: '1px solid #ccc' }}>
          {!isLoggedIn ? (
            <div>
              <h3>Login</h3>
              <div>
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <button onClick={login} style={{ width: '100%' }}>Login</button>
              </div>
            </div>
          ) : (
            <div>
              <h3>Welcome, {username}</h3>
              <button onClick={() => setIsLoggedIn(false)}>Logout</button>
            </div>
          )}
        </div>

       {/* Main content (posts list and post creation) */}
       <div style={{ flexGrow: 1 }}>
          <header className="App-header">
            <PostList posts={posts} />
          </header>

          <header className="Make-post">
            <MainTextbox />
            <PostButton refreshPosts={fetchPosts} />
          </header>
        </div>
      </div>
    </div>
  );
}

export default App;
