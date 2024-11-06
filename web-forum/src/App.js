import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
// import 'devextreme/dist/css/dx.light.css';
// import { TextBox } from 'devextreme-react/text-box';

function App() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  
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

        <div>
          <input type="text" value={inputValue} onChange={handleInputChange} />
          <p>You typed: {inputValue}</p>
        </div>
        
      </header>
    </div>
  );
}

export default App;
