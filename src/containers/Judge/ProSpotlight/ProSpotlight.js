import React, { useState } from 'react'
import {proBars} from './ProAssets/ProBars'
import './ProSpotlight.css'

function ProSpotlight(props) {

    let [bars, _ ] = useState(bars)
    return (
        <div className='pro-spotlight-wrapper'>
            <div className='backdrop' onClick={() => props.toggleModal(false)}></div>
            <div className='body'>
                <p className='section-one'>
                    {proBars.map((bar, i) => {
                        if (i < 4) {
                            i += 1
                            return <span id={`pro-line-${i}`}> {bar} <br /> </span>
                        }
                    })}

                </p>
                <p className='section-two'>
                    {proBars.map((bar, i) => {
                        if (i >= 4) {
                            i += 1
                            return <span id={`pro-line-${i}`}> {bar} <br /> </span>
                        }
                    })}

                </p>
                <div className='artist'>Earl Sweatshirt <span className='dash'>-</span> <span className='song'>Bill</span></div>
                <div className='date'>11.01.13</div>
            </div>
        </div>
    )
}

export default ProSpotlight