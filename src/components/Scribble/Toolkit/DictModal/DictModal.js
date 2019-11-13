import React, { Component } from 'react'
import './DictModal.css'
import GenID from '../../../../shared/GenID'

class DictModal extends Component {


    checkResponsetype = (arr) => {
        try {
            if (arr === 'Word is required.' || arr.every(datum => typeof datum === 'string')) {
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
        let response = this.props.dictJSON
        if (response) {
            let responseType = this.checkResponsetype(response)
            if (responseType === 'suggestions') {
                content = (
                    <div id="dict-sugg-modal-body">
                        <i className="fa fa-close" id="close-dict-sugg-modal" onClick={() => this.props.toggleModal('showdictJSON', false)}></i>

                        <div id="suggestions-wrapper">
                            <div id="sorry">Sorry fam, nothing for '<span id='wrong-word'>{this.props.theWord}</span>'.</div>
                            <div id='dict-sugg-'></div>
                        </div>
                    </div>
                )
            }
            else {
                // filter
                response = response.filter(entry => (entry.meta.id.toLowerCase() === this.props.theWord.toLowerCase()) || (entry.hom && entry.meta.id === this.props.theWord + ':' + entry.hom) || (entry.fl === 'trademark'))
                content = (
                    <div id="dict-modal-body">
                        <div className="close-dict-modal-wrapper"><i className="fa fa-close" id="close-dict-modal" onClick={() => this.props.toggleModal('showdictJSON', false)}></i></div>
                        <div  className='toolkit-modal' id='dict-modal-body-content'>
                            <div id="word-title">{this.props.theWord}</div>
                            <div id="dict-line-divider"></div>
                            <div id="definitions-container">
                                {response.map(type => {
                                    return (
                                        <div key={GenID()}>
                                            <div id="word-type">{type.fl}</div>
                                            <ol id="definitions-list">
                                                {type.shortdef.map(definition => {
                                                    return (
                                                        <li id="short-def" key={GenID()}>{definition}</li>
                                                    )
                                                })}
                                            </ol>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>


                    </div>

                )
            }
        }


        return (
            <div className='dict-modal-container'>
                <div id="dict-modal-backdrop" onClick={() => this.props.toggleModal('showdictJSON', false)}></div>
                {content}
            </div>
        )
    }
}
export default DictModal