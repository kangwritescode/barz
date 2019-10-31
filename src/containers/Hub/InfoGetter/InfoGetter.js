import React, { Component } from 'react'
import './InfoGetter.css'
import { connect } from 'react-redux'
import { postUserData } from '../../../store/actionCreators'
import { regions } from '../../../shared/regions'
import axios from '../../../axios-orders'
import axiosCommon from 'axios'
import { parse } from 'url'
import firebase from '../../../Firebase'
import 'firebase/firestore'
import DotSpinner from '../../../shared/DotSpinner/DotSpinner'

class InfoGetter extends Component {

    state = {

        username: '',
        zipcode: '',
        gender: '',
        focused: '',
        allUsernames: [],
        showNotification: false,
        notificationMsg: '',
        notificationStatus: false,

        processing: false,

    }
    componentDidMount = async () => {

        var allUsernames = []
        var db = firebase.firestore()
        await db.collection("users").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var user = doc.data()
                    if (!user.needsInfo) {
                        allUsernames.push(user.username)
                    }
                });
            })
            .catch((err) => {
                console.log(err)
            })
        this.setState({
            ...this.state,
            allUsernames: allUsernames
        })
    }

    toggleProcessing = (bool) => {
        this.setState({
            ...this.state,
            processing: bool
        })
    }

    usernameInputHandler(event) {
        this.setState({
            ...this.state,
            username: event.target.value
        })
    }

    zipcodeInputHandler(event) {
        this.setState({
            ...this.state,
            zipcode: event.target.value
        })
    }
    focusMale(event) {
        event.preventDefault()
        this.setState({
            ...this.state,
            gender: 'Male',
            focused: 'm'
        })
    }
    focusFemale(event) {
        event.preventDefault()
        this.setState({
            ...this.state,
            gender: 'Female',
            focused: 'f'
        })
    }
    validateZipCode = (elementValue) => {
        var elementvalue = parseInt(elementValue)
        var zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
        return zipCodePattern.test(elementValue);
    }

    errorCreater = (msg) => {
        return Object.assign(
            new Error(msg),
            { code: 405 }
        );
    }

    submissionChecks = () => {
        // username taken check
        if (this.state.allUsernames.includes(this.state.username)) {
            throw this.errorCreater("That username is taken.")
        }
        // username length check
        if (this.state.username.length <= 2) {
            throw this.errorCreater("Username must be between 3-15 characters.")
        }
        if (/\W/.test(this.state.username)) {
            throw this.errorCreater("Username can only include letters, numbers, and underscores.")
        }
        // valid zipcode check
        if (!this.validateZipCode(this.state.zipcode)) {
            throw this.errorCreater("Please enter a valid zipcode.")
        }
        // gender input check
        if (this.state.gender === '') {
            throw this.errorCreater("Please select a gender.")
        }
    }

    formIsValid = () => {

        // username length check
        if (this.state.username.length <= 2) {
            return false
        }
        if (/\W/.test(this.state.username)) {
            return false
        }
        // valid zipcode check
        if (!this.validateZipCode(this.state.zipcode)) {
            return false
        }
        // gender input check
        if (this.state.gender === '') {
            return false
        }
        return true
    }

    async setUserDataHandler(event) {
        event.preventDefault()
        this.toggleProcessing(true)
        // profile checks
        try {

            // try all check and throw err if conditions not met
            this.submissionChecks()

            // address data per zipcode
            const address = await this.fetchAddressFromZipcode(this.state.zipcode)

            // new profile information

            var username = this.state.username.toLowerCase()
            console.log('lowercase username')
            const toUpload = {
                username: username,
                address: {
                    ...address,
                    region: regions[address["state"]]
                },
                gender: this.state.gender,
                needsInfo: false,
                handles: {
                    facebook: '',
                    instagram: '',
                    soundcloud: '',
                    youtube: ''
                }
            }

            // uploads data to firebase profile
            this.props.setUserData(this.props.uid, toUpload)
        }
        catch (err) {
            this.setState({
                ...this.state,
                notificationMsg: err.message,
                showNotification: true,
                notificationStatus: false,
                processing: false
            })
        }
    }


    async fetchAddressFromZipcode(zipcode) {
        return axiosCommon.get('https://www.zipcodeapi.com/rest/js-zF10dQxfazt7cMgYnzZphQk7jEzBwBYPb781ubkqZokAXEvUzbinxdGT5rzVrkmB/info.json/' + zipcode + '/degrees')
            .then(res => { return res.data })
            .catch(err => { 
                
                throw this.errorCreater("Sorry, we're having issues processing that zipcode.") 
            })
    }

    noticeOverHandler = () => {
        this.setState({
            ...this.state,
            showNotification: false
        })
    }

    render() {

        var isValid = this.formIsValid()
        return (
            <form className="InfoGetterContainer">
                {this.state.processing ? <DotSpinner id={'info-getter-dot'}/> : null}
                {this.state.showNotification ? (
                    <div
                        onAnimationEnd={this.noticeOverHandler}
                        className="infoGetterMsg"
                        id={this.state.notificationStatus ? "successColor" : "failed"}>
                        {this.state.notificationMsg}
                    </div>
                ) : null}
                <h2 id="set-info">Set Info</h2>
                <input
                    id="username"
                    minLength="3"
                    maxLength="13"
                    type="text"
                    pattern="[a-zA-Z0-9-]+"
                    required
                    value={this.state.username}
                    onChange={event => this.usernameInputHandler(event)}
                    placeholder="Username"></input>
                <input
                    maxLength="5"
                    minLength="5"
                    onChange={event => this.zipcodeInputHandler(event)}
                    placeholder="Hometown ZIP"
                    id="Zipcode"
                    type="text"
                    pattern="[0-9]{5}"></input>
                <div className="GenderContainer">
                    <button
                        className="GenderButton"
                        id={this.state.focused === 'm' ? 'focused' : null}
                        onClick={event => this.focusMale(event)}>M</button>
                    <button
                        className="GenderButton"
                        id={this.state.focused === 'f' ? 'focused' : null}
                        onClick={event => this.focusFemale(event)}>F</button>
                </div>
                <button className={`set-info-button`} id={isValid && !this.state.processing ? 'info-getter-isValid' : null} disabled={this.state.processing || !isValid ? true : false} onClick={event => this.setUserDataHandler(event)}>Confirm</button>
            </form>


        )
    }

}
const mapStateToProps = state => {
    return {
        uid: state.uid,
        username: state.username,
        zipcode: state.zipcode,
        gender: state.gender
    }

}

const mapDispatchToProps = dispatch => {
    return {
        setUserData: (uid, nameZipGen) => dispatch(postUserData(uid, nameZipGen)),
        // fetchAddressFromZipcode: (zipcode) => dispatch(fetchAddressJSON(zipcode))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoGetter)

