import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ADD_NOTE, ADD_POINT, CHANGE_POINT, CHANGE_NOTE, DELETE_NOTE, DELETE_POINT} from '../constants'

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

    // Adds a marker to the map and push to the array.
    addMarker = location => {
        let makeId = Date.now() + Math.random().toString()
        let marker = new window.google.maps.Marker({
            position: location,
            map: this._map,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
            id: makeId,
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
            newPoint: makeId
        }))

        this.props.dispatch({
            type: ADD_POINT,
            payload: marker
        })
    }

    markPointFromMap = ({id}) => {
        this.setState({
            checkedPoint: id
        })
    }

    markPointFromList = event => {
        let pointId = event.currentTarget.dataset.id
        if (this.state.checkedPoint === pointId) return
        this.setState({
            checkedPoint: pointId
        })

        let elem = this.props.map.find(point => point.id === pointId)
        this._map.setCenter(elem.position)
    }

    // navigator.geolocation.getCurrentPosition(function(position) {
    //     do_something(position.coords.latitude, position.coords.longitude);
    // });


    handlePointSave = event => {
        event.preventDefault()

        const {pointName} = this.state
        const id = event.target.dataset.id

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

    handleInput = event => {
        const {value} = event.target

        this.setState({
            pointName: value
        })
    }

    handleInputNote = event => {
        const {value} = event.target

        this.setState({
            noteName: value
        })
    }

    togglePointEditing = event => {
        event.preventDefault()
        const id = event.target.dataset.id
        let elem = this.props.map.find(point => point.id === id)
        let name = elem.name
        this.setState({
            editablePoint: id,
            pointName: name
        })
    }

    handlePointRemove = event => {
        event.preventDefault()
        // if EDIT no ACTION
        if (this.state.pointName) return
        const id = event.target.dataset.id
        let point = this.props.map.find(point => point.id === id)
        point.setMap(null)
        this.props.dispatch({
            type: DELETE_POINT,
            payload: {
                id
            }
        })
    }

    createNote = event => {
        event.preventDefault()
        if (this.state.editableNote) return
        const id = event.target.dataset.id
        this.setState(prevState => ({
            newNote: id
        }))
    }

    handleNoteNewSave = event => {
        event.preventDefault()
        console.log(event)
        const {noteName} = this.state
        const parentId = event.target.dataset.id
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

    handleNoteEdit = event => {
        event.preventDefault()

        const id = event.target.dataset.id
        const noteId = event.target.dataset.nkey
        let elem = this.props.map.find(point => point.id === id)
        let name
        elem.notes.forEach(item => item.hasOwnProperty(noteId) ? name = item[noteId] : false)

        this.setState({
            noteName: name,
            editableNote: noteId
        })

    }

    handleNoteSave = event => {
        event.preventDefault()

        const {noteName} = this.state
        const noteKey = event.target.dataset.nkey
        const parentId = event.target.dataset.id

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

    handleNoteRemove = event => {
        event.preventDefault()

        const parentId = event.target.dataset.id
        const noteId = event.target.dataset.nkey

        this.props.dispatch({
            type: DELETE_NOTE,
            payload: {
                id: parentId,
                noteId: noteId
            }
        })
    }

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
                this.addMarker(event.latLng)
            }
        )

    }

    render() {

        if (this.props.gapiLoaded && !this.state.mapInitialized) {
            this._initMap()
        }

        const {map} = this.props
        const {pointName} = this.state
        const {noteName} = this.state
        const {newPoint} = this.state

        return (
            <div style={{height: `100%`}}>
                <div ref={(map) => {
                    this._mapContainer = map
                }} className="main"/>
                <div id="right-side">
                    <ul className="right-side__list">

                        {newPoint && <li data-id={newPoint}
                                         className="right-side__point">
                            <div className="edit-li">
                                <form data-id={newPoint}
                                      onSubmit={this.handlePointSave}>
                                    <textarea autoFocus type="text"
                                              className="edit-area"
                                              onChange={this.handleInput}
                                              value={pointName}>
                                    </textarea>
                                    <div className="edit-controls">
                                        <button
                                            className="edit-point-ok">OK
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div id="box"></div>
                        </li>
                        }

                        {map.map(point => (<li data-id={point.id}
                                               onClick={this.markPointFromList}
                                               key={Math.random()}
                                               className={this.state.checkedPoint === point.id ? 'right-side__point checked' : 'right-side__point'}>
                            {this.state.editablePoint === point.id &&
                            <div className="edit-li">
                                <form data-id={point.id}
                                      onSubmit={this.handlePointSave}>
                                     <textarea autoFocus
                                               className="edit-area"
                                               data-id={point.id}
                                               onChange={this.handleInput}
                                               value={pointName}>
                                     </textarea>
                                    <div className="edit-controls">
                                        <button className="edit-point-ok">OK</button>
                                    </div>
                                </form>
                            </div>
                            || <div>
                                {point.name}
                            </div>}

                            <div className="controls-container">
                                <a data-id={point.id}
                                   onClick={this.togglePointEditing}
                                   href=""
                                   className="controls"
                                   title="Edit">Edit</a>&nbsp;
                                <a data-id={point.id}
                                   onClick={this.createNote}
                                   href=""
                                   className="controls"
                                   title="Add">Add</a>&nbsp;
                                <a data-id={point.id}
                                   onClick={this.handlePointRemove}
                                   href=""
                                   className="controls"
                                   title="Remove">Remove</a>
                            </div>

                            {this.state.newNote === point.id &&
                            <ul>
                                <li>
                                    <div className="edit-li">
                                        <form data-id={point.id} onSubmit={this.handleNoteNewSave}>
                                            <div>
                                            <textarea autoFocus data-id={point.id}
                                                      className="edit-area"
                                                      placeholder="Введите описание объекта"
                                                      onChange={this.handleInputNote}
                                                      value={noteName}>
                                             </textarea>
                                            </div>
                                            <div className="edit-controls">
                                                <button type="button"
                                                        onClick={this.handleNoteNewSave}
                                                        data-id={point.id}
                                                        className="edit-child-ok">OK
                                                </button>
                                                &nbsp;
                                                <button type="button"
                                                        className="edit-child-cancel">CANCEL
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    <div id="box"></div>
                                </li>
                            </ul>
                            }

                            {(point.notes.length !== 0) &&
                            <ul>
                                {point.notes.map(note => Object.entries(note).map(([key, value]) => (
                                    <li key={key} className="right-side__point">
                                        {this.state.editableNote === key &&
                                        <div className="edit-li">
                                            <form data-id={point.id}
                                                  data-nkey={key}
                                                  onSubmit={this.handleNoteSave}>
                                        <textarea autoFocus
                                                  className="edit-area"
                                                  onChange={this.handleInputNote} value={noteName}>
                                         </textarea>
                                                <div className="edit-controls">
                                                    <button data-id={point.id}
                                                            data-nkey={key}
                                                            className="edit-point-ok">OK
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        ||
                                        <div>{value}</div>}
                                        <div className="controls-container">
                                            <a data-id={point.id}
                                               data-nkey={key}
                                               onClick={this.handleNoteEdit} href=""
                                               className="controls"
                                               title="EditNotes">Edit</a> &nbsp;
                                            <a data-id={point.id}
                                               data-nkey={key}
                                               onClick={this.handleNoteRemove}
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

// export default connect(state => {
//     return {
//         map: state.map
//     }
// })(Main)
