import React from 'react'
import validator from 'validator'
import './LandingNav.css'

export default function LandingNav(props) {

    return (
        <div className='splash-navbar'>
            <div className='logo'>BARZ</div>
            <form className='sign-in'>
                <input
                    placeholder='Email'
                    value={props.email}
                    onChange={event => props.setEmail(event.target.value)}></input>
                <div className='pass-input-wrapper'>
                    <input
                        placeholder='Password'
                        type='password'
                        value={props.password}
                        onChange={event => props.setPassword(event.target.value)}></input>
                    <div className='forgot-password'>Forgot Password?</div>
                </div>
                <button disabled className='log-in'>Log In</button>
            </form>
        </div>
    )
}
