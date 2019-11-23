import { updateObject } from '../../shared/utility';
import * as actionTypes from '../actions/actionsTypes';
import firebase from 'firebase'

const initialState = {
    hub: {
        feed: 'Personal'
    },
    scribble: {
        focus: 'Post'
    }
}

const setHubUI = (state, action) => {
    console.log(action)
    return {
        ...state,
        hub: {
            ...state.hub,
            ...action.hubUI
        }
    }
}
const setScribbleUI = (state, action) => {
    return {
        ...state,
        scribble: {
            ...state.scribble,
            ...action.scribbleUI
        }
    }
}

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SET_HUB_UI: return setHubUI(state, action)
        case actionTypes.SET_SCRIBBLE_UI: return setScribbleUI(state, action)
        default:
            return state
    }
}

export default reducer;