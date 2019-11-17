import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import 'firebase/firestore'
import './Scroller.css'
import { connect } from 'react-redux'
import manyPost from '../../../assets/images/manyPost.png'
import filterBar from '../../../assets/images/filter-bar.png'
import table from '../../../assets/images/table.png'

const Scroller = (props) => {

    return (
        <div className='scroller'>
            <div className={`scroller__item-container`}>
                <div className={`item-container__item`}>
                    <p>
                        <b className='emphasized'>Scribble </b>
                        and
                        <b className='emphasized'> Post </b>
                        your best rap barz and <b className='emphasized'>Judge</b> others</p>
                    <img className={'item__many-post'} alt='' src={manyPost}></img>
                </div>
                <div className={`item-container__item`}>
                    <p>
                        <b className='emphasized'>Scribble </b>
                        and
                        <b className='emphasized'> Post </b>
                        your best rap barz and <b className='emphasized'>Judge</b> others</p>
                    <img className={'item__table'} alt='' src={table}></img>
                </div>
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
