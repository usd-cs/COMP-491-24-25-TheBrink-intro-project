import React from 'react';
import './App.css'; // Make sure to import the CSS file

const Banner = ({ message, isLoggedIn, username, setUsername, password, setPassword, login, logout }) => {
  return (
    <div className="Banner">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Login/Profile Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {!isLoggedIn ? (
            <>
              <h3>Login</h3>
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  marginBottom: '5px',
                  padding: '5px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  marginBottom: '5px',
                  padding: '5px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={login}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#04AA6D',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Login
                </button>
                <button
                  onClick={logout}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#D9534F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
              <h3>Welcome, {username}!</h3>
              <button
                onClick={logout}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#D9534F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Central Banner Message */}
        <h2 style={{ marginLeft: 'auto', marginRight: 'auto', color: 'white', textAlign: 'center' }}>{message}</h2>
      </div>
    </div>
  );
};

export default Banner;
