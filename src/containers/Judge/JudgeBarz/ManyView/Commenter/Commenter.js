import React, { useState, useEffect } from 'react'
import david from '../../../../../assets/davidFace.png'
import firebase from 'firebase'
import { connect } from 'react-redux'
import 'firebase/firestore'
import scrollToElement from 'scroll-to-element'
import './Commenter.css'
import TextareaAutosize from 'react-autosize-textarea/lib'
import PostLikes from '../../../../../components/Scribble/MyBars/ViewedBar/PostLikes/PostLikes'
import PostComments from '../../../../../components/Scribble/MyBars/ViewedBar/PostComments/PostComments'

var Commenter = (props) => {

    const [input, setInput] = useState('')


    useEffect(() => {
        setInput('')
    }, [props.selectedPost])

    // firebase
    const addComment = () => {
        var db = firebase.firestore()
        db.collection('postComments').add({
            comment: input,
            date: new Date(),
            photoURL: props.photoURL,
            pid: props.selectedPost.pid,
            receiverUsername: props.selectedPost.username,
            receiverUID: props.selectedPost.uid,
            uid: props.uid,
            username: props.username
        })
            .then(() => {
                setInput('')
            })
            .catch(err => {
                console.log(err)
            })
    }

    // ui 
    var isExpanded = props.postSelected ? 'expanded' : null
    var isHidden = props.postSelected ? 'hidden' : null

    var commentsAndLikes = null
    if (props.postSelected) {
        commentsAndLikes = (
            <div className='comments-and-likes'>
                <PostComments 
                    viewedPost={props.selectedPost} 
                    comments={props.comments}
                    toggleDeleteCommentModal={props.toggleDeleteCommentModal} />
                <PostLikes viewedPost={props.selectedPost} />
            </div>

        )
    }
    return (
        <div className={`commenter-wrapper`} style={props.customStyle ? props.customStyle.wrapper : null}>
            <div className='header' style={props.customStyle ? props.customStyle.header : null}></div>
            <div className={`commenter-body ${isExpanded}`} style={props.customStyle ? props.customStyle.body : null}>
                <h2 className={`select-a-post ${isHidden}`} style={props.customStyle ? props.customStyle.selectAPost : null}>Select a Post</h2>
                {commentsAndLikes}
                <form className='post-comment'>
                    <div className='img-wrapper'><img alt='' src={props.photoURL} className='comment-user-img'></img></div>
                    <TextareaAutosize
                        disabled={!props.postSelected}
                        placeholder='Thoughts...'
                        value={input}
                        onChange={event => setInput(event.target.value)}
                        maxLength='200'
                        className='comment-input'
                        spellCheck="false">
                    </TextareaAutosize>
                    <button className={(!props.postSelected || input === '') ? 'disabled' : null}
                        disabled={!props.postSelected || input === '' ? true : false}
                        onClick={event => { event.preventDefault(); addComment() }}>Post</button>
                </form>
            </div>
        </div>

    )
}

const mapStateToProps = state => {
    return {
        uid: state.uid,
        username: state.username,
        state: state.address.state,
        photoURL: state.photoURL,
        handles: state.handles,
    }
}

export default connect(mapStateToProps, null)(Commenter)