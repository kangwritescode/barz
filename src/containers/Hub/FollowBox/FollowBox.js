import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import {connect} from 'react-redux'
import './FollowBox.css'

function FollowBox(props) {
    const [state, setState] = useState({
        followedBy: [],
        following: [],
        users: {}
    })

    // componentDidMount
    useEffect(() => {
        fetchFollows()
        fetchUsers()
        return () => {
        };
    }, [])

    const fetchFollows = () => {
        var db = firebase.firestore()
        db.collection('follows').get()
            .then(snap => {
                var following = []
                var followedBy = []
                snap.forEach(doc => {
                    var follow = {
                        ...doc.data()
                    }
                    console.log(follow)
                    if (follow.to === props.uid) {
                        followedBy.push(follow.from)
                    } else if (follow.from === props.uid) {
                        following.push(follow.to)
                    }
                })
                setState({
                    ...state,
                    following: following,
                    followedBy: followedBy
                })
            })
    }
    const fetchUsers = () => {
        var db = firebase.firestore()
        db.collection('users').get()
            .then(snap => {
                var users = {}
                snap.forEach(doc => {
                    users[doc.id] = doc.data()
                })
                setState({
                    ...state,
                    users: users
                })
            })
    }

    
    return (
        <div className='follow-box'>
            <div className='follow-box__header'>
                <div className='header__section'>
                    {state.followedBy} followers
                </div>
                <div className='header__section'>
                    {state.following} following
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
