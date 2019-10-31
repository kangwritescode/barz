import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionTypes from '../../../store/actions'
import './Turntable.css'
import glare from '../../../assets/glare.png'
import arm from '../../../assets/arm.png'
import Slider from './Slider/Slider'

class Turntable extends Component {

    playMusic = () => {

        // change song, play music
        var songs = Object.values(this.props.allStations)
        this.props.changeURL(songs[this.props.songPointer])
        this.props.playMusic()

        // stage correct pointer
        if (this.props.songPointer === songs.length - 1) { this.props.setSongPointer(0) }
        else { this.props.setSongPointer(this.props.songPointer + 1) }
    }



    render() {


        return (
            <div className="turntable">
                <div id="click-space" onClick={this.props.playing ? this.props.stopMusic : this.playMusic}></div>
                <Slider />
                <div id="vinyl">
                    <img alt="alt" className={this.props.playing ? 'spinning' : null} id="glare" src={glare} />
                    <div id="inner-vinyl"></div>
                    <div id="dot"></div>
                </div>
                <div className={`arm-container ${this.props.playing ? 'record-play' : 'record-stop'}`} >
                    <img alt="alt" id="arm" src={arm} />
                </div>
                <div id="buttons-container">
                    <div className={`button`} id={`${this.props.playing ? null : 'button-active'}`}></div>
                    <div className={`button`} id={`${this.props.playing ? 'button-active' : null}`}></div>
                </div>
            </div>
        )
    }
}

let mapStatetoProps = state => {
    return {
        musicURL: state.musicURL,
        volume: state.volume,
        playing: state.playing,
        allStations: {
            ...state.allStations
        },
        songPointer: state.songPointer
    }
}
let mapDispatchToProps = dispatch => {
    return {
        playMusic: () => dispatch({ type: actionTypes.PLAY_MUSIC }),
        stopMusic: () => dispatch({ type: actionTypes.STOP_MUSIC }),
        changeURL: (newURL) => dispatch({ type: actionTypes.CHANGE_MUSIC_URL, musicURL: newURL }),
        changeVol: (volume) => dispatch({ type: actionTypes.CHANGE_VOLUME, volume: volume }),
        setSongPointer: (val) => dispatch({ type: actionTypes.SET_SONG_POINTER, value: val })
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Turntable)