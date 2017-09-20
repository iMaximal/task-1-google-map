import React, {PureComponent} from "react"
import {connect} from 'react-redux'
import {
    changeNote,
    deleteNote,
    finishEdit,
} from '../actions'

@connect(({markers}) => ({markers}))
@connect(({map}) => ({map}))
export default class NoteItem extends React.Component { // todo

    constructor(props) {
        super(props)

        this.state = {
            noteName: ''
        }
    }

    /**
     * If click Edit note -> get Note name from Global store for edit form -> Save & mark input in Local state
     * @param event
     */
    NoteEditHandler = (event) => {
        event.preventDefault()
        // if editable field is exist -> nothing
        if (this.props.map.editablePoint || this.props.map.editableNote) return
        const id = event.target.closest('li').dataset.id
        console.log(id);
        const noteId = event.target.closest('li').dataset.nkey
        console.log(noteId);
        let elem = this.props.markers.find(point => point.id === id)
        console.log(elem);
        let name
        elem.notes.forEach(item => item.hasOwnProperty(noteId) ? name = item[noteId] : false)
        console.log('name', name)
        this.props.dispatch(finishEdit({ //todo change name in all files
            editableNote: noteId
        }))
        this.setState(prevState => ({
            noteName: name
        }))


    }

    /**
     * Cancel edit -> Change local params to null -> Data from Global store (nothing change)
     * @param event
     */
    NoteCancelHandler = (event) => {
        event.preventDefault()

        this.props.dispatch(finishEdit({ //todo change name in all files
            newNote: false,
            editableNote: null
        }))

        this.setState({
            noteName: ''
        })

    }

    /**
     * Write Note data from Local state to Global store
     * @param event
     */
    NoteSaveHandler = (event) => {
        event.preventDefault()

        const noteName = this.state.noteName || 'Нельзя менять на пустое имя'
        const noteKey = event.target.closest('li').dataset.nkey
        const parentId = event.target.closest('li').dataset.id

        this.props.dispatch(changeNote(parentId, noteName, noteKey))

        this.props.dispatch(finishEdit({ //todo change name in all files
            newNote: false,
            editableNote: null
        }))

        this.setState({
            noteName: ''
        })
    }

    /**
     * Delete Note from Global store
     * @param event
     */
    NoteRemoveHandler = (event) => {
        event.preventDefault()

        const parentId = event.target.closest('li').dataset.id
        const noteId = event.target.closest('li').dataset.nkey

        this.props.dispatch(deleteNote(parentId, noteId))

    }

    /**
     * Write input for Note (new / exist) to Local state
     * @param event
     */
    InputNoteHandler = event => {
        const {value} = event.target

        this.setState({
            noteName: value
        })
    }


    render() {

        const {noteName} = this.state

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
                                                           onChange={this.InputNoteHandler}
                                                           value={noteName}>
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
                            <a onClick={this.NoteEditHandler} href=""
                               className="controls"
                               title="EditNotes">Edit</a> &nbsp;
                            <a onClick={this.NoteRemoveHandler}
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
