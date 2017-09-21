import {
    CHANGE_MAP_STORE,
    MAP_LOADED
} from '../constants/constants'

export const changeMapStore = (obj) => {
    return {
        type: CHANGE_MAP_STORE,
        payload: obj
    }
}

export const mapLoaded = (value) => {
    return {
        type: MAP_LOADED,
        payload: value
    }
}




