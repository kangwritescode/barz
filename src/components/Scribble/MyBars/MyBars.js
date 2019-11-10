import React, { Component, useState, useEffect } from 'react'
import firebase from '../../../Firebase'
import { connect } from 'react-redux'
import 'firebase/firestore'
import './MyBars.css'
import ViewedPost from './ViewedBar/ViewedPost'
import GenID from '../../../shared/GenID'
import FireApi from '../../../FireApi/FireApi'


const MyBars = (props) => {

    const monthString = {
        '1': 'January',
        '2': 'February',
        '3': 'March',
        '4': 'April',
        '5': 'May',
        '6': 'June',
        '7': 'July',
        '8': 'August',
        '9': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    }

    const [posts, setPosts] = useState([])
    const [votes, setVotes] = useState({})
    const [comments, setComments] = useState([])
    const [showPost, setShowPost] = useState(false)
    const [viewedPost, setViewedPost] = useState(null)

    useEffect(() => {
        if (props.myUID) {
            const fetchVotesForUIDListener = FireApi.voteForUIDListener(setVotes, props.myUID)
            const userSortedPostsListener = FireApi.userSortedPostsListener(setPosts, props.myUID)
            const fetchCommentsListener = FireApi.allSubmissionCommentsListener(setComments)
            return () => {
                fetchVotesForUIDListener()
                userSortedPostsListener()
                fetchCommentsListener()
            };
        }

    }, [props.myUID])


    const insertDateHeaders = (inputArr) => {
        // create a copy
        var arr = [...inputArr]
        var currYear = 0
        var currMonth = 0
        var i = 0
        while (i < arr.length) {
            var postYear = arr[i].createdOn.toDate().getUTCFullYear()
            var postMonth = arr[i].createdOn.toDate().getUTCMonth() + 1

            // if a new year is introduced, update
            if (postYear !== currYear) {
                currYear = postYear
            }
            // if a new month is introduced, or the same month but different year
            if (postMonth !== currMonth || postMonth == currMonth && currYear != postYear) {
                arr.splice(i, 0, [postMonth, currYear])
                currMonth = postMonth
                i += 1
            } else {
                i += 1
            }
        }
        // return copy with inserted variables
        return arr
    }

    const toggleModal = (modal, value) => {
        setShowPost(value)
    }

    const viewPost = (pid) => {
        setShowPost(true)
        setViewedPost(pid)
    }

    const getCommentCount = (pid, comments) => {
        return comments.filter(comment => comment.pid === pid).length
    }





    // RENDER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



    // UI
    let focused = props.focused === "MyBars"
    let myBarsId = focused ? 'mybars-expanded' : 'mybars-compressed'
    let widgetHeader = focused ? 'my-bars-header-compressed' : 'my-bars-header-expanded'
    let postsContainerId = focused ? 'posts-container-opaque' : 'posts-container-transparent'

    // insert the date headers into the array

    var preppedPosts = insertDateHeaders(posts)

    console.log(votes)
    return (
        <div className="my-bars" id={myBarsId}>
            <div className={`my-bars-widget-header`} id={widgetHeader} onClick={!focused ? props.toggle : null}>Manage</div>
            <div className="posts-container" id={postsContainerId}>
                {preppedPosts.map((post) => {
                    if ((typeof post === 'array' || post instanceof Array)) {
                        return <div id='month-header' key={GenID()}>{monthString[post[0]]} {post[1]}</div>
                    }
                    return (
                        <div className="a-post" onClick={() => props.editPost(post.pid)} key={GenID()}>
                            <div id='likes-overlay'>
                                <span><i className="fas fa-fire" id="my-bars-flame"></i></span>
                                {votes[post.pid] > 0 ? votes[post.pid] : 0}
                                <span><i className="fas fa-comment" id="my-bars-comment"></i></span>
                                {getCommentCount(post.pid, comments)}
                            </div>
                            <p>{post.content.lineOne + "..."}</p>
                        </div>
                    )
                })}
            </div>
            {showPost ? <ViewedPost toggleViewedPost={toggleModal} pid={viewedPost} toggleModal={toggleModal} /> : null}
        </div>
    )

}

const mapStateToProps = state => {
    return {
        myUID: state.uid
    }
}

export default connect(mapStateToProps, null)(MyBars)

