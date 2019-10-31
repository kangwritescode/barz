import React from 'react'
import './Landing.css'
import splashVid from '../../assets/splash-vid.m4v'

export default function Landing() {


    return (
        <div className='landing'>

            <div className='splash-video-overlay'></div>
            <video className="splash-video" src={splashVid} autoPlay={true} loop={true} playsInline={true} muted />

            <div className='splash-navbar'>
                <div className='logo'>BARZ</div>
                <form className='sign-in'>
                    <input placeholder='Email'></input>
                    <div className='pass-input-wrapper'>
                        <input placeholder='Password'></input>
                    </div>
                    <button>Log In</button>
                </form>
            </div>
            <div className='header-wrapper'>
                <h1 className='header-text'>Scribble. Judge. Compete.</h1>
                <button className='register'>Register</button>
            </div>
            <div className='scribble-tut'></div>
        </div>
    )
}
