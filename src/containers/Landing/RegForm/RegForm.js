import React, { useState, useEffect } from 'react'
import validator from 'validator'
import firebase from 'firebase'
import {regions} from '../../../shared/regions'
import './RegForm.css'
import axios from 'axios'
import { errorCreater } from '../../../shared/errorCreator'

function RegForm(props) {

    //state
    var [step, setStep] = useState('account')

    var [email, setEmail] = useState('')
    var [password, setPass] = useState('')
    var [username, setUsername] = useState('')
    var [zipcode, setZipcode] = useState('')
    var [gender, pickGender] = useState(null)

    var [allEmails, setAllEmails] = useState([])
    var [allUsernames, setAllUsernames] = useState([])

    var [mysteryManBlob, setMysteryManBlob] = useState(null)

    // on mounting
    useEffect(() => {
        fetchEmailsAndUsernames()
        fetchMysteryMan()
    }, [])

    // api calls
    const fetchEmailsAndUsernames = async () => {
        const db = firebase.firestore()
        var emailsAndUsernames = await db.collection('users').get()
            .then(snapshots => {
                var emails = []
                var usernames = []
                snapshots.forEach(snapshot => {
                    emails.push(snapshot.data().email)
                    usernames.push(snapshot.data().username)
                })
                return [emails, usernames]
            })
        setAllEmails(emailsAndUsernames[0])
        setAllUsernames(emailsAndUsernames[1])
    }

    const fetchAddressFromZipcode = async (zipcode) => {
        return axios.get('https://www.zipcodeapi.com/rest/js-zF10dQxfazt7cMgYnzZphQk7jEzBwBYPb781ubkqZokAXEvUzbinxdGT5rzVrkmB/info.json/' + zipcode + '/degrees')
            .then(res => { return res.data })
            .catch(err => {
                throw err
            })
    }
    const createAuthUser = async (userInput, password) => {
        return firebase.auth().createUserWithEmailAndPassword(userInput, password)
            .then(authObj => {
                return [authObj.user.email, authObj.user.uid]
            })
            .catch(err => {

                throw err
            })
    }
    const uploadMysteryMan = async (uid) => {
        var storageRef = firebase.storage().ref();
        var photoRef = storageRef.child(`images/${uid}/userIMG.png`);
        return photoRef.put(mysteryManBlob)
            .then(() => { return photoRef })
            .catch(err => { console.log(err.message) })
    }

    const fetchMysteryMan = () => {
        var storage = firebase.storage()
        storage.ref('mysteryman/mysteryman.png').getDownloadURL()
            .then(url => {
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = event => {
                    var blob = xhr.response;
                    setMysteryManBlob(blob)
                };
                xhr.open('GET', url);
                xhr.send();

            }).catch(function (error) {
                console.log(error)
            });
    }
    const createFirebaseUser = async (email, uid, address, photoRef) => {
        var db = firebase.firestore();

        const user = {
            email: email,
            uid: uid,
            photoRef: photoRef,
            username: username,
            address: {
                ...address,
                region: regions[address["state"]]
            },
            gender: gender,
            handles: {
                facebook: '',
                instagram: '',
                soundcloud: '',
                youtube: ''
            }
        }
        return db.collection('users').doc(uid).set(user)
            .then(() => {
                return true
            })
            .catch((err) => {
                throw err
            });
    }



    // filter functions
    const filterAndSetUsername = (value) => {
        const regex = new RegExp(/^[A-Za-z0-9_]+$/)
        if (regex.test(value) || value === '') {
            setUsername(value)
        } else {
            return
        }
    }

    const filterAndSetZipcode = (value) => {
        if (value.length <= 5) {
            setZipcode(value)
        }
    }

    // validate functions
    const validateEmail = (email) => {
        if (!validator.isEmail(email)) {
            return false
        }
        return true
    }
    const validatePassword = (password) => {
        if (password.length < 6) {
            return false
        }
        return true
    }
    const validateUsername = (username) => {
        if (username.length < 3) {
            return false
        }
        return true
    }

    const validateZipcode = (zipcode) => {
        var zipString = parseInt(zipcode)
        var zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
        return zipCodePattern.test(zipString);
    }

    // auth functions
    const firstStep = () => {
        if (allEmails.includes(email)) {
            props.setErrMsg('An account with that email already exists.')
            props.setShowErr(true)
        } else {
            setStep('profile')
        }
    }

    const submit = async (event) => {
        event.preventDefault()

        try {
            // username check
            if (allUsernames.includes(username)) {
                throw errorCreater('That username is taken.')
            }
            // zipcode check
            const address = await fetchAddressFromZipcode(zipcode)
            let [emailFire, uid] = await createAuthUser(email, password)
            console.log("poopity scoop")
            const photoRef = await uploadMysteryMan(uid)
            await createFirebaseUser(emailFire, uid, address, photoRef.location.path)
            notifyWithErr('Profile Created Successfully')
        }
        catch (err) {
            console.log(err)
            notifyWithErr(err.message)
        }
    }
    const notifyWithErr = (msg) => {
        props.setErrMsg(msg)
        props.setShowErr(true)
    }

    // validate values (account)
    const isInvalidEmail = email && !validateEmail(email) ? 'invalid' : null
    const isInvalidPass = password && !validatePassword(password) ? 'invalid' : null
    const isValidContinue = email && password && !isInvalidEmail && !isInvalidPass ? 'valid' : null


    // validate values (profile)
    const isInvalidUsername = username && !validateUsername(username) ? 'invalid' : null
    const isInvalidZipcode = zipcode && !validateZipcode(zipcode) ? 'invalid' : null
    const maleSelected = gender === 'male' ? 'focused-sex' : null
    const femaleSelected = gender === 'female' ? 'focused-sex' : null
    const isValidSubmit = (
        username &&
        zipcode &&
        gender &&
        validateUsername(username) &&
        validateZipcode(zipcode)
    ) ? 'valid' : null


    // form
    var form = (
        <div className='account-wrapper'>
            <div className='reg-detail'>Account Info</div>
            <input
                className={`large-input ${isInvalidEmail}`}
                placeholder='Email'
                value={email}
                onChange={event => setEmail(event.target.value)}></input>
            <input
                className={`large-input ${isInvalidPass}`}
                type='password'
                value={password}
                placeholder='Password'
                onChange={event => setPass(event.target.value)}></input>
            <button
                className={`reg-button ${isValidContinue}`}
                onClick={(event) => {
                    event.preventDefault();
                    firstStep()
                }}
                disabled={!isValidContinue}>Continue</button>
        </div>

    )
    if (step === 'profile') {
        form = (
            <div className='profile-wrapper'>
                <div className='reg-detail'>Profile Info</div>
                <input
                    className={`large-input ${isInvalidUsername}`}
                    placeholder='Username'
                    value={username}
                    maxLength={15}
                    onChange={event => filterAndSetUsername(event.target.value)}></input>
                <div className='zip-sex-wrapper'>
                    <input
                        type='number'
                        className={`zip-input ${isInvalidZipcode}`}
                        placeholder='Hometown ZIP'
                        value={zipcode}
                        onChange={event => filterAndSetZipcode(event.target.value)}></input>
                    <button className={`sex-button ${maleSelected}`} onClick={(event) => { event.preventDefault(); pickGender('Male') }}>M</button>
                    <button className={`sex-button ${femaleSelected}`} onClick={(event) => { event.preventDefault(); pickGender('Female') }}>F</button>
                </div>
                <button
                    className={`reg-button ${isValidSubmit}`}
                    onClick={event => submit(event, email)}
                    disabled={!isValidSubmit}>Submit</button>
            </div>
        )
    }
    return (
        <form className='reg-form'>
            <i className="fa fa-close" id='reg-form-close' onClick={() => props.updateReg(false)}></i>
            <h1 className='reg-header'>Sign Up</h1>
            {form}
        </form>
    )
}

export default RegForm
