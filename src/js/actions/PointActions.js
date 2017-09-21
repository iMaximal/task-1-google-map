import {
    ADD_POINT,
    CHANGE_POINT,
    CHECK_POINT,
    CREATE_NOTE,
    CREATE_POINT,
    DELETE_POINT,
} from '../constants/constants'

export const addPoint = (marker) => {
    return {
        type: ADD_POINT,
        payload: marker
    }
}


export const changePoint = (id, pointName) => {
    return {
        type: CHANGE_POINT,
        payload: {
            id,
            pointName
        }
    }
}


export const deletePoint = (id) => {
    return {
        type: DELETE_POINT,
        payload: {
            id
        }
    }
}


export const isNewPoint = (markerId) => {
    return {
        type: CREATE_POINT,
        payload: markerId
    }
}


export const checkPoint = (id) => {
    return {
        type: CHECK_POINT,
        payload: id
    }
}

export const isNewNote = (id) => {
    return {
        type: CREATE_NOTE,
        payload: id
    }
}




