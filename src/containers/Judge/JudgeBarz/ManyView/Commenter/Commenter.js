import React from 'react'
import david from '../../../../../assets/davidFace.png'
import './Commenter.css'
import TextareaAutosize from 'react-autosize-textarea/lib'
import PostLikes from '../../../../../components/Scribble/MyBars/ViewedBar/PostLikes/PostLikes'
import PostComments from '../../../../../components/Scribble/MyBars/ViewedBar/PostComments/PostComments'

var Commenter = (props) => {

    console.log(props)
    var isExpanded = props.postSelected ? 'expanded' : null
    var isHidden = props.postSelected ? 'hidden' : null
    var commentsAndLikes = null
    if (props.postSelected) {
        commentsAndLikes = (
            <div className='comments-and-likes'>
                <PostComments viewedPost={props.selectedPost} comments={props.comments} />
                <PostLikes viewedPost={props.selectedPost} />
            </div>

        )
    }


    return (
        <div className={`Commenter ${isExpanded}`}>
            <div className='header'></div>
            <h2 className={`select-a-post ${isHidden}`}>Select a Post!</h2>
            {commentsAndLikes}
            <form className='post-comment'>
                <div className='img-wrapper'><img alt='alt' src={david} className='comment-user-img'></img></div>
                <TextareaAutosize
                    placeholder='Thoughts...'
                    disabled
                    maxLength='200'
                    className='comment-input'
                    spellCheck="false">
                </TextareaAutosize>
                <button disabled onClick={event => event.preventDefault()}>Post</button>
            </form>
        </div>
    )
}

export default Commenter