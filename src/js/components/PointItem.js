import React, {Component} from 'react'
import {connect} from 'react-redux'
import NewNote from './NewNote'
import NoteItem from './NoteItem'
import {
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
        if (this.props.map.editablePoint || this.props.map.editableNote) return
        this.props.dispatch(isNewNote(id))
    }


    render() {

        const {id, name, notes} = this.props.point
        const {pointName} = this.state

        let pointBody
        if (this.props.map.editablePoint === id) {
            pointBody = ( <div className="edit-li">
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
            )
        } else {
            pointBody = (
                <div>
                    {name}
                </div>
            )
        }

        let controlButtons = (
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
        )

        return (
            <li onClick={this.markPoint.bind(this, id)}
                key={id}
                className={this.props.map.checkedPoint === id ? 'right-side__point checked' : 'right-side__point'}>

                {pointBody}

                {controlButtons}

                {this.props.map.newNote === id && <NewNote id={id} /> }


                {(this.props.point.notes.length !== 0) &&
                <NoteItem notes={notes}
                          parentId={id}
                />
                }
            </li>
        )
    }
}
