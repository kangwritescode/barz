import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionTypes from '../../../../store/actions'
import './Slider.css'

class Slider extends Component {


    render() {

        console.log(this.props.customStyle)

        return (
            <div className="Slider"  >
                <input 
                    onChange={event => this.props.changeVol(event.target.value)} 
                    value={this.props.volume} 
                    type="range"
                    style={this.props.customStyle}/>
            </div>
        )
    }
}

let mapStatetoProps = state => {
    return {
        volume: state.music.volume,
    }
}
let mapDispatchToProps = dispatch => {
    return {
        changeVol: (volume) => dispatch({ type: actionTypes.CHANGE_VOLUME, volume: volume }),
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Slider)
