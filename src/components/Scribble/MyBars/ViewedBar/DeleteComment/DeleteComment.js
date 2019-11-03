import React, { Component, useState } from 'react'
import './DeleteComment.css'
import firebase from '../../../../../Firebase'
import 'firebase/firestore'

class DeleteComment extends Component {

    state = {
        spinner: false
    }

    toggleSpinner = (bool) => {
        this.setState({
            ...this.state,
            spinner: bool
        })
    }

    deleteComment = () => {
        this.toggleSpinner(true)
        const db = firebase.firestore()
        db.collection('postComments').doc(this.props.cid).delete()
            .then(() => {
                this.toggleSpinner(false)
                this.props.toggleDeleteCommentModal(false, null)
            })
            .catch(err => {console.log(err)})
    }

    render() {
        return (
            <div id="delete-comment-wrapper">
                <div id="delete-comment-backdrop" onClick={() => this.props.toggleDeleteCommentModal(false, null)}></div>
                <div id="delete-comment-body">
                    {this.state.spinner ? <div id='delete-comment-spinner'></div> : null}
                    <i className="fa fa-close" id="close-delete-comment-x" onClick={() => this.props.toggleDeleteCommentModal(false, null)}></i>
                    <div id="delete-comment-header">Delete Comment?</div>
                    <div id="delete-comment-question">This cannot be reversed.</div>
                    <div id='delete-comment-button-container'>
                        <div className='delete-comment-button' id='cancel-button' onClick={() => this.props.toggleDeleteCommentModal(false, null)}>Cancel</div>
                        <div className='delete-comment-button' id='delete-button' onClick={() => this.deleteComment(this.props.cid)}>Delete</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DeleteComment;