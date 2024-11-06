import React, { useRef, useEffect } from 'react';
import './styles.css';

function MainTextbox() {
  const textAreaRef = useRef(null);

  useEffect(() => {
    const adjustHeight = () => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto'; // Reset height to calculate scrollHeight
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      }
    };

    adjustHeight(); // Initial height adjustment

    if (textAreaRef.current) {
      textAreaRef.current.addEventListener('input', adjustHeight);
    }

    return () => {
      if (textAreaRef.current) {
        textAreaRef.current.removeEventListener('input', adjustHeight);
      }
    };
  }, []);

  return (
    <textarea className="main-textbox" ref={textAreaRef} placeholder="Enter text here..." />
  );
}

export default MainTextbox;