import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import {connect} from 'react-redux'
import './FollowBox.css'

function FollowBox(props) {

    const [followedBy, setFollowedBy] = useState([])
    const [following, setFollowing] = useState([])
    const [users, setUsers] = useState({})

    // componentDidMount
    useEffect(() => {
        if (props.uid) {
            fetchUsers()
            fetchFollows()
        }
    }, [props.uid])

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

    
    return (
        <div className='follow-box'>
            <div className='follow-box__header'>
                <div className='header__section'>
                    {followedBy.length} {'follower' + (followedBy.length !== 1 ? 's' : '')}
                </div>
                <div className='header__section'>
                    {following.length} following
                </div>
            </div>
            <div className='follow-box_body'></div>
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
