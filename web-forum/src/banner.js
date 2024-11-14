import React from 'react';
import './App.css'; // Make sure to import the CSS file

const Banner = ({ message, buttonText, onButtonClick, isLoggedIn, username, setUsername, password, setPassword, login, logout }) => {
  return (
    <div className="Banner">
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
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>

      {/* Main Banner Message and Button */}
      <div style={{ textAlign: 'center', flexGrow: 1 }}>
        <p>{message}</p>
        <button onClick={onButtonClick}>{buttonText}</button>
      </div>
    </div>
  );
};

export default Banner;
