import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router'
import vinyl2_IMG from '../../assets/images/vinyl2_IMG.png'
import vinyl2 from '../../assets/videos/vinyl2.mp4'
import './Judge.css'
import JudgeNavBar from './JudgeNavBar/JudgeNavBar'
import ManyView from './ManyView/ManyView'
import SingleView from './SingleView/SingleView'



const Judge = props => {

    const [sortFilterState, setSortFilterState] = useState({
        view: 'Explore',
        sort: 'Newest',
        filter: 'All Posts',
        time: 'All Time',
        coast: 'All Coasts',
    })

    const [keyPressed, setKeyPressed] = useState(null)
    useEffect(() => {
        const assignRedirect = (event) => {
            switch (event.key) {
                case '1': return setKeyPressed(1)
                case '2': return setKeyPressed(2)
                case '4': return setKeyPressed(4)
                default: break;
            }
        }
        document.addEventListener('keydown', assignRedirect)

        return () => {
            document.removeEventListener('keydown', assignRedirect)
        };
    }, [])

 


    const updateJudgeState = (newState, value) => {
        setSortFilterState({
            ...sortFilterState,
            [newState]: value
        })
    }


    let view = (
        <SingleView
            uid={props.uid}
            sort={sortFilterState.sort}
            filter={sortFilterState.filter}
            view={sortFilterState.view} />
    )
    if (sortFilterState.view === 'Explore') {
        view = (
            <ManyView
                sort={sortFilterState.sort}
                filter={sortFilterState.filter}
                view={sortFilterState.view}
                coast={sortFilterState.coast}
                time={sortFilterState.time}/>
        )
    }
    
    var content = (
        <div>
            <div className="JudgeContainer">

                <img id='backup-img' src={vinyl2_IMG} alt=''></img>
                <video src={vinyl2} autoPlay={true} loop={true} playsInline={true} muted />
                <div id="judgeOverlay" />
                <JudgeNavBar
                    sort={sortFilterState.sort}
                    filter={sortFilterState.filter}
                    view={sortFilterState.view}
                    time={sortFilterState.time}
                    coast={sortFilterState.coast}
                    updateJudgeState={updateJudgeState} />
                {view}
            </div>
        </div>

    )

    switch (keyPressed) {
        case 1: return content = <Redirect to='/hub'></Redirect>
        case 2: return content = <Redirect to='/scribble'></Redirect>
        case 4: return content = <Redirect to='/wordsmiths'></Redirect>
        default: break;

    }


    return content


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

