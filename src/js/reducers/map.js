import * as ACTIONS from '../constants'

const initialState = []

// const initialState = [{
//     geo: {
//         lat: 0,
//         lng: 0
//     },
//     title: 'name',
//     id: Math.random().toString(),
//     metadata: [{
//         id: Math.random().toString(),
//         title: 'place_name',
//         description: 'place_description'
//     }]
// }]

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
            let newState = Array.from(state)
            const index = newState.findIndex(point => point.id === id)
            // let newNote = Object.defineProperty({}, (String(noteId)), {
            //     value: note || 'Devvela - команда профессионалов'
            // })
            let newNote = {
                [noteId]: note
            }
            newState[index].notes.push(newNote)
            return newState

            // return state.reduce((result, point, _index) =>
            //     index !== _index ?
            //         [...result, point] :
            //         [...result, {...state[index], notes: [...state[index].notes, note]}], [])
        }


        case ACTIONS.CHANGE_NOTE: {
            const { id, note, noteId } = action.payload
            let newState = Array.from(state)
            const index = newState.findIndex(point => point.id === id)

            newState[index].notes.forEach(item => item.hasOwnProperty(noteId) ? item[noteId] = note : false)
            return newState
            // return state.reduce((result, point, _index) =>
            //     index !== _index ?
            //     [...result, point] : [...result, {...state[index], notes: note }], [])
        }

        case ACTIONS.DELETE_NOTE: {
            const {id, noteId} = action.payload
            let newState = Array.from(state)
            // let newState = state.map((item, i) => )
            const index = newState.findIndex(point => point.id === id)
            const newProp = newState[index].notes.filter(note => !note.hasOwnProperty(noteId))
            newState[index].notes = newProp
            return newState
        }


        default:
            return state
    }
}
