import React, { Component } from 'react'
import { connect } from 'react-redux'
import { postUserData } from '../../../../store/actionCreators'

import fb from '../../../../assets/modalHandles/fb.png'
import sc from '../../../../assets/modalHandles/add-sc.png'
import yt from '../../../../assets/modalHandles/add-yt.png'
import pencil from '../../../../assets/edit-pencil.png'
import ig from '../../../../assets/handles/ig.png'
import undo from '../../../../assets/undo.png'
import './AddHandles.css'

class AddHandles extends Component {

    state = {
        fb_input: '',
        ig_input: '',
        sc_input: '',
        yt_input: '',

        backup_fb: '',
        backup_ig: '',
        backup_sc: '',
        backup_yt: '',
    }

    componentDidMount = () => {
        this.setState({
            fb_input: this.props.handles.facebook,
            ig_input: this.props.handles.instagram,
            sc_input: this.props.handles.soundcloud,
            yt_input: this.props.handles.youtube,

            backup_fb: this.props.handles.facebook,
            backup_ig: this.props.handles.instagram,
            backup_sc: this.props.handles.soundcloud,
            backup_yt: this.props.handles.youtube,

        })
    }

    handleInputHandler = (event, handle) => {
        this.setState({
            ...this.state,
            [handle]: event.target.value
        })
    }

    updateHandles = async () => {

        try {
            await this.props.updateProfile(this.props.uid, {
                handles: {
                    facebook: this.state.fb_input,
                    instagram: this.state.ig_input,
                    soundcloud: this.state.sc_input,
                    youtube: this.state.yt_input
                }
            })
            this.setState({
                ...this.state,
                backup_fb: this.state.fb_input,
                backup_ig: this.state.ig_input,
                backup_sc: this.state.sc_input,
                backup_yt: this.state.yt_input
            })
        }
        catch (err) {
            console.log(err)
        }
        
    }

    undo = (handle) => {

        switch (handle) {
            case 'fb':
                this.setState({
                    ...this.state,
                    fb_input: this.state.backup_fb
                })
                break;
            case 'ig':
                this.setState({
                    ...this.state,
                    ig_input: this.state.backup_ig
                })
                break;
            case 'sc':
                this.setState({
                    ...this.state,
                    sc_input: this.state.backup_sc
                })
                break;
            case 'yt':
                this.setState({
                    ...this.state,
                    yt_input: this.state.backup_yt
                })
                break;
            default:
                break
        }
    }

    hasStagedItems = () => {
        if (this.state.fb_input !== this.props.handles.facebook || this.state.ig_input !== this.props.handles.instagram ||
            this.state.sc_input !== this.props.handles.soundcloud || this.state.yt_input !== this.props.handles.youtube) {
            return true
        }
        return false
    }

    render() {

        return (
            <div>
                <div className="ul-img-backdrop" onClick={() => this.props.toggleUploadHandles(false)}></div>
                <div className="add-handles-modal">
                <div id="closeUploadImage" onClick={() => this.props.toggleUploadHandles(false)}><i className="fa fa-close"></i></div>
                    <h1 id="handles-header">My Media</h1>

                    <div className={`handle-wrapper `}>
                        <div className="icon-holder">
                            <img alt="alt"  id="add-fb" src={fb} />
                        </div>
                        <input
                            className={`handle-input ${this.state.fb_input !== this.props.handles.facebook ? 'staged' : null}`}
                            spellcheck="false"
                            value={this.state.fb_input}
                            onChange={(event) => this.handleInputHandler(event, 'fb_input')}
                            placeholder={'-insert link-'}></input>
                        <img alt="alt"  id="pencil" src={pencil}></img>
                        <img alt="alt"  className={`${this.state.fb_input !== this.props.handles.facebook ? 'undo-staged' : 'undo'}`} src={undo} onClick={() => this.undo('fb')}></img>
                    </div>

                    <div className="handle-wrapper">
                        <div className="icon-holder">
                            <img alt="alt"  id="add-ig" src={ig} />
                        </div>
                        <input
                            className={`handle-input ${this.state.ig_input !== this.props.handles.instagram ? 'staged' : null}`}
                            spellcheck="false"
                            value={this.state.ig_input}
                            onChange={(event) => this.handleInputHandler(event, 'ig_input')}
                            placeholder={'-insert handle-'}></input>
                        <img alt="alt"  id="pencil" src={pencil}></img>
                        <img alt="alt"  className={`${this.state.ig_input !== this.props.handles.instagram ? 'undo-staged' : 'undo'}`} src={undo} onClick={() => this.undo('ig')}></img>
                    </div>

                    <div className="handle-wrapper">
                        <div className="icon-holder">
                            <img alt="alt"  id="add-sc" src={sc} />
                        </div>
                        <input
                            className={`handle-input ${this.state.sc_input !== this.props.handles.soundcloud ? 'staged' : null}`}
                            spellcheck="false"
                            value={this.state.sc_input}
                            onChange={(event) => this.handleInputHandler(event, 'sc_input')}
                            placeholder={'-insert link-'}></input>
                        <img alt="alt"  id="pencil" src={pencil}></img>
                        <img alt="alt"  className={`${this.state.sc_input !== this.props.handles.soundcloud ? 'undo-staged' : 'undo'}`} src={undo} onClick={() => this.undo('sc')}></img>

                    </div>

                    <div className="handle-wrapper">
                        <div className="icon-holder">
                            <img alt="alt"  id="add-yt" src={yt} />
                        </div>
                        <input
                            className={`handle-input ${this.state.yt_input !== this.props.handles.youtube ? 'staged' : null}`}
                            spellcheck="false"
                            value={this.state.yt_input}
                            onChange={(event) => this.handleInputHandler(event, 'yt_input')}
                            placeholder={'-insert link-'}></input>
                        <img alt="alt"  id="pencil" src={pencil}></img>
                        <img alt="alt"  className={`${this.state.yt_input !== this.props.handles.youtube ? 'undo-staged' : 'undo'}`} src={undo} onClick={() => this.undo('yt')}></img>

                    </div>
                    <div className={this.hasStagedItems() ? 'button-staged' : 'confirm-handles'} onClick={this.updateHandles.bind(this)}>Update</div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        uid: state.uid,
        handles: state.handles
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateProfile: (uid, data) => dispatch(postUserData(uid, data).bind(this))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddHandles)
