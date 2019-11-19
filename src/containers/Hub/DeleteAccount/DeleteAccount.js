/*global FB*/

import React, { Component } from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'
import './DeleteAccount.css'
import trash from '../../../assets/images/trash.png'
import * as actionTypes from '../../../store/actions/actionsTypes'
import * as actions from '../../../store/actions/index'
import { errorCreater } from '../../../shared/utility'
import { thisExpression } from '@babel/types'

class DeleteAccount extends Component {

    state = {
        password: '',
        spinning: true,
        FBtoken: null,
        authType: ''
    }

    componentDidMount = () => {
        let user = firebase.auth().currentUser;
        if (user.providerData[0].providerId === 'password') {
            this.setAuthType('password', null)
        } else {
            let token = localStorage.getItem('token')
            this.setAuthType('facebook', token)
        }
        
    }
    setAuthType = (authType, fbToken) => {
        this.setState({
            ...this.state,
            authType: authType,
            FBtoken: fbToken
        })

    }
    setSpinner = bool => {
        this.setState({
            ...this.state,
            spinning: bool
        })
    }

    onInputHandler = (event) => {
        this.setState({
            ...this.state,
            password: event.target.value
        })
    }


    deleteAccount = async () => {

        let user = firebase.auth().currentUser;
        let credentials = null;
        
        // get the appropriate credentials
        try {
            if (this.state.authType === 'password') {
                credentials = firebase.auth.EmailAuthProvider.credential(
                    user.email,
                    this.state.password
                );
            } else if (this.state.authType !== 'password') {
                credentials = firebase.auth.FacebookAuthProvider.credential(this.state.FBtoken);
            } else {
                throw errorCreater('Facebook Auth token has expired. Log out and back in to delete account.')
            }
        } catch (err) {
            console.log(err.message)
            this.setSpinner(false)
            return
        }

        // first reauthenticate
        user.reauthenticateWithCredential(credentials)
            .then(async () => {
                let db = firebase.firestore()

                // delete submissions
                await db.collection("submissions").get().then(snapshot => {
                    snapshot.forEach(doc => {
                        let post = doc.data()
                        if (post.uid === this.props.uid) {
                            doc.ref.delete()
                        }
                    })
                }).catch(err => { throw err })

                // delete follows
                await db.collection("follows").get().then(snapshot => {
                    snapshot.forEach(doc => {
                        let follow = doc.data()
                        if (follow.from === this.props.uid
                            || follow.to === this.props.uid) {
                            doc.ref.delete()
                        }
                    })
                }).catch(err => { throw err })


                // delete votes
                await db.collection("postVotes").get().then(snapshot => {
                    snapshot.forEach(doc => {
                        let vote = doc.data()
                        if (vote.receiverID === this.props.uid
                            || vote.voterID === this.props.uid) {
                            doc.ref.delete()
                        }
                    })
                }).catch(err => { throw err })

                // delete post comments
                await db.collection("postComments").get().then(querySnapshot => {
                    querySnapshot.forEach(doc => {

                        let comment = doc.data()
                        if (comment.uid === this.props.uid
                            || comment.receiverUID === this.props.uid) {
                            doc.ref.delete()
                        }

                    })
                }).catch(err => { throw err })



                //  remove profile image
                let storage = firebase.storage();
                let storageRef = storage.ref();
                let imgRef = storageRef.child(`images/${this.props.uid}/userIMG.png`)
                await imgRef.delete()
                    .then(() => console.log('profile image deleted successfully'))
                    .catch((err) => { throw err })

                // delete the user
                await db.collection('users').doc(`${this.props.uid}`).delete()
                    .then(() => { console.log('user deleted successfully') })
                    .catch(err => { throw err })

                // delete auth acount
                await firebase.auth().currentUser.delete()
                    .then(res => console.log('ACCOUNT WAS DELETED!!!!!'))
                    .catch(err => { throw err })

                this.props.logout()

            })
            .catch(err => console.log(err.message))

    }


    render() {

        var deletePrompt;
        if (this.state.authType === 'facebook') {
            deletePrompt = "Type 'goodbye' and press 'Delete'."
        }
        else {
            deletePrompt = 'All user data will be deleted forever.'
        }
        return (
            <div>
                <div className="delete-backdrop" onClick={() => this.props.toggleDeleteAcc(false)} />
                <div id="delete-account-modal">
                    <i className="fa fa-close" id="exit-delete-modal" onClick={() => this.props.toggleDeleteAcc(false)}></i>
                    <img id="delete-icon" src={trash} alt=''></img>
                    <div id="are-you-sure">Delete Account</div>
                    <div id="will-be-deleted">
                        {deletePrompt}
                    </div>
                    <input type="password" id="delete-pass-input" placeholder={this.state.authType === 'facebook' ? '' : 'password'} onChange={this.onInputHandler}></input>
                    <div id="delete-buttons">
                        <div className="delete-button" id="cancel" onClick={() => this.props.toggleDeleteAcc(false)}>Cancel</div>
                        <div
                            className={`delete-button`}
                            id={this.state.password === '' ? 'delete-disabled' : 'delete'} onClick={this.state.password === '' ? null : this.deleteAccount}>Delete</div>
                    </div>
                </div>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        uid: state.user.uid
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logOut())
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);
