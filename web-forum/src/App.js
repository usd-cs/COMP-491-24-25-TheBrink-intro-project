import React, { useState, useEffect } from 'react';
import MainTextbox from './MainTextbox';
import PostButton from './PostButton';
import PostList from './PostList';

function App() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

//Simulate API call for login
const login = async () => {
  if (username === 'user' && password === 'password') {
    setIsLoggedIn(true); // Simulate successful login
  } else {
    alert('Invalid credentials');
  }
};

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
      {/* Banner with login/profile on the left */}
      <div className="App-banner" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#282c34', color: 'white', padding: '20px' }}>
        {/* Login/Profile Section on the left */}
        <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
          {!isLoggedIn ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h3>Login</h3>
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                style={{ marginBottom: '5px' }}
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ marginBottom: '5px' }}
              />
              <button onClick={login}>Login</button>
            </div>
          ) : (
            <div>
              <h3>Welcome, {username}!</h3>
              <button onClick={() => setIsLoggedIn(false)}>Logout</button>
            </div>
          )}
        </div>

        {/* Main Banner Content */}
        <div style={{ textAlign: 'center', flexGrow: 1 }}>
          <h1>Welcome to The Brink!</h1>
        </div>
      </div>

      {/* Main App Content */}
      <header className="App-header">
        <PostList posts={posts} />
      </header>
      <header className="Make-post">
        <MainTextbox />
        <PostButton refreshPosts={fetchPosts} />
      </header>
    </div>
  );
}

export default App;
