
import * as actionTypes from './actions'
import firebase from '../Firebase'
import 'firebase/firestore'


// asynchronous actionCreators

export function fetchUserData(uid) {


    return dispatch => {

        var db = firebase.firestore()
        var docRef = db.collection(`users/`).doc(`${uid}`);
        docRef.get().then((doc) => {
            if (doc.exists) {
                dispatch({ type: actionTypes.SET_USER_DATA, data: doc.data() })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}

export function postUserData(uid, nameAddGen) {
    return dispatch => {

        var db = firebase.firestore()
        db.collection("users").doc(uid).update(nameAddGen)
            .then(function () {
                console.log("Document successfully updated!");
                dispatch({ type: actionTypes.SET_USER_DATA, data: nameAddGen })
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
    
}



// synchronous action creators

export function authCheckState() {
    return dispatch => {
        const token = localStorage.getItem('token')
        if (!token) {
            firebase.auth().signOut()
            dispatch({ type: actionTypes.LOG_OUT })
        } else {
            const expirationTime = new Date(localStorage.getItem('expirationDate'))
            if (expirationTime < new Date()) {
                console.log("would've logged out")
                firebase.auth().signOut()
                dispatch({ type: actionTypes.LOG_OUT })
            } else {
                const uid = localStorage.getItem('uid')
                dispatch(fetchUserData(uid))
            }

        }
    }
}

