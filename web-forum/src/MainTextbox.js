import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function MainTextbox() {
  const [value, setValue] = useState('');
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'; // Reset height to calculate scrollHeight
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [value]);

    // adjustHeight(); // Initial height adjustment

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <textarea
      ref={textAreaRef}
      value={value}
      onChange={handleChange}
    />
  );
  };

  // return (
  //   <textarea id="makePost" className="main-textbox" ref={textAreaRef} placeholder="Enter text here..." />
  // );


export default MainTextbox;