import React from 'react'
import { connect } from 'react-redux'
import './Rapper.css'

function Rapper(props) {
    const colorDict = {
        'West': 'yellow',
        'South': 'turquoise',
        'Midwest': 'darkred',
        'East': 'green'

    }
    
    return (
        <div className="rapper" onClick={() => props.shineSpotlight(props)} id={props.style}>
            <div className="rapperDetail rapper-detail-font" id="votes">{props.votes}</div>
            <div className="rapperDetail rapper-detail-font" id="username"><b>{props.username}</b></div>
            <div className="rapperDetail rapper-detail-font" id="location">{`${props.city}, ${props.state}`}</div>
            <div className="rapperDetail rapper-detail-font" id="coast"><span style={{color: colorDict[props.coast]}}>{props.coast}</span></div>
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