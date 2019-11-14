import React from 'react'
import './DotSpinner.css'

export default function DotSpinner(props) {
    return <div className='dot-spinner' id={props.id} style={props.customStyle}></div>
}
