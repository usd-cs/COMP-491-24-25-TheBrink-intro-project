import React, { useState, useEffect } from 'react';
import MainTextbox from './MainTextbox';
import PostButton from './PostButton';
import PostList from './PostList';
import CommentsSection from './CommentsSection';



function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState({}); //store comments by post ID

  // Define fetchPosts inside App
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await fetch('http://localhost:5001/api/posts/comments');
      if(response.ok){
        const data = await response.json();
        setComments((prevComments) => {
          const updatedComments = Object.assign({}, prevComments);
          updatedComments[postId] = data;
          return updatedComments;
        });

        setSelectedPostId(postId);
      }else {
      console.error('Failed to fetch comments');
    }
    }catch(error){
      console.error('Error:", error');
    }
  };

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className ="app-container">
      <header className="App-header">
        {/* Display the list of posts */}
        {/*<PostList posts={posts} />*/}

      <div className ="content">
      <PostList  posts ={posts} onSelectPost={fetchComments}/>
      {selectedPostId && (
        <CommentsSection
          comments={comments[selectedPostId || []]}
          postId={selectedPostId}
          refreshComments={() => fetchComments(selectedPostId)}
        />
      )}
      </div>

      <div className='make-post'>
        <MainTextbox/>
        <PostButton refreshPosts={fetchPosts}/>
      </div>
      </header>
    </div>
  );
}



export default App;
