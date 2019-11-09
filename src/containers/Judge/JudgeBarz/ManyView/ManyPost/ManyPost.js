import React, { Component, useState, useEffect } from 'react'
import './ManyPost.css'
import firebase from 'firebase'
import 'firebase/firestore'



const ManyPost = (props) => {

    const [commentsCount, setCommentsCount] = useState(0)
    const [myVote, setMyVote] = useState(0)


    useEffect(() => {
        if (props.pid && props.votes && props.uid) {
            var db = firebase.firestore()
            const commentsCountListener = db.collection('postComments').where('pid', '==', props.pid).onSnapshot(snap => {
                setCommentsCount(snap.size)
            })

            console.log(props.votes)
            var myVote = props.votes.filter(vote => vote.voterID === props.uid)
            myVote = myVote.length === 1 && myVote[0].value !== 0 ? myVote[0].value : 0
            setMyVote(myVote)
            return () => {
                commentsCountListener()
            };
        }

        
    }, [props.pid, props.uid, props.votes]);


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
            className={`many-post scrollTo${props.pid}`}
            id={`scrollTo${props.pid}`}
            onClick={() => props.selectPost(props.pid)}
            style={props.customStyle ? props.customStyle.body : null}
        >
            <header>
                <div className='many-post-details' id={props.pid}>
                    <img className='many-post-pic' src={props.photoURL} alt='pic'></img>
                    <div className='many-post-name-date-container'>
                        <h6 style={props.customStyle ? props.customStyle.username : null}>{props.username}</h6>
                        <p>{date}</p>
                    </div>
                </div>
                <div className='many-post-region' id={coastColor}>
                    {props.address.region.toLowerCase()}
                </div>
                <div className='many-post-misc'>
                    <i class="fas fa-comment" id='manyComment' ></i>
                    {commentsCount}
                    <i className="fas fa-fire" id='manyFlame' aria-hidden="true"></i>
                    {score.length}
                </div>
            </header>
            <div className='many-post-body'>
                <p style={props.customStyle ? props.customStyle.paragraph : null}>{`"${content}"`}</p>
            </div>

            <div className='vote-box'>
                <button className='vote-button dislike-button'>
                    <i className="fa fa-trash" style={myVote === -1 ? {color: 'darkRed'}: null} aria-hidden="true"></i>
                </button>
                <button className='vote-button like-button'>
                    <i className="fas fa-fire" style={myVote === 1 ? {color: 'orange'}: null}></i>
                </button>

            </div>
        </div>

    )
}


export default ManyPost
