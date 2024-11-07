import React from "react"
import './App.js'
import './MainTextbox.js'

function PostButton() {
    const handleClick = () => {
    // Do something when the button is clicked
        let textarea = document.getElementById("makePost");

        // Get the value of the textarea
        let value = textarea.value;
    };
    
    return (
    <div>
      <button onClick={handleClick}>Send Post</button>
    </div>
    )
}

export default PostButton;