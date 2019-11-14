import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import arm from '../../../assets/images/arm.png'
import glare from '../../../assets/images/glare.png'
import * as actions from '../../../store/actions/index'
import Slider from './Slider/Slider'
import './Turntable.css'

const Turntable = (props) => {
    const [animateOkay, setAnimateOkay] = useState(true)

    const getGenre = (num) => {
        switch (num) {
            case 1:
                return 'lofi'
            case 2:
                return 'boombap'
            case 3:
                return 'dilla'
            case 0:
                return 'chillhop'
            default:
                return 'error'
        }
    }

    useEffect(() => {
        if (props.playing) {
            setAnimateOkay(false)
        }
        return () => {

        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const playMusic = () => {

        // change song, play music
        if (!animateOkay) {
            setAnimateOkay(true)
        }
        let songs = Object.values(props.allStations)
        props.changeURL(songs[props.songPointer])
        props.playMusic()
        console.log(props.allStations)

        // stage correct pointer
        if (props.songPointer === songs.length - 1) { props.setSongPointer(0) }
        else { props.setSongPointer(props.songPointer + 1) }
    }

    let initialAnimate = !animateOkay ? { animation: 'none' } : null

    return (
        <div className="turntable">
            <div id="click-space" onClick={props.playing ? props.stopMusic : playMusic}></div>
            <Slider customStyle={props.customStyle ? props.customStyle.slider : null} />
            <div id="vinyl" style={props.customStyle ? props.customStyle.vinyl : null}>

                {props.playing ?
                    <h1
                        className={`turntable__word-animation`}
                        style={initialAnimate}>
                        {getGenre(props.songPointer)}
                    </h1> : null}
                <img
                    alt=""
                    className={props.playing ? 'spinning' : null}
                    style={props.customStyle ? props.customStyle.glare : null}
                    id="glare" src={glare} />
                <div id="inner-vinyl">

                </div>
                <div id="dot">

                </div>
            </div>
            <div className={`arm-container ${props.playing ? 'record-play' : 'record-stop'}`} >
                <img alt="" id="arm" src={arm} />
            </div>
            <div id="buttons-container">
                <div className={`button`} id={`${props.playing ? null : 'button-active'}`}></div>
                <div className={`button`} id={`${props.playing ? 'button-active' : null}`}></div>
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
        },
        songPointer: state.music.songPointer
    }
}
let mapDispatchToProps = dispatch => {
    return {
        playMusic: () => dispatch(actions.playMusic()),
        stopMusic: () => dispatch(actions.stopMusic()),
        changeURL: (newURL) => dispatch(actions.changeURL(newURL)),
        changeVol: (volume) => dispatch(actions.changeVol(volume)),
        setSongPointer: (val) => dispatch(actions.setSongPointer(val))
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Turntable)