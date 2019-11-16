import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { postUserData } from '../../../store/actions/auth'

import fb from '../../../assets/images/modalHandles/fb.png'
import sc from '../../../assets/images/modalHandles/add-sc.png'
import yt from '../../../assets/images/modalHandles/add-yt.png'
import pencil from '../../../assets/images/edit-pencil.png'
import ig from '../../../assets/images/ig.png'
import undoIMG from '../../../assets/images/undo.png'
import './AddHandles.css'
import DotSpinner from '../../../components/DotSpinner/DotSpinner'


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
    const [loading, setLoading] = useState(false)


    useEffect(() => {
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
            setLoading(true)
            await props.updateProfile(props.uid, {
                handles: {
                    facebook: input.fb,
                    instagram: input.ig,
                    soundcloud: input.sc,
                    youtube: input.yt
                }
            }, setLoading)
            setBackup({
                fb: input.fb,
                ig: input.ig,
                sc: input.sc,
                yt: input.yt
            })
        }
        catch (err) {
            console.log(err.message)
            setLoading(false)

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
            handleName: 'fb',
            className: 'fab fa-facebook-f',
            color: props.handles.facebook ? 'blue' : null
        },
        {
            url: ig,
            input: input.ig,
            propsValue: props.handles.instagram,
            handleName: 'ig',

            className: 'fab fa-instagram',
            color: props.handles.instagram ? 'purple' : null
        },
        {
            url: sc,
            input: input.sc,
            propsValue: props.handles.soundcloud,
            handleName: 'sc',

            className: 'fab fa-soundcloud',
            color: props.handles.soundcloud ? 'orange' : null

        },
        {
            url: yt,
            input: input.yt,
            propsValue: props.handles.youtube,
            handleName: 'yt',

            className: 'fab fa-youtube',
            color: props.handles.youtube ? 'red' : null

        },
    ]

    const inputRender = handleData.map(inputData => (
        <div className={`handle-wrapper `}>
            <div className="icon-holder">
                <i className={`${inputData.className} ${inputData.color}`}></i>
            </div>
            <input
                className={`handle-input ${inputData.input !== inputData.propsValue ? 'staged' : null}`}
                spellCheck="false"
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
                {loading ? <DotSpinner customStyle={{position: 'absolute', zIndex: '999', bottom: '-4em', left: '6em'}}/> : false}
                <i className="fa fa-close close-add-handles" onClick={() => props.toggleUploadHandles(false)}></i>
                <h1 id="handles-header">My Media</h1>
                {inputRender}
                <div className={hasStagedItems() ? 'button-staged' : 'confirm-handles'} onClick={updateHandles}>Update</div>

            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        uid: state.user.uid,
        handles: state.user.handles
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateProfile: (uid, data, setSpinner) => dispatch(postUserData(uid, data, setSpinner))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddHandles)
