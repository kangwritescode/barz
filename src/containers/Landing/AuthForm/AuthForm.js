
import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import 'firebase/firestore'
import validator from 'validator'
import './AuthForm.css'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions/index'
import { regions } from '../../../shared/regions'
import DotSpinner from '../../../components/DotSpinner/DotSpinner'
import { fbind } from 'q'

const AuthForm = (props) => {

    // ui state
    const [isRegistering, setisRegistering] = useState(false)
    const [notification, setNotification] = useState('')
    const [sentiment, setSentiment] = useState(false)

    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')

    const [mysteryManBlob, setMysteryManBlob] = useState(null)
    // login
    const [spinner, setSpinner] = useState(false)


    useEffect(() => {
        fetchMysteryMan()
        document.getElementById('login-container__email-input').focus()
        return () => {
        };
    }, [])
    // sign in
    const signIn = async (event) => {
        setSpinner(true)
        if (event) { event.preventDefault() }
        try {
            const uid = await authenticate(email, password)
            setSpinner(false)
            props.getUserData(uid)
        }
        catch (err) {
            setSpinner(false)
            console.log(err.message)
            switch (err.code) {
                case 'auth/invalid-email':
                    setNotification(err.message)
                    break;
                case "auth/too-many-requests":
                    let errMsg = "Too many unsuccessful login attempts. Please try again later."
                    setNotification(errMsg)
                    break;
                case 'auth/user-not-found':
                    setNotification(err.message)
                    break;
                case 'auth/wrong-password':
                    setNotification(err.message)
                    break;
                default:
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

    // uploades mysteryman and then...
    const uploadMysteryMan = async (uid) => {
        let storageRef = firebase.storage().ref();
        let photoRef = storageRef.child(`images/${uid}/userIMG.png`);
        return photoRef.put(mysteryManBlob)
            .then(async (successObj) => {
                // fetches and returns the download URL
                const url = await successObj.ref.getDownloadURL()
                return url
            })
            .catch(err => { console.log(err.message) })
    }

    const fetchMysteryMan = () => {
        let storage = firebase.storage()
        storage.ref('mysteryman/mysteryman.png').getDownloadURL()
            .then(url => {
                let xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = event => {
                    let blob = xhr.response;
                    setMysteryManBlob(blob)
                };
                xhr.open('GET', url);
                xhr.send();

            }).catch(function (error) {
                console.log(error)
            });
    }
    // register 
    const createAuthUser = async (userInput, password) => {
        return firebase.auth().createUserWithEmailAndPassword(userInput, password)
            .then(authObj => {
                return [authObj.user.email, authObj.user.uid]
            })
            .catch(err => {
                throw err
            })
    }
    const createFirebaseUser = async (email, uid, photoURL) => {
        let db = firebase.firestore();

        const user = {
            email: email,
            uid: uid,
            photoURL: photoURL,
            username: '',
            address: '',
            gender: '',
            handles: {
                facebook: '',
                instagram: '',
                soundcloud: '',
                youtube: ''
            }
        }
        return db.collection('users').doc(uid).set(user)
            .then(() => {
                return true
            })
            .catch((err) => {
                throw err
            });
    }

    const createAccount = async (email, inputPass, event) => {
        setSpinner(true)
        event.preventDefault()
        try {
            let [fireEmail, uid] = await createAuthUser(email, inputPass)
            const photoURL = await uploadMysteryMan(uid)
            console.log(photoURL, '<----')
            await createFirebaseUser(fireEmail, uid, photoURL)
            setSpinner(false)
            setNotification('Created Account Successfully!')
            setSentiment(true)
            setisRegistering(false)
            document.getElementById('auth-frame__button').focus()

        }
        catch (err) {
            setSpinner(false)
            setNotification(err.message)
        }
    }

    const isValidEmail = email => {
        return validator.isEmail(email)
    }
    const isValidPassword = password => {
        return password.length >= 6
    }
    return (
        <div className={`landing__auth-frame`} style={isRegistering ? { paddingBottom: '2.9em' } : null}>
            {notification ?
                <p
                    className={`auth-frame__notification`}
                    style={sentiment ? {background: 'rgba(2, 48, 8, 0.918)'} : null}
                    onAnimationEnd={() => setNotification('')}>
                    {notification}
                </p>
                : null}
            <div className={`auth-frame__logo`} style={isRegistering ? { fontSize: '3.2em' } : null}>{isRegistering ? 'Sign Up' : 'BARZ'}</div>
            {isRegistering ? null : (
                <div className={`auth-frame__sub-text`}>The best hub for your <br /> inner wordsmith.</div>

            )}
            <div className={`auth-frame__login-container`} style={isRegistering ? { marginTop: '.3em' } : null}>
                <input
                    id='login-container__email-input'
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
                {isRegistering ? null : (
                    <div className={`login-container__forgot-pass-container`}>
                        <button
                            className={`forgot-pass-container__button`}
                            onClick={() => props.toggleForgotPass(true)}
                            tabIndex="-1">Forgot your password?</button>
                    </div>
                )}
            </div>
            <button
                id='auth-frame__button'
                style={isRegistering ? { marginTop: '2.45em' } : null}
                className={`auth-frame__login-button ${email.length > 0 && isValidEmail(email) && isValidPassword(password) && !spinner ? 'auth-frame__login-button--valid' : null}`}
                onClick={isRegistering ? (event) => createAccount(email, password, event) : signIn}
                disabled={!isValidEmail(email) || !isValidPassword(password) || spinner}>
                {isRegistering ? 'Create Account' : 'Log In'}
                {spinner ? <DotSpinner customStyle={{ position: 'absolute', left: '-55px', bottom: '-104px' }} /> : null}
            </button>
            <div className={`auth-frame__or`}>or</div>
            <button className={`auth-frame__facebook-login`}>
                <i class="fab fa-facebook-square facebook-login__icon"></i>
                <b>{isRegistering ? 'Sign Up' : 'Continue'} with Facebook</b>

            </button>
            {isRegistering ? <div className={`auth-frame__dont-have`} onClick={() => setisRegistering(false)}>Already have an account? &nbsp;<span className={`dont-have__sign-up`}><b>Log In</b></span></div>
                : <div className={`auth-frame__dont-have`} onClick={() => setisRegistering(true)}>Don't have an account? &nbsp;<span className={`dont-have__sign-up`}><b>Sign Up</b></span></div>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUserData: (uid) => dispatch(actions.fetchUserData(uid))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AuthForm)
