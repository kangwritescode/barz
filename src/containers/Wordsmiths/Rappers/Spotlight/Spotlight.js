import React, { useEffect, useState } from 'react'
import './Spotlight.css'
import PhotoContainer from '../../../Hub/ProfileBox/PhotoContainer/PhotoContainer'
import * as actionTypes from '../../../../store/actions/actionsTypes'
import * as actions from '../../../../store/actions/index'
import firebase from 'firebase'
import { getOrdinal } from '../../../../shared/getOrdinal'
import { connect } from 'react-redux'
import { postUserData } from '../../../../store/actions/auth'



function Spotlight(props) {

    const [showDropOptions, toggleDropOptions] = useState(false)
    const [follows, setFollows] = useState([])
    const [amFollowing, setAmFollowing] = useState(false)
    const [blurbText, setBlurbText] = useState('')



    // componentDidMount
    useEffect(() => {
        document.addEventListener('click', closeDropOptions)
        fetchFollows()
        return () => {
            document.removeEventListener('click', closeDropOptions)
        };
    }, [])

    // componentDidUpdate
    useEffect(() => {

        const calcAmFollowing = (otherUID) => {

            let follow = follows
                .filter(follow => {
                    return follow.to === otherUID && follow.from === props.uid
                })
            setAmFollowing(follow.length === 0 ? false : true)
        }

        if (props.rapper) {
            console.log(props.rapper)
            calcAmFollowing(props.rapper.uid)
        }
        if (props.blurb) {
            setBlurbText(props.blurb)
        }
    }, [props.photoURL, props.rapper, follows, props.uid, props.blurb])

    const fetchFollows = async () => {
        let db = firebase.firestore()
        let follows = await db.collection("follows").get().then(((querySnapshot) => {
            let fetchedFollows = []
            querySnapshot.forEach(doc => {
                fetchedFollows.push({
                    ...doc.data(),
                    fid: doc.id
                })
            })
            return fetchedFollows
        }))
        setFollows(follows)

    }


    const follow = () => {
        setAmFollowing(true)
        let db = firebase.firestore()
        db.collection('follows').add({
            from: props.uid,
            to: props.rapper.uid
        })
            .then(() => fetchFollows())
            .catch(err => console.log(err.message))
    }

    const unfollow = () => {
        setAmFollowing(false)
        let db = firebase.firestore()
        db.collection('follows')
            .where('from', '==', props.uid)
            .where('to', '==', props.rapper.uid)
            .get()
            .then(snap => {
                snap.forEach(doc => {
                    doc.ref.delete()
                })
                fetchFollows()
            })
            .catch(err => console.log(err))
    }

    const addhttp = (url) => {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }

    const closeDropOptions = (event) => {
        if (!event.target.classList.contains('spotlight__three-dots') && !event.target.classList.contains('dot')) {
            toggleDropOptions(false)
        }
    }


    let username = props.rapper ?
        <div className='block-one__username'>{props.rapper ? props.rapper.username : null}</div>
        : <h2 className='block-one__select-a-user'>Select a User</h2>
    let addressGender = props.rapper ?
        <div className='block-one__address-gender'>{props.rapper ? props.rapper.city : null}, {props.rapper ? props.rapper.state : null} | {props.rapper ? props.rapper.gender : null}</div>
        : null


    let photo = props.rapper ?
        <div className='block-one__img-wrapper'>
            <div>
                <img alt='' src={props.rapper.photoURL} />
                {props.rapper.rank === 1 ? 
                    <i class="fas fa-crown crown"></i> 
                    : null}
                {props.rapper.rank === 2 ? 
                    <i class="fas fa-crown crown" style={{color: 'silver'}}></i> 
                    : null}
                    
            </div>

        </div>
        : null
    let button = <button className='follow-button' onClick={follow}>follow</button>
    if (amFollowing) {
        button = <button className='follow-button' onClick={unfollow}>following</button>
    }
    let handles = null;


    if (props.rapper && (props.rapper.handles.facebook
        || props.rapper.handles.soundcloud
        || props.rapper.handles.instagram
        || props.rapper.handles.youtube)) {
        handles = (<div className='block-one__handles-container'>
            {props.rapper && props.rapper.handles.facebook ?
                <a href={addhttp(props.rapper.handles.facebook)} rel="noopener noreferrer" target="_blank">
                    <i className="fab fa-facebook-f icon"></i>
                </a> : null}
            {props.rapper && props.rapper.handles.instagram ?
                <a href={addhttp(props.rapper.handles.instagram)} rel="noopener noreferrer" target="_blank">
                    <i className="fab fa-instagram icon"></i>
                </a> : null}
            {props.rapper && props.rapper.handles.soundcloud ?
                <a href={addhttp(props.rapper.handles.soundcloud)} rel="noopener noreferrer" target="_blank">
                    <i className="fab fa-soundcloud icon"></i>
                </a> : null}
            {props.rapper && props.rapper.handles.youtube ?
                <a href={addhttp(props.rapper.handles.youtube)} rel="noopener noreferrer" target="_blank">
                    <i className="fab fa-youtube icon"></i>
                </a> : null}
        </div>)
    }
    let blurb = null;
    if (props.rapper && props.rapper.blurb) {
        blurb = (
            <p className='block-one__blurb' style={{ cursor: 'text' }}>
                    {props.rapper ? props.rapper.blurb : null}
                </p>
        )
    }
    console.log(props.rapper)
    return (
        <div className='spotlight' >
            <div className='spotlight__block-one'>

                {photo}
                {username}
                {addressGender}
                {handles}
                {blurb}
            </div>
            <div className='spotlight__block-two' style={{ fontSize: '.7em' }}>
                {props.focus === 'them' ? button : null}
                <div>{props.rapper ? props.rapper.rank + getOrdinal(props.rapper.rank) + ' place' : null} </div>
                <div>{props.rapper ? props.rapper.votes + (props.rapper.votes === 1 ? ' point' : ' points') : null} </div>

            </div>
        </div>
    )
}


const mapStateToProps = state => {
    return {
        uid: state.user.uid,
        email: state.user.email,
        username: state.user.username,
        sex: state.user.gender,
        address: state.user.address,
        zipcode: state.user.address.zip_code,
        city: state.user.address.city,
        state: state.user.address.state,
        needsInfo: state.user.needsInfo,
        photoURL: state.user.photoURL,
        blurb: state.user.blurb
    }
}



const mapDispatchToProps = dispatch => {
    return {
        postUserData: (uid, data) => dispatch(postUserData(uid, data)),
        logout: () => dispatch(actions.logOut())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Spotlight)
