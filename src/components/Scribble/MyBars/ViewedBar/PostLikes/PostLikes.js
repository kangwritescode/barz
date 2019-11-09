import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase'
import 'firebase/firestore'


import './PostLikes.css'

const PostLikes = (props) => {

    const [points, setPoints] = useState(0);
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)



    useEffect(() => {

        const db = firebase.firestore()
        const votesListener = db.collection('postVotes').where('pid', '==', props.viewedPost.pid).onSnapshot(snapshot => {
            var points = 0
            var likes = 0
            var dislikes = 0
            // for every vote of this post
            snapshot.docs.forEach(vote => {
                vote = vote.data()
                console.log(vote)
                if (vote.value === 1) {
                    likes += 1
                }
                if (vote.value === -1) {
                    dislikes += 1
                }
            })
            points = (likes - dislikes) < 0 ? 0 : (likes - dislikes)
            setPoints(points)
            setLikes(likes)
            setDislikes(dislikes)
        })
        return () => {
            votesListener()
        };
    }, [props.postSelected, props.viewedPost]);

    const percentage = likes > 0 ? Math.floor((likes * 1.0) / (likes + dislikes * 1.0) * 100) : null

    return (
        <div className='likes'>
            <div className={`vote-icon-container`}></div>
            <div className='total-score'>
                {points} pt{points === 1 ? null : 's'}. {percentage ? '('+ percentage + '%)' : null}
            </div>
            <div className='fans'>
                {likes} {likes === 1 ? 'like' : 'likes'}
            </div>

        </div>
    )
}

const mapStatetoProps = state => {
    return {
        uid: state.uid
    }
}

export default connect(mapStatetoProps, null)(PostLikes)
