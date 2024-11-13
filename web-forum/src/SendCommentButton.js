import React from 'react';

function SendCommentButton({ refreshComments }) {
  const handleClick = async () => {
    const textarea = document.getElementById("makeComment");
    const value = textarea.value;

    try {
      const response = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,  // Replace with actual user_id if needed
          content: value,
        }),
      });

      if (response.ok) {
        console.log('Comment sent successfully');
        textarea.value = '';  // Clear textarea
        refreshComments();       // Refresh post list
      } else {
        console.log('Failed to send post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button class="button" onClick={handleClick}>Send Comment</button>
    </div>
  );
}

export default SendCommentButton;
