import React, { Component } from 'react'
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


class Scribble extends Component {

    state = {
        viewFocus: 'Post',
    }

    toggleView = () => {
        if (this.state.viewFocus === 'Post') {
            this.setState({
                viewFocus: 'MyBars'
            })
        } else if (this.state.viewFocus === 'MyBars') {
            this.setState({
                viewFocus: 'Post'
            })
        }
        return
    }


    render() {


        return (
            <div className="Scribble">
                <img id='backup-img' src={vinyIMG} alt='alt'></img>
                <video src={vinyl} autoPlay={true} loop={true} playsInline={true} muted />
                <div id="scribbleOverlay" />
                <div className="row-one">
                    <MyBars focused={this.state.viewFocus} toggle={this.toggleView} />
                    <Post focused={this.state.viewFocus} toggle={this.toggleView} />
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
        changeVol: (volume) => dispatch({ type: actionTypes.CHANGE_VOLUME, volume: volume })
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Scribble);