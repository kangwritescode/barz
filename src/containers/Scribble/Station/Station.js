import React from 'react'
import './Station.css'




export default function Station(props) {



    return (
        <div className="Station" onClick={() => props.playGenre(props.genre)}>
            <img id={props.genre} src={props.icon} alt="MISSING" />
        </div>
    )
}
