import React, { useState } from 'react'
import './Landing.css'
import splashVid from '../../assets/splash-vid.m4v'
import LandingNav from './LandingNav/LandingNav'
import RegForm from './RegForm/RegForm'

export default function Landing() {

    // ui state
    var [isReg, updateReg] = useState(true)
    var [showErr, setShowErr] = useState(false)
    var [errMsg, setErrMsg] = useState('')
    var [errSentiment, setErrSentiment] = useState(false)

    // login
    var [email, setEmail] = useState('')
    var [password, setPassword] = useState('')

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
            setShowErr={setShowErr}
            setErrSentiment={setErrSentiment}
            setEmail={setEmail}
            setPassword={setPassword}/>
        )
    }

    return (

        <div className='landing'>
            <div className='splash-video-overlay'></div>
            <video className="splash-video" src={splashVid} autoPlay={true} loop={true} playsInline={true} muted />
            <LandingNav 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}/>
            <div className='content'>
                <div className='header-wrapper'>
                    <div className={`header-text`}>
                        <span className={`header-word ${blurOne}`}>Scribble. </span>
                        <span className={`header-word ${blurTwo}`}>Judge. </span>
                        <span className={`header-word ${blurThree}`}>Compete. </span>
                    </div>
                    <div className={`register ${registerBody}`} onClick={() => !isReg ? updateReg(!isReg) : null}>
                        {showErr && isReg ? <div className={`error-msg ${errSentiment ? 'positive-msg' : null}`} onAnimationEnd={() => {setShowErr(false); setErrSentiment(false);}}>{errMsg}</div> : null}
                        <span className={regText}>Sign Up</span>
                        {regForm}
                    </div>
                </div>
                <div className='scribble-tut'></div>
            </div>
        </div>
    )
}
