import React from 'react'
import './RegForm.css'

function RegForm() {
    return (
        <form className='reg-form'>
            <h1 className='reg-header'>Sign Up</h1>
            <div className='reg-steps'></div>
            <input className='email-input' placeholder='Email'></input>
            <input className='pass-input' placeholder='Password'></input>
            <input className='confirm-pass' placeholder='Confirm Password'></input>
        </form>
    )
}

export default RegForm
