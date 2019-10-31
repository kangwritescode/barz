import React, { Component, useState } from 'react'
import './DeletePost.css'
import firebase from '../../../../../Firebase'
import 'firebase/firestore'
import {connect} from 'react-redux';
import * as actionTypes from '../../../../../store/actions'

class DeletePost extends Component {

    state = {
        spinner: false
    }

    toggleSpinner = (bool) => {
        this.setState({
            ...this.state,
            spinner: bool
        })
    }

    deletePost = async (pid) => {
        this.toggleSpinner(true)
        var db = firebase.firestore()
        await db.collection('submissions').doc(pid).delete()
            .then(() => { console.log("document successfully deleted") })
            .catch(err => { this.toggleSpinner(false)})
        await db.collection('postVotes').where('pid', '==', pid).get()
            .then(snap => {
                snap.forEach(doc => {
                    doc.ref.delete().then(() => {
                        console.log('doc successfully deleted!!!')
                    })
                })
            })
            .catch(err => { this.toggleSpinner(false)})
        this.toggleSpinner(false)
        this.props.toggleModal('showPost', false, 'deleted')
        
    }
    render() {
        return (
            <div id="delete-post-wrapper">
                <div id="delete-post-backdrop" onClick={() => this.props.toggle('showDeleteModal', false)}></div>
                <div id="delete-post-body">
                    {this.state.spinner ? <div id='delete-post-spinner'></div> : null}
                    <i className="fa fa-close" id="close-delete-post-x" onClick={() => this.props.toggle('showDeleteModal', false)}></i>
                    <div id="delete-post-header">Delete Post?</div>
                    <div id="delete-post-question">This cannot be reversed.</div>
                    <div id='delete-post-button-container'>
                        <div className='delete-post-button' id='cancel-button' onClick={() => this.props.toggle('showDeleteModal', false)}>Cancel</div>
                        <div className='delete-post-button' id='delete-button' onClick={() => this.deletePost(this.props.pid)}>Delete</div>
                    </div>
                </div>
            </div>
        )
    }
}



export default connect(null, null)(DeletePost); 