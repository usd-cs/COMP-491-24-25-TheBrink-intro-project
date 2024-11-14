import React from 'react';

function SendCommentButton({ postId, refreshComments }) {
  const handleClick = async () => {
    const textarea = document.getElementById('makeComment');
    const value = textarea.value;

    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Replace with actual user_id if needed
          content: value,
        }),
      });

      if (response.ok) {
        console.log('Comment sent successfully');
        textarea.value = ''; // Clear textarea
        refreshComments(); // Refresh comments
      } else {
        console.log('Failed to send comment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Send Comment</button>
    </div>
  );
}

export default SendCommentButton;
