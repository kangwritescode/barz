import React, { useEffect } from 'react'
import {connect} from 'react-redux'
import './Rapper.css'

function Rapper(props) {
    
    return (
        <div className="rapper" onClick={() => props.shineSpotlight(props)} id={props.style}>
            <div className="rapperDetail rapper-detail-font" id="votes">{props.votes}</div>
            <div className="rapperDetail rapper-detail-font" id="username">{props.username}</div>
            <div className="rapperDetail rapper-detail-font" id="location">{`${props.city}, ${props.state}`}</div>
            <div className="rapperDetail rapper-detail-font" id="coast">{props.coast}</div>
            <div className="rapperDetail rapper-detail-font" id="gender">{props.gender}</div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        myUsername: state.user.username,
    }
}

export default connect(mapStateToProps, null)(Rapper)