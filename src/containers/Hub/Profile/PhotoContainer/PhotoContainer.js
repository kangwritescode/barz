import React from 'react'
import './PhotoContainer.css'

function PhotoContainer(props) {
    return (
        <div id="uploadContainer" onClick={() => props.toggleShowUploadImage('showUploadImage', true)}>
            <div id="uploadButtonContainer">
                <div id="uploadButton">
                    <i className="fa fa-camera" aria-hidden="true"></i>
                </div>
            </div>
            {props.imgSRC ?
                <img id="ProfileImage" alt={""} src={props.imgSRC} /> :
                null}
        </div>
    )
}

export default PhotoContainer
