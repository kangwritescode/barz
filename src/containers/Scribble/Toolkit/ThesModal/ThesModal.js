import React, { Component } from 'react'
import './ThesModal.css'
import GenID from '../../../../shared/GenID'

class ThesModal extends Component {


    checkResponsetype = (arr) => {
        try {
            if (arr.length === 0 || arr.every(datum => typeof datum === 'string')) {
                return 'suggestions'
            } else {
                return 'definitions'
            }
        }
        catch {
            return 'suggestions'
        }
    }

    render() {


        let content = null
        let response = this.props.thesJSON

        if (response) {
            let responseType = this.checkResponsetype(response)
            if (responseType === 'suggestions') {

                content = (
                    <div id="thes-sugg-modal-body">
                        <i className="fa fa-close" id="close-thes-sugg-modal" onClick={() => this.props.toggleModal('showthesJSON', false)}></i>

                        <div id="suggestions-wrapper">
                            <div id="sorry">Sorry fam, nothing for '<span id='wrong-word'>{this.props.theWord}</span>'.</div>
                        </div>
                    </div>
                )
            }
            else {
                // filter
                response = response.filter(entry => (entry.meta.id.toLowerCase() === this.props.theWord.toLowerCase())
                    || (entry.hom && entry.meta.id === this.props.theWord + ':' + entry.hom)
                )

                content = (
                    <div id="thes-modal-body">
                        <div id='thes-close-wrapper'>
                            <i className="fa fa-close" id="close-thes-modal" onClick={() => this.props.toggleModal('showthesJSON', false)}></i>
                        </div>
                        <div className='toolkit-modal' id="thes-content">
                            <div id="word-title">{this.props.theWord}</div>
                            <div id="line-divider"></div>

                            {/* for very single type */}
                            {response.map((type, index) => {

                                return (
                                    <div id="body-section-container" key={GenID()}>
                                        <div id="thes-def">
                                            <i id="thes-def-type">{type.fl}. </i>
                                            {type.shortdef.map((definition, index) => {
                                                if (index === type.shortdef.length - 1) {
                                                    return ` ${definition}`
                                                } return ` ${definition}; `
                                            })}
                                        </div>
                                        {type.meta.syns.map((synList, index) => {
                                            return (
                                                <div key={GenID()}>
                                                    <div id="a-syn-list">
                                                        {synList.map((word, index) => {
                                                            let comma = index === synList.length - 1 ? null : ', '
                                                            return word + comma
                                                        })}
                                                    </div>
                                                    {index === type.meta.syns.length - 1 ? null : <div id="dotted-bottom"></div>}
                                                </div>
                                            )
                                        })}
                                        {index === response.length - 1 ? <div id='hacky-space-filler' /> : <div id="type-divider"></div>}
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                )
            }
        }

        return (
            <div className='thes-modal-container'>
                <div id="thes-modal-backdrop" onClick={() => this.props.toggleModal('showthesJSON', false)}></div>
                {content}
            </div>
        )
    }
}
export default ThesModal