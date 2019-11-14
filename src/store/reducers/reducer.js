import vinyl from '../../assets/vinyl.mov';
import { updateObject } from '../../shared/utility';
import * as actionTypes from '../actions/actionsTypes';

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

const toggleMusic = (state, action, bool) => {
    return updateObject(state, {
        playing: bool
    })
}
const changeMusicUrl = (state, action) => {
    return updateObject(state, {
        musicURL: action.musicURL
    })
}
const changeMusicVolume = (state, action) => {
    return updateObject(state, {
        volume: action.volume
    })
}
const setSongPointer = (state, action) => {
    return updateObject(state, {
        songPointer: action.value
    })
}

const authenticate = (state, action) => {
    return updateObject(state, {
        loggedIn: true,
        email: action.email
    })
}

const setUserData = (state, action) => {
    return updateObject(state, {
        ...action.data,
        loggedIn: true,
        autoSignInOver: true,
    })
}

const logOut = (state, action) => {
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
        // music related
        case actionTypes.PLAY_MUSIC: return toggleMusic(state, action, true)
        case actionTypes.STOP_MUSIC: return toggleMusic(state, action, false)
        case actionTypes.CHANGE_MUSIC_URL: return changeMusicUrl(state, action)
        case actionTypes.CHANGE_VOLUME: return changeMusicVolume(state, action)
        case actionTypes.SET_SONG_POINTER: return setSongPointer(state, action)

        case actionTypes.AUTHENTICATE: return authenticate(state, action)
        case actionTypes.SET_USER_DATA: return setUserData(state, action)
        case actionTypes.LOG_OUT: return logOut(state, action)
        default:
            return state
    }
}

export default reducer;