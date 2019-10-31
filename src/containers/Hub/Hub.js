import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Hub.css'
import Authenticate from '../Authenticate/Authenticate'
import Dashboard from '../../components/Scribble/Dashboard/Dashboard'
// import Aux from '../../hoc/Aux/'
import yox from '../../assets/yox.m4v'
import yoxIMG from '../../assets/yoxIMG.png'
import DotSpinner from '../../shared/DotSpinner/DotSpinner'

class Hub extends Component {

    static defaultProps = {
        autoSignInOver: false
    }


    render() {

        var content = this.props.loggedIn ? <Dashboard /> : <Authenticate />
        if (!this.props.autoSignInOver) {
            content = <div className="loader" id='hub-loader'>Loading...</div>
        }

        return (
            <div className="HubLayout">
                <img id="backup-img" src={yoxIMG} alt="alt"/>
                <video id="yox" src={yox} autoPlay={true} loop={true} playsInline={true} muted />
                <div id="yoxOverlay" />
                {/* <div className="navBarCompensation"></div> */}
                <div id="MVCRED">YEAR OF THE OX - MOOD CONTROL CYPHER </div>
                {content}
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
        representing: state.representing   
    }
}

export default connect(mapStateToProps, null)(Hub)

