import React, { Component } from 'react'
import firebase from '../../../../Firebase'
import 'firebase/firestore'
import { connect } from 'react-redux'
import './DeleteAccount.css'
import trash from '../../../../assets/trash.png'
import axios from '../../../../axios-orders'
import * as actionTypes from '../../../../store/actions'

class DeleteAccount extends Component {

    state = {
        password: ''
    }

    onInputHandler = (event) => {
        this.setState({
            ...this.state,
            password: event.target.value
        })
    }


    deleteAccount = async () => {

        var user = firebase.auth().currentUser;
        var credentials = firebase.auth.EmailAuthProvider.credential(
            user.email,
            this.state.password
        );
        // first reauthenticate
        user.reauthenticateWithCredential(credentials)
            .then(async () => {
                var db = firebase.firestore()

                // // delete the votes
                await db.collection("submissions").get().then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        var submission = doc.data()
                        var votes = submission.votes
                        delete votes[this.props.uid]
                        db.collection("submissions").doc(`${doc.id}`).update({ votes: votes })
                            .then(res => { console.log(res) })
                            .catch(err => { console.log(err) })
                    })
                })
                // delete the submissions
                await db.collection("submissions").where("uid", "==", this.props.uid)
                    .get().then(snapshot => {
                        snapshot.forEach(doc => {
                            doc.ref.delete()
                        })
                    })
                // delete the user
                await db.collection('users').doc(`${this.props.uid}`).delete()
                    .then(res => { console.log(res) })
                    .catch(err => { console.log(err) })

                //  remove profile image
                var storage = firebase.storage();
                var storageRef = storage.ref();
                var imgRef = storageRef.child(`images/${this.props.uid}/userIMG.png`)
                await imgRef.delete()
                    .then(() => console.log('profile image deleted successfully'))
                    .catch(() => console.log('issue deleteing profile image'))

                // delete auth acount
                await firebase.auth().currentUser.delete()
                    .then(res => console.log('ACCOUNT WAS DELETED!!!!!'))
                    .catch(err => console.log(err))



                this.props.logout()

            })
            .catch(err => console.log('it was not a success to reauthenticate!!!'))

    }


    render() {


        return (
            <div>
                <div className="delete-backdrop" onClick={() => this.props.toggleDeleteAcc(false)} />
                <div id="delete-account-modal">
                    <i className="fa fa-close" id="exit-delete-modal" onClick={() => this.props.toggleDeleteAcc(false)}></i>
                    <img id="delete-icon" src={trash}></img>
                    <div id="are-you-sure">Delete Account</div>
                    <div id="will-be-deleted">
                        All user data will be deleted forever.
                    </div>
                    <input type="password" id="delete-pass-input" placeholder="password" onChange={this.onInputHandler}></input>
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
        uid: state.uid
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({ type: actionTypes.LOG_OUT })
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);
