import React from 'react';

const Banner = ({ message, buttonText, onButtonClick }) => {
  return (
    <div className="banner">
      <p>{message}</p>
      <button onClick={onButtonClick}>{buttonText}</button>
    </div>
  );
};

export default Banner;
