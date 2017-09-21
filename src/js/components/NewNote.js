import React, {PureComponent} from "react"
import {connect} from 'react-redux'
import {
    addNote,
    changeMapStore,
} from '../actions'

@connect(({map}) => ({map}))
export default class NewPoint extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            noteName: '',
        }
    }

    /**
     * Write input for new Note to Local state
     * @param event
     */
    InputNoteHandler = (event) => {
        const {value} = event.target

        this.setState({
            noteName: value
        })
    }

    /**
     * Save new Note from Local state to Global store
     * @param parentId - Note ID
     * @param event
     */
    NoteNewSaveHandler = (parentId, event) => {
        event.preventDefault()
        const noteName = this.state.noteName || 'Какое интересное имя'
        const makeId = Date.now() + Math.random().toString()

        this.props.dispatch(addNote(parentId, noteName, makeId))
        this.props.dispatch(changeMapStore({
            newNote: false,
            editableNote: null
        }))
        this.setState({
            noteName: ''
        })
    }

    NoteCancelHandler = (event) => {
        event.preventDefault()

        this.props.dispatch(changeMapStore({
            newNote: false,
            editableNote: null
        }))
    }

    render() {

        const {noteName} = this.state
        const {id} = this.props

        const newNoteControls = (
            <div className="edit-controls">
                <button type="submit"
                        className="edit-ok">OK
                </button>
                &nbsp;
                <button type="button"
                        onClick={this.NoteCancelHandler}
                        className="edit-cancel">CANCEL
                </button>
            </div>
        )

        return (
                <li>
                    <div className="edit-li">
                        <form onSubmit={this.NoteNewSaveHandler.bind(this, id)}>
                             <textarea autoFocus
                                       className="edit-area"
                                       placeholder="Введите описание объекта"
                                       onChange={this.InputNoteHandler}
                                       value={noteName}>
                             </textarea>
                            {newNoteControls}
                        </form>
                    </div>
                    <div id="box"></div>
                </li>
        )
    }
}
