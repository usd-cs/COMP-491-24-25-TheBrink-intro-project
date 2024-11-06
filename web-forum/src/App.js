import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import MainTextbox from './MainTextbox'

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to The Brink
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <MainTextbox />
        
      </header>
      
    </div>
  );
}

export default App;
