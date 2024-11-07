import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import MainTextbox from './MainTextbox'
import PostButton from './PostButton'

function App() {

  return (
    <div>
      <header className="App-header">
        
      </header>

      <header className="Make-post">
        <MainTextbox />
        <PostButton />
      </header>
      
    </div>
  );
}

export default App;
