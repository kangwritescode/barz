import React, { useEffect } from 'react'
import validator from 'validator'
import './LandingNav.css'

export default function LandingNav(props) {

    useEffect(() => {
        document.getElementById('sign-in__email').focus()
        return () => {  
        };
    }, [])

    const isValidEmail = () => {
        return (
            validator.isEmail(props.email)
        )
    }
    const isValidPassword = () => {
        return props.password.length >= 6
    }

    const buttonValidStyle = isValidEmail() && isValidPassword() ? 'valid-button' : null

    return (
        <div className='splash-navbar'>
            <div className={`splash-navbar__contents-container`}>
                <div className='logo'>BARZ</div>
                <form className='sign-in'>
                    <input
                        id={`sign-in__email`}
                        type='email'
                        placeholder='Email'
                        value={props.email}
                        autoComplete
                        onChange={event => props.setEmail(event.target.value)}></input>
                    <div className='pass-input-wrapper'>
                        <input
                            placeholder='Password'
                            type='password'
                            value={props.password}
                            onChange={event => props.setPassword(event.target.value)}></input>
                        <div className='forgot-password' onClick={() => props.toggleForgotPass(true)}>Forgot Password?</div>
                    </div>
                    <button
                        className={`log-in ${buttonValidStyle}`}
                        disabled={!buttonValidStyle}
                        onClick={props.trySignIn}>Log In</button>
                </form>
            </div>
        </div>
    )
}
