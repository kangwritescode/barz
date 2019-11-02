import React, { useState } from 'react'
import './Landing.css'
import splashVid from '../../assets/splash-vid.m4v'
import LandingNav from './LandingNav/LandingNav'
import RegForm from './RegForm/RegForm'

export default function Landing() {

    // state
    var [isReg, updateReg] = useState(true)
    var [showErr, setShowErr] = useState(false)
    var [errMsg, setErrMsg] = useState('nuuu buggy buggy')


    // header-text 
    var blurOne = isReg ? 'blurOne' : null
    var blurTwo = isReg ? 'blurTwo' : null
    var blurThree = isReg ? 'blurThree' : null

    // register form
    var registerBody = isReg ? 'expanded' : null
    var regText = isReg ? 'register-text-hidden' : null

    var regForm = null;
    if (isReg) {
        regForm = (
        <RegForm 
            updateReg={updateReg} 
            setErrMsg={setErrMsg}
            setShowErr={setShowErr}/>
        )
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
                        {showErr ? <div className={`error-msg`} onAnimationEnd={() => setShowErr(false)}>{errMsg}</div> : null}
                        <span className={regText}>Sign Up</span>
                        {regForm}
                    </div>
                </div>
                <div className='scribble-tut'></div>
            </div>
        </div>
    )
}
