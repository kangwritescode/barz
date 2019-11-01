import React, { useState } from 'react'
import './Landing.css'
import splashVid from '../../assets/splash-vid.m4v'
import LandingNav from './LandingNav/LandingNav'
import RegForm from './RegForm/RegForm'

export default function Landing() {

    var [isReg, updateReg] = useState(true)

    // header-text 
    var blurOne = isReg ? 'blurOne' : null
    var blurTwo = isReg ? 'blurTwo' : null
    var blurThree = isReg ? 'blurThree' : null

    // register form
    var registerBody = isReg ? 'expanded' : null
    var regText = isReg ? 'register-text-hidden' : null

    var regForm = null;
    if (isReg) {
        regForm = <RegForm />
    }

    return (
        
        <div className='landing'>
            <div className='splash-video-overlay'></div>
            <video className="splash-video" src={splashVid} autoPlay={true} loop={true} playsInline={true} muted />
            <LandingNav />
            <div className='content'>
                <div className='header-wrapper'>
                    <div className={`header-text`}>
                        <span className={`header-word ${blurOne}`}>Scribble. </span>
                        <span className={`header-word ${blurTwo}`}>Judge. </span>
                        <span className={`header-word ${blurThree}`}>Compete. </span>
                    </div>
                    <div className={`register ${registerBody}`} onClick={() => !isReg ? updateReg(!isReg) : null}>
                        <span className={regText}>Sign Up</span>
                        {regForm}
                    </div>
                </div>
                <div className='scribble-tut'></div>
            </div>
        </div>
    )
}
