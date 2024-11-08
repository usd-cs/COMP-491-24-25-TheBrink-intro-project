import React from 'react';

function PostButton() {
    const handleClick = async () => {
        const textarea = document.getElementById("makePost");
        const value = textarea.value;

        // Send post data to backend
        try {
            const response = await fetch('http://localhost:5001/api/posts', {  // Updated to port 5001
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 1,  // Replace with actual user_id as needed
                    content: value,
                }),
            });

            if (response.ok) {
                console.log('Post sent successfully');
                textarea.value = '';  // Optionally clear the text area after sending
            } else {
                console.log('Failed to send post');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <button onClick={handleClick}>Send Post</button>
        </div>
    );
}

export default PostButton;
