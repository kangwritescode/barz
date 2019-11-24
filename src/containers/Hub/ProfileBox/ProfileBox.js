import React, { useEffect, useState } from 'react'
import './ProfileBox.css'
import PhotoContainer from './PhotoContainer/PhotoContainer'
import firebase from 'firebase'
import { getOrdinal } from '../../../shared/utility'
import { connect } from 'react-redux'
import { postUserData } from '../../../store/actions/auth'
import * as actions from '../../../store/actions/index'



function ProfileBox(props) {

    const [showDropOptions, toggleDropOptions] = useState(false)
    const [follows, setFollows] = useState([])
    const [blurbText, setBlurbText] = useState('')

    // componentDidMount
    useEffect(() => {
        document.addEventListener('click', closeDropOptions)
        fetchFollows()
        return () => {
            document.removeEventListener('click', closeDropOptions)
        };
    }, [])

    // componentDidUpdate
    useEffect(() => {

        if (props.blurb) {
            setBlurbText(props.blurb)
        }
    }, [props.photoRef, props.rapper, follows, props.uid, props.blurb])

    const fetchFollows = async () => {
        let db = firebase.firestore()
        let follows = await db.collection("follows").get().then(((querySnapshot) => {
            let fetchedFollows = []
            querySnapshot.forEach(doc => {
                fetchedFollows.push({
                    ...doc.data(),
                    fid: doc.id
                })
            })
            return fetchedFollows
        }))
        setFollows(follows)

    }


    const closeDropOptions = (event) => {
        if (!event.target.classList.contains('hub-profile-box__three-dots') && !event.target.classList.contains('dot')) {
            toggleDropOptions(false)
        }
    }

    const textAreaKeyDown = event => {
        if (event.keyCode === 13) {
            event.preventDefault()
            event.target.blur()
        }
    }
    const addhttp = (url) => {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }


    var user = props.paramsUser ? props.paramsUser : props

    let blockOneContent = null;
    let handles = (
        <div className='contents-wrapper__handles-container'>
            <i className="fab fa-facebook-f icon" onClick={() => props.toggleUploadHandles(true)}></i>
            <i className="fab fa-instagram icon" onClick={() => props.toggleUploadHandles(true)}></i>
            <i className="fab fa-soundcloud icon" onClick={() => props.toggleUploadHandles(true)}></i>
            <i className="fab fa-youtube icon" onClick={() => props.toggleUploadHandles(true)}></i>
        </div>
    )
    if (props.paramsUser) {
        handles = Object.entries(user.handles).map(entry => {
            if (entry[1] !== "") {
                return <i className={`fab fa-${entry[0] + (entry[0] === 'facebook' ? '-f' : '')} icon`} onClick={() => window.open(addhttp(entry[1]))}></i>
            }
            return null
        })
        handles = (
            <div className='contents-wrapper__handles-container'>
                {handles}
            </div>
        )
    }

    if (!user.needsInfo && !props.isLoading) {
        blockOneContent = (
            <div className={`block-one__contents-wrapper`}>
                {props.paramsUser ? <img className='contents-wrapper__params-photo' src={props.paramsUser.photoURL} alt=''></img> : (
                    <PhotoContainer imgURL={user.photoURL} setShowPhotoModal={props.setShowPhotoModal} />
                )}

                <div className='contents-wrapper__username'>{user.username}</div>
                <div className='contents-wrapper__address-gender'>{user.address.city}, {user.address.state} | {user.gender}</div>
                {handles}
                {!props.paramsUser ?
                    (<textarea
                        className='contents-wrapper__blurb'
                        placeholder={props.paramsUser ? null : '-Write a blurb-'}
                        spellCheck={false}
                        maxLength={55}
                        style={props.paramsUser ? { cursor: 'default' } : null}
                        onKeyDown={event => textAreaKeyDown(event)}
                        onChange={event => setBlurbText(event.target.value)}
                        onBlur={event => props.postUserData(props.uid, { blurb: event.target.value })}
                        disabled={!!props.paramsUser}
                        value={props.paramsUser ? user.blurb : blurbText} />)
                : <div className='contents-wrapper__blurb' style={{cursor: 'default'}}>{props.paramsUser.blurb}</div> }

            </div>
        )
    }
    if (props.needsInfo && !props.isLoading) {
        blockOneContent = (
            <div className={`block-one__contents-wrapper`}>
                <img
                    className='contents-wrapper__dummy-img'
                    alt=''
                    src={props.photoURL}></img>
                <div className='contents-wrapper__username'>Anonymous</div>
            </div>
        )
    }

    let blockTwoContent = null;

    if (!props.isLoading) {
        blockTwoContent = (
            <div className={'block-two__place-point-container'}>
                <div>
                    {props.myPlace + getOrdinal(props.myPlace) + " place"}
                </div>
                <div>
                    {props.myPoints + " point" + (props.myPoints === 1 ? '' : 's')}
                </div>
            </div>
        )
    }

    let editOptions;
    if (props.paramsUser || props.isLoading) {
        editOptions = null;
    } else {
        editOptions = (
            <div>
                <div className='hub-profile-box__three-dots' onClick={() => toggleDropOptions(!showDropOptions)}>
                    <div className='dot' />
                    <div className='dot' />
                    <div className='dot' />
                </div>
                {showDropOptions ?
                    <div className='hub-profile-box__drop-options'>
                        <div className='drop-options__log-out' onClick={props.logout}>Log Out</div>
                    </div> : null}

                <i className="fas fa-cog hub-profile-box__settings" onClick={() => props.toggleDeleteAcc(true)}></i>
            </div>
        )
    }

    return (<div className='hub-profile-box' >

        {editOptions}
        <div className='hub-profile-box__block-one'>
            {blockOneContent}
        </div>
        <div className='hub-profile-box__block-two'>
            {blockTwoContent}
        </div>
    </div>
    )
}

const mapStateToProps = state => {
    return {
        uid: state.user.uid,
        email: state.user.email,
        username: state.user.username,
        sex: state.user.gender,
        address: state.user.address,
        zipcode: state.user.address.zip_code,
        city: state.user.address.city,
        state: state.user.address.state,
        needsInfo: state.user.needsInfo,
        photoURL: state.user.photoURL,
        blurb: state.user.blurb
    }
}



const mapDispatchToProps = dispatch => {
    return {
        postUserData: (uid, data) => dispatch(postUserData(uid, data)),
        logout: () => dispatch(actions.logOut())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBox)
