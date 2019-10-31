import React, { useState, Fragment } from 'react'
import Slider from 'react-input-slider'
import './VolumeSlider.css'

export default function VolumeSlider(props) {

  const [state, setState] = useState({ x: 0.7 });
  const style = {
    track: {
      backgroundColor: 'grey'
    },
    active: {
      backgroundColor: 'grey'
    },
    track: {
      width: 100,
      height: 2
    },
    thumb: {
      width: 8,
      height: 8,
      opacity: 1
    },
    disabled: {
      opacity: 0.5
    }
  }

  return (
    <div className="VolumeSlider">
      <Slider
        axis="x"
        xstep={.001}
        xmin={0}
        xmax={1}
        x={state.x}
        onChange={({ x }) => {
          setState({ x: x })
          props.changeVol(x)
        }}
        styles={style} />
    </div>

  );
}
