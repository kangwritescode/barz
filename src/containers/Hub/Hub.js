import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Hub.css'
// import Aux from '../../hoc/Aux/'
import yox from '../../assets/yox.m4v'
import yoxIMG from '../../assets/yoxIMG.png'
import DotSpinner from '../../shared/DotSpinner/DotSpinner'

class Hub extends Component {

    static defaultProps = {
    }


    render() {

        return (
            <div className="hub-layout">
                <img id="backup-img" src={yoxIMG} alt="alt" />
                <video id="yox" src={yox} autoPlay={true} loop={true} playsInline={true} muted />
                <div id="yoxOverlay" />
                <div id="mv-cred">YEAR OF THE OX - MOOD CONTROL CYPHER</div>
                <div className='column-container'>
                    <div className='left-column'>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className='middle-column'></div>
                    <div className='right column'>
                        <div className='news-and-updates'></div>
                        <div></div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.loggedIn,
        autoSignInOver: state.autoSignInOver,
        email: state.email,
        username: state.username,
        sex: state.sex,
    }
}

export default connect(mapStateToProps, null)(Hub)

