import React, { Component, useState, useEffect, useRef } from 'react'
import './ManyPost.css'
import { connect } from 'react-redux'
import firebase from 'firebase'
import 'firebase/firestore'
import { Link } from 'react-router-dom'





const ManyPost = (props) => {

    // vote
    const [myVote, setMyVote] = useState([])


    useEffect(() => {

        if (props.pid && props.votes && props.uid) {
            var myVote = props.votes.filter(vote => vote.voterID === props.myUID)
            setMyVote(myVote)
            return () => {
            };
        }


    }, [props.pid, props.uid, props.votes, props.comments, props.photoURL]);

    const vote = (newValue) => {
        const db = firebase.firestore()

        if (myVote.length === 0) {
            var newVote = {
                value: newValue,
                date: new Date(),
                pid: props.pid,
                receiverID: props.uid,
                voterID: props.myUID,
                postDate: props.createdOn,
                address: props.address
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

    // RENDER ---->


    // date
    var verboseDate = props.createdOn.toDate().toDateString()
    const date = verboseDate.slice(4, verboseDate.length)

    // content
    var content = props.content.lineOne + ' / ' + props.content.lineTwo + ' / ' + props.content.lineThree + ' / ' + props.content.lineFour

    // votes
    var score = props.votes.filter(vote => {
        return props.pid === vote.pid && vote.value === 1
    })

    // dict {coast: color}
    const colorDict = {
        'West': 'yellow',
        'East': 'greeen',
        'South': 'blue',
        'Midwest': 'purple',
    }
    const coastColor = colorDict[props.address.region]

    return (

        <div
            className={`many-post scrollTo${props.pid} ${props.inEditor ? 'editor-style' : null}`}
            id={`scrollTo${props.pid}`}
            style={props.customStyle ? props.customStyle.whole : null}>
            <header
                onClick={() => props.selectPost(props.pid)}
                style={props.customStyle ? props.customStyle.header : null}>
                <div className='many-post-details' id={props.pid}>
                    <Link style={{ textDecoration: 'none' }} to={`/${props.username}/`} >
                        <img className='many-post-pic' src={props.uid === props.myUID ? props.myPhotoURL : props.photoURL} alt='pic'></img>
                    </Link>
                    <div className='many-post-name-date-container'>
                        <Link style={{ textDecoration: 'none' }} to={`/${props.username}/`} >
                            <h6 style={props.customStyle ? props.customStyle.username : null}>{props.username}</h6>
                        </Link>
                        <p>{date}</p>
                    </div>
                </div>
                <div className='many-post-region' id={coastColor}>
                    {props.address.region.toLowerCase()}
                </div>
                <div className='many-post-misc'>
                    <i className="fas fa-comment" id='manyComment' ></i>
                    {props.comments.length}
                    <i className="fas fa-fire" id='manyFlame' aria-hidden="true"></i>
                    {score.length}
                </div>

            </header>
            <div
                className='many-post-body' onClick={() => props.selectPost(props.pid)}
                style={props.customStyle ? props.customStyle.midSection : null}>

                <p
                    style={props.customStyle ? props.customStyle.paragraph : null}>
                    {`"${content}"`}
                </p>
            </div>

            <div className='vote-box'>
                <button className='vote-button dislike-button' onClick={() => vote(-1)}>
                    <i className="fa fa-trash" style={myVote.length === 1 && myVote[0].value === -1 ? { color: 'darkRed' } : null} aria-hidden="true"></i>
                </button>
                <button className='vote-button like-button' onClick={() => vote(1)}>
                    <i className="fas fa-fire" style={myVote.length === 1 && myVote[0].value === 1 ? { color: 'orange' } : null}></i>
                </button>

            </div>
        </div>

    )
}

const mapStateToProps = state => {
    return {
        myUID: state.user.uid,
        myPhotoURL: state.user.photoURL
    }
}

export default connect(mapStateToProps, null)(ManyPost)
