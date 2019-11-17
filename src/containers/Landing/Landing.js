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

const Landing = (props) => {

    // ui state
    let [isReg, updateReg] = useState(false)
    let [showErr, setShowErr] = useState(false)
    let [errMsg, setErrMsg] = useState('')
    let [errSentiment, setErrSentiment] = useState(false)

    let [showForgotPass, toggleForgotPass] = useState(false)

    // login
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')




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
                    let errMsg = "Too many unsuccessful login attempts. Please try again later."
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
                let expirationDate = new Date()
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



    return (

        <div className='landing'>
            {showForgotPass ? <ForgotPassword toggleForgotPass={toggleForgotPass} /> : null}
            <div className='landing__video-overlay'></div>
            <video className="landing__video" src={splashVid} autoPlay={'false'} loop={true} playsInline={true} muted />
            <div className={`landing__letter-box-top`}></div>
            <div className='landing__hor-flex'>
                <Scroller />
                <div className={`landing__auth-frame`}>
                    <div className={`auth-frame__logo`}>BARZ</div>
                    <div className={`auth-frame__sub-text`}>The best hub for your <br/> inner wordsmith.</div>
                    <div className={`auth-frame__login-container`}>
                        <input
                            id={`sign-in__email`}
                            type='email'
                            placeholder='Email'
                            value={email}
                            autoComplete
                            onChange={event => setEmail(event.target.value)}></input>
                        <input
                            placeholder='Password'
                            type='password'
                            value={password}
                            onChange={event => setPassword(event.target.value)}></input>
                        <div className={`login-container__forgot-pass-container`}>
                            <button className={`forgot-pass-container__button`}>Forgot your password?</button>
                        </div>
                    </div>
                    <button className={`auth-frame__login-button`}>Log In</button>
                    <div className={`auth-frame__or`}>or</div>
                    <button className={`auth-frame__facebook-login`}>
                        <i class="fab fa-facebook-square facebook-login__icon"></i>
                        <b>Continue with Facebook</b>
                    </button>
                    <div className={`auth-frame__dont-have`}>Don't have an account? &nbsp;<span className={`dont-have__sign-up`}><b>Sign Up</b></span></div>
                </div>

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








