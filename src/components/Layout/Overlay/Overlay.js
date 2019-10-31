import React from 'react'
import './Overlay.css'

export default function Overlay(props) {
    return (
        <div className="Overlay">
            {props.children}
        </div>
    )
}
