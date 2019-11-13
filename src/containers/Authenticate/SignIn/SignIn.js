import React, { Component } from 'react'
import firebase from '../../../Firebase'
import { connect } from 'react-redux'
import { fetchUserData } from '../../../store/actionCreators'
import validator from 'validator'
import './SignIn.css'
import Spinner from '../../../components/UI/Spinner/Spinner'
import ForgotPassword from './ForgotPassword/ForgotPassword'
import DotSpinner from '../../../shared/DotSpinner/DotSpinner'

class SignIn extends Component {

    state = {
        userInput: '',
        passInput: '',
        loading: false,
        badInput: '',
        showForgotPassword: false,
        processing: false
    }

    toggleProcessing = (bool) => {
        this.setState({
            ...this.state,
            processing: bool
        })
    }

    userInputHandler(event) {
        this.setState({
            ...this.state,
            userInput: event.target.value
        })
    }

    passInputHandler(event) {
        this.setState({
            ...this.state,
            passInput: event.target.value,
        })
    }

    async signInHandler(event) {

        event.preventDefault()
        this.toggleProcessing(true)
        try {
            const uid = await this.authenticate(this.state.userInput, this.state.passInput)
            this.props.getUserData(uid)
            this.toggleProcessing(false)
        }
        catch (err) {
            console.log(err.code)
            switch (err.code) {
                case 'auth/invalid-email':
                    this.props.loginErrMsgHandler(err.message, false)
                    this.setBadInput('email')
                    break;
                case "auth/too-many-requests":
                    let errMsg = "Too many unsuccessful login attempts. Please try again later."
                    this.props.loginErrMsgHandler(errMsg, false)
                    this.setBadInput('password')
                    break;
                case 'auth/user-not-found':
                    this.props.loginErrMsgHandler(err.message, false)
                    this.setBadInput('email')
                    break;
                case 'auth/wrong-password':
                    this.props.loginErrMsgHandler(err.message, false)
                    this.setBadInput('password')
                    break;
                default:
                    console.log('default!')
            }
            this.toggleProcessing(false)
        }
    }

    setBadInput(input) {
        this.setState({
            ...this.state,
            badInput: input
        })
    }

    authenticate = async (userInput, passInput) => {

        return await firebase.auth().signInWithEmailAndPassword(userInput, passInput)
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


    toggleModal = (event, modal, bool) => {
        event.preventDefault()
        this.setState({
            ...this.state,
            [modal]: bool
        })
    }

    formIsValid = () => {
        if (!this.state.userInput || this.state.passInput.length < 6) { return false }
        if (!validator.isEmail(this.state.userInput)) { return false }
        return true
    }

    render() {

        let formIsValid = this.formIsValid()

        return (
            <div>
                {this.state.showForgotPassword ? <ForgotPassword toggleModal={this.toggleModal.bind(this)} /> : null}
                <form className="LoginContainer">
                    {this.state.processing ? <DotSpinner id='sign-dot-spinner' /> : null}

                    <h1>Login</h1>
                    <input
                        className={this.state.badInput === 'email' ? 'Username-badInput' : ''}
                        type="email"
                        placeholder={'email'}
                        vaxlue={this.state.userInput}
                        autoCorrect="off"
                        spellCheck='false'
                        autoComplete="off"
                        onChange={(event) => this.userInputHandler(event)}></input>
                    <input
                        className={this.state.badInput === 'password' ? 'Password-BadInput' : ''}
                        type="password"
                        placeholder={'password'}
                        spellCheck='false'
                        autoCorrect="off"
                        value={this.state.passInput}
                        onChange={event => this.passInputHandler(event)}
                        autoComplete="off"></input>
                    <button className={formIsValid && !this.state.processing ? 'AuthButton' : ''} onClick={event => this.signInHandler(event)} disabled={!formIsValid || this.state.processing}>Login</button>
                    <div className="BottomButtons">
                        <button id="register" onClick={event => this.props.toggleProcess('signup', event)}>Register</button> |
                    <button id="forgotPassword" onClick={(event) => this.toggleModal(event, 'showForgotPassword', true)}>Forgot Password</button>
                    </div>
                </form>

            </div>
        )

    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUserData: (uid) => dispatch(fetchUserData(uid))
    }
}

export default connect(null, mapDispatchToProps)(SignIn)
