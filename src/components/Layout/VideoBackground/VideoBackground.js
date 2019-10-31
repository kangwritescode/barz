import React from 'react'
import './VideoBackground.css'
import {connect} from 'react-redux'

function VideoBackground(props) {
  return (
    <div className="VideoBackground">
      </div>
  )
}

const mapStateToProps = state => {
  return {
    bgvideo: state.bgvideo
  }
}

 
export default connect(mapStateToProps, null)(VideoBackground)
