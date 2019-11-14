import * as actionTypes from '../actions';
import { updateObject } from '../../shared/utility'

const initialState = {
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
    }
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

const reducer = (state = initialState, action) => {

    switch (action.type) {
        // music related
        case actionTypes.PLAY_MUSIC: return toggleMusic(state, action, true)
        case actionTypes.STOP_MUSIC: return toggleMusic(state, action, false)
        case actionTypes.CHANGE_MUSIC_URL: return changeMusicUrl(state, action)
        case actionTypes.CHANGE_VOLUME: return changeMusicVolume(state, action)
        case actionTypes.SET_SONG_POINTER: return setSongPointer(state, action)
        default:
            return state
    }
}

export default reducer;