import React from 'react'
import './RegForm.css'

function RegForm() {
    return (
        <form className='reg-form'>
            <i className="fa fa-close" id='reg-form-close'></i>
            <h1 className='reg-header'>Sign Up</h1>
            <div className='reg-detail'>Account Info</div>
            <input className='email-input' placeholder='Email'></input>
            <input className='pass-input' placeholder='Password'></input>
            <button className='continue-button'>Continue</button>
        </form>
    )
}

export default RegForm
