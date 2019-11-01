import React from 'react'
import './LandingNav.css'

export default function LandingNav() {
    return (
        <div className='splash-navbar'>
            <div className='logo'>BARZ</div>
            <form className='sign-in'>
                <input placeholder='Email'></input>
                <div className='pass-input-wrapper'>
                    <input placeholder='Password'></input>
                    <div className='forgot-password'>Forgot Password?</div>
                </div>
                <button className='log-in'>Log In</button>
            </form>
        </div>
    )
}
