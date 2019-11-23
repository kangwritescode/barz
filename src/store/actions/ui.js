import * as actionTypes from './actionsTypes'


export const updateHubUI = (newState) => {
    return {
        type: actionTypes.SET_HUB_UI,
        hubUI: newState
    }
}