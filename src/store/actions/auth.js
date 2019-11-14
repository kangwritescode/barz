
import * as actionTypes from './actionsTypes'
import firebase from '../../Firebase'
import 'firebase/firestore'
let db = firebase.firestore()

export const fetchUserData = (uid) => {
    return dispatch => {
        let docRef = db.collection(`users/`).doc(uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                dispatch(setUserData(doc.data()))
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}

export const setUserData = (data) => {
    return {
        type: actionTypes.SET_USER_DATA, data: data
    }
}

export const postUserData = (uid, newInfo) => {
    return dispatch => {
        db.collection("users").doc(uid).update(newInfo)
            .then(function () {
                console.log("Document successfully updated!");
                dispatch(setUserData(newInfo))
            })
            .catch(function (error) {
                console.error("Error updating document: ", error);
            });
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        if (!token) {
            firebase.auth().signOut()
            dispatch(logOut())
        } else {
            const expirationTime = new Date(localStorage.getItem('expirationDate'))
            if (expirationTime < new Date()) {
                firebase.auth().signOut()
                dispatch(logOut())
            } else {
                const uid = localStorage.getItem('uid')
                dispatch(fetchUserData(uid))
            }
        }
    }
}

export const logOut = () => {
    return {
        type: actionTypes.LOG_OUT
    }
}

