import React, { useState } from 'react'
import './Landing.css'
import { fetchUserData } from '../../store/actionCreators'
import { connect } from 'react-redux'
import splashVid from '../../assets/splash-vid.m4v'
import LandingNav from './LandingNav/LandingNav'
import firebase from 'firebase'
import RegForm from './RegForm/RegForm'
import ForgotPassword from '../Authenticate/SignIn/ForgotPassword/ForgotPassword'

const Landing = (props) => {

    // ui state
    var [isReg, updateReg] = useState(false)
    var [showErr, setShowErr] = useState(false)
    var [errMsg, setErrMsg] = useState('')
    var [errSentiment, setErrSentiment] = useState(false)

    var [showForgotPass, toggleForgotPass] = useState(false)

    // login
    var [email, setEmail] = useState('')
    var [password, setPassword] = useState('')



    // sign in
    const signIn = async (event) => {

        event.preventDefault()
        try {
            const uid = await authenticate(email, password)
            props.getUserData(uid)
        }
        catch (err) {
            switch (err.code) {
                case 'auth/invalid-email':
                    console.log(err.message)
                    break;
                case "auth/too-many-requests":
                    var errMsg = "Too many unsuccessful login attempts. Please try again later."
                    console.log(errMsg)
                    break;
                case 'auth/user-not-found':
                    console.log(err.message)
                    break;
                case 'auth/wrong-password':
                    console.log(err.message)
                    break;
                default:
                    console.log(err, 'default!')
            }
        }
    }
    // authenticate
    const authenticate = async (email, password) => {

        return await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(successObj => {
                // now's date
                var expirationDate = new Date()
                // now's date + 1 hour
                expirationDate.setHours(expirationDate.getHours() + 100)
                localStorage.setItem('token', successObj.user.refreshToken)
                localStorage.setItem('expirationDate', expirationDate)
                localStorage.setItem('uid', successObj.user.uid)
                return successObj.user.uid

            })
            .catch(function (error) {
                console.log(error)
                throw error
            });
    }







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
                setPassword={setPassword} />
        )
    }

    return (

        <div className='landing'>
            {showForgotPass ? <ForgotPassword toggleForgotPass={toggleForgotPass}/> : null}
            <div className='splash-video-overlay'></div>
            <video className="splash-video" src={splashVid} autoPlay={true} loop={true} playsInline={true} muted />
            <LandingNav
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                trySignIn={signIn} 
                toggleForgotPass={toggleForgotPass}/>
            <div className='content'>
                <div className='header-wrapper'>
                    <div className={`header-text`}>
                        <span className={`header-word ${blurOne}`}>Scribble. </span>
                        <span className={`header-word ${blurTwo}`}>Judge. </span>
                        <span className={`header-word ${blurThree}`}>Compete. </span>
                    </div>
                    <div className={`register ${registerBody}`} onClick={() => !isReg ? updateReg(!isReg) : null}>
                        {showErr && isReg ? <div className={`error-msg ${errSentiment ? 'positive-msg' : null}`} onAnimationEnd={() => { setShowErr(false); setErrSentiment(false); }}>{errMsg}</div> : null}
                        <span className={regText}>Sign Up</span>
                        {regForm}
                    </div>
                </div>
                <div className='scribble-tut'></div>
            </div>
        </div>
    )

}

const mapDispatchToProps = dispatch => {
    return {
        getUserData: (uid) => dispatch(fetchUserData(uid))
    }
}

export default connect(null, mapDispatchToProps)(Landing)








