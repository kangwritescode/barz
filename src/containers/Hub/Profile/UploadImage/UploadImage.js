import React, { Component } from 'react'
import './UploadImage.css'
import { connect } from 'react-redux'
import firebase from '../../../../Firebase'
import portrait from '../../../../assets/portrait.png'

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
        var storage = firebase.storage();
        storage.ref(this.props.photoRef).getDownloadURL().then(url => {

            console.log(url)
            this.setState({
                ...this.state,
                selectedFile: url
            })
        }).catch(function (error) {
            console.log("error in Profile.js: ", error)
        });
    }

    fileSelectedHandler = event => {
        var targetFile = event.target.files[0]
        if (targetFile) {
            var reader = new FileReader()
            var presentIMG = document.getElementById("uploadIMGPresent")
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
        var storageRef = firebase.storage().ref()
        var imageRef = storageRef.child(this.props.photoRef)
        var uploadTask = imageRef.put(this.state.selectedFile)
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
                this.props.setImgURL(downloadURL)
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
        var theImage;
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

                    {/* <img alt="alt" src={portrait}></img> */}
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
        photoRef: state.photoRef
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadImage)