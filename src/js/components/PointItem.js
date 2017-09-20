import React, {Component} from 'react'
import {connect} from 'react-redux'
import NoteItem from './NoteItem'
import {
    addNote,
    changeNote,
    deletePoint,
    deleteNote,
    finishEdit,
    isNewNote
} from '../actions'

@connect(({markers}) => ({markers}))
@connect(({map}) => ({map}))
export default class PointItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pointName: '',
            noteName: ''
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

        const pointName = this.state.pointName.trim() || 'Забыли назвать точку :-('
        this.props.onPointSave(event, pointName)
        this.setState({pointName: ''})
    }

    /**
     * Write input for Point exist to Local state
     * @param event
     */
    InputPointHandler = (event) => {
        const {value} = event.target
        this.setState({
            pointName: value
        })
    }

    /**
     * Write input for Note (new / exist) to Local state
     * @param event
     */
    InputNotehandler = (event) => {
        const {value} = event.target

        this.setState({
            noteName: value
        })
    }

    /**
     * If click Edit Point -> Global state mark Point editable
     * @param event
     */
    togglePointEditing = (event) => {
        event.preventDefault()
        // if editable field is exist -> nothing
        if (this.props.map.editablePoint || this.props.map.editableNote) return
        const id = event.target.parentNode.parentNode.dataset.id
        let elem = this.props.markers.find(point => point.id === id)
        let name = elem.name
        this.props.dispatch(finishEdit({ //todo change name in all files
            editablePoint: id,
        }))
        this.setState({
            pointName: name
        })
    }

    /**
     * Remove Point from Global store and from Map
     * @param event
     */
    handlePointRemove = (event) => {
        event.preventDefault()
        // if EDIT -> no ACTION
        if (this.state.pointName) return
        const id = event.target.parentNode.parentNode.dataset.id
        const point = this.props.markers.find(point => point.id === id)
        point.setMap(null)
        this.props.dispatch(deletePoint(id))
    }

    /**
     * If newNote not null -> Show the add form in list
     * @param event
     */
    createNote = (event) => {
        event.preventDefault()
        if (this.props.map.editableNote) return
        const id = event.target.parentNode.parentNode.dataset.id
        this.props.dispatch(isNewNote(id))
    }

    /**
     * Save new Note from Local state to Global store
     * @param event
     */
    NoteNewSaveHandler = (event) => {
        event.preventDefault()
        const noteName = this.state.noteName || 'Какое интересное имя'
        const parentId = event.target.closest('li').dataset.id
        const makeId = Date.now() + Math.random().toString()

        this.props.dispatch(addNote(parentId, noteName, makeId))
        this.props.dispatch(finishEdit({ //todo change name in all files
            newNote: false,
            editableNote: null
        }))
        this.setState({
            noteName: '',
        })
    }

    /**
     * If click Edit note -> get Note name from Global store for edit form -> Save & mark input in Local state
     * @param event
     */
    handleNoteEdit = (event) => {
        event.preventDefault()
        // if editable field is exist -> nothing
        if (this.props.map.editablePoint || this.props.map.editableNote) return
        const id = event.target.closest('li').dataset.id
        const noteId = event.target.closest('li').dataset.nkey
        let elem = this.props.markers.find(point => point.id === id)
        let name
        elem.notes.forEach(item => item.hasOwnProperty(noteId) ? name = item[noteId] : false)
        this.props.dispatch(finishEdit({ //todo change name in all files
            editableNote: noteId
        }))
        this.setState({
            noteName: name,
        })

    }

    /**
     * Cancel edit -> Change local params to null -> Data from Global store (nothing change)
     * @param event
     */
    handleNoteCancel = (event) => {
        event.preventDefault()

        this.props.dispatch(finishEdit({ //todo change name in all files
            newNote: false,
            editableNote: null
        }))

        this.setState({
            noteName: '',
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

        this.props.dispatch(finishEdit({ //todo change name in all files
            newNote: false,
            editableNote: null
        }))

        this.setState({
            noteName: '',
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
                className={this.props.map.checkedPoint === id ? 'right-side__point checked' : 'right-side__point'}>
                {/**
                 * If editable -> Show Edit form
                 */}
                {this.props.map.editablePoint === id &&
                <div className="edit-li">
                    <form data-id={id}
                          onSubmit={this.PointSave}>
                                     <textarea autoFocus
                                               className="edit-area"
                                               onChange={this.InputPointHandler}
                                               value={this.state.pointName}>
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

                {this.props.map.newNote === id &&
                <ul>
                    <li data-id={id}>
                        <div className="edit-li">
                            <form onSubmit={this.NoteNewSaveHandler}>
                                             <textarea autoFocus
                                                       className="edit-area"
                                                       placeholder="Введите описание объекта"
                                                       onChange={this.InputNotehandler}
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
                          newNote={this.props.map.newNote}
                          parentId={id}
                          noteName={this.state.noteName}
                          editableNote={this.props.map.editableNote}
                          onNoteSave={this.handleNoteSave}
                          onNoteCancel={this.handleNoteCancel}
                          onInputNote={this.InputNotehandler}
                          onNoteEdit={this.handleNoteEdit}
                          onNoteRemove={this.handleNoteRemove}
                />
                }
            </li>
        )
    }
}
