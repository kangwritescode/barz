import React, { useEffect, useState } from 'react'
import './ProfileBox.css'
import PhotoContainer from '../Profile/PhotoContainer/PhotoContainer'
import ig from '../../../assets/handles/ig.png'
import fb from '../../../assets/handles/fb.png'
import sc from '../../../assets/handles/sc.png'
import yt from '../../../assets/handles/yt.png'
import firebase from 'firebase'
import { connect } from 'react-redux'

function ProfileBox(props) {




    return (
        <div className='profile-box'>
            <div className='profile-box__block-one'>
                <div className='block-one__username'>{props.username}</div>
                <div className='block-one__address-gender'>{props.address.city}, {props.address.state} | {props.sex}</div>
                <PhotoContainer imgURL={props.imgURL} setShowPhotoModal={props.setShowPhotoModal} />
            </div>
            <div className='profile-box__block-two'>
                <p className='block-two__blurb'>"West Philidelphia born and raised, on the playground was where i spent most of my days"</p>
            </div>
            <div className='profile-box__block-three'>
                <div className='handle-container'>
                    <img className={`block-three__fb`} alt="alt" src={fb}></img>
                </div>
                <div className='handle-container'>
                    <img className={`block-three__ig`} alt="alt" src={ig}></img>
                </div>
                <div className='handle-container'>
                    <img className={`block-three__sc`} alt="alt" src={sc}></img>
                </div>
                <div className='handle-container'>
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
        handles: state.handles,
    }
}

export default connect(mapStateToProps, null)(ProfileBox)
