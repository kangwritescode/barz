import React, { Component } from 'react'
import './Register.css'
import firebase from '../../../Firebase'
import validator from 'validator'
import Spinner from '../../../components/UI/Spinner/Spinner';
import DotSpinner from '../../../shared/DotSpinner/DotSpinner';
require("firebase/firestore");

class Register extends Component {


    state = {
        userInput: '',
        password: '',
        badField: '',
        mysteryManBlob: null,
        processing: false
    }

    componentDidMount() {
        this.fetchMysteryMan()
    }
    toggleProcessing = (bool) => {
        this.setState({
            ...this.state,
            processing: bool
        })
    }

    fetchMysteryMan = () => {
        var storage = firebase.storage()
        storage.ref('mysteryman/mysteryman.png').getDownloadURL()
            .then(url => {


                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = event => {
                    var blob = xhr.response;
                    this.setState({
                        ...this.state,
                        mysteryManBlob: blob
                    })
                };
                xhr.open('GET', url);
                xhr.send();


            }).catch(function (error) {
                console.log(error)
            });
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
            password: event.target.value
        })
    }




    async signUpHandler(event) {
        event.preventDefault()
        this.toggleProcessing(true)
        try {
            const [email, uid] = await this.createUser(this.state.userInput, this.state.password)
            let photoRef = await this.uploadMysteryMan(uid)
            await this.createFirebaseUser(email, uid, photoRef.location.path)
            this.props.loginErrMsgHandler("Account successfully created!", true)
            this.toggleProcessing(false)
            this.props.toggleProcess('login')

        }
        catch (err) {
            this.props.loginErrMsgHandler(err.message, false)
            
            switch (err.code) {
                case 'auth/invalid-email':
                    this.setState({
                        ...this.state,
                        loading: false,
                        badField: 'email',
                        processing: false
                    })
                    break;
                case 'auth/email-already-in-use':
                    this.setState({
                        ...this.state,
                        loading: false,
                        badField: 'email',
                        processing: false

                    })
                    break;
                case 'auth/weak-password':
                    this.setState({
                        ...this.state,
                        loading: false,
                        badField: 'password',
                        processing: false

                    })
                    break;
                default:
                    this.toggleProcessing(false)
                    break;
                
                


            }
        }
    }



    createUser = async (userInput, password) => {
        return firebase.auth().createUserWithEmailAndPassword(userInput, password)
            .then(authObj => {
                return [authObj.user.email, authObj.user.uid]
            })
            .catch(err => {
                throw err
            })

    }


    createFirebaseUser = async (email, uid, photoRef) => {
        var db = firebase.firestore();
        return db.collection('users').doc(uid).set({
            email: email,
            uid: uid,
            needsInfo: true,
            photoRef: photoRef
        })
            .then(() => {

            })
            .catch((err) => {

                console.error("Error adding document: ", err);
                throw err
            });
    }


    uploadMysteryMan(uid) {
        return new Promise((resolve, reject) => {
            var storageRef = firebase.storage().ref();
            var photoRef = storageRef.child(`images/${uid}/userIMG.png`);
            photoRef.put(this.state.mysteryManBlob)
                .then(snapshot => { resolve(photoRef) })
                .catch(err => { console.log(err) })

        })


    }

    formIsValid = () => {
        if (!this.state.userInput || this.state.password.length < 6) { return false }
        if (!validator.isEmail(this.state.userInput)) { return false }
        return true
    }


    render() {

        var formIsValid = this.formIsValid()


        return (
                <form className="register-container">
                   {this.state.processing ?  <div id='reg-dot-spinner'/> : null}
                    <h1>Sign Up</h1>
                    <input
                        id={this.state.badField === "email" ? "Username-bad" : "Username"}
                        type="email"
                        placeholder={'email'}
                        value={this.state.userInput}
                        autoCorrect="off"
                        spellCheck='false'
                        autoComplete="off"
                        onChange={(event) => this.userInputHandler(event)}></input>
                    <input
                        id={this.state.badField === "password" ? "Password-bad" : "Password"}
                        type="password"
                        placeholder={'password'}
                        autoCorrect="off"
                        spellCheck='false'
                        value={this.state.encryptInput}
                        onChange={event => this.passInputHandler(event)}
                        autoComplete="off"></input>
                    <button className={formIsValid && !this.state.processing ? 'reg-valid' : 'reg-invalid'} onClick={event => this.signUpHandler(event)} disabled={(!formIsValid || this.state.processing) ? true : false}>Create Account</button>
                    <div className="BottomButtons">
                        <button id="GoBack" onClick={event => this.props.toggleProcess('signup', event)}>Go Back</button>
                    </div>
                </form>
        )
    }
}

export default Register
