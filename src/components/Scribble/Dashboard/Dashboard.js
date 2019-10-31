import React, { Component } from 'react'
import './Dashboard.css'
import Profile from '../../../containers/Hub/Profile/Profile'
import { connect } from 'react-redux'
import InfoGetter from '../../../containers/Hub/InfoGetter/InfoGetter'


class Dashboard extends Component {
    state = {
        content: null
    }
    
    setContent = (name) => {
        this.setState({
            ...this.state,
            content: name
        })
    }

    render() {
        var content = <Profile changeWindow={this.setContent}/>
        if (this.state.content === "judgedBarz") {
            content = <h1>judgedBarz</h1>
        }
        if (this.state.content === "myBarz") {
            content = <h1>myBarz</h1>
        }
        return (
            <div className="Dashboard">
                {this.props.needsInfo ? 
                    <InfoGetter /> : 
                    content}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        uid: state.uid,
        loggedin: state.loggedIn,
        email: state.email,
        username: state.username,
        sex: state.gender,
        address: state.address,
        zipcode: state.address.zip_code,
        city: state.address.city,
        state: state.address.state,
        needsInfo: state.needsInfo,
        photoRef: state.photoRef
    }
}

export default connect(mapStateToProps, null)(Dashboard)
