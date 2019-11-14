import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import 'firebase/firestore'
import * as actionTypes from '../../store/actions'
import './Scribble.css'
import vinyl from '../../assets/vinyl.mov'
import vinyIMG from '../../assets/vinylIMG.png'
import Post from './Post/Post'
import MyBars from './MyBars/MyBars'
import Toolkit from './Toolkit/Toolkit'
import Turntable from './Turntable/Turntable'
import nafla from '../../assets/nafla-blows.m4v'
import PostEditor from './PostEditor/PostEditor'


const Scribble = () => {

    const [viewFocus, setViewFocus] = useState('Post')
    const [editedPost, setEditedPost] = useState(null)

    const toggleView = () => {
        return viewFocus === 'Post' ? setViewFocus('MyBars') : setViewFocus('Post')
    }
    const editPost = (pid) => {
        setEditedPost(pid)
    }

    return (
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
        playMusic: () => dispatch({ type: actionTypes.PLAY_MUSIC }),
        stopMusic: () => dispatch({ type: actionTypes.STOP_MUSIC }),
        changeURL: (newURL) => dispatch({ type: actionTypes.CHANGE_MUSIC_URL, musicURL: newURL }),
        changeVol: (volume) => dispatch({ type: actionTypes.CHANGE_VOLUME, volume: volume })
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Scribble);