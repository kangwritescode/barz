import * as actionTypes from './actions';
import vinyl from '../assets/vinyl.mov'
import firebase from '../Firebase'

const initialState = {

    // global background
    bgvideo: vinyl,
    bgvideostyle: null,

    // music related
    playing: false,
    musicURL: '',
    volume: 50,
    songPointer: 0,
    allStations: {
        lofi: 'https://www.youtube.com/watch?v=hHW1oY26kxQ',
        boombap: 'https://www.youtube.com/watch?v=BOXG4MLj1kU',
        dilla: 'https://www.youtube.com/watch?v=XKB5h2tJQHQ',
        chillhop: 'https://www.youtube.com/watch?v=DKSzY7Dg-rA'
    },
    
    // user related,
    loggedIn: false,
    needsInfo: true,
    autoSignInOver: false,
    
    uid: '',
    email: '',
    username: '?',
    gender: '?',
    address: '?',
    photoRef: null,
    handles: {
        facebook: '',
        instagram: '',
        soundcloud: '',
        youtube: ''
    },

    // ui related
    shouldRefetchPosts: false

}

const reducer = (state=initialState, action) => {

    switch (action.type) {
        case actionTypes.PLAY_MUSIC:

            return {
                ...state,
                playing: true
            }
        case actionTypes.STOP_MUSIC:

            return {
                ...state,
                playing: false
            }
        case actionTypes.CHANGE_MUSIC_URL:
            return {
                ...state,
                musicURL: action.musicURL
            }
        case actionTypes.CHANGE_VOLUME:
            return {
                ...state,
                volume: action.volume
            }
        case actionTypes.AUTHENTICATE:
            return {
                ...state,
                loggedIn: true,
                email: action.email
            }
        case actionTypes.SET_USER_DATA:
            return {
                ...state,
                loggedIn: true,
                autoSignInOver: true,
                ...action.data
            }
        case actionTypes.LOG_OUT:
            localStorage.removeItem('token')
            localStorage.removeItem('expirationDate')
            localStorage.removeItem('uid')
            return {
                ...initialState,
            autoSignInOver: true
            };
            
        case actionTypes.SET_GLOBAL_BACKGROUND:
            return {
                ...state,
                bgvideo: action.bgvideo,
            }
        case actionTypes.SET_SONG_POINTER:
            return {
                ...state,
                songPointer: action.value
            }
        case actionTypes.SET_SHOULD_REFETCH_POSTS:
            return {
                ...state,
                shouldRefetchPosts: action.bool
            }
        case actionTypes.SET_PHOTO_URL:
            return {
                ...state,
                photoURL: action.photoURL
            }
        default:
            return state
    }
}

export default reducer;