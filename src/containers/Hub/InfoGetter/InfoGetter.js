import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import './InfoGetter.css'
import 'firebase/firestore'
import { connect } from 'react-redux'

const InfoGetter = (props) => {
    return (
        <div className={`info-getter`}>
            <h1>Complete Your Profile</h1>
            <input className='info-getter__username' placeholder='Username' spellCheck={false} autoCorrect='off'></input>
            <div className={`info-getter__hor-container`}>
                <input className='hor-container__input' placeholder='Hometown Zipcode'></input>
                <button className='hor-container__gender-button'>M</button>
                <button className='hor-container__gender-button'>F</button>
            </div>
            <button className='info-getter__submit'>Submit</button>
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


export default connect(mapStateToProps, mapDispatchToProps)(InfoGetter)
