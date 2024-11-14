import React, { useState, useEffect } from 'react';
import MainTextbox from './MainTextbox';
import PostButton from './PostButton';
import PostList from './PostList';
import Banner from './Banner';


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

  // Define logout function
const logout = () => {
  setIsLoggedIn(false);
  setUsername('');
  setPassword('');
};




  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
    {/* Banner Component with Login/Profile */}
    // Pass logout to Banner
  <Banner 
    message="Welcome to The Brink!" 
    buttonText="Click Me" 
    onButtonClick={() => alert('Button clicked!')}
    isLoggedIn={isLoggedIn} 
    username={username} 
    setUsername={setUsername}
    password={password} 
    setPassword={setPassword}
    login={login} 
    logout={logout} // Ensure logout is passed here
  />
    

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