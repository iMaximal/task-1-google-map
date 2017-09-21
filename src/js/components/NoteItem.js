import React, {PureComponent} from "react"
import ReactDOM from "react-dom"
import {connect} from 'react-redux'
import {
    changeNote,
    deleteNote,
    changeMapStore,
} from '../actions'

@connect(({map, markers}) => ({map, markers}))
export default class NoteItem extends React.Component { // todo

    /**
     * If click Edit note -> get Note name from Global store for edit form -> Save & mark input in Local state
     * @param event
     */
    NoteEditHandler = (key, value, event) => {
        event.preventDefault()
        // if editable field is exist -> nothing
        if (this.props.map.editablePoint || this.props.map.editableNote) return

        this.props.dispatch(changeMapStore({ //todo change name in all files
            editableNote: key
        }))

    }

    /**
     * Cancel edit -> Change local params to null -> Data from Global store (nothing change)
     * @param event
     */
    NoteCancelHandler = (event) => {
        event.preventDefault()

        this.props.dispatch(changeMapStore({ //todo change name in all files
            newNote: false,
            editableNote: null
        }))

        this.setState({
            noteNameEdit: ''
        })

    }

    /**
     * Write Note data from Local state to Global store
     * @param event
     */
    NoteSaveHandler = (event) => {
        event.preventDefault()

        const noteNameEdit = ReactDOM.findDOMNode(this.refs.noteEditable).value.trim() || 'Нельзя менять на пустое имя'
        const noteKey = event.target.closest('li').dataset.nkey
        const parentId = event.target.closest('li').dataset.id

        this.props.dispatch(changeNote(parentId, noteNameEdit, noteKey))

        this.props.dispatch(changeMapStore({ //todo change name in all files
            newNote: false,
            editableNote: null
        }))

        this.setState({
            noteNameEdit: ''
        })
    }

    /**
     * Delete Note from Global store
     * @param event
     */
    NoteRemoveHandler = (event) => {
        event.preventDefault()

        // if editable field is exist -> nothing
        if (this.props.map.editablePoint || this.props.map.editableNote) return

        const parentId = event.target.closest('li').dataset.id
        const noteId = event.target.closest('li').dataset.nkey

        this.props.dispatch(deleteNote(parentId, noteId))

    }


    render() {

        return (


            <ul>
                {this.props.notes.map(note => Object.entries(note).map(([key, value]) => (
                    <li key={key}
                        data-id={this.props.parentId}
                        data-nkey={key}
                        className="right-side__point">

                        {/**
                         * If Note editable -> Show form
                         */}
                        {this.props.map.editableNote === key &&
                        <div className="edit-li">
                            <form onSubmit={this.NoteSaveHandler}>
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
                            <a onClick={this.NoteEditHandler.bind(this, key, value)} href=""
                               className="controls"
                               title="Edit Notes">Edit</a> &nbsp;
                            <a onClick={this.NoteRemoveHandler}
                               href=""
                               className="controls"
                               title="Remove Notes">Remove</a>
                        </div>
                    </li>
                )))}
            </ul>
        )
    }

}
