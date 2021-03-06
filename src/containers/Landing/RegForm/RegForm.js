import React, { useState, useEffect } from 'react'
import validator from 'validator'
import firebase from 'firebase'
import { regions } from '../../../shared/regions'
import './RegForm.css'
import axios from 'axios'
import { errorCreater } from '../../../shared/utility'

function RegForm(props) {

    // State

    // data 
    let [allEmails, setAllEmails] = useState([])
    let [allUsernames, setAllUsernames] = useState([])
    let [mysteryManBlob, setMysteryManBlob] = useState(null)

    // ui
    let [step, setStep] = useState('account')
    let [spinning, setSpinner] = useState(false)

    //profile
    let [email, setEmail] = useState('')
    let [password, setPass] = useState('')
    let [username, setUsername] = useState('')
    let [zipcode, setZipcode] = useState('')
    let [gender, pickGender] = useState('')





    // on mounting
    useEffect(() => {
        fetchEmailsAndUsernames()
        fetchMysteryMan()
    }, [])

    // api calls
    const fetchEmailsAndUsernames = async () => {
        const db = firebase.firestore()
        let emailsAndUsernames = await db.collection('users').get()
            .then(snapshots => {
                let emails = []
                let usernames = []
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
                throw errorCreater("Sorry, we're having trouble processing that ZIP Code.")
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

    // uploades mysteryman and then...
    const uploadMysteryMan = async (uid) => {
        let storageRef = firebase.storage().ref();
        let photoRef = storageRef.child(`images/${uid}/userIMG.png`);
        return photoRef.put(mysteryManBlob)
            .then(async (successObj) => {
                // fetches and returns the download URL
                const url = await successObj.ref.getDownloadURL()
                return url
            })
            .catch(err => { console.log(err.message) })
    }

    const fetchMysteryMan = () => {
        let storage = firebase.storage()
        storage.ref('mysteryman/mysteryman.png').getDownloadURL()
            .then(url => {
                let xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = event => {
                    let blob = xhr.response;
                    setMysteryManBlob(blob)
                };
                xhr.open('GET', url);
                xhr.send();

            }).catch(function (error) {
                console.log(error)
            });
    }
    const createFirebaseUser = async (email, uid, address, photoURL) => {
        let db = firebase.firestore();

        const user = {
            email: email,
            uid: uid,
            photoURL: photoURL,
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
            setUsername(value.toLowerCase())
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
        if (zipcode.length === 5) {
            return true
        } return false
    }

    // auth functions
    const firstStep = async () => {
        setSpinner(true)
        try {
            await fetchEmailsAndUsernames()
            if (allEmails.includes(email)) {
                throw errorCreater('The email address is already in use by another account.')
            } else {
                setSpinner(false)
                setStep('profile')
            }
        }

        catch (err) {
            setSpinner(false)
            notifyWithErr(err.message)
        }
    }



    const submit = async (event) => {
        event.preventDefault()
        setSpinner(true)

        try {
            // username check
            await fetchEmailsAndUsernames()
            if (allUsernames.includes(username)) {
                throw errorCreater('That username is taken.')
            }
            if (allEmails.includes(email)) {
                throw errorCreater('The email address is already in use by another account.')
            }
            // zipcode check
            const address = await fetchAddressFromZipcode(zipcode)
            console.log(address)
            let [emailFire, uid] = await createAuthUser(email, password)
            const photoURL = await uploadMysteryMan(uid)
            await createFirebaseUser(emailFire, uid, address, photoURL)

            // success!

            props.setErrSentiment(true)
            notifyWithErr('Profile Created Successfully!')
            setSpinner(false)
            setUsername('')
            setZipcode('')
            pickGender('')
            props.setEmail(email)
            props.setPassword(password)
            setEmail('')
            setPass('')



        }
        catch (err) {
            notifyWithErr(err.message)
            setSpinner(false)
        }
    }
    const notifyWithErr = (msg) => {
        props.setErrMsg(msg)
        props.setShowErr(true)
    }

    // validate values (account)
    const isInvalidEmail = email && !validateEmail(email) ? 'invalid' : null
    const isInvalidPass = password && !validatePassword(password) ? 'invalid' : null
    const isValidContinue = email && password && !isInvalidEmail && !isInvalidPass && !spinning ? 'valid' : null


    // validate values (profile)
    const isInvalidUsername = username && !validateUsername(username) ? 'invalid' : null
    const isInvalidZipcode = zipcode && !validateZipcode(zipcode) ? 'invalid' : null
    const maleSelected = gender === 'Male' ? 'focused-sex' : null
    const femaleSelected = gender === 'Female' ? 'focused-sex' : null
    const isValidSubmit = (
        username &&
        zipcode &&
        gender &&
        validateUsername(username) &&
        validateZipcode(zipcode) &&
        !spinning
    ) ? 'valid' : null


    // form
    let form = (
        <div className={`account-wrapper`}>
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
            <div className={`profile-wrapper`}>
                <i className="fas fa-chevron-left" id='reg-form-back' onClick={() => setStep('account')}></i>
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
            {spinning ? <div className='reg-form-spinner'></div> : null}
            <i className="fa fa-close" id='reg-form-close' onClick={() => { props.updateReg(false); props.setShowErr(false) }}></i>
            <h1 className='reg-header'>Sign Up</h1>
            {form}
        </form>
    )
}

export default RegForm
