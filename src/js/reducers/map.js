import * as ACTIONS from '../constants/constants'

const initialState = {
    checkedPoint: null,
    editablePoint: null,
    editableNote: null,
    gApiLoaded: false,
    mapInitialized: false,
    newPoint: false,
}

export default function map(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.API_LOADED: {
            return {...state, gApiLoaded: action.payload}
        }


        case ACTIONS.CHANGE_MAP_STORE: {
            return {...state, ...action.payload}
        }


        case ACTIONS.CHECK_POINT: {
            return {...state, checkedPoint: action.payload}
        }


        case ACTIONS.CREATE_POINT: {
            return {...state, newPoint: action.payload}
        }


        case ACTIONS.CREATE_NOTE: {
            return {...state, newNote: action.payload}
        }


        case ACTIONS.MAP_LOADED: {
            return {...state, mapInitialized: action.payload}
        }


        default:
            return state
    }
}
