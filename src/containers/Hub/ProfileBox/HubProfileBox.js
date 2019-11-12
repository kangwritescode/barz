import React, { useEffect, useState } from 'react'
import './HubProfileBox.css'
import PhotoContainer from '../Profile/PhotoContainer/PhotoContainer'
import * as actionTypes from '../../../store/actions'
import firebase from 'firebase'
import { getOrdinal } from '../../../shared/getOrdinal'
import { connect } from 'react-redux'
import { postUserData } from '../../../store/actionCreators'
import DotSpinner from '../../../shared/DotSpinner/DotSpinner'



function HubProfileBox(props) {

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


    const closeDropOptions = (event) => {
        if (!event.target.classList.contains('hub-profile-box__three-dots') && !event.target.classList.contains('dot')) {
            toggleDropOptions(false)
        }
    }

    const textAreaKeyDown = event => {
        if (event.keyCode === 13) {
            event.preventDefault()
            event.target.blur()
        }
    }


    var blockOneContent = null;
    // <DotSpinner customStyle={{position: 'absolute', top: '-1em'}}/>
    if (props.username) {
        blockOneContent = (
            <div className={`block-one__contents-wrapper`}>
                <PhotoContainer imgURL={props.photoURL} setShowPhotoModal={props.setShowPhotoModal} />
                <div className='contents-wrapper__username'>{props.username}</div>
                <div className='contents-wrapper__address-gender'>{props.city}, {props.state} | {props.sex}</div>
                <div className='contents-wrapper__handles-container'>
                    <i className="fab fa-facebook-f icon" onClick={() => props.toggleUploadHandles(true)}></i>
                    <i className="fab fa-instagram icon" onClick={() => props.toggleUploadHandles(true)}></i>
                    <i className="fab fa-soundcloud icon" onClick={() => props.toggleUploadHandles(true)}></i>
                    <i className="fab fa-youtube icon" onClick={() => props.toggleUploadHandles(true)}></i>
                </div>
                <textarea
                    className='contents-wrapper__blurb'
                    placeholder='-Write a blurb-'
                    spellCheck={false}
                    maxLength={55}
                    onKeyDown={event => textAreaKeyDown(event)}
                    onChange={event =>  setBlurbText(event.target.value)}
                    onBlur={event => props.postUserData(props.uid, { blurb: event.target.value })}
                    value={blurbText} />
            </div>
        )
    }

    var blockTwoContent = null;

    if (props.myPlace) {
        blockTwoContent = (
            <div className={'block-two__place-point-container'}>
                <div>
                    {props.myPlace + getOrdinal(props.myPlace) + " place"}
                </div>
                <div>
                    {props.myPoints + " point" + (props.myPoints === 1 ? '' : 's')}
                </div>
            </div>
        )
    }

    return (<div className='hub-profile-box' >

        <div>
            <div className='hub-profile-box__three-dots' onClick={() => toggleDropOptions(!showDropOptions)}>
                <div className='dot' />
                <div className='dot' />
                <div className='dot' />
            </div>
            {showDropOptions ?
                <div className='hub-profile-box__drop-options'>
                    <div className='drop-options__log-out' onClick={props.logout}>Log Out</div>
                </div> : null}

            <i className="fas fa-cog hub-profile-box__settings" onClick={() => props.toggleDeleteAcc(true)}></i>
        </div>
        <div className='hub-profile-box__block-one'>
            {blockOneContent}
        </div>
        <div className='hub-profile-box__block-two'>
            {blockTwoContent}
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

export default connect(mapStateToProps, mapDispatchToProps)(HubProfileBox)
