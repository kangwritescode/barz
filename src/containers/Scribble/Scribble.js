import 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import vinyl from '../../assets/videos/vinyl.mov'
import vinyIMG from '../../assets/images/vinylIMG.png'
import * as actions from '../../store/actions/index'
import MyBars from './MyBars/MyBars'
import Post from './Post/Post'
import './Scribble.css'
import Toolkit from './Toolkit/Toolkit'
import Turntable from './Turntable/Turntable'
import PostEditor from '../Scribble/PostEditor/PostEditor'
import { isTSExpressionWithTypeArguments } from '@babel/types'




const Scribble = (props) => {

    const [viewFocus, setViewFocus] = useState(props.scribbleUI.focus)
    const [keyPressed, setKeyPressed] = useState(null)
    const [editedPost, setEditedPost] = useState(null)
    const toggleView = () => {
        return viewFocus === 'Post' ? props.setScribbleUI({focus: 'MyBars'}) : props.setScribbleUI({focus: 'Post'})
    }
    const editPost = (pid) => {
        setEditedPost(pid)
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
        // document.addEventListener('keydown', assignRedirect)
        return () => {
            // document.removeEventListener('keydown', afssignRedirect)
        };
    }, [])
    useEffect(() => {
        setViewFocus(props.scribbleUI.focus)
        return () => {
        };
    }, [props.scribbleUI])


    var content = (
        <div className="Scribble">
            <img id='backup-img' src={vinyIMG} alt=''></img>
            <video src={vinyl} autoPlay={true} loop={true} playsInline={true} muted />
            <div id="scribbleOverlay" />
            {editedPost ? <PostEditor pid={editedPost} toggleEditor={setEditedPost}/> : null}
            <div className="row-one">
                <MyBars focused={viewFocus} toggle={toggleView} editPost={editPost}/>
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
    // switch (keyPressed) {
    //     case 1: return content = <Redirect to='/hub'></Redirect>
    //     case 3: return content = <Redirect to='/judge'></Redirect>
    //     case 4: return content = <Redirect to='/wordsmiths'></Redirect>
    //     default: break;

    // }
    return content
}

let mapStatetoProps = state => {
    return {
        musicURL: state.music.musicURL,
        volume: state.music.volume,
        playing: state.music.playing,
        scribbleUI: state.ui.scribble,
        allStations: {
            ...state.music.allStations
        },

    }
}
let mapDispatchToProps = dispatch => {
    return {
        playMusic: () => dispatch(actions.playMusic()),
        stopMusic: () => dispatch(actions.stopMusic()),
        changeURL: (newURL) => dispatch(actions.changeURL(newURL)),
        changeVol: (volume) => dispatch(actions.changeVol(volume)),
        setScribbleUI: (newState) => dispatch(actions.setScribbleUI(newState))
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Scribble);