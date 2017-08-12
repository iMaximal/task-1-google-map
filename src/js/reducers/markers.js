import * as ACTIONS from '../constants'

const initialState = []

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTIONS.ADD_POINT: {
            const marker = action.payload
            return [marker, ...state]
        }

        case ACTIONS.CHANGE_POINT: {
            const {id, pointName} = action.payload
            return state.map(item => {
                    if (item.id === id) {
                        item.name = pointName
                    }
                    return item
                }
            )
        }

        case ACTIONS.DELETE_POINT: {
            const {id} = action.payload
            return state.filter(item => item.id !== id)
        }

        case ACTIONS.ADD_NOTE: {
            const {id, note, noteId} = action.payload
            let newState = [...state]
            const index = newState.findIndex(point => point.id === id)
            let newNote = {
                [noteId]: note
            }
            newState[index].notes.push(newNote)
            return newState
        }


        case ACTIONS.CHANGE_NOTE: {
            const { id, note, noteId } = action.payload
            let newState = [...state]
            const index = newState.findIndex(point => point.id === id)
            newState[index].notes.forEach(item => item.hasOwnProperty(noteId) ? item[noteId] = note : false)
            return newState
        }

        case ACTIONS.DELETE_NOTE: {
            const {id, noteId} = action.payload
            let newState = [...state]
            const index = newState.findIndex(point => point.id === id)
            newState[index].notes = newState[index].notes.filter(note => !note.hasOwnProperty(noteId))
            return newState
        }

        default:
            return state
    }
}
