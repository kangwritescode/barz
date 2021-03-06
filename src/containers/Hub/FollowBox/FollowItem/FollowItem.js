import React, { useEffect, useState } from 'react'
import firebase from 'firebase'
import './FollowItem.css'
import 'firebase/firestore'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const FollowItem = (props) => {

    const [amFollowing, setAmFollowing] = useState(false);

    // componentDidMount
    useEffect(() => {
        return () => {
        };
    }, [])

    useEffect(() => {
        // return true if user is following this user, otherwise false
        const iAmFollowing = () => {
            return props.follows.filter(follow => follow.to === props.user.uid && follow.from === props.myUID).length !== 0
        }
        setAmFollowing(iAmFollowing)
        return () => {

        };
    }, [props.follows, props.myUID, props.user.uid])


    const follow = () => {
        let db = firebase.firestore()
        db.collection('follows').add({
            from: props.myUID,
            to: props.user.uid
        })
            .then(() => console.log('follow set successfully'))
            .catch(err => console.log(err.message))
    }

    const unfollow = () => {
        let db = firebase.firestore()
        console.log(props.uid, props.user)
        db.collection('follows')
            .where('from', '==', props.myUID)
            .where('to', '==', props.user.uid)
            .get()
            .then(snap => {
                snap.forEach(doc => {
                    doc.ref.delete()
                })
            })
            .catch(err => console.log(err))
    }


    return (
        <div className='follow-item'>
            <div className={`follow-item__profile`}>
                <Link style={{ color: 'lightgrey', textDecoration: 'none' }} to={`/${props.user.username}/`}>
                    <img className={`profile__photo`} alt='' src={props.user.photoURL}></img>
                </Link>
                <div className={`profile__details-container`}>
                    <div className={`details-container__name`}>
                        <Link style={{ color: 'lightgrey', textDecoration: 'none' }} to={`/${props.user.username}/`}>
                            {props.user.username}
                        </Link>

                    </div>
                    <div className={`details-container__details`}>
                        {props.user.address.city}, {props.user.address.state} | {props.user.gender === 'Male' ? 'M' : 'F'}
                    </div>
                </div>
            </div>
            <button
                className={`follow-item__follow-button`}
                onClick={amFollowing ? unfollow : follow}>
                {amFollowing ? 'following' : 'follow'}
            </button>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        myUID: state.user.uid
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(FollowItem)
