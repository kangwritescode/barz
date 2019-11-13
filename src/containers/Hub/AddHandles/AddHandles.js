import React, { UseState, Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { postUserData } from '../../../store/actionCreators'

import fb from '../../../assets/modalHandles/fb.png'
import sc from '../../../assets/modalHandles/add-sc.png'
import yt from '../../../assets/modalHandles/add-yt.png'
import pencil from '../../../assets/edit-pencil.png'
import ig from '../../../assets/handles/ig.png'
import undoIMG from '../../../assets/undo.png'
import './AddHandles.css'

const AddHandles = (props) => {

    const [input, setInput] = useState({
        fb: '',
        ig: '',
        sc: '',
        yt: ''
    })
    const [backup, setBackup] = useState({
        fb: '',
        ig: '',
        sc: '',
        yt: ''
    })


    useEffect(() => {
        console.log('yaaaha')
        setInput({
            fb: props.handles.facebook,
            ig: props.handles.instagram,
            sc: props.handles.soundcloud,
            yt: props.handles.youtube
        })
        setBackup({
            fb: props.handles.facebook,
            ig: props.handles.instagram,
            sc: props.handles.soundcloud,
            yt: props.handles.youtube
        })
        return () => {
        };
    }, [])



    const updateHandles = async () => {

        try {
            await props.updateProfile(props.uid, {
                handles: {
                    facebook: input.fb,
                    instagram: input.ig,
                    soundcloud: input.sc,
                    youtube: input.yt
                }
            })
            setBackup({
                fb: input.fb,
                ig: input.ig,
                sc: input.sc,
                yt: input.yt
            })
        }
        catch (err) {
            console.log(err)
        }

    }

    const undo = (handle) => {

        switch (handle) {
            case 'fb':
                return setInput({
                    ...input,
                    fb: backup.fb
                })
            case 'ig':
                return setInput({
                    ...input,
                    ig: backup.ig
                })
            case 'sc':
                return setInput({
                    ...input,
                    sc: backup.sc
                })
            case 'yt':
                return setInput({
                    ...input,
                    yt: backup.yt
                })
            default:
                break
        }
    }

    const hasStagedItems = () => {
        if ((input.fb !== props.handles.facebook)
            || (input.ig !== props.handles.instagram)
            || (input.sc !== props.handles.soundcloud)
            || (input.yt !== props.handles.youtube)) {
            return true
        }
        return false
    }



    // render ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const handleData = [
        {
            url: fb,
            input: input.fb,
            propsValue: props.handles.facebook,
            handleName: 'fb'
        },
        {
            url: ig,
            input: input.ig,
            propsValue: props.handles.instagram,
            handleName: 'ig'
        },
        {
            url: sc,
            input: input.sc,
            propsValue: props.handles.soundcloud,
            handleName: 'sc'
        },
        {
            url: yt,
            input: input.yt,
            propsValue: props.handles.youtube,
            handleName: 'yt'
        },
    ]

    const inputRender = handleData.map(inputData => (
        <div className={`handle-wrapper `}>
            <div className="icon-holder">
                <img alt="" id="add-fb" src={inputData.url} />
            </div>
            <input
                className={`handle-input ${inputData.input !== inputData.propsValue ? 'staged' : null}`}
                spellcheck="false"
                value={inputData.input}
                onChange={(event) => setInput({
                    ...input,
                    [inputData.handleName]: event.target.value
                })}
                placeholder={'-insert link-'}></input>
            <img
                alt=""
                id="pencil"
                src={pencil}></img>
            <img
                alt=""
                className={`${inputData.input !== inputData.propsValue ? 'undo-staged' : 'undo'}`}
                src={undoIMG}
                onClick={() => undo(inputData.handleName)}></img>
        </div>
    ))

    return (
        <div>
            <div className="ul-img-backdrop" onClick={() => props.toggleUploadHandles(false)}></div>
            <div className="add-handles-modal">
                <div id="closeUploadImage" onClick={() => props.toggleUploadHandles(false)}><i className="fa fa-close"></i></div>
                <h1 id="handles-header">My Media</h1>
                {inputRender}
                <div className={hasStagedItems() ? 'button-staged' : 'confirm-handles'} onClick={updateHandles}>Update</div>

            </div>
        </div>
    )
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
