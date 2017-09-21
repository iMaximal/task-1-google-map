import React, {Component} from 'react'
import {connect} from 'react-redux'
import NoteItem from './NoteItem'
import {
    addNote,
    deletePoint,
    changeMapStore,
    isNewNote
} from '../actions'

@connect(({map, markers}) => ({map, markers}))
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
     * @param pointId
     */
    markPoint = (pointId) => {
        this.props.onMarkPointFromList(pointId)
    }

    /**
     * Save New Point Name (from Local state to Global state)
     * @param id - Point ID
     * @param event
     */
    PointSave = (id, event) => {
        event.preventDefault()

        const pointName = this.state.pointName.trim() || 'Забыли назвать точку :-('
        this.props.onPointSave(event, id, pointName)
        this.setState({
            pointName: ''
        })
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
     * If click Edit Point -> Global state mark Point editable
     * @param id - Point ID
     * @param text - Point text value
     * @param event
     */
    togglePointEditing = (id, text, event) => {
        event.preventDefault()
        // if editable field is exist -> nothing
        if (this.props.map.editablePoint || this.props.map.editableNote) return

        this.props.dispatch(changeMapStore({
            editablePoint: id,
        }))
        this.setState({
            pointName: text
        })
    }

    /**
     * Remove Point from Global store and from Map
     * @param id - Point ID
     * @param event
     */
    PointRemoveHandler = (id, event) => {
        event.preventDefault()
        // if EDIT -> no ACTION
        if (this.state.pointName) return
        const point = this.props.markers.find(point => point.id === id)
        point.setMap(null)
        this.props.dispatch(deletePoint(id))
    }

    /**
     * If newNote not null -> Show the add form in list
     * @param id - Note ID
     * @param event
     */
    createNote = (id, event) => {
        event.preventDefault()
        if (this.props.map.editableNote) return
        this.props.dispatch(isNewNote(id))
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


    render() {

        const {id, name, notes} = this.props.point
        const {pointName, noteName} = this.state

        return (
            <li onClick={this.markPoint.bind(this, id)}
                key={id}
                className={this.props.map.checkedPoint === id ? 'right-side__point checked' : 'right-side__point'}>
                {/**
                 * If editable -> Show Edit form
                 */}
                {this.props.map.editablePoint === id &&
                <div className="edit-li">
                    <form onSubmit={this.PointSave.bind(this, id)}>
                         <textarea autoFocus
                                   className="edit-area"
                                   onChange={this.InputPointHandler}
                                   value={pointName}>
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
                    <a onClick={this.togglePointEditing.bind(this, id, name)}
                       href=""
                       className="controls"
                       title="Edit">Edit</a>&nbsp;
                    <a onClick={this.createNote.bind(this, id)}
                       href=""
                       className="controls"
                       title="Add">Add</a>&nbsp;
                    <a onClick={this.PointRemoveHandler.bind(this, id)}
                       href=""
                       className="controls"
                       title="Remove">Remove</a>
                </div>

                {this.props.map.newNote === id &&
                <ul>
                    <li>
                        <div className="edit-li">
                            <form onSubmit={this.NoteNewSaveHandler.bind(this, id)}>
                                 <textarea autoFocus
                                           className="edit-area"
                                           placeholder="Введите описание объекта"
                                           onChange={this.InputNoteHandler}
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
                          parentId={id}
                />
                }
            </li>
        )
    }
}
