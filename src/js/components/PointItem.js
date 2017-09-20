import React, {Component} from 'react'
import {connect} from 'react-redux'
import NoteItem from './NoteItem'
import {
    addNote,
    changeNote,
    deletePoint,
    deleteNote
} from '../actions'

@connect(({markers}) => ({markers}))
export default class PointItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            newPoint: false,
            newNote: false,
            noteName: '',
            editableNote: null,
        }
    }

    /**
     * If click on List -> Mark & Center map
     * @param event
     */
    markPoint = (event) => {
        this.props.onMarkPointFromList(event)
    }

    /**
     * Save New Point Name (from Local state to Global state)
     * @param event
     */
    PointSave = (event) => {
        event.preventDefault()
        this.props.onPointSave(event)
    }

    /**
     * Write input for Point (new / exist) to Local state
     * @param event
     */
    handleInput = (event) => {
        this.props.onChangePoint(event)
    }

    /**
     * Write input for Note (new / exist) to Local state
     * @param event
     */
    handleInputNote = (event) => {
        const {value} = event.target

        this.setState({
            noteName: value
        })
    }

    /**
     * If click Edit Point -> Local state mark Point editable
     * @param event
     */
    togglePointEditing = (event) => {
        event.preventDefault()
        // if editable field is exist -> nothing
        if (this.props.editablePoint || this.state.editableNote) return
        const id = event.target.parentNode.parentNode.dataset.id
        let elem = this.props.markers.find(point => point.id === id)
        let name = elem.name
        this.props.onPointEditable(id, name)
    }

    /**
     * Remove Point from Global store and from Map
     * @param event
     */
    handlePointRemove = (event) => {
        event.preventDefault()
        // if EDIT -> no ACTION
        if (this.props.pointName) return
        const id = event.target.parentNode.parentNode.dataset.id
        let point = this.props.markers.find(point => point.id === id)
        point.setMap(null)
        this.props.dispatch(deletePoint(id))
    }

    /**
     * If newNote not null -> Show the add form in list
     * @param event
     */
    createNote = (event) => {
        event.preventDefault()
        if (this.state.editableNote) return
        const id = event.target.parentNode.parentNode.dataset.id
        this.setState(prevState => ({
            newNote: id
        }))
    }

    /**
     * Save new Note from Local state to Global store
     * @param event
     */
    handleNoteNewSave = (event) => {
        event.preventDefault()
        const noteName = this.state.noteName || 'Какое интересное имя'
        const parentId = event.target.closest('li').dataset.id
        const makeId = Date.now() + Math.random().toString()

        this.props.dispatch(addNote(parentId, noteName, makeId))

        this.setState({
            newNote: false,
            noteName: '',
            editableNote: null
        })
    }

    /**
     * If click Edit note -> get Note name from Global store for edit form -> save & mark input in Local state
     * @param event
     */
    handleNoteEdit = (event) => {
        event.preventDefault()
        // if editable field is exist -> nothing
        if (this.props.editablePoint || this.state.editableNote) return
        const id = event.target.closest('li').dataset.id
        const noteId = event.target.closest('li').dataset.nkey
        let elem = this.props.markers.find(point => point.id === id)
        let name
        elem.notes.forEach(item => item.hasOwnProperty(noteId) ? name = item[noteId] : false)

        this.setState({
            noteName: name,
            editableNote: noteId
        })

    }

    /**
     * Cancel edit -> Change local params to null -> Data from Global store (nothing change)
     * @param event
     */
    handleNoteCancel = (event) => {
        event.preventDefault()

        this.setState({
            newNote: false,
            noteName: '',
            editableNote: null
        })

    }

    /**
     * Write Note data from Local state to Global store
     * @param event
     */
    handleNoteSave = (event) => {
        event.preventDefault()

        const noteName = this.state.noteName || 'Нельзя менять на пустое имя'
        const noteKey = event.target.closest('li').dataset.nkey
        const parentId = event.target.closest('li').dataset.id

        this.props.dispatch(changeNote(parentId, noteName, noteKey))

        this.setState({
            newNote: false,
            noteName: '',
            editableNote: null
        })

    }

    /**
     * Delete Note from Global store
     * @param event
     */
    handleNoteRemove = (event) => {
        event.preventDefault()

        const parentId = event.target.closest('li').dataset.id
        const noteId = event.target.closest('li').dataset.nkey

        this.props.dispatch(deleteNote(parentId, noteId))

    }


    render() {

        const {id, name, notes} = this.props.point
        const {noteName} = this.state

        return (
            <li data-id={id}
                onClick={this.markPoint}
                key={Math.random()}
                className={this.props.checkedPoint === id ? 'right-side__point checked' : 'right-side__point'}>
                {/**
                 * If editable -> Show Edit form
                 */}
                {this.props.editablePoint === id &&
                <div className="edit-li">
                    <form data-id={id}
                          onSubmit={this.PointSave}>
                                     <textarea autoFocus
                                               className="edit-area"
                                               onChange={this.handleInput}
                                               value={this.props.pointName}>
                                     </textarea>
                        <div className="edit-controls">
                            <button className="edit-ok">OK</button>
                        </div>
                    </form>
                </div>
                || <div>
                    {name}
                </div>}

                <div className="controls-container">
                    <a onClick={this.togglePointEditing}
                       href=""
                       className="controls"
                       title="Edit">Edit</a>&nbsp;
                    <a onClick={this.createNote}
                       href=""
                       className="controls"
                       title="Add">Add</a>&nbsp;
                    <a onClick={this.handlePointRemove}
                       href=""
                       className="controls"
                       title="Remove">Remove</a>
                </div>

                {this.state.newNote === id &&
                <ul>
                    <li data-id={id}>
                        <div className="edit-li">
                            <form onSubmit={this.handleNoteNewSave}>
                                             <textarea autoFocus
                                                       className="edit-area"
                                                       placeholder="Введите описание объекта"
                                                       onChange={this.handleInputNote}
                                                       value={noteName}>
                                             </textarea>
                                <div className="edit-controls">
                                    <button type="submit"
                                            className="edit-ok">OK
                                    </button>
                                    &nbsp;
                                    <button type="button"
                                            onClick={this.handleNoteCancel}
                                            className="edit-cancel">CANCEL
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div id="box"></div>
                    </li>
                </ul>
                }


                {(this.props.point.notes.length !== 0) &&
                <NoteItem notes={notes}
                          newNote={this.state.newNote}
                          parentId={id}
                          noteName={this.state.noteName}
                          editableNote={this.state.editableNote}
                          onNoteSave={this.handleNoteSave}
                          onNoteCancel={this.handleNoteCancel}
                          onInputNote={this.handleInputNote}
                          onNoteEdit={this.handleNoteEdit}
                          onNoteRemove={this.handleNoteRemove}
                />
                }
            </li>
        )
    }
}
