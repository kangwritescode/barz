import React from 'react'
import './PopNotif.css'

function PopNotif(props) {
    return (
        <div className='pop-notif' id={props.id}>
            <div className='pop-notif-tail'></div>
        </div>
    )
}

export default PopNotif