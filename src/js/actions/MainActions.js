import {
    API_LOADED } from '../constants/constants'

export const ApiLoaded = (value) => {
    return {
        type: API_LOADED,
        payload: value
    }
}
