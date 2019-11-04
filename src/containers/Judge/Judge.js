import React, { Component } from 'react'
import './Judge.css'
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actions'
import vinyl2 from '../../assets/vinyl2.mp4'
import vinyl2_IMG from '../../assets/vinyl2_IMG.png'
import nafla from '../../assets/nafla-blows.m4v'
import JudgeNavBar from '../Judge/JudgeBarz/JudgeNavBar/JudgeNavBar'
import ManyView from './JudgeBarz/ManyView/ManyView'
import SingleView from './JudgeBarz/SingleView/SingleView'
import ViewedPost from '../../components/Scribble/MyBars/ViewedBar/ViewedPost'
import ProSpotlight from './ProSpotlight/ProSpotlight'



class Judge extends Component {

    state = {
        view: 'Explore',
        sort: 'Newest',
        filter: 'All Posts',
        time: 'All Time',
        coast: 'All Coasts',

        // manyView viewed post
        showPost: false,
        viewedPost: '',

        showProSpotlight: false,
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

    toggleProSpotlight = (bool) => {
        this.setState({
            ...this.state,
            showProSpotlight: bool
        })
    }


    render() {

        var view = (
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
                    toggleModal={this.toggleModal}
                    togglePro={this.toggleProSpotlight} />
            )
        }
        return (
            <div>
                <div className="JudgeContainer">
                    <img id='backup-img' src={vinyl2_IMG} alt=''></img>
                    <video src={vinyl2} autoPlay={true} loop={false} playsInline={true} muted />
                    <div id="judgeOverlay" />
                    <JudgeNavBar 
                        sort={this.state.sort}
                        filter={this.state.filter}
                        view={this.state.view}
                        time={this.state.time}
                        coast={this.state.coast}
                        updateJudgeState={this.updateJudgeState} />
                    {view} 
                    {this.state.showPost ? <ViewedPost toggleModal={this.toggleModal} pid={this.state.viewedPost} /> : null}
                    {this.state.showProSpotlight ? <ProSpotlight toggleModal={this.toggleProSpotlight}/> : null}
                </div>
            </div>

        )
    }

}

const mapStateToProps = state => {
    return {
        uid: state.uid
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBg: (video, style) => dispatch({ type: actionTypes.SET_GLOBAL_BACKGROUND, video: video, style: style })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Judge)

