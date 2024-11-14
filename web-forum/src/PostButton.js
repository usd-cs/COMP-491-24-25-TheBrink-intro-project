import React from 'react';

function PostButton({ refreshPosts, isLoggedIn }) {
  const handleClick = async () => {
    if (!isLoggedIn) {
      alert("You must be logged in to post.");
      return;
    }

    const textarea = document.getElementById("makePost");
    const value = textarea.value;

    try {
      const response = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Replace with actual user_id from login
          content: value,
        }),
      });

      if (response.ok) {
        console.log('Post sent successfully');
        textarea.value = ''; // Clear textarea
        refreshPosts(); // Refresh post list
      } else {
        console.log('Failed to send post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <button className="button" onClick={handleClick}>
          Send Post
        </button>
      ) : (
        <p style={{ color: 'red' }}>Login required to post.</p>
      )}
    </div>
  );
}

export default PostButton;
