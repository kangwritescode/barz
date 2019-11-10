import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase'
import 'firebase/firestore'


import './PostLikes.css'

const PostLikes = (props) => {

    const [points, setPoints] = useState(0);
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [myVote, setMyVote] = useState({})



    useEffect(() => {

        const db = firebase.firestore()
        const votesListener = db.collection('postVotes').where('pid', '==', props.viewedPost.pid).onSnapshot(snapshot => {
            var points = 0
            var likes = 0
            var dislikes = 0
            var myVote = null;
            // for every vote of this post
            snapshot.docs.forEach(vote => {
                vote = vote.data()
                if (vote.value === 1) {
                    likes += 1
                }
                if (vote.value === -1) {
                    dislikes += 1
                }
                if (vote.voterID === props.myUID) {
                    myVote = vote
                }
            })
            points = (likes - dislikes) < 0 ? 0 : (likes - dislikes)
            setPoints(points)
            setLikes(likes)
            setDislikes(dislikes)
            setMyVote(myVote)
        })
        return () => {
            votesListener()
        };
    }, [props.myUID, props.postSelected, props.viewedPost]);

    const pointsPercentage = likes > 0 ? Math.floor((likes * 1.0) / (likes + dislikes * 1.0) * 100) : null

    
    var iconStyle = 'fire'
    var iconColor = myVote.value ? 'lit' : ''
    if (myVote.value === -1) {
        iconStyle = 'trash'
    }


    return (
        <div className='likes'>
            <div className={`vote-icon-container`}>
            <i className={`fas fa-${iconStyle} vote-icon-container__${iconStyle} ${iconColor}`}></i>
            </div>
            <div className='total-score'>
                {points} pt{points === 1 ? null : 's'}. {pointsPercentage ? '(' + pointsPercentage + '%)' : null}
            </div>
            <div className='fans'>
                {likes} {likes === 1 ? 'like' : 'likes'}
            </div>

        </div>
    )
}

const mapStatetoProps = state => {
    return {
        myUID: state.uid
    }
}

export default connect(mapStatetoProps, null)(PostLikes)
