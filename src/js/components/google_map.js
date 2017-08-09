import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    ADD_NOTE,
    ADD_POINT,
    CHANGE_POINT,
    CHANGE_NOTE,
    DELETE_NOTE,
    DELETE_POINT
} from '../constants'

@connect(({map}) => ({map}))
export default class GoogleMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mapInitialized: false,
            newPoint: false,
            newNote: false,
            pointName: '',
            noteName: '',
            editablePoint: null,
            editableNote: null,
            checkedPoint: null
        }
        this._mapContainer = null
        this._map = null
        this._infoWindow = null
    }

    // Adds a marker to the map and push to the array (Global store).
    addMarker = location => {
        let markerId = Date.now() + Math.random().toString()
        let marker = new window.google.maps.Marker({
            position: location,
            map: this._map,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
            id: markerId,
            name: '',
            notes: []
        })

        marker.addListener('click', () => {
            let contentString = marker.name
            // Set the info window's content and position.
            this._infoWindow.setContent(contentString)
            this._infoWindow.open(this._map, marker)
            this.markPointFromMap(marker)
        })

        this.setState(prevState => ({
            newPoint: markerId
        }))

        this.props.dispatch({
            type: ADD_POINT,
            payload: marker
        })
    }

    /**
     *  If click on Map -> Mark checked Point in List
     * @param id - Point id
     */
    markPointFromMap = ({id}) => {
        this.setState({
            checkedPoint: id
        })
    }

    /**
     * If click on List -> Mark & Center map
     * @param event
     */
    markPointFromList = event => {
        let pointId = event.currentTarget.dataset.id
        if (this.state.checkedPoint !== pointId) {
            this.setState({
                checkedPoint: pointId
            })
        }

        let elem = this.props.map.find(point => point.id === pointId)
        this._map.setCenter(elem.position)
    }

    /**
     * Save New Point Name (from Local state to Global state)
     * @param event
     */
    handlePointSave = event => {
        event.preventDefault()

        const pointName = this.state.pointName || 'Забыли назвать точку :-('
        const id = event.target.parentNode.parentNode.dataset.id

        this.props.dispatch({
            type: CHANGE_POINT,
            payload: {
                id,
                pointName
            }
        })

        this.setState({
            newPoint: false,
            pointName: '',
            editablePoint: null
        })
    }

    /**
     * Write input for Point (new / exist) to Local state
     * @param event
     */
    handleInput = event => {
        const {value} = event.target

        this.setState({
            pointName: value
        })
    }

    /**
     * Write input for Note (new / exist) to Local state
     * @param event
     */
    handleInputNote = event => {
        const {value} = event.target

        this.setState({
            noteName: value
        })
    }

    /**
     * If click Edit Point -> Local state mark Point editable
     * @param event
     */
    togglePointEditing = event => {
        event.preventDefault()
        // if editable field is exist -> nothing
        if (this.state.editablePoint || this.state.editableNote) return
        const id = event.target.parentNode.parentNode.dataset.id
        let elem = this.props.map.find(point => point.id === id)
        let name = elem.name
        this.setState({
            editablePoint: id,
            pointName: name
        })
    }

    /**
     * Remove Point from Global store and from Map
     * @param event
     */
    handlePointRemove = event => {
        event.preventDefault()
        // if EDIT -> no ACTION
        if (this.state.pointName) return
        const id = event.target.parentNode.parentNode.dataset.id
        let point = this.props.map.find(point => point.id === id)
        point.setMap(null)
        this.props.dispatch({
            type: DELETE_POINT,
            payload: {
                id
            }
        })
    }

    /**
     * If newNote not null -> Show the add form in list
     * @param event
     */
    createNote = event => {
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
    handleNoteNewSave = event => {
        event.preventDefault()
        const noteName = this.state.noteName || 'Какое интересное имя'
        const parentId = event.target.closest('li').dataset.id
        const makeId = Date.now() + Math.random().toString()

        this.props.dispatch({
            type: ADD_NOTE,
            payload: {
                id: parentId,
                note: noteName,
                noteId: makeId
            }
        })

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
    handleNoteEdit = event => {
        event.preventDefault()
        // if editable field is exist -> nothing
        if (this.state.editablePoint || this.state.editableNote) return
        const id = event.target.closest('li').dataset.id
        const noteId = event.target.closest('li').dataset.nkey
        let elem = this.props.map.find(point => point.id === id)
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
    handleNoteCancel = event => {
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
    handleNoteSave = event => {
        event.preventDefault()

        const noteName = this.state.noteName || 'Нельзя менять на пустое имя'
        const noteKey = event.target.closest('li').dataset.nkey
        const parentId = event.target.closest('li').dataset.id

        this.props.dispatch({
            type: CHANGE_NOTE,
            payload: {
                id: parentId,
                note: noteName,
                noteId: noteKey
            }
        })

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
    handleNoteRemove = event => {
        event.preventDefault()

        const parentId = event.target.closest('li').dataset.id
        const noteId = event.target.closest('li').dataset.nkey

        this.props.dispatch({
            type: DELETE_NOTE,
            payload: {
                id: parentId,
                noteId: noteId
            }
        })
    }

    /**
     * Create Map Object if Google API loaded
     * @private
     */
    _initMap() {

        this._map = new window.google.maps.Map(this._mapContainer, {
            zoom: 14,
            center: {lat: 56.840375, lng: 60.568951},
            mapTypeId: 'terrain'
        })

        this.setState({mapInitialized: true})

        // Define an info window on the map.
        this._infoWindow = new window.google.maps.InfoWindow()

        // This event listener will call addMarker() when the map is clicked.
        this._map.addListener('click', event => {
                // if editable field is exist -> nothing
                if (this.state.editablePoint || this.state.editableNote) return
                this.addMarker(event.latLng)
            }
        )

    }

    render() {
        if (this.props.gapiLoaded && !this.state.mapInitialized) {
            setTimeout(() => {
                this._initMap()
            }, 4)
        }

        const {map} = this.props
        const {pointName} = this.state
        const {noteName} = this.state
        const {newPoint} = this.state

        return (

            <div style={{height: `100%`}}>
                {/**
                 * Show the Google map
                 */}
                <div ref={(map) => {
                    this._mapContainer = map
                }} className="main"/>

                {/**
                * Points and their Notes
                */}
                <div id="right-side">
                    <ul className="right-side__list">
                        {/**
                        * If New Point -> Show form -> Ask Point name
                        */}
                        {newPoint && <li data-id={newPoint}
                                         className="right-side__point">
                            <div className="edit-li">
                                <form onSubmit={this.handlePointSave}>
                                    <textarea autoFocus type="text"
                                              className="edit-area"
                                              onChange={this.handleInput}
                                              value={pointName}>
                                    </textarea>
                                    <div className="edit-controls">
                                        <button
                                            className="edit-ok">OK
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div id="box"></div>
                        </li>
                        }

                        {/**
                        * Show exist Points
                        */}
                        {map.map(point => (<li data-id={point.id}
                                               onClick={this.markPointFromList}
                                               key={Math.random()}
                                               className={this.state.checkedPoint === point.id ? 'right-side__point checked' : 'right-side__point'}>
                            {/**
                            * If editable -> Show Edit form
                            */}
                            {this.state.editablePoint === point.id &&
                            <div className="edit-li">
                                <form data-id={point.id}
                                      onSubmit={this.handlePointSave}>
                                     <textarea autoFocus
                                               className="edit-area"
                                               onChange={this.handleInput}
                                               value={pointName}>
                                     </textarea>
                                    <div className="edit-controls">
                                        <button className="edit-ok">OK</button>
                                    </div>
                                </form>
                            </div>
                            || <div>
                                {point.name}
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

                            {/**
                            * If Local State has newNote id -> Show Create form
                            */}
                            {this.state.newNote === point.id &&
                            <ul>
                                <li data-id={point.id}>
                                    <div className="edit-li">
                                        <form onSubmit={this.handleNoteNewSave}>
                                             <textarea autoFocus
                                                       className="edit-area"
                                                       placeholder="Введите описание объекта"
                                                       onChange={this.handleInputNote}
                                                       value={noteName}>
                                             </textarea>
                                            <div className="edit-controls">
                                                <button type="button"
                                                        onClick={this.handleNoteNewSave}
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

                            {/**
                            * If Point has child -> Show their
                            */}
                            {(point.notes.length !== 0) &&
                            <ul>
                                {point.notes.map(note => Object.entries(note).map(([key, value]) => (
                                    <li key={key}
                                        data-id={point.id}
                                        data-nkey={key}
                                        className="right-side__point">

                                        {/**
                                        * If Note editable -> Show form
                                        */}
                                        {this.state.editableNote === key &&
                                        <div className="edit-li">
                                            <form onSubmit={this.handleNoteSave}>
                                                 <textarea autoFocus
                                                           className="edit-area"
                                                           onChange={this.handleInputNote}
                                                           value={noteName}>
                                                 </textarea>
                                                <div className="edit-controls">
                                                    <button className="edit-ok">OK
                                                    </button>
                                                    <button type="button"
                                                            onClick={this.handleNoteCancel}
                                                            className="edit-cancel">CANCEL
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        ||
                                        <div>{value}</div>}
                                        <div className="controls-container">
                                            <a onClick={this.handleNoteEdit} href=""
                                               className="controls"
                                               title="EditNotes">Edit</a> &nbsp;
                                            <a onClick={this.handleNoteRemove}
                                               href=""
                                               className="controls"
                                               title="RemoveNotes">Remove</a>
                                        </div>
                                    </li>
                                )))}
                            </ul>
                            }
                        </li>))}
                    </ul>


                </div>
            </div>
        )
    }
}
