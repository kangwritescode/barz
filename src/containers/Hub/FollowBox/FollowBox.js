import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import {connect} from 'react-redux'
import './FollowBox.css'

function FollowBox(props) {

    const followBoxClasses = [
        'follow-box',
        'follow-box__header',
        'follow-box_body',
        "header__section"
    ]

    // follows
    const [followedBy, setFollowedBy] = useState([])
    const [following, setFollowing] = useState([])
    // users
    const [users, setUsers] = useState({})
    //ui
    const [focusOn, setFocusOn] = useState('')


    useEffect(() => {
        document.addEventListener('click', toggleFocus)
        return () => {
            document.removeEventListener('click', toggleFocus)
        };
    }, [])

    useEffect(() => {
        if (props.uid) {
            fetchUsers()
            fetchFollows()
        }
    }, [props.uid])

    const toggleFocus = (event) => {
        var clickedOnFollowBox = false;
        followBoxClasses.forEach(className => {
            if (event.target.classList.contains(className)) {
                clickedOnFollowBox = true
            } 
        });
        if (clickedOnFollowBox) {
            return
        } else {
            setFocusOn('')
        }
       
    }

    const fetchFollows = async () => {
        var db = firebase.firestore()
        db.collection('follows').get()
            .then(snap => {
                var following = []
                var followedBy = []
                snap.forEach(doc => {
                    var follow = {
                        ...doc.data()
                    }
                    if (follow.to === props.uid) {
                        followedBy.push(follow.from)
                    } else if (follow.from === props.uid) {
                        following.push(follow.to)
                    }
                })
                setFollowedBy(followedBy)
                setFollowing(following)
            })
    }
    const fetchUsers = async () => {
        var db = firebase.firestore()
        db.collection('users').get()
            .then(snap => {
                var users = {}
                snap.forEach(doc => {
                    users[doc.id] = doc.data()
                })
                setUsers(users)
            })
    }

    
    const expandedBody = focusOn ? 'follow-box__expanded' : 'follow-box__compressed'
    const followersFocused = focusOn === 'followers' ? 'focused' : null
    const followingFocused = focusOn === 'following' ? 'focused' : null
   
    var focusedBarStyle = null;
    if (focusOn === 'following') {
        focusedBarStyle = 'under-following'
    } else if (focusOn === 'followers') {
        focusedBarStyle = 'under-followers'
    }

    return (
        <div className='follow-box'>
            <div className='follow-box__header'>
                <div className={`header__section ${followersFocused}`} onClick={() => setFocusOn(focusOn === 'followers' ? '' : 'followers')}>
                    {followedBy.length} {'follower' + (followedBy.length !== 1 ? 's' : '')}
                    <div className={`focused-bar ${focusedBarStyle}`}></div>
                </div>
                <div className={`header__section ${followingFocused}`} onClick={() => setFocusOn(focusOn === 'following' ? '' : 'following')}>
                    {following.length} following
                </div>
            </div>
            <div className={`follow-box_body ${expandedBody}`}>

            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        uid: state.uid,
    }
}

const mapDispatchToProps = dispatch => {
    return {
       
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(FollowBox)
