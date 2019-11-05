import React, { useEffect, useState } from 'react'
import './ProfileBox.css'
import PhotoContainer from '../Profile/PhotoContainer/PhotoContainer'
import * as actionTypes from '../../../store/actions'
import DeleteAccount from '../Profile/DeleteAccount/DeleteAccount'
import firebase from 'firebase'
import { getOrdinal } from '../../../shared/getOrdinal'
import ig from '../../../assets/handles/ig.png'
import fb from '../../../assets/handles/fb.png'
import sc from '../../../assets/handles/sc.png'
import yt from '../../../assets/handles/yt.png'
import { connect } from 'react-redux'

function ProfileBox(props) {

    const [showDropOptions, toggleDropOptions] = useState(false)
    const [showDeleteAcc, toggleDeleteAcc] = useState(false)
    const [imgURL, setImgURL] = useState(null)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        document.addEventListener('click', closeDropOptions)
        return () => {
            document.removeEventListener('click', closeDropOptions)
        };
    }, [])

    useEffect(() => {
        if (props.uid) {
            fetchUserData(props.uid)
        }
        if (props.photoRef) {
            fetchPhotoURL(props.photoRef)
        }
        return () => {
        };
    }, [props.uid, props.photoRef])

    const fetchUserData = async (uid) => {
        var db = firebase.firestore()
        db.collection('users').doc(uid).get()
            .then(user => {
                user = {
                    ...user.data(),
                    uid: user.id
                }
                setUserData(user)
            })
    }
    const fetchPhotoURL = async (photoRef) => {
        var storage = firebase.storage();
        storage.ref(photoRef).getDownloadURL().then(url => {
            setImgURL(url)
        }).catch(function (error) { console.log("error in Profile.js: ", error) });
        return () => {
            // cleanup
        };
    }

    const addhttp = (url) => {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }

    const closeDropOptions = (event) => {
        if (!event.target.classList.contains('profile-box__three-dots') && !event.target.classList.contains('dot')) {
            toggleDropOptions(false)
        }
    }

    var myAccountOptions = null;
    var theHandles = null;
    var blockTwo = null;

    if (props.wrappedBy === 'Hub') {
        myAccountOptions = (
            <div>
                <div className='profile-box__three-dots' onClick={() => toggleDropOptions(!showDropOptions)}>
                    <div className='dot' />
                    <div className='dot' />
                    <div className='dot' />
                </div>
                {showDropOptions ?
                    <div className='profile-box__drop-options'>
                        <div className='drop-options__log-out' onClick={props.logout}>Log Out</div>
                    </div> : null}

                <i className="fas fa-cog profile-box__settings" onClick={() => toggleDeleteAcc(true)}></i>
            </div>
        )
        theHandles = (
            <div className='block-one__handles-container'>
                <i className="fab fa-facebook-f icon" onClick={() => props.toggleUploadHandles(true)}></i>
                <i className="fab fa-instagram icon" onClick={() => props.toggleUploadHandles(true)}></i>
                <i className="fab fa-soundcloud icon" onClick={() => props.toggleUploadHandles(true)}></i>
                <i className="fab fa-youtube icon" onClick={() => props.toggleUploadHandles(true)}></i>
            </div>
        )
        blockTwo = (
            <div className='profile-box__block-two'>
                <div>
                    {props.myPlace + getOrdinal(props.myPlace) + " place"}
                </div>
                <div>
                    {props.myPoints + " point" + (props.myPoints === 1 ? '' : 's')}
                </div>
            </div>
        )

    }

    else if (props.wrappedBy === 'Rappers') {
        theHandles = (
            <div className='block-one__handles-container'>
                {userData && userData.handles.facebook ?
                    <a href={addhttp(userData.handles.facebook)} rel="noopener noreferrer" target="_blank">
                        <i className="fab fa-facebook-f icon" onClick={() => props.toggleUploadHandles(true)}></i>
                    </a> : null}
                {userData && userData.handles.instagram ?
                    <a href={addhttp(userData.handles.instagram)} rel="noopener noreferrer" target="_blank">
                        <i className="fab fa-instagram icon" onClick={() => props.toggleUploadHandles(true)}></i>
                    </a> : null}
                {userData && userData.handles.soundcloud ?
                    <a href={addhttp(userData.handles.soundcloud)} rel="noopener noreferrer" target="_blank">
                        <i className="fab fa-soundcloud icon" onClick={() => props.toggleUploadHandles(true)}></i>
                    </a> : null}
                {userData && userData.handles.youtube ?
                    <a href={addhttp(userData.handles.youtube)} rel="noopener noreferrer" target="_blank">
                        <i className="fab fa-youtube icon" onClick={() => props.toggleUploadHandles(true)}></i>
                    </a> : null}
            </div>
        )
        blockTwo = (
            <div className='profile-box__block-two'>
            </div>
        )
    }


    return (
        <div className='profile-box' >
            {showDeleteAcc ? <DeleteAccount toggleDeleteAcc={toggleDeleteAcc} /> : null}
            {myAccountOptions}
            <div className='profile-box__block-one'>
                <PhotoContainer imgURL={imgURL} setShowPhotoModal={props.setShowPhotoModal} />
                <div className='block-one__username'>{userData ? userData.username : null}</div>
                <div className='block-one__address-gender'>{userData ? userData.address.city : null}, {userData ? userData.address.state : null} | {userData ? userData.gender : null}</div>
                {theHandles}
                <p className='block-one__blurb'>"West Philadelpha born and raised on the playground was where I spent most of my days..."</p>
            </div>
            {blockTwo}
        </div>
    )
}
const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({ type: actionTypes.LOG_OUT })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBox)
