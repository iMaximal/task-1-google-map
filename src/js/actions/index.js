import {
    ADD_NOTE,
    ADD_POINT,
    CHANGE_MAP_STORE,
    CHANGE_NOTE,
    CHANGE_POINT,
    CHECK_POINT,
    CREATE_POINT,
    CREATE_NOTE,
    DELETE_NOTE,
    DELETE_POINT,
    MAP_LOADED
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


export const addNote = (id, note, noteId) => {
    return {
        type: ADD_NOTE,
        payload: {
            id,
            note,
            noteId
        }
    }
}


export const changeNote = (id, note, noteId) => {
    return {
        type: CHANGE_NOTE,
        payload: {
            id,
            note,
            noteId
        }
    }
}


export const deleteNote = (id, noteId) => {
    return {
        type: DELETE_NOTE,
        payload: {
            id,
            noteId
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


export const isNewNote = (id) => {
    return {
        type: CREATE_NOTE,
        payload: id
    }
}


