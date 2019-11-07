import React, { useEffect, useState } from 'react'
import firebase from 'firebase'
import './FollowItem.css'
import 'firebase/firestore'
import { connect } from 'react-redux'

const FollowItem = (props) => {

    const [photoURL, setPhotoURL] = useState(null)

    // componentDidMount
    useEffect(() => {
        fetchPhotoUrl()
        return () => {
        };
    }, [])

    const fetchPhotoUrl = () => {
        var storage = firebase.storage();
        storage.ref(props.photoRef).getDownloadURL().then(url => {
            setPhotoURL(url)
        })
    }

    return (
        <div className='follow-item'>
            <div className={`follow-item__profile`}>
                <img className={`profile__photo`} alt='' src={photoURL}></img>
                <div className={`profile__details-container`}>
                    <div className={`details-container__name`}>
                        {props.username}
                    </div>
                    <div className={`details-container__details`}>
                        {props.address.city}, {props.address.state} | {props.gender === 'Male' ? 'M' : 'F'}
                    </div>
                </div>
            </div>
            <button className={`follow-item__follow-button`}>following</button>
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


export default connect(mapStateToProps, mapDispatchToProps)(FollowItem)
