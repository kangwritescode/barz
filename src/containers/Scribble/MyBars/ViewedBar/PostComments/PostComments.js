import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase'
import 'firebase/firestore'
import './PostComments.css'
import PostComment from './PostComment/PostComment'
import { GenID } from '../../../../../shared/utility'

function PostComments(props) {

    var comments = props.comments.filter(comment => comment.pid === props.viewedPost.pid)
    comments = comments.sort((a, b) => {
        if (a.date < b.date) {
            return -1
        } return 1
    })

    var display = (<div>
        <div className='filler-block'></div>
        {comments.map((comment, index) => {
            return (
                <PostComment
                    key={GenID()}
                    viewedPost={props.viewedPost}
                    index={index}
                    noOfComments={props.comments.length}
                    data={comment}
                    toggleDeleteCommentModal={props.toggleDeleteCommentModal}
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
