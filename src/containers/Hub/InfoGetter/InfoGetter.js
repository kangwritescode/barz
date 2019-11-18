import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import './InfoGetter.css'
import 'firebase/firestore'
import * as actions from '../../../store/actions/index'
import { connect } from 'react-redux'
import { errorCreater } from '../../../shared/utility'
import axios from 'axios'
import {regions} from '../../../shared/regions'

const InfoGetter = (props) => {

    const [username, setUsername] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [gender, setGender] = useState('')
    const [allUsernames, setAllUsernames] = useState([])

    useEffect(() => {
        fetchAllUsernames()
        return () => {

        };
    }, [])
    const filterAndSetUsername = (value) => {
        const regex = new RegExp(/^[A-Za-z0-9_]+$/)
        if (regex.test(value) || value === '') {
            setUsername(value.toLowerCase())
        } else {
            return
        }
    }
    const filterAndSetZipcode = (value) => {
        if (value.length <= 5) {
            setZipCode(value)
        }
    }
    const fetchAddressFromZipcode = async (zipcode) => {
        return axios.get('https://www.zipcodeapi.com/rest/js-zF10dQxfazt7cMgYnzZphQk7jEzBwBYPb781ubkqZokAXEvUzbinxdGT5rzVrkmB/info.json/' + zipcode + '/degrees')
            .then(res => { return res.data })
            .catch(err => {
                throw errorCreater("Sorry, we're having trouble processing that ZIP Code.")
            })
    }
    const fetchAllUsernames = async () => {
        const db = firebase.firestore()
        db.collection('users').get()
            .then(snapshots => {
                let usernames = []
                snapshots.forEach(snapshot => {
                    usernames.push(snapshot.data().username)
                })
                setAllUsernames(usernames)

            })
    }
    const submit = async () => {
        try {
            if (allUsernames.includes(username)) {
                throw errorCreater('Sorry, that username is taken')
            }
            console.log(zipCode)
            let address = await fetchAddressFromZipcode(zipCode)
            var newInfo = {
                username: username,
                address: address,
                needsInfo: false,
                gender: gender === 'M' ? 'Male': 'Female'
            }
            console.log(props.myUID)
            props.postUserData(props.myUID, newInfo)
        }
        catch (err) {
            console.log(err.message)
        }
        
    }
    var submitValid = (username.length > 2) && (zipCode.length === 5) && (!!gender)
    console.log(submitValid)
    console.log(props.userState)
    return (
        <div className={`info-getter`}>
            <h1>Complete Your Profile</h1>
            <input
                className='info-getter__username'
                placeholder='Username'
                value={username}
                onChange={event => filterAndSetUsername(event.target.value)}
                spellCheck={false}
                maxLength={14}
                autoCorrect='off'></input>
            <div className={`info-getter__hor-container`}>
                <input
                    className='hor-container__input'
                    placeholder='Hometown Zipcode'
                    type='number'
                    value={zipCode}
                    onChange={event => filterAndSetZipcode(event.target.value)}></input>
                <button
                    className={`hor-container__gender-button ${gender === 'M' ? 'valid' : null}`}
                    onClick={() => setGender('M')}>M</button>
                <button
                    className={`hor-container__gender-button ${gender === 'F' ? 'valid' : null}`}
                    onClick={() => setGender('F')}>F</button>
            </div>
            <button
                className={`info-getter__submit ${submitValid ? 'valid-submit' : ''}`}
                disabled={username < 3 || zipCode.length < 5 || !gender}
                onClick={submit}>
                Submit
                    </button>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        myUID: state.user.uid,
        userState: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        postUserData: (uid, data) => dispatch(actions.postUserData(uid, data))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(InfoGetter)
