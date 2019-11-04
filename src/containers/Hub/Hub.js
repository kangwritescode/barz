import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import './Hub.css'
import firebase from 'firebase'
// import Aux from '../../hoc/Aux/'
import yox from '../../assets/yox.m4v'
import yoxIMG from '../../assets/yoxIMG.png'
import ProfileBox from './ProfileBox/ProfileBox'
import Profile from './Profile/Profile'
import UploadImage from './Profile/UploadImage/UploadImage'


const Hub = (props) => {

    const [showPhotoModal, setShowPhotoModal] = useState(false)

    var profile = <Profile />

    const [imgURL, setImgURL] = useState('')


    // fetch imgURL if new photoRef is given
    useEffect(() => {
        if (props.photoRef) {
            console.log(props.photoRef)
            var storage = firebase.storage();
            storage.ref(props.photoRef).getDownloadURL().then(url => {
                setImgURL(url)
            }).catch(function (error) { console.log("error in Profile.js: ", error) });
            return () => {
                // cleanup
            };
        }

    }, [props.photoRef])

    if (true) {
        profile = (
            <div className="hub-layout">
                {showPhotoModal ? <UploadImage setShowPhotoModal={setShowPhotoModal} setImgURL={setImgURL}/> : null}
                <img id="backup-img" src={yoxIMG} alt="alt" />
                <video id="yox" src={yox} autoPlay={true} loop={true} playsInline={true} muted />
                <div id="yoxOverlay" />
                <div id="mv-cred">YEAR OF THE OX - MOOD CONTROL CYPHER</div>
                <div className='column-container'>
                    <div className='left-column'>
                        <ProfileBox setShowPhotoModal={setShowPhotoModal} imgURL={imgURL}/>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className='middle-column'></div>
                    <div className='right column'>
                        <div className='news-and-updates'></div>
                        <div></div>
                    </div>
                </div>
            </div>
        )
    }
    return profile

}

const mapStateToProps = state => {
    return {
        loggedIn: state.loggedIn,
        autoSignInOver: state.autoSignInOver,
        email: state.email,
        username: state.username,
        sex: state.sex,
        photoRef: state.photoRef
    }
}

export default connect(mapStateToProps, null)(Hub)

