import * as actionTypes from './actionsTypes'


export const updateHubUI = (newState) => {
    return {
        type: actionTypes.SET_HUB_UI,
        hubUI: newState
    }
}

export const setScribbleUI = (newState) => {
    return {
        type: actionTypes.SET_SCRIBBLE_UI,
        scribbleUI: newState
    }
}