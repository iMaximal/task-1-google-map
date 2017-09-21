import React, {PureComponent} from "react"
import ReactDOM from "react-dom"
import {connect} from 'react-redux'
import {
    changeNote,
    deleteNote,
    changeMapStore,
} from '../actions'

@connect(({map, markers}) => ({map, markers}))
export default class NoteItem extends PureComponent {

    /**
     * If click Edit note -> Mark Note in Global store
     * @param key - noteId
     * @param event
     */
    NoteEditHandler = (key, event) => {
        event.preventDefault()
        // if editable field is exist -> nothing
        if (this.props.map.editablePoint || this.props.map.editableNote) return false

        this.props.dispatch(changeMapStore({
            editableNote: key
        }))
    }

    /**
     * Cancel edit -> Change Global params to null
     * @param event
     */
    NoteCancelHandler = (event) => {
        event.preventDefault()

        this.props.dispatch(changeMapStore({
            newNote: false,
            editableNote: null
        }))
    }

    NoteSaveHandler = (parentId, noteId, event) => {
        event.preventDefault()

        const noteName = ReactDOM.findDOMNode(this.refs.noteEditable).value.trim() || 'Нельзя менять на пустое имя'

        this.props.dispatch(changeNote(parentId, noteName, noteId))

        this.props.dispatch(changeMapStore({
            newNote: false,
            editableNote: null
        }))
    }

    /**
     * Delete Note from Global store
     * @param event
     */
    NoteRemoveHandler = (parentId, noteId, event) => {
        event.preventDefault()

        // if editable field is exist -> nothing
        if (this.props.map.editablePoint || this.props.map.editableNote) return

        this.props.dispatch(deleteNote(parentId, noteId))
    }


    render() {

        const {parentId} = this.props

        return (


            <ul>
                {this.props.notes.map(note => Object.entries(note).map(([key, value]) => (
                    <li key={key}
                        data-id={parentId}
                        data-nkey={key}
                        className="right-side__point">

                        {/**
                         * If Note editable -> Show form
                         */}
                        {this.props.map.editableNote === key &&
                        <div className="edit-li">
                            <form onSubmit={this.NoteSaveHandler.bind(this, parentId, key)}>
                                <textarea autoFocus
                                          className="edit-area"
                                          defaultValue={value}
                                          ref="noteEditable"
                                >
                                </textarea>
                                <div className="edit-controls">
                                    <button className="edit-ok">OK
                                    </button>
                                    <button type="button"
                                            onClick={this.NoteCancelHandler}
                                            className="edit-cancel">CANCEL
                                    </button>
                                </div>
                            </form>
                        </div>
                        ||
                        <div>{value}</div>
                        }

                        <div className="controls-container">
                            <a onClick={this.NoteEditHandler.bind(this, key)} href=""
                               className="controls"
                               title="Edit Note">Edit</a> &nbsp;
                            <a onClick={this.NoteRemoveHandler.bind(this, parentId, key)}
                               href=""
                               className="controls"
                               title="Remove Note">Remove</a>
                        </div>
                    </li>
                )))}
            </ul>
        )
    }
}
