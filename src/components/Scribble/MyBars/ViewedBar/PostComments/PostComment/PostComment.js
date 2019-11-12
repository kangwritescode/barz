import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import './PostComment.css'
import firebase from 'firebase'
import 'firebase/firestore'


function PostComment(props) {

    var data = props.data

    // fetch photo on mounting
    useEffect(() => {
        document.addEventListener('click', closeDropdowns)

        return () => {
            document.removeEventListener('click', closeDropdowns)

        }
    }, [])


    const closeDropdowns = (event) => {
        const classList = event.target.classList
        if (classList
            && !classList.contains('posted-comment__dots')
            && !classList.contains('posted-comment__dot')) {
            const dropdowns = document.getElementsByClassName('delete-comment-drop-menu')
            for (let dropdown of dropdowns) {
                dropdown.classList.remove('delete-comment-drop-menu-show')
            }
        }
    }

    const toggleDeleteDropdown = (event, cid) => {
        const dropdown = document.getElementById(cid)
        console.log(dropdown)
        if (dropdown.classList.contains('delete-comment-drop-menu-show')) {
            dropdown.classList.remove('delete-comment-drop-menu-show')
        } else {
            const allDropdowns = document.getElementsByClassName('delete-comment-drop-menu-show')
            for (let dropdown of allDropdowns) {
                dropdown.classList.remove('delete-comment-drop-menu-show')
            }
            dropdown.classList.add('delete-comment-drop-menu-show')
        }
    }

    const generateDatePassed = () => {
        var datePassed = new Date().getTime() - props.data.date.toDate().getTime()
        var minutesPassed = Math.trunc(datePassed / 1000 / 60)
        if (minutesPassed < 60) {
            return Math.max(minutesPassed, 1) + 'm'
        }
        var hoursPassed = Math.trunc(minutesPassed / 60)
        if (hoursPassed < 24) {
            return hoursPassed + 'h'
        }
        var daysPassed = Math.trunc(hoursPassed / 24)
        if (daysPassed < 7) {
            return daysPassed + 'd'
        }
        return Math.trunc((daysPassed / 7)) + 'w'
    }
    // editable if current user's comment or current user's post
    const editable = (props.uid === data.uid) || (props.viewedPost.uid === props.uid)
    var deleteOption = null;
    if (editable) {
        deleteOption = (
            <div className={`posted-comment__dots-container`}>
                <div
                    className='posted-comment__dots' onClick={(event) => toggleDeleteDropdown(event, data.cid)}>
                    <div
                        className={`delete-comment-drop-menu`}
                        id={data.cid}
                        onMouseLeave={(event) => { closeDropdowns(event) }}>
                        <div className="delete-comment-drop-menu-item" id="delete-post" onClick={() => props.toggleDeleteCommentModal(true, data.cid)}>
                            Delete
                        </div>
                    </div>
                    <div className='posted-comment__dot'></div>
                    <div className='posted-comment__dot'></div>
                    <div className='posted-comment__dot'></div>
                </div>
                {/* <i className="fas fa-minus"></i> */}
            </div>
        )
    }

    return (
        <div
            className='posted-comment'
            onMouseLeave={(event) => { closeDropdowns(event) }}>
            <div className='posted-comment__img-container'>
                <img alt='' src={props.myPhotoURL}></img>
            </div>
            <div className='posted-comment__content'>
                <b>{data.username}</b> {data.comment} <br />
                <div className='posted-comment__content__date'>{generateDatePassed()}</div>
            </div>
            {deleteOption}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        uid: state.uid,
        myPhotoURL: state.photoURL
    }
}

export default connect(mapStateToProps, null)(PostComment)