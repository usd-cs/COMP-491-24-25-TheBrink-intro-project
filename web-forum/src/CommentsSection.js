import React from 'react';
import SendCommentButton from './SendCommentButton';

function CommentsSection({comments, postID,refreshComments}){
    if(!postID){
        return <p>Select a post to see comments</p>;
    }
    return(
        <div className = "comments-section">
        <h3>Comments for Post ID {postID} </h3>
        {comments.length > 0 ?(
            comments.map((comment) => (
                <p key ={comment.id}>{comment.content}</p>
            ))
        ): (
            <p> No comments yet</p>
        )}
        <SendCommentButton postId={postID} refreshComments={refreshComments}/>

        </div>

    );
}
export default CommentsSection;