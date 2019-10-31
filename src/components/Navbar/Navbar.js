import React from 'react'
import './Navbar.css'
import NavItem from './NavItem/NavItem'
import BarzLogo from './BarzLogo/BarzLogo'



function Navbar() {

    return (
       
            <div className="Navbar">
                <BarzLogo></BarzLogo>
                <NavItem buttonTitle="HUB" dest="/hub"></NavItem>
                <NavItem buttonTitle="SCRIBBLE" dest="/scribble"></NavItem>
                <NavItem buttonTitle="JUDGE" dest="/judge"></NavItem>
                <NavItem buttonTitle="WORDSMITHS" dest="/wordsmiths"></NavItem>
            </div>
            

    )
}

export default Navbar
