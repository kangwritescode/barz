import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import './InfoGetter.css'
import 'firebase/firestore'
import * as actions from '../../../store/actions/index'
import { connect } from 'react-redux'
import { errorCreater } from '../../../shared/utility'
import axios from 'axios'
import { regions } from '../../../shared/regions'
import DotSpinner from '../../../components/DotSpinner/DotSpinner'

const InfoGetter = (props) => {

    const [username, setUsername] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [gender, setGender] = useState('')
    const [allUsernames, setAllUsernames] = useState([])
    const [spinner, setSpinner] = useState(false)
    const [notification, setNotification] = useState('')

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
        return axios.get('https://cors-anywhere.herokuapp.com/' + 'https://www.zipcodeapi.com/rest/' + process.env.REACT_APP_ZIP_KEY +  '/info.json/' + zipcode + '/degrees')
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
        setSpinner(true)
        try {
            if (allUsernames.includes(username)) {
                throw errorCreater('Sorry, that username is taken')
            }
            console.log(zipCode)
            let address = await fetchAddressFromZipcode(zipCode)
            var newInfo = {
                username: username,
                address: {
                    ...address,
                    region: regions[address["state"]]
                },
                needsInfo: false,
                gender: gender === 'M' ? 'Male' : 'Female'
            }
            props.postUserData(props.myUID, newInfo, setSpinner)
        }
        catch (err) {
            setSpinner(false)
            setNotification(err.message)
        }

    }
    var submitValid = (username.length > 2) && (zipCode.length === 5) && (!!gender)
    return (
        <div className={`info-getter`}>
            {notification
                ? <div className={`info-getter__notification`}
                    onAnimationEnd={() => setNotification('')}>
                    {notification}
                </div>
                : null}
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
                className={`info-getter__submit ${submitValid && !spinner ? 'valid-submit' : ''}`}
                disabled={username < 3 || zipCode.length < 5 || !gender || spinner}
                onClick={submit}>
                Submit
                {spinner ? <DotSpinner customStyle={{ position: 'absolute', left: '-5em', top: '-9.5em' }} /> : null}
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
        postUserData: (uid, data, spinner) => dispatch(actions.postUserData(uid, data, spinner))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(InfoGetter)
