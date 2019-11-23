/*global FB*/

import { updateObject } from '../../shared/utility';
import * as actionTypes from '../actions/actionsTypes';
import firebase from 'firebase'

const initialState = {

    // user related,
    loggedIn: false,
    needsInfo: false,
    autoSignInOver: false,
    uid: '',
    email: '',
    username: '',
    gender: '',
    address: '',
    photoRef: null,
    handles: {
        facebook: '',
        instagram: '',
        soundcloud: '',
        youtube: ''
    },
    blurb: '',

}

const authenticate = (state, action) => {
    return updateObject(state, {
        loggedIn: true,
        email: action.email
    })
}

const setUserData = (state, action) => {
    console.log(action.data)
    return updateObject(state, {
        ...action.data,
        loggedIn: true,
        autoSignInOver: true,
    })
}

const logOut = (state, action) => {
    firebase.auth().signOut().then(function () {
        console.log('auth logout successful')
    }).catch(function (error) {
        console.log(error.message)
    });
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('uid')
    return updateObject(state, {
        ...initialState,
        autoSignInOver: true
    })

}


const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.AUTHENTICATE: return authenticate(state, action)
        case actionTypes.SET_USER_DATA: return setUserData(state, action)
        case actionTypes.LOG_OUT: return logOut(state, action)
        default:
            return state
    }
}

export default reducer;