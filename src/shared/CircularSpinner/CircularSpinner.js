import React from 'react'
import './CircularSpinner.css'
import PropTypes from 'prop-types'

function CircularSpinner(props) {
    return (
        <div 
            className='circular-spinner'
            style={props.customStyle ? props.customStyle : null}>
        </div>
    )
}

CircularSpinner.propTypes = {
    customStyle: PropTypes.object
}

export default CircularSpinner

