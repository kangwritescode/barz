import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'
import './FollowBox.css'
import FollowItem from './FollowItem/FollowItem'

function FollowBox(props) {

    const followBoxClasses = [
        'follow-box',
        'follow-box__header',
        'follow-box_body',
        "header__section",
        'follow-item__follow-button',
        'follow-box_body follow-box__expanded',
        'follow-item',
        'profile__photo',
        'details-container__name',
        'details-container__details'
    ]

    // follows
    const [follows, setfollows] = useState([])
    const [followersCount, setfollowersCount] = useState(0);
    const [followingCount, setfollowingCount] = useState(0);
    // users
    const [users, setUsers] = useState([]);
    //ui
    const [focusOn, setFocusOn] = useState('')


    // componentDidMount
    useEffect(() => {
        document.addEventListener('click', toggleFocus)
        return () => {
            document.removeEventListener('click', toggleFocus)
        };
    }, [])

    // attach listeners for users, following, followers
    useEffect(() => {
        if (props.follows) {
            var followersCount = 0;
            var followingCount = 0;
            var arr = []
                    props.follows.forEach(follow => {
                        if (follow.from === props.uid) {
                            followingCount += 1
                        }
                        if (follow.to === props.uid) {
                            followersCount += 1
                        }
                        arr.push(follow)
                    })
                    setfollowersCount(followersCount)
                    setfollowingCount(followingCount)
                    setfollows(props.follows)
                }
            }, [props.uid, followersCount, followingCount, props.follows])


    // fetch followerUsers and followingUsers
    useEffect(() => {
        if (focusOn) {
            var db = firebase.firestore()
            db.collection('users').get()
                .then(snapshot => {
                    var arr = []
                    snapshot.forEach(doc => {
                        arr.push({ ...doc.data() })
                    })
                    setUsers(arr)
                })
        }
        return () => {
        };
    }, [focusOn])

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

    // returns array of 
    const myFollowersUIDs = (follows) => {
        const myFollowsFrom = []
        follows.forEach(follow => {
            if (follow.to === props.uid) {
                myFollowsFrom.push(follow.from)
            }
        })
        return myFollowsFrom
    }
    const myFollowingUIDs = (follows) => {
        const myFollowsTo = []
        follows.forEach(follow => {
            if (follow.from === props.uid) {
                myFollowsTo.push(follow.to)
            }
        })
        return myFollowsTo
    }
    const getFilteredUsers = (users, follows) => {
        return users.filter(user => {
            if (follows.includes(user.uid)) {
                return true
            } return false
        })
    }


    // ui
    const expandedBody = focusOn ? 'follow-box__expanded' : 'follow-box__compressed'
    const followersFocused = focusOn === 'followers' ? 'focused' : null
    const followingFocused = focusOn === 'following' ? 'focused' : null

    // focus bar style
    var focusedBarStyle = null;
    if (focusOn === 'following') {
        focusedBarStyle = 'under-following'
    } else if (focusOn === 'followers') {
        focusedBarStyle = 'under-followers'
    }



    const followingUIDs = myFollowingUIDs(follows)
    const followersUIDs = myFollowersUIDs(follows)

    var followingUsers = getFilteredUsers(users, followingUIDs)
    var followedUsers = getFilteredUsers(users, followersUIDs)

    var displayedUsers;
    if (focusOn === 'following') {
        displayedUsers = followingUsers.map(user => {
            return <FollowItem follows={follows} user={user} />
        })
    } else if (focusOn === 'followers') {
        displayedUsers = followedUsers.map(user => {
            return <FollowItem follows={follows} user={user} />
        })
    }

    return (
        <div className='follow-box'>
            <div className={`follow-box__header ${focusOn ? 'follow-box_header-filled' : 'follow-box_header-unfilled'}`}>
                <div className={`header__section ${followersFocused}`} onClick={() => setFocusOn(focusOn === 'followers' ? '' : 'followers')}>
                    {followersCount} {'follower' + (followersCount !== 1 ? 's' : '')}
                    <div className={`focused-bar ${focusedBarStyle}`}></div>
                </div>
                <div className={`header__section ${followingFocused}`} onClick={() => setFocusOn(focusOn === 'following' ? '' : 'following')}>
                    {followingCount} following
                </div>
            </div>
            <div className={`follow-box_body ${expandedBody}`}>
                {displayedUsers}
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
