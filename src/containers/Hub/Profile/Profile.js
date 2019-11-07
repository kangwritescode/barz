import './Profile.css'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionTypes from '../../../store/actions'
import firebase from '../../../Firebase'
import UploadImage from './UploadImage/UploadImage'
import PhotoContainer from './PhotoContainer/PhotoContainer'
import DeleteAccount from './DeleteAccount/DeleteAccount'
import AddHandles from './AddHandles/AddHandles'


import close from '../../../assets/logout.png'
import ig from '../../../assets/handles/ig.png'
import fb from '../../../assets/handles/fb.png'
import sc from '../../../assets/handles/sc.png'
import yt from '../../../assets/handles/yt.png'




class Profile extends Component {

    state = {
        imgSRC: null,
        showUploadImage: false,
        showDeleteAccount: false,
        showAddHandles: false,
        animation: null
    }

    componentDidMount = () => {

        var storage = firebase.storage();
        storage.ref(this.props.photoRef).getDownloadURL().then(url => {

            this.setState({
                ...this.state,
                imgSRC: url
            })
        }).catch(function (error) {
            console.log("error in Profile.js: ", error)
        });
    }

    setImage = (img) => {
        this.setState({
            ...this.state,
            imgSRC: img
        })
    }

    logout = (event) => {
        event.preventDefault()
        firebase.auth().signOut()
        this.props.logout()
    }

    toggleShowModal = (modal, bool) => {
        this.setState({
            ...this.state,
            [modal]: bool
        })
    }

    changeWindow = (name) => {
        this.setState({
            ...this.state,
            animation: 'profile-ease-out'
        }, () => {
            setTimeout(() => {
                this.props.changeWindow(name)
            }, 550)
        })
    }

    render() {

        const playing = this.props.playing ? 'speaker-boom': null
        return (

            <div className="ProfileBoxContainer" id={this.state.animation ? 'profile-ease-out' : null}>
                <div id="box-handle"></div>
                {/* Upload Image Modal */}
                {this.state.showUploadImage ? <UploadImage setProfileImage={this.setImage.bind(this)} toggleShow={this.toggleShowModal.bind(this)} /> : null}
                {/* Delete Account Modal */}
                {this.state.showDeleteAccount ? <DeleteAccount toggleShow={this.toggleShowModal.bind(this)} /> : null}
                {/* Show AddHandles Modal */}
                {this.state.showAddHandles ? <AddHandles toggleShow={this.toggleShowModal.bind(this)} /> : null}
                <div className="UpperButtons">
                    <div id="delete-account" onClick={() => this.toggleShowModal('showDeleteAccount', true)}> Delete Account</div>
                    <div id="logout-container">
                        <div className="box-button" />
                        <div className="box-button" />
                        <div id="logout-button" onClick={this.logout}>
                            <img alt="" id="log-out" src={close}></img>
                        </div>
                    </div>
                </div>
                <div className="inner-box">
                    <div className={`speaker ${playing}`}>
                        <div id="left-inner-speaker">
                        </div>
                    </div>
                    <div id="center-speaker">
                        <div className="ProfileBox">
                            <PhotoContainer imgSRC={this.state.imgSRC} toggleShowUploadImage={this.toggleShowModal.bind(this)} />
                            <div id="profileDetailsContainer">
                                <div id="profileUsername">{this.props.username}</div>
                                <div id="description">{this.props.city + ", " + this.props.state}  |  {this.props.sex === "Female" ? "F" : "M"}</div>
                            </div>
                        </div>
                        <div id="handles-container">
                            <div className={this.props.handles.facebook ? "fb-container-active" : "fb-container"} onClick={() => this.toggleShowModal('showAddHandles', true)}>
                                <img alt="" id="fb" src={fb} />
                            </div>
                            <div className={this.props.handles.instagram ? "handle-button-active" : "handle-button"} onClick={() => this.toggleShowModal('showAddHandles', true)}>
                                <img alt="" id="ig" src={ig} />
                            </div>
                            <div className={this.props.handles.soundcloud ? "handle-button-active" : "handle-button"} onClick={() => this.toggleShowModal('showAddHandles', true)}>
                                <img alt="" id="sc" src={sc} />
                            </div>
                            <div className={this.props.handles.youtube ? "handle-button-active" : "handle-button"} onClick={() => this.toggleShowModal('showAddHandles', true)}>
                                <img alt="" id="yt" src={yt} />
                            </div>
                        </div>
                    </div>
                    <div className={`speaker ${playing}`}>
                        <div id="right-inner-speaker">
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        uid: state.uid,
        loggedin: state.loggedIn,
        email: state.email,
        username: state.username,
        sex: state.gender,
        address: state.address,
        zipcode: state.address.zip_code,
        city: state.address.city,
        state: state.address.state,
        needsInfo: state.needsInfo,
        photoURL: state.photoURL,
        handles: state.handles,
        playing: state.playing
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({ type: actionTypes.LOG_OUT })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile)
