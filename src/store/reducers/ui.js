import { updateObject } from '../../shared/utility';
import * as actionTypes from '../actions/actionsTypes';
import firebase from 'firebase'

const initialState = {
    hub: {
        feed: 'Personal'
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

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SET_HUB_UI: return setHubUI(state, action)
        default:
            return state
    }
}

export default reducer;