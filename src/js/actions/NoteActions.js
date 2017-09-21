import {
    ADD_NOTE,
    CHANGE_NOTE,
    DELETE_NOTE,
} from '../constants/constants'

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
