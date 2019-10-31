import React, { Component } from 'react'
import copy from 'clipboard-copy'
import './RhymeModal.css'
import GenID from '../../../../shared/GenID'

class RhymeModal extends Component {

    distribute = (arr) => {

        var columns = {
            one: [],
            two: [],
            three: [],
            four: [],
        }
        while (arr.length > 0) {

            columns.one.push(arr.pop().word)
            if (arr.length === 0) { return columns }
            columns.two.push(arr.pop().word)
            if (arr.length === 0) { return columns }
            columns.three.push(arr.pop().word)
            if (arr.length === 0) { return columns }
            columns.four.push(arr.pop().word)
        }
        return columns
    }



    copyAndShowNotification = (word) => {
        // copy to clipboard
        copy(word)

        var allNotifications = document.getElementsByClassName('notification')
        for (let item of allNotifications) {
            item.classList.remove('show-copy-notification')
        }


        var notification = document.getElementById(`${word}-notification`)
        notification.classList.add('show-copy-notification')
    }

    removeShowNotificationClass = (word) => {
        var notification = document.getElementById(`${word}-notification`)
        notification.classList.remove('show-copy-notification')
    }

    render() {



        // rhyme arra y
        var rhymeArray = [...this.props.rhymeJSON]
        var content = this.distribute(rhymeArray)
        var theWords = []
        for (let lineNumber in content) {
            theWords.push((
                <div className='column' id={`column-${lineNumber}`} key={GenID()}>
                    {content[lineNumber].map(word => {
                        return (
                            <div className="rhyme-word" id={word} onClick={() => this.copyAndShowNotification(word)} key={GenID()}>
                                <div className="notification" id={`${word}-notification`} onAnimationEnd={() => this.removeShowNotificationClass(word)}>
                                    <div id={`notification-tail`}></div>
                                    Copied to clipboard!
                                        </div>
                                {word}
                            </div>
                        )
                    })}
                </div>
            ))
        }



        var bodyContent = (
            <div id="rhyme-sugg-modal-body">
                <i className="fa fa-close" id="close-rhyme-sugg-modal" onClick={() => this.props.toggleModal('showrhymeJSON', false)}></i>
                <div id="suggestions-wrapper">
                    <div id="sorry">Sorry fam, nothing for '<span id='wrong-word'>{this.props.theWord}</span>'.</div>
                </div>
            </div>
        )
        if (this.props.rhymeJSON.length !== 0) {
            bodyContent = (
                <div className='rhyme-modal-container'>
                    <div id='close-rhyme-modal-wrapper'>
                        <i className="fa fa-close" id="close-rhyme-modal" onClick={() => this.props.toggleModal('showrhymeJSON', false)}></i>
                    </div>
                    <div className='toolkit-modal' id="rhyme-modal-body">
                        <div id="word-title">{this.props.theWord}</div>
                        <div id="line-divider"></div>
                        <div className='columns-container'>
                            {theWords}
                        </div>
                    </div>
                </div>
            )
        }



        return (
            <div id='rhyme-modal-wrapper'>
                <div id="rhyme-modal-backdrop" onClick={() => this.props.toggleModal('showrhymeJSON', false)}></div>
                <div id="body-content-wrapper">

                    {bodyContent}
                </div>
            </div>
        )
    }
}
export default RhymeModal