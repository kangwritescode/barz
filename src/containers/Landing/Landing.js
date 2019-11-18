import firebase from 'firebase'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import splashVid from '../../assets/videos/splash-vid.m4v'
import { fetchUserData } from '../../store/actions/auth'
import ForgotPassword from './ForgotPassword/ForgotPassword'
import './Landing.css'
import LandingNav from './LandingNav/LandingNav'
import RegForm from './RegForm/RegForm'
import Scroller from './Scroller/Scroller'
import validator from 'validator'
import AuthForm from './AuthForm/AuthForm'

const Landing = (props) => {

    

    let [showForgotPass, toggleForgotPass] = useState(false)




    return (

        <div className='landing'>
            {showForgotPass ? <ForgotPassword toggleForgotPass={toggleForgotPass} /> : null}
            <div className='landing__video-overlay'></div>
            <video className="landing__video" src={splashVid} autoPlay={'false'} loop={true} playsInline={true} muted />
            <div className={`landing__letter-box-top`}></div>
            <div className='landing__hor-flex'>
                <Scroller />
                <AuthForm toggleForgotPass={toggleForgotPass}/>
            </div>
            <div className={`landing__letter-box-bottom`}></div>
        </div>
    )

}

const mapDispatchToProps = dispatch => {
    return {
        getUserData: (uid) => dispatch(fetchUserData(uid))
    }
}

export default connect(null, mapDispatchToProps)(Landing)








