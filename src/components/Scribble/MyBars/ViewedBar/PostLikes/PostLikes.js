import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase'
import 'firebase/firestore'


import './PostLikes.css'
import { setTimeout } from 'timers'

const PostLikes = (props) => {


    // data
    const [points, setPoints] = useState(0);
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [myVote, setMyVote] = useState(null)


    useEffect(() => {

        const showTimeOut = () => {
            window.clearTimeout(closeTimeout)
            openTimeout = window.setTimeout(function () {
                voter.classList.add('show')
            }, 750);
        }
        const removeTimeOut = () => {
            window.clearTimeout(openTimeout)
            closeTimeout = window.setTimeout(function () {
                voter.classList.remove('show')
            }, 750)
        }

        var openTimeout = null;
        var closeTimeout = null
        const voter = document.getElementById('voter')
        const voteIcon = document.getElementById('vote-icon')


        voteIcon.addEventListener('mouseover', showTimeOut);
        voter.addEventListener('mouseover', () => window.clearTimeout(closeTimeout));
        voteIcon.addEventListener('mouseout', removeTimeOut);
        return () => {

        };
    }, [])



    useEffect(() => {

        const db = firebase.firestore()
        const votesListener = db.collection('postVotes').where('pid', '==', props.viewedPost.pid).onSnapshot(snapshot => {
            var points = 0
            var likes = 0
            var dislikes = 0
            var myVote = [];
            // for every vote of this post
            snapshot.docs.forEach(vote => {
                vote = { ...vote.data(), vid: vote.id }
                if (vote.value === 1) {
                    likes += 1
                }
                if (vote.value === -1) {
                    dislikes += 1
                }
                if (vote.voterID === props.myUID) {
                    myVote.push(vote)
                }
            })
            points = (likes - dislikes) < 0 ? 0 : (likes - dislikes)
            setPoints(points)
            setLikes(likes)
            setDislikes(dislikes)
            setMyVote(myVote.length > 0 ? myVote : [])
        })
        return () => {
            votesListener()
        };
    }, [props.myUID, props.postSelected, props.viewedPost]);


    const vote = (newValue) => {
        const voter = document.getElementById('voter')
        voter.classList.remove('show')
        const db = firebase.firestore()
        if (myVote.length === 0) {
            var newVote = {
                value: newValue,
                date: new Date(),
                pid: props.viewedPost.pid,
                receiverID: props.viewedPost.uid,
                voterID: props.myUID,
                postDate: props.viewedPost.createdOn,
                address: props.viewedPost.address
            }
            db.collection('postVotes').add(newVote)
                .catch(err => console.log(err))
        } else {
            var updatedVote = {
                ...myVote[0],
                value: newValue === myVote[0].value ? 0 : newValue,
                date: new Date()
            }
            // set the vote 
            db.collection('postVotes').doc(myVote[0].vid)
                .set(updatedVote)
                .catch(err => console.log(err))

            // cleanup leaked extras ***
            if (myVote.length > 1) {
                for (let i = 1; i < myVote.length; i++) {
                    db.collection('postVotes').doc(myVote[i].vid)
                        .delete()
                        .then(() => console.log('vote deleted successfully'))
                        .catch(err => console.log(err))
                }
            }
        }
    }

    // render ~~~~~~~~~~~~~


    const pointsPercentage = likes > 0 ? Math.floor((likes * 1.0) / (likes + dislikes * 1.0) * 100) : null

    console.log(myVote)
    var iconColor = myVote && myVote[0] && myVote[0].value ? 'lit' : ''
    var iconStyle = <i className={`fa fa-${'fire'} vote-icon-container__${'fire'} ${iconColor}`} id='icon'/>
    if (myVote && myVote[0] && myVote[0].value === -1) {
        iconStyle = <i className={`fa fa-${'trash'} vote-icon-container__${'trash'} ${iconColor}`} id='icon'/>
    }

    return (
        <div className='likes'>
            <div
                className={`vote-icon-container`}
                id={`vote-icon`}>
                {iconStyle}
                <div className={`vote-icon-container-hover-div`} onClick={myVote && myVote[0] && myVote[0].value === -1 ? () => vote(-1) : () => vote(1)}></div>
                <div className={`vote-icon-container__pop-up-voter`} id={`voter`}>
                    <div className={`pop-up-voter__icon-wrapper left`} onClick={() => vote(-1)}><i className={`fa fa-trash lit-trash voter-icon`} aria-hidden="true"></i></div>
                    <div className={`pop-up-voter__icon-wrapper right`} onClick={() => vote(1)}><i className={`fa fa-fire lit voter-icon`} aria-hidden="true"></i></div>
                </div>
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
