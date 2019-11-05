import React from 'react'
import './FollowBox.css'

function FollowBox() {
    return (
        <div className='follow-box'>
            <div className='follow-box__header'>
                <div className='header__section'>
                    7 followers
                </div>
                <div className='header__section'>
                    12 following
                </div>
            </div>
            <div className='follow-box_body'></div>
        </div>
    )
}

export default FollowBox
