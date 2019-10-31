import React, { Component } from 'react'
import './BoomBox.css'
import { connect } from 'react-redux'
import Station from '../../components/Scribble/Station/Station'

//images
import chillhop from '../../assets/chillhop.png'
import dilla from '../../assets/dilla.png'
import boombap from '../../assets/boombap.png'
import lofi from '../../assets/lofi.png'
import * as actionTypes from '../../store/actions'

// import VolumeSlider from '../../components/Scribble/VolumeSlider/VolumeSlider'


class BoomBox extends Component {


    volumeHandler = (vol) => {
        this.props.changeVol(vol)
    }

    chooseStation = (station) => {

        // if there's not music playing...
        if (!this.props.playing) {
            this.props.changeURL(station)
            this.props.playMusic()
            return
        }
        // if you press the same button when playing...
        else if (this.props.allStations[station] === this.props.musicURL) {
            this.props.stopMusic()
            return
        }
        // if you press a new button
        else {
            this.props.changeURL(station)
        }
    }


    render() {

        return (
            <div className="BoomBox">
                <div className="StationContainer">
                    <Station playGenre={this.chooseStation} genre='dilla' icon={dilla} />
                    <Station playGenre={this.chooseStation} genre='boombap' icon={boombap} />
                    <Station playGenre={this.chooseStation} genre='lofi' icon={lofi} />
                    <Station playGenre={this.chooseStation} genre='chillhop' icon={chillhop} />
                </div>
                {/* <VolumeSlider changeVol={this.volumeHandler}/> */}
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
        }
    }
}
let mapDispatchToProps = dispatch => {
    return {
        playMusic: () => dispatch({ type: actionTypes.PLAY_MUSIC }),
        stopMusic: () => dispatch({ type: actionTypes.STOP_MUSIC }),
        changeURL: (newURL) => dispatch({ type: actionTypes.CHANGE_MUSIC_URL, musicURL: newURL }),
        changeVol: (volume) => dispatch({ type: actionTypes.CHANGE_VOLUME, volume: volume})
    }
}


export default connect(mapStatetoProps, mapDispatchToProps)(BoomBox)
