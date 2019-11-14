import * as actionTypes from './actionsTypes'


export const playMusic = () =>{
    return {
        type: actionTypes.PLAY_MUSIC
    }
}
export const stopMusic = () =>{
    return {
        type: actionTypes.STOP_MUSIC
    }
}
export const changeURL = (newURL) => {
    return {
        type: actionTypes.CHANGE_MUSIC_URL,
        musicURL: newURL
    }
}
export const changeVol = (volume) => {
    return {
        type: actionTypes.CHANGE_VOLUME,
        volume: volume
    }
}
export const setSongPointer = (val) => {
    return {
        type: actionTypes.SET_SONG_POINTER,
        value: val
    }
}