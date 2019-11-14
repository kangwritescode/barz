import React, { Component } from 'react'
import './UploadImage.css'
import { connect } from 'react-redux'
import firebase from 'firebase'
import * as actionTypes from '../../../../store/actions'

class UploadImage extends Component {

    state = {
        selectedFile: null,
        hasChanged: false,
        uploading: false,
        showNotification: false,
        notificationMessage: 'Upload Successful!',
        notificationStatus: 'successColor'
    }

    componentDidMount() {

        this.setState({
            ...this.state,
            selectedFile: this.props.photoURL
        })
    }


    fileSelectedHandler = event => {
        let targetFile = event.target.files[0]
        if (targetFile) {
            let reader = new FileReader()
            let presentIMG = document.getElementById("uploadIMGPresent")
            presentIMG.title = targetFile.name
            reader.onload = event => {
                presentIMG.src = event.target.result
            }
            reader.readAsDataURL(targetFile)
            this.setState({
                ...this.state,
                selectedFile: event.target.files[0],
                hasChanged: true
            })
        }
    }

    fileUploadHandler() {
        this.setState({
            ...this.state,
            uploading: true
        })
        let storageRef = firebase.storage().ref()
        let imageRef = storageRef.child(`images/${this.props.uid}/userIMG.png`);
        let uploadTask = imageRef.put(this.state.selectedFile)
        uploadTask.on('state_changed', snapshot => {

        }, (err) => {
            this.setState({
                ...this.state,
                uploading: false,
                showNotification: true,
                notificationStatus: 'failed',
                notificationMessage: err.message
            })
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                this.props.setUserData(downloadURL)
                this.setState({
                    ...this.state,
                    uploading: false,
                    showNotification: true
                })
            });
        });

    }

    toggleNotification = (bool) => {
        this.setState({
            ...this.state,
            showNotification: bool
        })
    }




    render() {
        let theImage;
        if (this.state.selectedFile) {
            theImage = (<img id="uploadIMGPresent" alt={"what?"} src={this.state.selectedFile} />

            )
        } else {
            theImage = (<div className="lds-ripple"><div></div><div></div></div>)
        }

        return (
            <div>
                <div className="ul-img-backdrop" onClick={() => this.props.setShowPhotoModal(false)}></div>

                <div id="UploadImage">
                    {this.state.uploading ? <div id="dotdotLoader"></div> : null}
                    {this.state.showNotification ?
                        <div
                            className="upload-photo-success-msg"
                            onAnimationEnd={() => this.toggleNotification(false)}
                            id={this.state.notificationStatus ? "successColor" : "failed"}>
                            {this.state.notificationMessage}
                        </div> : null}

                    <div id="closeUploadImage" onClick={() => this.props.setShowPhotoModal(false)}><i className="fa fa-close"></i></div>

                    {/* <img alt="" src={portrait}></img> */}
                    <h1>Set Photo</h1>
                    <div id="IMG_Border">
                        {theImage}
                    </div>



                    <div id="UploadButtons">
                        <input onChange={this.fileSelectedHandler} type="file" id="files" className="hidden" accept="image/x-png, image/jpeg" />
                        <label id="uploadIMG" htmlFor="files">Choose File</label>
                        {this.state.hasChanged ?
                            <button onClick={() => this.fileUploadHandler()}>Confirm</button> :
                            <button onClick={() => this.props.setShowPhotoModal(false)}>Cancel</button>}
                    </div>

                </div>
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        uid: state.uid,
        photoURL: state.photoURL,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUserData: (photoURL) => dispatch({type: actionTypes.SET_USER_DATA, data: {photoURL: photoURL}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadImage)