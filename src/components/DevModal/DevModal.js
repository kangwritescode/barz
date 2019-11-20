import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import 'firebase/firestore'
import './DevModal.css'
import { connect } from 'react-redux'

const DevModal = (props) => {
    return (
        <div className={`dev-modal-wrapper`}>
            <div className='dev-modal-backdrop' onClick={props.togglePopup}></div>
            <div className={`dev-modal`}>
                <i class="fa fa-close dev-modal__close" onClick={props.togglePopup}></i>
                Thanks for checking out this early beta version of BARZ! It’s still in development so expect bugs, weird behavior, and at worst crashes (I’ll work really hard to prevent this), but I hope you can still have fun with the app in the meantime.
                <br />
                <br />
                A stable version release is aimed for sometime early next year.
                If you’re interested in working on the app, shoot me an <a href="mailto:kangwritescode@gmail.com?Subject=BARZ" target="_top">email</a> or add me on <a href={'https://www.facebook.com/david.kang.75'}>Facebook</a>.
                Happy writing!
                <br />
                <span>-Ajiashi</span>
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


export default connect(mapStateToProps, mapDispatchToProps)(DevModal)
