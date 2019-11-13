import React, { Component } from 'react'
import './Toolkit.css'
import axios from 'axios'
import DictModal from './DictModal/DictModal'
import ThesModal from './ThesModal/ThesModal'
import RhymeModal from './RhymeModal/RhymeModal'

class Toolkit extends Component {

    static dictKEY = 'a3e24913-4128-48ea-a608-b32992b47b18'
    static thesKey = '4fee459c-2f1e-428d-8a92-e4bbf1e117c1'

    state = {
        searchInput: '',
        dictJSON: null,
        thesJSON: null,
        rhymeJSON: null,

        showdictJSON: false,
        showthesJSON: false,
        showrhymeJSON: false,

        spinner: false
    }
    toggleSpinner = (value) => {
        this.setState({
            ...this.state,
            spinner: value
        })
    }
    onChangeHandler = (event) => {
        this.setState({
            ...this.state,
            searchInput: event.target.value.toLowerCase()
        })
    }

    fetchJSON = async (type, input, event) => {
        event.preventDefault()
        this.toggleSpinner(true)
        let URL = ''
        switch (type) {
            case 'dictJSON': URL = `https://cors-anywhere.herokuapp.com/https://www.dictionaryapi.com/api/v3/references/collegiate/json/${input}?key=${Toolkit.dictKEY}`; break;
            case 'thesJSON': URL = `https://cors-anywhere.herokuapp.com/https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${input}?key=${Toolkit.thesKey}`; break;
            case 'rhymeJSON': URL = `https://cors-anywhere.herokuapp.com/https://api.datamuse.com/words?rel_rhy=${input}`; break;
            default: break;
        }
        axios.get(URL)
            .then(res => {
                this.toggleSpinner(false)
                this.setState({
                    ...this.state,
                    [type]: res.data,
                    ['show' + type]: true
                })
            })
            .catch(err => {
                console.log(err)
                this.toggleSpinner(false)

            })
    }


    toggleModal = (type, value) => {
        this.setState({
            ...this.state,
            [type]: value
        })
    }

    inputNotEmptyLetters = () => {
        return this.state.searchInput && /^[a-zA-Z]+$/.test(this.state.searchInput)
    }

    render() {
        return (
            <div className="Toolkit">
                {this.state.spinner ? <div id='my-search-spinner'></div> : null}
                {this.state.showdictJSON ? <DictModal theWord={this.state.searchInput.toLowerCase()} dictJSON={this.state.dictJSON} toggleModal={this.toggleModal} /> : null}
                {this.state.showthesJSON ? <ThesModal theWord={this.state.searchInput.toLowerCase()} thesJSON={this.state.thesJSON} toggleModal={this.toggleModal} /> : null}
                {this.state.showrhymeJSON ? <RhymeModal theWord={this.state.searchInput.toLowerCase()} rhymeJSON={this.state.rhymeJSON} toggleModal={this.toggleModal} /> : null}
                <div className="toolkit-header">Toolkit</div>

                <form id="body">
                    <input
                        placeholder=""
                        value={this.state.searchInput}
                        onChange={this.onChangeHandler}
                        spellCheck='false'
                        autoCorrect={'off'}
                        autoComplete={'off'}
                        maxLength="30"></input>
                    <div id="toolkit__button-wrapper">
                        <button
                            className={this.inputNotEmptyLetters() && !this.state.spinner ? `button` : 'disabled-button'}
                            id="dict" 
                            disabled={!this.inputNotEmptyLetters() || this.state.spinner ? true : false}
                            onClick={this.inputNotEmptyLetters() ? (event) => this.fetchJSON('dictJSON', this.state.searchInput.toLowerCase(), event) : (event) => event.preventDefault()}>
                            Dict
                        </button>
                        <button
                            className={this.inputNotEmptyLetters() && !this.state.spinner ? `button` : 'disabled-button'}
                            id="thes"
                            disabled={!this.inputNotEmptyLetters() || this.state.spinner ? true : false}
                            onClick={this.inputNotEmptyLetters() ? (event) => this.fetchJSON('thesJSON', this.state.searchInput.toLowerCase(), event) : (event) => event.preventDefault()}>
                            Thes
                        </button>
                        <button
                            className={this.inputNotEmptyLetters() && !this.state.spinner ? `button` : 'disabled-button'}
                            id="rhyme"
                            disabled={!this.inputNotEmptyLetters() || this.state.spinner ? true : false}
                            onClick={this.inputNotEmptyLetters() ? (event) => this.fetchJSON('rhymeJSON', this.state.searchInput.toLowerCase(), event) : (event) => event.preventDefault()}>
                            Rhyme
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Toolkit
