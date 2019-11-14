import React from 'react'
import './BarzLogo.css'
import {Link} from 'react-router-dom'

function BarzLogo() {
    return (
        <div className="BarzLogo">
            <Link to="/">
                <button>BARZ</button>
            </Link>
        </div>
    )
}
export default BarzLogo
