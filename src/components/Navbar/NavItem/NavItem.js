import React from 'react'
import './NavItem.css'
import { Link } from 'react-router-dom'

function NavItem(props) {
    return (

        <div className="ButtonContainer">
            <Link to={props.dest}>
                <button>{props.buttonTitle}</button>
            </Link>
        </div>

    )
}

export default NavItem