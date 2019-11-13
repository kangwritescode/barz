import React from 'react'
import './PhotoContainer.css'

function PhotoContainer(props) {



    return (
        <div id="uploadContainer" onClick={() => props.setShowPhotoModal(true)}>
            <div id="uploadButtonContainer">
                <div id="uploadButton">
                    <i className="fa fa-camera camera-icon" aria-hidden="true"></i>
                </div>
            </div>
            {props.imgURL ?
                <img id="ProfileImage" alt={""} src={props.imgURL} /> :
                null}
        </div>
    )
}

export default PhotoContainer
