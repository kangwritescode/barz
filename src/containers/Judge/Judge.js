import React, { Component } from 'react'
import './Judge.css'
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actions/actionsTypes'
import vinyl2 from '../../assets/videos/vinyl2.mp4'
import vinyl2_IMG from '../../assets/images/vinyl2_IMG.png'
import nafla from '../../assets/videos/nafla-blows.m4v'
import JudgeNavBar from './JudgeNavBar/JudgeNavBar'
import ManyView from './ManyView/ManyView'
import SingleView from './SingleView/SingleView'



class Judge extends Component {

    state = {
        view: 'Explore',
        sort: 'Newest',
        filter: 'All Posts',
        time: 'All Time',
        coast: 'All Coasts',

        // manyView viewed post
        showPost: false,
        proRapper: null
    }

    updateJudgeState = (newState, value) => {
        // console.log('boop', newState, value)
        this.setState({
            ...this.state,
            [newState]: value
        })
    }

    toggleModal = (modal, value, pid) => {
        this.setState({
            ...this.state,
            [modal]: value,
            viewedPost: pid
        })
    }



    render() {

        let view = (
            <SingleView
                uid={this.props.uid}
                toggleModal={this.toggleModal}
                sort={this.state.sort}
                filter={this.state.filter}
                view={this.state.view} />
        )
        if (this.state.view === 'Explore') {
            view = (
                <ManyView
                    sort={this.state.sort}
                    filter={this.state.filter}
                    view={this.state.view}
                    coast={this.state.coast}
                    time={this.state.time}
                    toggleModal={this.toggleModal} />
            )
        }
        return (
            <div>
                <div className="JudgeContainer">
                    <img id='backup-img' src={vinyl2_IMG} alt=''></img>
                    <video src={vinyl2} autoPlay={true} loop={true} playsInline={true} muted />
                    <div id="judgeOverlay" />
                    <JudgeNavBar
                        sort={this.state.sort}
                        filter={this.state.filter}
                        view={this.state.view}
                        time={this.state.time}
                        coast={this.state.coast}
                        updateJudgeState={this.updateJudgeState} />
                    {view}
                </div>
            </div>

        )
    }

}

const mapStateToProps = state => {
    return {
        uid: state.user.uid
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Judge)

