import React, { Component } from 'react'
import './ForgotPassword.css'
import passIcon from '../../../assets/images/pass-icon.png'
import firebase from 'firebase'
import validator from 'validator'
import DotSpinner from '../../../components/DotSpinner/DotSpinner'

class ForgotPassword extends Component {

    state = {
        emailInput: '',
        showNotification: false,
        notificationMsg: 'Initial Notification Message',
        errStyle: null,
        notificationStyle: null,
        processing: false
    }
    toggleProcessing = (bool) => {
        this.setState({
            ...this.state,
            processing: bool
        })
    }

    emailInputHandler = event => {
        this.setState({
            ...this.state,
            emailInput: event.target.value
        })
    }

    requestPassReset = (event) => {
        event.preventDefault()
        this.toggleProcessing(true)
        var auth = firebase.auth()
        auth.sendPasswordResetEmail(this.state.emailInput)
            .then(() => {

                this.setState({
                    ...this.state,
                    showNotification: true,
                    notificationMsg: 'Password Reset Link Sent!',
                    emailInput: '',
                    errStyle: null,
                    processing: false,
                    notificationStyle: { backgroundColor: 'rgba(0, 65, 3, 0.5)' }

                })
            })
            .catch(err => {
                this.toggleProcessing(false)
                var msg = err.message
                this.setState({
                    ...this.state,
                    showNotification: true,
                    notificationMsg: msg,
                    processing: false,
                    notificationStyle: { backgroundColor: 'rgba(112, 0, 0, 0.5)' }
                })
            })
    }

    closeNotificationMsg = () => {
        this.setState({
            ...this.state,
            showNotification: false
        })
    }
    isValidEmail = () => {
        return validator.isEmail(this.state.emailInput)
    }

    render() {
        return (
            <div>
                <div className="forgot-password-backdrop" onClick={(event) => this.props.toggleForgotPass(false)} />
                <form id="forgot-password-modal">
                    <i className="fa fa-close" id="forgot-pass-x" onClick={(event) => this.props.toggleForgotPass(false)}></i>
                    {this.state.processing ? <DotSpinner id={'forgot-pass-dot'} /> : null}
                    {this.state.showNotification ? 
                            <div className="forgot-pass-notification"
                                 onAnimationEnd={this.closeNotificationMsg}
                                 style={this.state.notificationStyle}>
                                    {this.state.notificationMsg}
                            </div> : 
                            null}
                    <img id="pass-icon" src={passIcon} alt=''/>
                    <h2>Reset Password</h2>
                    <h5 id='dont-remember'>Don't remember your password? We'll send you a reset link to your email.</h5>
                    <input
                        className="pass-reset-input"
                        type="email"
                        placeholder="email"
                        value={this.state.emailInput}
                        onChange={this.emailInputHandler}
                        style={this.state.errStyle}>
                    </input>
                    <button
                        className={`passResetBtn ${this.isValidEmail() && !this.state.processing ? '' : 'forgot-pass-invalid'}`}
                        onClick={this.requestPassReset}
                        disabled={!this.isValidEmail() || this.state.processing ? true : false}>

                        Send Reset
                        </button>
                </form>
            </div>

        )
    }
}

export default ForgotPassword
