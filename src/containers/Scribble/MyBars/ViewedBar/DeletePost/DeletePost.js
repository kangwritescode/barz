import React, { Component, useState } from 'react'
import './DeletePost.css'
import firebase from '../../../../../Firebase'
import 'firebase/firestore'
import { connect } from 'react-redux';
import * as actionTypes from '../../../../../store/actions'

const DeletePost = (props) => {

    const [spinner, setSpinner] = useState(false)


    const deletePost = async (pid) => {
        setSpinner(true)
        var db = firebase.firestore()
        await db.collection('postVotes').where('pid', '==', pid).get()
            .then(snap => {
                snap.forEach(doc => {
                    doc.ref.delete().catch(err => console.log(err.message))
                })
            })
            .catch(err => { setSpinner(false) })
        await db.collection('postComments').where('pid', '==', pid).get()
            .then(snap => {
                snap.forEach(doc => {
                    doc.ref.delete().catch(err => console.log(err.message))
                })
            })
            .catch(err => { setSpinner(false) })
        await db.collection('submissions').doc(pid).delete()
            .catch(err => { setSpinner(false) })
        props.toggleEditor(null)


    }

    return (
        <div id="delete-post-wrapper">
            <div id="delete-post-backdrop" onClick={() => props.toggle(null)}></div>
            <div id="delete-post-body">
                {spinner ? <div id='delete-post-spinner'></div> : null}
                <i className="fa fa-close" id="close-delete-post-x" onClick={() => props.toggle(null)}></i>
                <div id="delete-post-header">Delete Post?</div>
                <div id="delete-post-question">This cannot be reversed.</div>
                <div id='delete-post-button-container'>
                    <div className='delete-post-button' id='cancel-button' onClick={() => props.toggle(null)}>Cancel</div>
                    <div className='delete-post-button' id='delete-button' onClick={props.pid ? () => deletePost(props.pid) : null}>Delete</div>
                </div>
            </div>
        </div>
    )
}



export default connect(null, null)(DeletePost); 