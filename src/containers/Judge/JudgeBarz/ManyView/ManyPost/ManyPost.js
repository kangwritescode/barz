import React, { Component, useState, useEffect } from 'react'
import './ManyPost.css'
import firebase from 'firebase'
import 'firebase/firestore'



const ManyPost = (props) => {

    const [photoURL, setphotoURL] = useState('https://firebasestorage.googleapis.com/v0/b/barz-86ae0.appspot.com/o/mysteryman%2Fmysteryman.png?alt=media&token=7b1e5a7c-ede3-46ff-a036-70636e528cd2')
    const [commentsCount, setCommentsCount] = useState(0)
    const [votes, setVotes] = useState([])

    useEffect(() => {
            var db = firebase.firestore()
            const votesListener = db.collection('postVotes').where('pid', '==', props.pid).onSnapshot(snap => {
                var votes = []
                snap.docs.forEach(doc => { votes.push(doc.data()) })
                setVotes(votes)
            })
            const commentsCountListener = db.collection('postComments').where('pid', '==', props.pid).onSnapshot(snap => {
                setCommentsCount(snap.size)
            })
        return () => {
            votesListener()
            commentsCountListener()

        };
    }, [commentsCount, votes]);




    // date
    var verboseDate = props.createdOn.toDate().toDateString()
    const date = verboseDate.slice(4, verboseDate.length)

    // content
    var content = props.content.lineOne + ' / ' + props.content.lineTwo + ' / ' + props.content.lineThree + ' / ' + props.content.lineFour

    // votes 
    var score = votes.filter(vote => {
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
                    <i class="fas fa-comment" id='manyComment'></i>
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
                    <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
                <button className='vote-button like-button'>
                    <i className="fas fa-fire"></i>
                </button>

            </div>
        </div>

    )
}


export default ManyPost
