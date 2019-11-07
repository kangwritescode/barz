import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'
import './FollowBox.css'

function FollowBox(props) {

    const followBoxClasses = [
        'follow-box',
        'follow-box__header',
        'follow-box_body',
        "header__section"
    ]

    // follows
    const [followedByCount, setFollowedByCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
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
            var followersPromise = fetchFollowers()
            var followingPromise = fetchFollowing()
            return () => {
                followersPromise.then(listener => listener())
                followingPromise.then(listener => listener())
            }
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

    const fetchFollowers = async () => {
        var db = firebase.firestore()
        return db.collection('follows').where('to', '==', props.uid)
            .onSnapshot(snapshot => {
                setFollowedByCount(snapshot.size)
                var arr = []
                snapshot.forEach(doc => {
                    arr.push(doc.data().from)
                })
                setFollowedBy(arr)
            })
    }
    const fetchFollowing = async () => {
        var db = firebase.firestore()
        return db.collection('follows').where('from', '==', props.uid)
            .onSnapshot(snapshot => {
                setFollowingCount(snapshot.size)
                var arr = []
                snapshot.forEach(doc => {
                    arr.push(doc.data().to)
                })
                setFollowing(arr)
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
            <div className={`follow-box__header ${focusOn ? 'follow-box_header-filled' : 'follow-box_header-unfilled'}`}>
                <div className={`header__section ${followersFocused}`} onClick={() => setFocusOn(focusOn === 'followers' ? '' : 'followers')}>
                    {followedBy.length} {'follower' + (followedByCount !== 1 ? 's' : '')}
                    <div className={`focused-bar ${focusedBarStyle}`}></div>
                </div>
                <div className={`header__section ${followingFocused}`} onClick={() => setFocusOn(focusOn === 'following' ? '' : 'following')}>
                    {followingCount} following
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
