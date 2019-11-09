
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

export const postUserData = (uid, newInfo) => {

    return dispatch => {

        var db = firebase.firestore()
        db.collection("users").doc(uid).update(newInfo)
            .then(function () {
                console.log("Document successfully updated!");
                dispatch({ type: actionTypes.SET_USER_DATA, data: newInfo })
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }   
}

export const fetchPhotoURL = (photoRef) => {
    return dispatch => {
        var storage = firebase.storage();
            storage.ref(photoRef).getDownloadURL()
            .then(url => {
                dispatch({ type: actionTypes.SET_PHOTO_URL, photoURL: url})
            })
            .catch(function (error) { console.log("error in Profile.js: ", error) });
            return () => {
                // cleanup
            };
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

