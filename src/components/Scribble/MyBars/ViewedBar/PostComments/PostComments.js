import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase'
import 'firebase/firestore'
import './PostComments.css'
import PostComment from './PostComment/PostComment'

function PostComments(props) {

    // const [loading, toggleLoader] = useState(false)

    var display = (<div>
        <div className='filler-block'></div>
        {props.comments.map((comment, index) => {
            return (
                <PostComment
                    viewedPost={props.viewedPost}
                    index={index}
                    noOfComments={props.comments.length}
                    data={comment}
                    toggleModal={props.toggleModal}
                    // toggleLoader={toggleLoader}
                />
            )
        })}
    </div>)

    // var loadingStyle = loading ? 'loading' : 'done-loading'
    return (
        <div className={`post-comments`}>
            {display}
        </div>
    )
}

export default PostComments
