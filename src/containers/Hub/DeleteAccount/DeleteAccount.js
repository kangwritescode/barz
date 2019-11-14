import React, { Component } from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'
import './DeleteAccount.css'
import trash from '../../../assets/trash.png'
import * as actionTypes from '../../../store/actions/actionsTypes'
import * as actions from '../../../store/actions/index'

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

        let user = firebase.auth().currentUser;
        let credentials = firebase.auth.EmailAuthProvider.credential(
            user.email,
            this.state.password
        );
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
        uid: state.user.uid
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logOut())
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);
