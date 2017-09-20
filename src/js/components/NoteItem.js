import React, {Component} from 'react'
import {connect} from 'react-redux'

@connect(({markers}) => ({markers}))
export default class NoteItem extends Component {

    NoteSave = (event) => {
        event.preventDefault()
        this.props.onNoteSave(event)
    }

    NoteCancel = (event) => {
        event.preventDefault()
        this.props.onNoteCancel(event)
    }

    InputNote = (event) => {
        event.preventDefault()
        this.props.onInputNote(event)
    }

    NoteEdit = (event) => {
        event.preventDefault()
        this.props.onNoteEdit(event)
    }

    NoteRemove = (event) => {
        event.preventDefault()
        this.props.onNoteRemove(event)
    }

    render() {

        const {noteName} = this.props

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
                        {this.props.editableNote === key &&
                        <div className="edit-li">
                            <form onSubmit={this.NoteSave}>
                                                 <textarea autoFocus
                                                           className="edit-area"
                                                           onChange={this.InputNote}
                                                           value={noteName}>
                                                 </textarea>
                                <div className="edit-controls">
                                    <button className="edit-ok">OK
                                    </button>
                                    <button type="button"
                                            onClick={this.NoteCancel}
                                            className="edit-cancel">CANCEL
                                    </button>
                                </div>
                            </form>
                        </div>
                        ||
                        <div>{value}</div>
                        }

                        <div className="controls-container">
                            <a onClick={this.NoteEdit} href=""
                               className="controls"
                               title="EditNotes">Edit</a> &nbsp;
                            <a onClick={this.NoteRemove}
                               href=""
                               className="controls"
                               title="RemoveNotes">Remove</a>
                        </div>
                    </li>
                )))}
            </ul>
        )
    }

}
