import React, { Component } from 'react'
import './Authenticate.css'
import * as actionTypes from '../../store/actions'
import { connect } from 'react-redux'
import SignIn from './SignIn/SignIn'
import Register from './Register/Register'





class Authenticate extends Component {

    state = {
        userInput: '',
        passInput: '',
        encryptInput: '',
        showNotification: false,
        notificationMsg: '',
        notificationStatus: false,
        creatingAccount: false
    }

    toggleProcess(process, event) {
        switch (process) {
            case 'login':
                this.setState({
                    ...this.state,
                    creatingAccount: false
                })
                break;
            case 'signup':
                this.setState({
                    ...this.state,
                    creatingAccount: true
                })
                break;
            default:
                break;
        }
    }

    toggleNotification = (msg, status) => {
        this.setState({
            ...this.state,
            showNotification: true,
            notificationMsg: msg,
            notificationStatus: status
        })
    }
    endNotification = () => {
        this.setState({
            showNotification: false
        })
    }


    render() {


        let content = (
                <SignIn
                    userInput={this.state.userInput}
                    encryptInput={this.state.encryptInput}
                    userInputHandler={(event) => this.userInputHandler(event)}
                    passInputHandler={(event) => this.passInputHandler(event)}
                    toggleProcess={(event) => this.toggleProcess('signup', event)}
                    loginErrMsgHandler={this.toggleNotification}
                    errMessageState={this.state.showLoginErrMsg} />

            
        )
        if (this.state.creatingAccount) {
            content = (
                <Register
                    errMessageState={this.state.showLoginErrMsg}
                    userInput={this.state.userInput}
                    encryptInput={this.state.encryptInput}
                    userInputHandler={(event) => this.userInputHandler(event)}
                    passInputHandler={(event) => this.passInputHandler(event)}
                    toggleProcess={(event) => this.toggleProcess('login', event)}
                    loginErrMsgHandler={this.toggleNotification}></Register>
            )
        }

        return (
            <div className="Backdrop">
                <div id="auth-notification-container">
                    {this.state.showNotification ? 
                        <div 
                            className="authErrMsg" 
                            id={this.state.notificationStatus ? "authSuccess" : "authFailure"}
                            onAnimationEnd={this.endNotification.bind(this)}>{this.state.notificationMsg}</div> : null}
                </div>
                {content}
            </div>
        )
    }

    
}


const mapDispatchToProps = dispatch => {
    return {
        authenticate: () => dispatch({ type: actionTypes.AUTHENTICATE })
    }
}

export default connect(null, mapDispatchToProps)(Authenticate)