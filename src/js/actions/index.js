import {
    ADD_NOTE,
    ADD_POINT,
    CHANGE_POINT,
    CHANGE_NOTE,
    DELETE_NOTE,
    DELETE_POINT
} from '../constants'

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
