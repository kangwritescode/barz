import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import 'firebase/firestore'
import './Scroller.css'
import { connect } from 'react-redux'
import ManyPost from '../../Judge/ManyView/ManyPost/ManyPost'

const Scroller = (props) => {
    const manyPostData = {
        content: {
            lineOne: 'helloooo',
            lineTwo: 'helloooo',
            lineThree: 'helloooo',
            lineFour: 'helloooo',
        }
    }
    return (
        <div className='scroller'>
            <div className={`scroller__item-container`}>
                <div className={`item-container__item`}>
                    {/* <ManyPost /> */}
                </div>
                <div className={`item-container__item`}>Item 2</div>
                <div className={`item-container__item`}>Item 3</div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scroller)
