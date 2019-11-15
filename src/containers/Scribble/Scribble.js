import 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import vinyl from '../../assets/videos/vinyl.mov'
import vinyIMG from '../../assets/images/vinylIMG.png'
import * as actions from '../../store/actions/index'
import MyBars from './MyBars/MyBars'
import Post from './Post/Post'
import './Scribble.css'
import Toolkit from './Toolkit/Toolkit'
import Turntable from './Turntable/Turntable'




const Scribble = () => {

    const [viewFocus, setViewFocus] = useState('Post')
    const [keyPressed, setKeyPressed] = useState(null)

    const toggleView = () => {
        return viewFocus === 'Post' ? setViewFocus('MyBars') : setViewFocus('Post')
    }
    
    useEffect(() => {
        const assignRedirect = (event) => {
            switch (event.key) {
                case '1': return setKeyPressed(1)
                case '3': return setKeyPressed(3)
                case '4': return setKeyPressed(4)
                default: break;
            }
        }
        document.addEventListener('keydown', assignRedirect)
        return () => {
            document.removeEventListener('keydown', assignRedirect)
        };
    }, [])
    var content = (
        <div className="Scribble">
            <img id='backup-img' src={vinyIMG} alt=''></img>
            <video src={vinyl} autoPlay={true} loop={true} playsInline={true} muted />
            <div id="scribbleOverlay" />
            <div className="row-one">
                <MyBars focused={viewFocus} toggle={toggleView} />
                <Post focused={viewFocus} toggle={toggleView} />
                <div></div>
            </div>
            <div className="row-two">
                <Toolkit />
                <div className='scribble-turntable-wrapper'>
                    <Turntable />
                </div>
            </div>
        </div>
    )
    switch (keyPressed) {
        case 1: return content = <Redirect to='/hub'></Redirect>
        case 3: return content = <Redirect to='/judge'></Redirect>
        case 4: return content = <Redirect to='/wordsmiths'></Redirect>
        default: break;

    }
    return content
}
let mapStatetoProps = state => {
    return {
        musicURL: state.music.musicURL,
        volume: state.music.volume,
        playing: state.music.playing,
        allStations: {
            ...state.music.allStations
        }
    }
}
let mapDispatchToProps = dispatch => {
    return {
        playMusic: () => dispatch(actions.playMusic()),
        stopMusic: () => dispatch(actions.stopMusic()),
        changeURL: (newURL) => dispatch(actions.changeURL(newURL)),
        changeVol: (volume) => dispatch(actions.changeVol(volume)),
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Scribble);