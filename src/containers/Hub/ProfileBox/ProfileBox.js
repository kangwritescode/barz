import React, { useEffect, useState } from 'react'
import './ProfileBox.css'
import PhotoContainer from '../Profile/PhotoContainer/PhotoContainer'
import * as actionTypes from '../../../store/actions'
import DeleteAccount from '../Profile/DeleteAccount/DeleteAccount'
import firebase from 'firebase'
import { getOrdinal } from '../../../shared/getOrdinal'
import { connect } from 'react-redux'



// this component is stupid an should be split into two separate components 
// or made dynamic so there isn't so much code
function ProfileBox(props) {

    const [showDropOptions, toggleDropOptions] = useState(false)
    const [showDeleteAcc, toggleDeleteAcc] = useState(false)
    const [imgURL, setImgURL] = useState(null)
    const [follows, setFollows] = useState([])
    const [amFollowing, setAmFollowing] = useState(false)



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

        const calcAmFollowing = (otherUID) => {

            var follow = follows
                .filter(follow => {
                    return follow.to === otherUID && follow.from === props.uid
                })
            setAmFollowing(follow.length === 0 ? false : true)
        }

        if (props.wrappedBy === 'Hub') {
            fetchPhotoURL(props.photoRef)
        }
        if (props.wrappedBy === 'Rappers' && props.rapper) {
            fetchPhotoURL(props.rapper.photoRef)
            calcAmFollowing(props.rapper.uid)
        }
    }, [props.photoRef, props.rapper, props.wrappedBy, follows, props.uid])

    const fetchFollows = async () => {
        var db = firebase.firestore()
        var follows = await db.collection("follows").get().then(((querySnapshot) => {
            var fetchedFollows = []
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

    const fetchPhotoURL = async (photoRef) => {
        var storage = firebase.storage();
        storage.ref(photoRef).getDownloadURL().then(url => {
            setImgURL(url)
        }).catch(function (error) { console.log("error in Profile.js: ", error) });
        return () => {
            // cleanup
        };
    }

    const follow = () => {
        setAmFollowing(true)
        var db = firebase.firestore()
        db.collection('follows').add({
            from: props.uid,
            to: props.rapper.uid
        })
            .then(() => fetchFollows())
            .catch(err => console.log(err.message))
    }

    const unfollow = () => {
        setAmFollowing(false)
        var db = firebase.firestore()
        db.collection('follows')
            .where('from', '==', props.uid)
            .where('to', '==', props.rapper.uid)
            .get()
            .then(snap => {
                snap.forEach(doc => {
                    doc.ref.delete()
                })
                fetchFollows()
            })
            .catch(err => console.log(err))
    }

    const addhttp = (url) => {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }

    const closeDropOptions = (event) => {
        if (!event.target.classList.contains('profile-box__three-dots') && !event.target.classList.contains('dot')) {
            toggleDropOptions(false)
        }
    }




    var content = null;



    // hub component ~~~
    if (props.wrappedBy === 'Hub') {
        content = (<div className='profile-box' >
            {showDeleteAcc ? <DeleteAccount toggleDeleteAcc={toggleDeleteAcc} /> : null}
            <div>
                <div className='profile-box__three-dots' onClick={() => toggleDropOptions(!showDropOptions)}>
                    <div className='dot' />
                    <div className='dot' />
                    <div className='dot' />
                </div>
                {showDropOptions ?
                    <div className='profile-box__drop-options'>
                        <div className='drop-options__log-out' onClick={props.logout}>Log Out</div>
                    </div> : null}

                <i className="fas fa-cog profile-box__settings" onClick={() => toggleDeleteAcc(true)}></i>
            </div>
            <div className='profile-box__block-one'>
                <PhotoContainer imgURL={imgURL} setShowPhotoModal={props.setShowPhotoModal} />
                <div className='block-one__username'>{props.username}</div>
                <div className='block-one__address-gender'>{props.city}, {props.state} | {props.sex}</div>
                <div className='block-one__handles-container'>
                    <i className="fab fa-facebook-f icon" onClick={() => props.toggleUploadHandles(true)}></i>
                    <i className="fab fa-instagram icon" onClick={() => props.toggleUploadHandles(true)}></i>
                    <i className="fab fa-soundcloud icon" onClick={() => props.toggleUploadHandles(true)}></i>
                    <i className="fab fa-youtube icon" onClick={() => props.toggleUploadHandles(true)}></i>
                </div>
                <p className='block-one__blurb'>"West Philadelpha born and raised on the playground was where I spent most of my days..."</p>
            </div>
            <div className='profile-box__block-two'>
                <div>
                    {props.myPlace + getOrdinal(props.myPlace) + " place"}
                </div>
                <div>
                    {props.myPoints + " point" + (props.myPoints === 1 ? '' : 's')}
                </div>
            </div>
        </div>
        )
    }


    // hub component ~~~
    else if (props.wrappedBy === 'Rappers') {

        var username = props.rapper ?
            <div className='block-one__username'>{props.rapper ? props.rapper.username : null}</div>
            : <h2>Select a User</h2>
        var addressGender = props.rapper ?
            <div className='block-one__address-gender'>{props.rapper ? props.rapper.city : null}, {props.rapper ? props.rapper.state : null} | {props.rapper ? props.rapper.gender : null}</div>
            : null

   
        var photo = props.rapper ?
            <div className='block-one__img-wrapper'>
                <img alt='' src={imgURL} />
            </div>
            : null
        var button = <button className='follow-button' onClick={follow}>follow</button>
        if (amFollowing) {
            button = <button className='follow-button' onClick={unfollow}>following</button>
        }
        content = (
            <div className='profile-box' >
                {showDeleteAcc ? <DeleteAccount toggleDeleteAcc={toggleDeleteAcc} /> : null}
                <div className='profile-box__block-one'>
                    {photo}
                    {username}
                    {addressGender}
                    <div className='block-one__handles-container'>
                        {props.rapper && props.rapper.handles.facebook ?
                            <a href={addhttp(props.rapper.handles.facebook)} rel="noopener noreferrer" target="_blank">
                                <i className="fab fa-facebook-f icon"></i>
                            </a> : null}
                        {props.rapper && props.rapper.handles.instagram ?
                            <a href={addhttp(props.rapper.handles.instagram)} rel="noopener noreferrer" target="_blank">
                                <i className="fab fa-instagram icon"></i>
                            </a> : null}
                        {props.rapper && props.rapper.handles.soundcloud ?
                            <a href={addhttp(props.rapper.handles.soundcloud)} rel="noopener noreferrer" target="_blank">
                                <i className="fab fa-soundcloud icon"></i>
                            </a> : null}
                        {props.rapper && props.rapper.handles.youtube ?
                            <a href={addhttp(props.rapper.handles.youtube)} rel="noopener noreferrer" target="_blank">
                                <i className="fab fa-youtube icon"></i>
                            </a> : null}
                    </div>
                    <p className='block-one__blurb'>{props.rapper ? "\"West Philadelphia born and raised, on the playground was where I spent most of my days.\"" : null}</p>
                </div>
                <div className='profile-box__block-two' style={{ fontSize: '.7em' }}>
                    {props.focus === 'them' ? button : null}
                    <div>{props.rapper ? props.rapper.rank + getOrdinal(props.rapper.rank) + ' place' : null} </div>
                    <div>{props.rapper ? props.rapper.votes + (props.rapper.votes === 1 ? ' point' : ' points') : null} </div>

                </div>
            </div>
        )
    }

    console.log(follows)
    return content
}
const mapStateToProps = state => {
    return {
        uid: state.uid,
        email: state.email,
        username: state.username,
        sex: state.gender,
        address: state.address,
        zipcode: state.address.zip_code,
        city: state.address.city,
        state: state.address.state,
        needsInfo: state.needsInfo,
        photoRef: state.photoRef,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({ type: actionTypes.LOG_OUT })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBox)
