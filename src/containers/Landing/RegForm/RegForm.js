import React, { useState } from 'react'
import validator from 'validator'
import './RegForm.css'

function RegForm(props) {
    var [step, setStep] = useState('account')

    var form = (
        <div className='account-wrapper'>
            <div className='reg-detail'>Account Info</div>
            <input className='large-input' placeholder='Email'></input>
            <input className='large-input' placeholder='Password'></input>
            <button className='reg-button' onClick={(event) => { event.preventDefault(); setStep('profile') }}>Continue</button>
        </div>

    )

    if (step === 'profile') {
        form = (
            <div className='profile-wrapper'>
                <div className='reg-detail'>Profile Info</div>
                <input className='large-input' placeholder='Username'></input>
                <div className='zip-sex-wrapper'>
                    <input className='zip-input' placeholder='Hometown ZIP'></input>
                    <div className='sex-button'>M</div>
                    <div className='sex-button'>F</div>
                </div>
                <button className='reg-button' onClick={() => setStep('profile')}>Submit</button>
            </div>
        )
    }
    return (
        <form className='reg-form'>
            <i className="fa fa-close" id='reg-form-close' onClick={() => props.updateReg(false)}></i>
            <h1 className='reg-header'>Sign Up</h1>
            {form}
        </form>
    )
}

export default RegForm
