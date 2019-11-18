import React, { Component } from 'react'
import './UploadImage.css'
import { connect } from 'react-redux'
import firebase from 'firebase'
import * as actions from '../../../../store/actions/index'
import DotSpinner from '../../../../components/DotSpinner/DotSpinner'

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

    fileUploadHandler = () => {
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
            uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                try {
                    var db = firebase.firestore()
                    await db.collection('submissions').where('uid', '==', this.props.uid).get()
                        .then(snapshot => {
                            snapshot.forEach(doc => {
                                doc.ref.update({ photoURL: downloadURL })
                            })
                        })
                    await db.collection('postComments').where('uid', '==', this.props.uid).get()
                        .then(snapshot => {
                            snapshot.forEach(doc => {
                                doc.ref.update({ photoURL: downloadURL })
                            })
                        })
                    this.props.setUserData(downloadURL)
                    this.setState({
                        ...this.state,
                        uploading: false,
                        showNotification: true,
                        hasChanged: false
                    })
                } catch (err) {
                    console.log(err.message)
                }

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
                    <div className={`upload-image__header`}>
                        <div>Set Photo</div>
                    </div>
                    {this.state.uploading ? <DotSpinner customStyle={{ position: 'absolute', zIndex: 500, color: 'orange', top: '-10em' }} /> : null}
                    {this.state.showNotification ?
                        <div
                            className="upload-photo-success-msg"
                            onAnimationEnd={() => this.toggleNotification(false)}
                            id={this.state.notificationStatus ? "successColor" : "failed"}>
                            {this.state.notificationMessage}
                        </div> : null}

                    <div className={`upload-image__content-container`}>
                        <i className="fa fa-close closeUploadImage" onClick={() => this.props.setShowPhotoModal(false)}></i>

                        {/* <img alt="" src={portrait}></img> */}
                        {/* <h1>Set Photo</h1> */}
                        {theImage}
                        <input onChange={this.fileSelectedHandler} type="file" id="files" className="hidden" accept="image/x-png, image/jpeg" />

                        <div id="UploadButtons">
                            {!this.state.hasChanged ? <label id="uploadIMG" htmlFor="files">{'Choose File'}</label>
                                : <button id='uploadIMG' onClick={this.fileUploadHandler}>Confirm</button>}

                        </div>
                    </div>

                </div>
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        uid: state.user.uid,
        photoURL: state.user.photoURL,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUserData: (photoURL) => dispatch(actions.setUserData({ photoURL: photoURL }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadImage)