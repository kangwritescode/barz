import React, { useEffect, useState } from 'react'
import './Spotlight.css'
import PhotoContainer from '../../../Hub/Profile/PhotoContainer/PhotoContainer'
import * as actionTypes from '../../../../store/actions'
import firebase from 'firebase'
import { getOrdinal } from '../../../../shared/getOrdinal'
import { connect } from 'react-redux'
import { postUserData } from '../../../../store/actionCreators'



function Spotlight(props) {

    const [showDropOptions, toggleDropOptions] = useState(false)
    const [imgURL, setImgURL] = useState(null)
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

            var follow = follows
                .filter(follow => {
                    return follow.to === otherUID && follow.from === props.uid
                })
            setAmFollowing(follow.length === 0 ? false : true)
        }

        if (props.rapper) {
            console.log(props.rapper)
            setImgURL(props.rapper.photoURL)
            calcAmFollowing(props.rapper.uid)
        }
        if (props.blurb) {
            setBlurbText(props.blurb)
        }
    }, [props.photoRef, props.rapper, follows, props.uid, props.blurb])

    const fetchFollows = async () => {
        var db = firebase.firestore()
        var follows = await db.collection("follows").get().then(((querySnapshot) => {
            var fetchedFollows = []
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
        var db = firebase.firestore()
        db.collection('follows').add({
            from: props.uid,
            to: props.rapper.uid
        })
            .then(() => fetchFollows())
            .catch(err => console.log(err.message))
    }

    const unfollow = () => {
        setAmFollowing(false)
        var db = firebase.firestore()
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


    var username = props.rapper ?
        <div className='block-one__username'>{props.rapper ? props.rapper.username : null}</div>
        : <h2 className='block-one__select-a-user'>Select a User</h2>
    var addressGender = props.rapper ?
        <div className='block-one__address-gender'>{props.rapper ? props.rapper.city : null}, {props.rapper ? props.rapper.state : null} | {props.rapper ? props.rapper.gender : null}</div>
        : null


    var photo = props.rapper ?
        <div className='block-one__img-wrapper'>
            <img alt='' src={imgURL} />
        </div>
        : null
    var button = <button className='follow-button' onClick={follow}>follow</button>
    if (amFollowing) {
        button = <button className='follow-button' onClick={unfollow}>following</button>
    }
    var handles = null;
    console.log(props.rapper)
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

    return (
        <div className='spotlight' >
            <div className='spotlight__block-one'>

                {photo}
                {username}
                {addressGender}
                {handles}

                <p className='block-one__blurb' style={{ cursor: 'text' }}>
                    {props.rapper ? props.rapper.blurb : null}
                </p>
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
        uid: state.uid,
        email: state.email,
        username: state.username,
        sex: state.gender,
        address: state.address,
        zipcode: state.address.zip_code,
        city: state.address.city,
        state: state.address.state,
        needsInfo: state.needsInfo,
        photoURL: state.photoURL,
        blurb: state.blurb
    }
}



const mapDispatchToProps = dispatch => {
    return {
        postUserData: (uid, data) => dispatch(postUserData(uid, data)),
        logout: () => dispatch({ type: actionTypes.LOG_OUT })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Spotlight)
