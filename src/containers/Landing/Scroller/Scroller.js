import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import 'firebase/firestore'
import './Scroller.css'
import { connect } from 'react-redux'
import manyPost from '../../../assets/images/manyPost.png'
import ajiashi from '../../../assets/images/ajiashi.png'
import table from '../../../assets/images/table.png'

const Scroller = (props) => {
    const [xPos, setXPos] = useState(-1290);
    useEffect(() => {

        if (xPos === -1290) {
            setTimeout(() => {
                setXPos(0)
            }, 6000);
        }
        else {
            if (!xPos) {
                setXPos(-430)
            }
            setTimeout(() => {
                setXPos(xPos - 430)
            }, 6000);
        }

    }, [xPos])

    var scrollStyle = { 
        transform: `translateX(${xPos}px)`,
    }
    if (!xPos) {
        scrollStyle = { 
            transform: `translateX(${xPos}px)`,
            transition: 'none'
        }
    }
    return (
        <div className='scroller'>
            <div
                className={`scroller__item-container`}
                style={scrollStyle}>
                <div className={`item-container__item`}>
                    <p>
                        <b className='emphasized'>Scribble </b>
                        and
                        <b className='emphasized'> Post </b>
                        your best rap barz and <b className='emphasized'>Judge</b> the competition</p>
                    <img className={'item__many-post'} alt='' src={manyPost}></img>
                </div>
                <div className={`item-container__item`}>
                    <p>See where you <b className='emphasized'>Rank</b> among the strongest <b className='emphasized'>Wordsmiths</b> in your area</p>
                    <img className={'item__table'} alt='' src={table}></img>
                </div>
                <div className={`item-container__item`}>
                    <p> <b className='emphasized'>Follow</b> your favorite <b className='emphasized'>Wordsmiths</b> and <br /> <b className='emphasized'>Explore</b> each others' media</p>
                    <img className={'item__ajiashi'} alt='' src={ajiashi}></img>
                </div>
                <div className={`item-container__item`}>
                    <p>
                        <b className='emphasized'>Scribble </b>
                        and
                        <b className='emphasized'> Post </b>
                        your best rap barz and <b className='emphasized'>Judge</b> the competition</p>
                    <img className={'item__many-post'} alt='' src={manyPost}></img>
                </div>
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
