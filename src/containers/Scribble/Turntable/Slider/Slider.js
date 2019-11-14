import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionTypes from '../../../../store/actions/actionsTypes'
import * as actions from '../../../../store/actions/index'
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
        changeVol: (volume) => dispatch(actions.changeVol(volume)),
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Slider)
