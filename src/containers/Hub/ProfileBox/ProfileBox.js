import React, { useEffect, useState } from 'react'
import './ProfileBox.css'
import PhotoContainer from '../Profile/PhotoContainer/PhotoContainer'
import * as actionTypes from '../../../store/actions'
import DeleteAccount from '../Profile/DeleteAccount/DeleteAccount'
import ig from '../../../assets/handles/ig.png'
import fb from '../../../assets/handles/fb.png'
import sc from '../../../assets/handles/sc.png'
import yt from '../../../assets/handles/yt.png'
import { connect } from 'react-redux'

function ProfileBox(props) {

    const [showDropOptions, toggleDropOptions] = useState(false)
    const [showDeleteAcc, toggleDeleteAcc] = useState(false)

    useEffect(() => {
        document.addEventListener('click', closeDropOptions)
        return () => {
        };
    }, [])

    const closeDropOptions = (event) => {
        if (!event.target.classList.contains('profile-box__three-dots') && !event.target.classList.contains('dot')) {
            toggleDropOptions(false)
        }
    }

    const activeFB = props.handles.facebook ? 'active-handle' : null
    const activeIG = props.handles.instagram ? 'active-handle' : null
    const activeSC = props.handles.soundcloud ? 'active-handle' : null
    const activeYT = props.handles.youtube ? 'active-handle' : null

    var myAccountOptions = null

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
    }


    return (
        <div className='profile-box'>
            {showDeleteAcc ? <DeleteAccount toggleDeleteAcc={toggleDeleteAcc} /> : null}
            {myAccountOptions}
            <div className='profile-box__block-one'>
                <div className='block-one__username'>{props.username}</div>
                <div className='block-one__address-gender'>{props.address.city}, {props.address.state} | {props.sex}</div>
                <PhotoContainer imgURL={props.photoURL} setShowPhotoModal={props.setShowPhotoModal} />
            </div>
            <div className='profile-box__block-two'>
                <p className='block-two__blurb'>"West Philidelphia born and raised, on the playground was where i spent most of my days"</p>
            </div>
            <div className='profile-box__block-three'>
                <div className={`handle-container ${activeFB}`} onClick={() => props.toggleUploadHandles(true)}>
                    <img className={`block-three__fb`} alt="alt" src={fb}></img>
                </div>
                <div className={`handle-container ${activeIG}`} onClick={() => props.toggleUploadHandles(true)}>
                    <img className={`block-three__ig`} alt="alt" src={ig}></img>
                </div>
                <div className={`handle-container ${activeSC}`} onClick={() => props.toggleUploadHandles(true)}>
                    <img className={`block-three__sc`} alt="alt" src={sc}></img>
                </div>
                <div className={`handle-container ${activeYT}`} onClick={() => props.toggleUploadHandles(true)}>
                    <img className={`block-three__yt`} alt="alt" src={yt}></img>
                </div>




            </div>

        </div>
    )
}
const mapStateToProps = state => {
    return {
        uid: state.uid,
        loggedin: state.loggedIn,
        email: state.email,
        username: state.username,
        sex: state.gender,
        address: state.address,
        zipcode: state.address.zip_code,
        city: state.address.city,
        state: state.address.state,
        needsInfo: state.needsInfo,
        photoRef: state.photoRef,
        photoURL: state.photoURL,
        handles: state.handles,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({ type: actionTypes.LOG_OUT })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBox)
